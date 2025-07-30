"use client";

import type React from "react";
import { useState, useEffect, useCallback } from "react";
import { useAuth } from "../../contexts/AuthContext";
import CategorySidebar from "../../components/CategorySidebar/CategorySidebar";
import Statistics from "../../components/Statistics/Statistics";
import PostList from "../../components/PostList/PostList";
import WritePostModal from "../../components/WritePostModal/WritePostModal";
import { postService } from "../../services/postService";
import type { Post, NewPost } from "../../types";
import "./Home.css";

const Home: React.FC = () => {
  const { currentUser } = useAuth();
  const [posts, setPosts] = useState<Post[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [isWriteModalOpen, setIsWriteModalOpen] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

  const loadPosts = useCallback(async () => {
    try {
      setLoading(true);
      const fetchedPosts = await postService.getAllPosts();
      setPosts(fetchedPosts);
    } catch (error) {
      console.error("게시글 로딩 실패:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadPosts();
  }, [loadPosts]);

  const filteredPosts = posts.filter((post) => {
    const matchesCategory =
      selectedCategory === "all" || post.category === selectedCategory;
    const matchesSearch =
      searchQuery === "" ||
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.content.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleLike = async (postId: string) => {
    if (!currentUser) return;

    try {
      await postService.toggleLike(postId, currentUser.uid);
      setPosts(
        posts.map((post) => {
          if (post.id === postId) {
            const isLiked = post.likes.includes(currentUser.uid);
            return {
              ...post,
              likes: isLiked
                ? post.likes.filter((uid) => uid !== currentUser.uid)
                : [...post.likes, currentUser.uid],
              likesCount: isLiked ? post.likesCount - 1 : post.likesCount + 1,
            };
          }
          return post;
        })
      );
    } catch (error) {
      console.error("좋아요 실패:", error);
    }
  };

  const handleCommentAdded = useCallback(async (postId: string) => {
    // 댓글이 추가된 후 해당 게시글의 댓글 수를 업데이트
    try {
      const updatedPost = await postService.getPost(postId);
      if (updatedPost) {
        setPosts(
          posts.map((post) => {
            if (post.id === postId) {
              return {
                ...post,
                commentsCount: updatedPost.commentsCount,
              };
            }
            return post;
          })
        );
      }
    } catch (error) {
      console.error("댓글 수 업데이트 실패:", error);
    }
  }, [posts]);

  const handleAddPost = async (newPost: NewPost) => {
    if (!currentUser) return;

    try {
      await postService.createPost(
        newPost,
        currentUser.uid,
        currentUser.displayName || "익명사용자"
      );
      await loadPosts();
    } catch (error) {
      console.error("게시글 작성 실패:", error);
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner">로딩 중...</div>
      </div>
    );
  }

  return (
    <div className="home">
      <div className="main-container">
        <div className="content-grid">
          <div className="sidebar">
            <CategorySidebar
              selectedCategory={selectedCategory}
              onCategoryChange={setSelectedCategory}
            />
            <Statistics posts={posts} />
          </div>

          <div className="main-content">
            <div className="content-header">
              <div className="search-container">
                <div className="search-input-wrapper">
                  <span className="search-icon">🔍</span>
                  <input
                    type="text"
                    placeholder="게시글 검색..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="search-input"
                  />
                </div>
              </div>
              {currentUser && (
                <button
                  className="btn btn-primary"
                  onClick={() => setIsWriteModalOpen(true)}
                >
                  ✏️ 글쓰기
                </button>
              )}
            </div>
            <PostList
              posts={filteredPosts}
              searchQuery={searchQuery}
              onLike={handleLike}
              onCommentAdded={handleCommentAdded}
              currentUser={currentUser}
            />
          </div>
        </div>
      </div>

      {currentUser && (
        <WritePostModal
          isOpen={isWriteModalOpen}
          onClose={() => setIsWriteModalOpen(false)}
          onSubmit={handleAddPost}
        />
      )}
    </div>
  );
};

export default Home;
