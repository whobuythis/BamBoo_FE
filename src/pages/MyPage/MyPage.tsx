import React, { useState, useEffect, useCallback } from "react";
import { useAuth } from "../../contexts/AuthContext";
import type { Post, Comment } from "../../types";
import "./MyPage.css";

const MyPage: React.FC = () => {
  const { currentUser } = useAuth();
  const [userPosts, setUserPosts] = useState<Post[]>([]);
  const [userComments, setUserComments] = useState<Comment[]>([]);
  const [activeTab, setActiveTab] = useState<"posts" | "comments">("posts");
  const [loading, setLoading] = useState(true);

  const loadUserData = useCallback(async () => {
    if (!currentUser) return;

    try {
      setLoading(true);
      const { userService } = await import("../../services/userService");
      const [posts, comments] = await Promise.all([
        userService.getUserPosts(currentUser.uid),
        userService.getUserComments(currentUser.uid),
      ]);

      setUserPosts(posts);
      setUserComments(comments);
    } catch (error) {
      console.error("사용자 데이터 로드 실패:", error);
    } finally {
      setLoading(false);
    }
  }, [currentUser]);

  useEffect(() => {
    if (currentUser) {
      loadUserData();
    }
  }, [currentUser, loadUserData]);

  const formatDate = (timestamp: any) => {
    if (!timestamp) return "";
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleDateString("ko-KR");
  };

  if (!currentUser) {
    return (
      <div className="mypage-container">
        <div className="mypage-error">
          <h2>로그인이 필요합니다</h2>
          <p>마이페이지를 보려면 로그인해주세요.</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="mypage-container">
        <div className="mypage-loading">로딩 중...</div>
      </div>
    );
  }

  return (
    <div className="mypage-container">
      <div className="mypage-header">
        <h1>마이페이지</h1>
        <div className="user-info">
          <div className="user-avatar">
            {currentUser.photoURL ? (
              <img src={currentUser.photoURL} alt="프로필" />
            ) : (
              <div className="avatar-placeholder">
                {currentUser.displayName?.[0] || currentUser.email[0]}
              </div>
            )}
          </div>
          <div className="user-details">
            <h2>{currentUser.displayName || "사용자"}</h2>
            <p>{currentUser.email}</p>
            <p>가입일: {formatDate(currentUser.createdAt)}</p>
          </div>
        </div>
      </div>

      <div className="mypage-tabs">
        <button
          className={`tab-button ${activeTab === "posts" ? "active" : ""}`}
          onClick={() => setActiveTab("posts")}
        >
          내 게시글 ({userPosts.length})
        </button>
        <button
          className={`tab-button ${activeTab === "comments" ? "active" : ""}`}
          onClick={() => setActiveTab("comments")}
        >
          내 댓글 ({userComments.length})
        </button>
      </div>

      <div className="mypage-content">
        {activeTab === "posts" && (
          <div className="posts-section">
            {userPosts.length === 0 ? (
              <div className="empty-state">
                <p>작성한 게시글이 없습니다.</p>
              </div>
            ) : (
              <div className="posts-list">
                {userPosts.map((post) => (
                  <div key={post.id} className="post-item">
                    <h3>{post.title}</h3>
                    <p className="post-meta">
                      카테고리: {post.category} | 
                      작성일: {formatDate(post.createdAt)} | 
                      좋아요: {post.likesCount} | 
                      댓글: {post.commentsCount}
                    </p>
                    <p className="post-content">{post.content.substring(0, 100)}...</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === "comments" && (
          <div className="comments-section">
            {userComments.length === 0 ? (
              <div className="empty-state">
                <p>작성한 댓글이 없습니다.</p>
              </div>
            ) : (
              <div className="comments-list">
                {userComments.map((comment) => (
                  <div key={comment.id} className="comment-item">
                    <p className="comment-content">{comment.content}</p>
                    <p className="comment-meta">
                      작성일: {formatDate(comment.createdAt)}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyPage; 