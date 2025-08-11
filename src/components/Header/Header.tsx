"use client";

import type React from "react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import "./Header.css";

interface HeaderProps {
  searchQuery?: string;
  onSearchChange?: (query: string) => void;
  onOpenWriteModal?: () => void;
}

const Header: React.FC<HeaderProps> = ({
  searchQuery = "",
  onSearchChange,
  onOpenWriteModal,
}) => {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const [localSearchQuery, setLocalSearchQuery] = useState(searchQuery);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setLocalSearchQuery(value);
    if (onSearchChange) {
      onSearchChange(value);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/");
    } catch (error) {
      console.error("로그아웃 실패:", error);
    }
  };

  return (
    <header className="header">
      <div className="header-container">
        <div className="header-left">
          <Link to="/" className="logo">
            <div className="logo-icon">💬</div>
            <div className="logo-text">
              <h1>BamBoo하우스</h1>
              <p>
                {currentUser
                  ? `${currentUser.displayName}님, 안녕하세요!`
                  : "익명 소통 공간"}
              </p>
            </div>
          </Link>
        </div>

        {onSearchChange && (
          <div className="search-container">
            <div className="search-input-wrapper">
              <span className="search-icon">🔍</span>
              <input
                type="text"
                placeholder="게시글 검색..."
                value={localSearchQuery}
                onChange={handleSearchChange}
                className="search-input"
              />
            </div>
          </div>
        )}

        <div className="header-actions">
          <Link to="/inquiry" className="btn btn-outline btn-inquiry">
            📝 문의하기
          </Link>
          
          {currentUser && onOpenWriteModal && (
            <button className="btn btn-primary" onClick={onOpenWriteModal}>
              ✏️ 글쓰기
            </button>
          )}

          {currentUser ? (
            <>
              <Link to="/mypage" className="btn btn-outline">
                👤 마이페이지
              </Link>
              <button className="btn btn-ghost" onClick={handleLogout}>
                🚪 로그아웃
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn btn-outline">
                로그인
              </Link>
              <Link to="/register" className="btn btn-primary">
                회원가입
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
