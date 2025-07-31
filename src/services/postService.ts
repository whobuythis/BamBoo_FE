import {
  collection,
  addDoc,
  getDocs,
  doc,
  getDoc,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
  where,
  Timestamp,
  arrayUnion,
  arrayRemove,
  increment,
} from "firebase/firestore";
import type { Post, NewPost, Comment, NewComment } from "../types";

export const postService = {
  async createPost(
    postData: NewPost,
    authorId: string,
    authorName: string
  ): Promise<string> {
    const { db } = await import("../config/firebase");
    const post = {
      ...postData,
      authorId,
      authorName,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
      likes: [],
      likesCount: 0,
      commentsCount: 0,
    };

    const docRef = await addDoc(collection(db, "posts"), post);
    return docRef.id;
  },

  async getAllPosts(): Promise<Post[]> {
    const { db } = await import("../config/firebase");
    const q = query(collection(db, "posts"), orderBy("createdAt", "desc"));
    const querySnapshot = await getDocs(q);

    return querySnapshot.docs.map(
      (doc) =>
        ({
          id: doc.id,
          ...doc.data(),
        } as Post)
    );
  },

  async getPost(postId: string): Promise<Post | null> {
    const { db } = await import("../config/firebase");
    const docRef = doc(db, "posts", postId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() } as Post;
    }
    return null;
  },

  async updatePost(
    postId: string,
    updates: Partial<{ title: string; content: string; category: string }>
  ): Promise<void> {
    const { db } = await import("../config/firebase");
    const postRef = doc(db, "posts", postId);
    await updateDoc(postRef, {
      ...updates,
      updatedAt: Timestamp.now(),
    });
  },

  async deletePost(postId: string): Promise<void> {
    const { db } = await import("../config/firebase");
    
    // 먼저 해당 게시글의 모든 댓글을 삭제
    const commentsQuery = query(
      collection(db, "comments"),
      where("postId", "==", postId)
    );
    const commentsSnapshot = await getDocs(commentsQuery);
    
    const deletePromises = commentsSnapshot.docs.map((commentDoc) =>
      deleteDoc(doc(db, "comments", commentDoc.id))
    );
    
    // 댓글들을 모두 삭제한 후 게시글 삭제
    await Promise.all(deletePromises);
    await deleteDoc(doc(db, "posts", postId));
  },

  async toggleLike(postId: string, userId: string): Promise<void> {
    const { db } = await import("../config/firebase");
    const postRef = doc(db, "posts", postId);
    const postSnap = await getDoc(postRef);

    if (postSnap.exists()) {
      const post = postSnap.data() as Post;
      const isLiked = post.likes.includes(userId);

      if (isLiked) {
        await updateDoc(postRef, {
          likes: arrayRemove(userId),
          likesCount: increment(-1),
        });
      } else {
        await updateDoc(postRef, {
          likes: arrayUnion(userId),
          likesCount: increment(1),
        });
      }
    }
  },

  async getPostsByCategory(category: string): Promise<Post[]> {
    const { db } = await import("../config/firebase");
    const q = query(
      collection(db, "posts"),
      where("category", "==", category),
      orderBy("createdAt", "desc")
    );
    const querySnapshot = await getDocs(q);

    return querySnapshot.docs.map(
      (doc) =>
        ({
          id: doc.id,
          ...doc.data(),
        } as Post)
    );
  },
};

export const commentService = {
  async createComment(
    commentData: NewComment,
    postId: string,
    authorId: string,
    authorName: string
  ): Promise<string> {
    const { db } = await import("../config/firebase");
    const comment = {
      ...commentData,
      postId,
      authorId,
      authorName,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    };

    const docRef = await addDoc(collection(db, "comments"), comment);

    const postRef = doc(db, "posts", postId);
    await updateDoc(postRef, {
      commentsCount: increment(1),
    });

    return docRef.id;
  },

  async getCommentsByPost(postId: string): Promise<Comment[]> {
    const { db } = await import("../config/firebase");
    // 복합 인덱스 문제를 해결하기 위해 orderBy를 제거하고 클라이언트에서 정렬
    const q = query(
      collection(db, "comments"),
      where("postId", "==", postId)
    );
    const querySnapshot = await getDocs(q);

    const comments = querySnapshot.docs.map(
      (doc) =>
        ({
          id: doc.id,
          ...doc.data(),
        } as Comment)
    );

    // 클라이언트에서 정렬
    return comments.sort((a, b) => {
      const aTime = a.createdAt?.toDate ? a.createdAt.toDate().getTime() : (a.createdAt as any).seconds * 1000;
      const bTime = b.createdAt?.toDate ? b.createdAt.toDate().getTime() : (b.createdAt as any).seconds * 1000;
      return aTime - bTime; // 오름차순 정렬
    });
  },

  async updateComment(
    commentId: string,
    updates: Partial<{ content: string }>
  ): Promise<void> {
    const { db } = await import("../config/firebase");
    const commentRef = doc(db, "comments", commentId);
    await updateDoc(commentRef, {
      ...updates,
      updatedAt: Timestamp.now(),
    });
  },

  async deleteComment(commentId: string, postId: string): Promise<void> {
    const { db } = await import("../config/firebase");
    await deleteDoc(doc(db, "comments", commentId));

    const postRef = doc(db, "posts", postId);
    await updateDoc(postRef, {
      commentsCount: increment(-1),
    });
  },
};
