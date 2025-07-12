"use client";

import type React from "react";
import type { Post } from "../../types";
import "./PostCard.css";

//1. 기본 컴포넌트 틀 만들기
//2. props 인터페이스 정의
//3. 컴포넌트에 props 연결
//4. 카테고리 색상 설정 함수 만들기
//5. 좋아요 버튼 구현 함수

//컴포넌트가 받게될 데이터 구조 정의.
//부모 컴포넌트(PostList)가 PostCard에게 props로 전달해주는 것들
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
}; //카테고리 종류에 따라 스타일 다르게 적용하는 함수

const PostCard: React.FC<PostCardProps> = ({ post, onLike }) => {
  //const PostCard = ({ post, onLike }: PostCardProps) => { ... }
  //PostCard는 함수형 컴포넌트(React.FC). PostCardProps 타입에 맞는 props 받도록 지정
  //{ post, onLike }: props로 받아온 데이터 구조분해 할당

  //좋아요 버튼을 클릭했을 때 실행되는 함수
  const handleLikeClick = (): void => {
    onLike(post.id); //호출
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
          {/* 좋아요 버튼 */}
          <button
            className={`stat-button ${post.isLiked ? "liked" : ""}`}
            onClick={handleLikeClick}
          >
            <span className="stat-icon">{post.isLiked ? "❤️" : "🤍"}</span>
            <span>{post.likes}</span>
          </button>
          {/* 댓글 버튼 */}
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
