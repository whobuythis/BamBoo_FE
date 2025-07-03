"use client";
import "./CategorySidebar.css";

const categories = [
  { value: "all", label: "전체", icon: "📋" },
  { value: "공지사항", label: "공지사항", icon: "📢" },
  { value: "웹 개발팀", label: "웹 개발팀", icon: "👥" },
  { value: "데이터 분석팀", label: "데이터 분석팀", icon: "📊" },
  { value: "일반", label: "일반", icon: "☕" },
];

const CategorySidebar = ({ selectedCategory, onCategoryChange }) => {
  return (
    <div className="category-sidebar">
      <div className="category-header"></div>
      <h3>카테고리</h3>
    </div>
  );
};
