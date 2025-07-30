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
import { db } from "../config/firebase";
import type { Post, NewPost, Comment, NewComment } from "../types";

export const postService = {
  async createPost(
    postData: NewPost,
    authorId: string,
    authorName: string
  ): Promise<string> {
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
    const docRef = doc(db, "posts", postId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() } as Post;
    }
    return null;
  },

  async toggleLike(postId: string, userId: string): Promise<void> {
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
    const q = query(
      collection(db, "comments"),
      where("postId", "==", postId),
      orderBy("createdAt", "asc")
    );
    const querySnapshot = await getDocs(q);

    return querySnapshot.docs.map(
      (doc) =>
        ({
          id: doc.id,
          ...doc.data(),
        } as Comment)
    );
  },

  async deleteComment(commentId: string, postId: string): Promise<void> {
    await deleteDoc(doc(db, "comments", commentId));

    const postRef = doc(db, "posts", postId);
    await updateDoc(postRef, {
      commentsCount: increment(-1),
    });
  },
};
