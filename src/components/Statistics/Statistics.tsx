import type React from "react";
import type { Post } from "../../types";
import "./Statistics.css";

interface StatisticsProps {
  posts: Post[];
}

const Statistics: React.FC<StatisticsProps> = ({ posts }) => {
  const getPostCountByCategory = (category: string): number => {
    return posts.filter((post) => post.category === category).length;
  };

  return (
    <div className="statistics">
      <div className="statistics-header">
        <h3>통계</h3>
      </div>
      <div className="statistics-content">
        <div className="stat-item">
          <span className="stat-label">전체 글</span>
          <span className="stat-value">{posts.length}</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">공지사항</span>
          <span className="stat-value">
            {getPostCountByCategory("공지사항")}
          </span>
        </div>
        <div className="stat-item">
          <span className="stat-label">웹 개발팀</span>
          <span className="stat-value">
            {getPostCountByCategory("웹 개발팀")}
          </span>
        </div>
        <div className="stat-item">
          <span className="stat-label">데이터 분석팀</span>
          <span className="stat-value">
            {getPostCountByCategory("데이터 분석팀")}
          </span>
        </div>
        <div className="stat-item">
          <span className="stat-label">일반</span>
          <span className="stat-value">{getPostCountByCategory("일반")}</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">문의</span>
          <span className="stat-value">{getPostCountByCategory("문의")}</span>
        </div>
      </div>
    </div>
  );
};

export default Statistics;
