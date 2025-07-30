"use client";

import type React from "react";
import { Link } from "react-router-dom";
import type { Post, User } from "../../types";
import "./PostCard.css";

interface PostCardProps {
  post: Post;
  onLike: (postId: string) => void;
  currentUser: User | null;
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

const formatDate = (timestamp: any): string => {
  if (!timestamp) return "";

  const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
  const now = new Date();
  const diff = now.getTime() - date.getTime();

  const minutes = Math.floor(diff / (1000 * 60));
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));

  if (minutes < 1) return "방금 전";
  if (minutes < 60) return `${minutes}분 전`;
  if (hours < 24) return `${hours}시간 전`;
  if (days < 7) return `${days}일 전`;

  return date.toLocaleDateString("ko-KR");
};

const PostCard: React.FC<PostCardProps> = ({ post, onLike, currentUser }) => {
  const handleLikeClick = () => {
    if (currentUser) {
      onLike(post.id);
    }
  };

  const isLiked = currentUser ? post.likes.includes(currentUser.uid) : false;

  return (
    <div className="post-card">
      <div className="post-header">
        <div className="post-meta">
          <span className={`category-badge ${getCategoryColor(post.category)}`}>
            {post.category}
          </span>
          <div className="post-info">
            <span className="author-name">{post.authorName}</span>
            <span className="post-time">
              <span className="time-icon">🕒</span>
              {formatDate(post.createdAt)}
            </span>
          </div>
        </div>
        <h3 className="post-title">{post.title}</h3>
        <p className="post-content">
          {post.content.length > 200
            ? `${post.content.substring(0, 200)}...`
            : post.content}
        </p>
      </div>

      <div className="post-actions">
        <div className="post-stats">
          <button
            className={`stat-button ${isLiked ? "liked" : ""}`}
            onClick={handleLikeClick}
            disabled={!currentUser}
          >
            <span className="stat-icon">{isLiked ? "❤️" : "🤍"}</span>
            <span>{post.likesCount}</span>
          </button>
          <button className="stat-button">
            <span className="stat-icon">💬</span>
            <span>{post.commentsCount}</span>
          </button>
        </div>
        <Link to={`/post/${post.id}`} className="detail-button">
          자세히 보기
        </Link>
      </div>
    </div>
  );
};

export default PostCard;
