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
  //const PostCard = ({ post, onLike }: PostCardProps) => { ... }
  //PostCard는 함수형 컴포넌트(React.FC). PostCardProps 타입에 맞는 props 받도록 지정
  //{ post, onLike }: props로 받아온 데이터 구조분해 할당
  // PostCard는 함수형 컴포넌트로, PostCardProps 타입의 props를 받도록 선언함
  // 리액트 컴포넌트는 props를 항상 하나의 객체로 전달 -> 매개변수 반드시 하나여야 함
  // 여기서는 구조 분해 할당을 사용해 props 객체에서 post와 onLike를 바로 꺼냄

  //좋아요 버튼을 클릭했을 때 실행되는 함수
  const handleLikeClick = (): void => {
    onLike(post.id);
  }; //결과를 return하지 않기에 이 함수 전체는 void. 아무것도 반환하지 않음

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
