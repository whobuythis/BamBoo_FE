"use client";

import { useState } from "react";
import "./WritePostModal.css";

const WritePostModal = ({ isOpen, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    category: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.title && formData.content && formData.category) {
      onSubmit(formData);
      setFormData({ title: "", content: "", category: "" });
      onClose();
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>새 글 작성</h2>
          <p>익명으로 고민이나 이야기를 공유해보세요.</p>
          <button className="close-button" onClick={onClose}>
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-group">
            <label htmlFor="category">카테고리</label>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
            >
              <option value="">카테고리를 선택하세요</option>
              <option value="공지사항">공지사항</option>
              <option value="웹 개발팀">웹 개발팀</option>
              <option value="데이터 분석팀">데이터 분석팀</option>
              <option value="일반">일반</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="title">제목</label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="제목을 입력하세요"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="content">내용</label>
            <textarea
              id="content"
              name="content"
              value={formData.content}
              onChange={handleChange}
              placeholder="내용을 입력하세요"
              rows={6}
              required
            />
          </div>

          <div className="modal-actions">
            <button type="button" className="btn btn-outline" onClick={onClose}>
              취소
            </button>
            <button type="submit" className="btn btn-primary">
              게시하기
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default WritePostModal;
