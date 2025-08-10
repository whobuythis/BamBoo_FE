"use client"; // Next.js 클라이언트 컴포넌트
import type React from "react";
import { useState } from "react";

// 주요 컴포넌트들
import InquiryForm from "./components/InquiryForm/InquiryForm";
import Header from "./components/Header/Header";
import CategorySidebar from "./components/CategorySidebar/CategorySidebar";
import Statistics from "./components/Statistics/Statistics";
import PostList from "./components/PostList/PostList";
import WritePostModal from "./components/WritePostModal/WritePostModal";
import type { Post, NewPost } from "./types";
import "./App.css";

// 초기 게시글 더미 데이터
const initialPosts: Post[] = [
  {
    id: 0,
    title: "[공지] BamBoo하우스 이용 안내",
    content:
      "안녕하세요! BamBoo하우스에 오신 것을 환영합니다. 이곳은 웹 개발팀과 데이터 분석팀이 함께 소통할 수 있는 익명 공간입니다. 서로 존중하며 건설적인 대화를 나누어 주세요.",
    category: "공지사항",
    timestamp: "1주 전",
    likes: 45,
    comments: 3,
    isLiked: false,
  },
  {
    id: 1,
    title: "새로운 프레임워크 도입에 대한 고민",
    content:
      "팀에서 React에서 Next.js로 전환을 고려하고 있는데, 러닝 커브가 걱정됩니다. 경험 있으신 분들의 조언 부탁드려요.",
    category: "웹 개발팀",
    timestamp: "2시간 전",
    likes: 12,
    comments: 8,
    isLiked: false,
  },
  {
    id: 2,
    title: "데이터 시각화 툴 추천해주세요",
    content:
      "대시보드 제작을 위한 데이터 시각화 툴을 찾고 있습니다. D3.js vs Chart.js vs 기타 라이브러리들 중에서 어떤 게 좋을까요?",
    category: "데이터 분석팀",
    timestamp: "4시간 전",
    likes: 8,
    comments: 15,
    isLiked: true,
  },
  {
    id: 3,
    title: "야근이 너무 많아서 힘들어요",
    content:
      "요즘 프로젝트 데드라인 때문에 야근이 너무 많습니다. 다들 어떻게 워라밸을 맞추고 계신가요?",
    category: "일반",
    timestamp: "6시간 전",
    likes: 24,
    comments: 12,
    isLiked: false,
  },
  {
    id: 4,
    title: "SQL 쿼리 최적화 팁 공유",
    content:
      "대용량 데이터 처리할 때 쿼리 성능 개선 방법들을 정리해봤습니다. 인덱스 활용법과 조인 최적화 등...",
    category: "데이터 분석팀",
    timestamp: "1일 전",
    likes: 18,
    comments: 6,
    isLiked: false,
  },
  {
    id: 5,
    title: "코드 리뷰 문화 개선하고 싶어요",
    content:
      "팀 내 코드 리뷰가 형식적으로 이루어지고 있는 것 같아요. 더 건설적인 리뷰 문화를 만들려면 어떻게 해야 할까요?",
    category: "웹 개발팀",
    timestamp: "1일 전",
    likes: 15,
    comments: 9,
    isLiked: true,
  },
];

const App: React.FC = () => {
  // 게시글 상태
  const [posts, setPosts] = useState<Post[]>(initialPosts);
  // 현재 선택된 카테고리
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  // 로그인 상태
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [username, setUsername] = useState<string>("");
  // 검색어
  const [searchQuery, setSearchQuery] = useState<string>("");
  // 글쓰기 모달 상태
  const [isWriteModalOpen, setIsWriteModalOpen] = useState<boolean>(false);

  // 카테고리 & 검색어 기반으로 필터링된 게시글 목록
  const filteredPosts = posts.filter((post) => {
    const matchesCategory =
      selectedCategory === "all" || post.category === selectedCategory;
    const q = searchQuery.trim().toLowerCase();
    const matchesSearch =
      q === "" ||
      post.title.toLowerCase().includes(q) ||
      post.content.toLowerCase().includes(q);
    return matchesCategory && matchesSearch;
  });

  // 좋아요 토글
  const handleLike = (postId: number): void => {
    setPosts((prev) =>
      prev.map((post) =>
        post.id === postId
          ? {
              ...post,
              likes: post.isLiked ? post.likes - 1 : post.likes + 1,
              isLiked: !post.isLiked,
            }
          : post
      )
    );
  };

  // 새 글 추가
  const handleAddPost = (newPost: NewPost): void => {
    const nextId =
      posts.length > 0 ? Math.max(...posts.map((p) => p.id)) + 1 : 0;
    const post: Post = {
      id: nextId,
      ...newPost,
      timestamp: "방금 전",
      likes: 0,
      comments: 0,
      isLiked: false,
    };
    setPosts((prev) => [post, ...prev]); // 최신 글이 위로
  };

  // 로그인/로그아웃
  const handleLogin = (): void => {
    setIsLoggedIn(true);
    setUsername("익명사용자");
  };
  const handleLogout = (): void => {
    setIsLoggedIn(false);
    setUsername("");
  };

  return (
    <div className="app">
      {/* 상단 헤더: 로그인 상태, 검색창, 글쓰기 버튼 */}
      <Header
        isLoggedIn={isLoggedIn}
        username={username}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onLogin={handleLogin}
        onLogout={handleLogout}
        onOpenWriteModal={() => setIsWriteModalOpen(true)}
      />

      {/* 메인 컨테이너 */}
      <div className="main-container">
        <div className="content-grid">
          {/* 왼쪽 사이드바: 카테고리 + 통계 */}
          <div className="sidebar">
            <CategorySidebar
              selectedCategory={selectedCategory}
              onCategoryChange={setSelectedCategory}
            />
            <Statistics posts={posts} />
          </div>

          {/* 오른쪽: 게시글 목록 또는 문의하기 폼 (여기만 조건부) */}
          <div className="main-content">
            {selectedCategory === "문의하기" ? (
              <InquiryForm />
            ) : (
              <PostList
                posts={filteredPosts}
                searchQuery={searchQuery}
                onLike={handleLike}
              />
            )}
          </div>
        </div>
      </div>

      {/* 글쓰기 모달 */}
      <WritePostModal
        isOpen={isWriteModalOpen}
        onClose={() => setIsWriteModalOpen(false)}
        onSubmit={handleAddPost}
      />
    </div>
  );
};

export default App;
