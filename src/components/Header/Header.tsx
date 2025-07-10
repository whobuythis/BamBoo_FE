"use client";

import type React from "react";
import type { ChangeEvent } from "react";
import "./Header.css";

interface HeaderProps {
  isLoggedIn: boolean;
  username: string;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onLogin: () => void;
  onLogout: () => void;
  onOpenWriteModal: () => void;
}

const Header: React.FC<HeaderProps> = ({
  isLoggedIn,
  username,
  searchQuery,
  onSearchChange,
  onLogin,
  onLogout,
  onOpenWriteModal,
}) => {
  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>): void => {
    onSearchChange(e.target.value);
  };

  return (
    <header className="header">
      <div className="header-container">
        <div className="header-left">
          <div className="logo">
            <div className="logo-icon">💬</div>
            <div className="logo-text">
              <h1>BamBoo하우스</h1>
              <p>
                {isLoggedIn ? `${username}님, 안녕하세요!` : "익명 소통 공간"}
              </p>
            </div>
          </div>
        </div>

        <div className="search-container">
          <div className="search-input-wrapper">
            <span className="search-icon">🔍</span>
            <input
              type="text"
              placeholder="게시글 검색..."
              value={searchQuery}
              onChange={handleSearchChange}
              className="search-input"
            />
          </div>
        </div>

        <div className="header-actions">
          <button className="btn btn-primary" onClick={onOpenWriteModal}>
            ✏️ 글쓰기
          </button>

          {isLoggedIn ? (
            <>
              <button className="btn btn-outline">👤 마이페이지</button>
              <button className="btn btn-ghost" onClick={onLogout}>
                🚪 로그아웃
              </button>
            </>
          ) : (
            <button className="btn btn-outline" onClick={onLogin}>
              로그인
            </button>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
