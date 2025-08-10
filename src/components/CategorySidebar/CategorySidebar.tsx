// 클라이언트 컴포넌트임을 명시 (Next.js에서 사용됨)
"use client";

// React와 Category 타입을 가져옴
import type React from "react";
import type { Category } from "../../types";

// CSS 스타일 파일을 가져옴
import "./CategorySidebar.css";

// 컴포넌트에 전달될 props 타입 정의
interface CategorySidebarProps {
  selectedCategory: string; // 현재 선택된 카테고리 값
  onCategoryChange: (category: string) => void; // 카테고리를 클릭했을 때 실행될 콜백 함수
}

// 고정된 카테고리 리스트 정의 (value, label, 아이콘 포함)
const categories: Category[] = [
  { value: "all", label: "전체", icon: "📋" },
  { value: "공지사항", label: "공지사항", icon: "📢" },
  { value: "웹 개발팀", label: "웹 개발팀", icon: "👥" },
  { value: "데이터 분석팀", label: "데이터 분석팀", icon: "📊" },
  { value: "일반", label: "일반", icon: "☕" },
  { value: "문의하기", label: "문의하기", icon: "💬" },
];

// React 함수형 컴포넌트 정의 및 props 구조 분해
const CategorySidebar: React.FC<CategorySidebarProps> = ({
  selectedCategory, // 선택된 카테고리
  onCategoryChange, // 카테고리 변경 시 호출할 함수
}) => {
  const handleCategoryClick = (categoryValue: string): void => {
    onCategoryChange(categoryValue); // 부모 컴포넌트로 선택된 카테고리 전달
  };

  return (
    // 전체 사이드바 wrapper
    <div className="category-sidebar">
      {/* 헤더 영역 */}
      <div className="category-header">
        <h3>카테고리</h3> {/* 제목 텍스트 */}
      </div>

      {/* 카테고리 목록 영역 */}
      <div className="category-list">
        {categories.map((category) => (
          // 각 카테고리마다 버튼 생성
          <button
            key={category.value} // 리스트 렌더링을 위한 고유 key
            className={`category-item ${
              selectedCategory === category.value ? "active" : "" // 현재 선택된 항목은 active 클래스 추가
            }`}
            onClick={() => handleCategoryClick(category.value)} // 클릭 시 해당 카테고리 선택 처리
          >
            {/* 아이콘 출력 */}
            <span className="category-icon">{category.icon}</span>
            {/* 라벨 출력 */}
            <span className="category-label">{category.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

// 외부에서 이 컴포넌트를 사용할 수 있도록 export
export default CategorySidebar;
