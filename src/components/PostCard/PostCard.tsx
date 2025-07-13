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
  post: Post; //Post: 객체타입
  onLike: (postId: number) => void; //함수타입
  //아무 값도 return하지 않고, 내부에서 상태만 바꾸기 때문에 void
  //onLike: () => void라고 하면 "아무 인자도 받지 않는 함수"라고 타입스크립트가 인식
  //숫자를 매개변수로 받는다는 것을 명시해야
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
  // PostCard는 함수형 컴포넌트로, PostCardProps 타입의 props를 받도록 선언함
  // 리액트 컴포넌트는 props를 항상 하나의 객체로 전달 -> 매개변수 반드시 하나여야 함
  // 여기서는 구조 분해 할당을 사용해 props 객체에서 post와 onLike를 바로 꺼냄

  //좋아요 버튼을 클릭했을 때 실행되는 함수
  const handleLikeClick = (): void => {
    //(): void => 매개변수를 받지 않고 아무것도 반환하지 않는 함수
    onLike(post.id); // 리턴값이 아닌 단순히 실행되는 동작
  };
  //결과를 return하지 않기에 이 함수 전체는 void. 아무것도 반환하지 않음

  return (
    <div className="post-card">
      <div className="post-header">
        <div className="post-meta">
          <span className={`category-badge ${getCategoryColor(post.category)}`}>
            {/* 렌더링 시 즉시 실행(함수호출) */}
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
            onClick={handleLikeClick} //클릭될 때 실행(함수 참조)
            //handleLikeClick()는 렌더링 시 즉시 실행되어 잘못된 코드(함수 호출)
            //인라인 화살표 함수도 가능. onClick={() => onLike(post.id)}
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
