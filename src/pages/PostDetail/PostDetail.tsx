"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { postService, commentService } from "../../services/postService";
import CommentSection from "../../components/CommentSection/CommentSection";
import type { Post, Comment } from "../../types";
import "./PostDetail.css";

const PostDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [post, setPost] = useState<Post | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (id) {
      loadPostAndComments();
    }
  }, [id]);

  const loadPostAndComments = async () => {
    if (!id) return;

    try {
      setLoading(true);
      const [postData, commentsData] = await Promise.all([
        postService.getPost(id),
        commentService.getCommentsByPost(id),
      ]);

      if (postData) {
        setPost(postData);
        setComments(commentsData);
      } else {
        setError("게시글을 찾을 수 없습니다.");
      }
    } catch (error) {
      console.error("데이터 로딩 실패:", error);
      setError("데이터를 불러오는데 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async () => {
    if (!currentUser || !post) return;

    try {
      await postService.toggleLike(post.id, currentUser.uid);

      const isLiked = post.likes.includes(currentUser.uid);
      setPost({
        ...post,
        likes: isLiked
          ? post.likes.filter((uid) => uid !== currentUser.uid)
          : [...post.likes, currentUser.uid],
        likesCount: isLiked ? post.likesCount - 1 : post.likesCount + 1,
      });
    } catch (error) {
      console.error("좋아요 실패:", error);
    }
  };

  const handleAddComment = async (content: string) => {
    if (!currentUser || !post) return;

    try {
      await commentService.createComment(
        { content },
        post.id,
        currentUser.uid,
        currentUser.displayName || "익명사용자"
      );

      const updatedComments = await commentService.getCommentsByPost(post.id);
      setComments(updatedComments);

      setPost({
        ...post,
        commentsCount: post.commentsCount + 1,
      });
    } catch (error) {
      console.error("댓글 작성 실패:", error);
    }
  };

  const formatDate = (timestamp: any): string => {
    if (!timestamp) return "";

    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleString("ko-KR");
  };

  const getCategoryColor = (category: string): string => {
    switch (category) {
      case "공지사항":
        return "category-notice";
      case "웹 개발팀":
        return "category-web";
      case "데이터 분석팀":
        return "category-data";
      case "일반":
        return "category-general";
      default:
        return "category-default";
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner">로딩 중...</div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="error-container">
        <div className="error-message">
          {error || "게시글을 찾을 수 없습니다."}
        </div>
        <button onClick={() => navigate("/")} className="btn btn-primary">
          홈으로 돌아가기
        </button>
      </div>
    );
  }

  const isLiked = currentUser ? post.likes.includes(currentUser.uid) : false;

  return (
    <div className="post-detail-page">
      <div className="post-detail-container">
        <button onClick={() => navigate("/")} className="back-button">
          ← 목록으로 돌아가기
        </button>

        <article className="post-detail">
          <header className="post-detail-header">
            <div className="post-meta">
              <span
                className={`category-badge ${getCategoryColor(post.category)}`}
              >
                {post.category}
              </span>
              <div className="post-info">
                <span className="author-name">{post.authorName}</span>
                <span className="post-date">{formatDate(post.createdAt)}</span>
              </div>
            </div>
            <h1 className="post-title">{post.title}</h1>
          </header>

          <div className="post-content">
            <p>{post.content}</p>
          </div>

          <div className="post-actions">
            <div className="post-stats">
              <button
                className={`stat-button ${isLiked ? "liked" : ""}`}
                onClick={handleLike}
                disabled={!currentUser}
              >
                <span className="stat-icon">{isLiked ? "❤️" : "🤍"}</span>
                <span>좋아요 {post.likesCount}</span>
              </button>
              <div className="stat-item">
                <span className="stat-icon">💬</span>
                <span>댓글 {post.commentsCount}</span>
              </div>
            </div>
          </div>
        </article>

        <CommentSection
          comments={comments}
          onAddComment={handleAddComment}
          currentUser={currentUser}
        />
      </div>
    </div>
  );
};

export default PostDetail;
