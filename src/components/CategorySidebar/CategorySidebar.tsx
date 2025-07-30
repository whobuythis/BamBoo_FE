"use client";

import type React from "react";
import type { Category } from "../../types";
import "./CategorySidebar.css";

interface CategorySidebarProps {
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
}

const categories: Category[] = [
  { value: "all", label: "전체", icon: "📋" },
  { value: "공지사항", label: "공지사항", icon: "📢" },
  { value: "웹 개발팀", label: "웹 개발팀", icon: "👥" },
  { value: "데이터 분석팀", label: "데이터 분석팀", icon: "📊" },
  { value: "일반", label: "일반", icon: "☕" },
];

const CategorySidebar: React.FC<CategorySidebarProps> = ({
  selectedCategory,
  onCategoryChange,
}) => {
  return (
    <div className="category-sidebar">
      <div className="category-header">
        <h3>카테고리</h3>
      </div>
      <div className="category-list">
        {categories.map((category) => (
          <button
            key={category.value}
            className={`category-item ${
              selectedCategory === category.value ? "active" : ""
            }`}
            onClick={() => onCategoryChange(category.value)}
          >
            <span className="category-icon">{category.icon}</span>
            <span className="category-label">{category.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default CategorySidebar;
