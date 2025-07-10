"use client";

import type React from "react";
import type { Post } from "../../types";
import "./PostCard.css";

interface PostCardProps {
  post: Post;
  onLike: (postId: number) => void;
}

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

const PostCard: React.FC<PostCardProps> = ({ post, onLike }) => {
  const handleLikeClick = (): void => {
    onLike(post.id);
  };

  return (
    <div className="post-card">
      <div className="post-header">
        <div className="post-meta">
          <span className={`category-badge ${getCategoryColor(post.category)}`}>
            {post.category}
          </span>
          <div className="post-time">
            <span className="time-icon">🕒</span>
            <span>{post.timestamp}</span>
          </div>
        </div>
        <h3 className="post-title">{post.title}</h3>
        <p className="post-content">{post.content}</p>
      </div>

      <div className="post-actions">
        <div className="post-stats">
          <button
            className={`stat-button ${post.isLiked ? "liked" : ""}`}
            onClick={handleLikeClick}
          >
            <span className="stat-icon">{post.isLiked ? "❤️" : "🤍"}</span>
            <span>{post.likes}</span>
          </button>
          <button className="stat-button">
            <span className="stat-icon">💬</span>
            <span>{post.comments}</span>
          </button>
        </div>
        <button className="detail-button">자세히 보기</button>
      </div>
    </div>
  );
};

export default PostCard;
