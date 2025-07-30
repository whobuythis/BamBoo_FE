"use client";

import type React from "react";
import { useState } from "react";
import type { Comment, User } from "../../types";
import "./CommentSection.css";

interface CommentSectionProps {
  comments: Comment[];
  onAddComment: (content: string) => void;
  currentUser: User | null;
}

const CommentSection: React.FC<CommentSectionProps> = ({
  comments,
  onAddComment,
  currentUser,
}) => {
  const [newComment, setNewComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || !currentUser) return;

    try {
      setIsSubmitting(true);
      await onAddComment(newComment.trim());
      setNewComment("");
    } catch (error) {
      console.error("댓글 작성 실패:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatDate = (timestamp: any): string => {
    if (!timestamp) return "";

    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    const now = new Date();
    const diff = now.getTime() - date.getTime();

    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (minutes < 1) return "방금 전";
    if (minutes < 60) return `${minutes}분 전`;
    if (hours < 24) return `${hours}시간 전`;
    if (days < 7) return `${days}일 전`;

    return date.toLocaleDateString("ko-KR");
  };

  return (
    <div className="comment-section">
      <div className="comment-header">
        <h3>댓글 {comments.length}개</h3>
      </div>

      {currentUser && (
        <form onSubmit={handleSubmit} className="comment-form">
          <div className="comment-input-wrapper">
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="댓글을 작성해주세요..."
              rows={3}
              className="comment-input"
            />
            <button
              type="submit"
              className="comment-submit-btn"
              disabled={!newComment.trim() || isSubmitting}
            >
              {isSubmitting ? "작성 중..." : "댓글 작성"}
            </button>
          </div>
        </form>
      )}

      <div className="comments-list">
        {comments.length === 0 ? (
          <div className="no-comments">
            <p>아직 댓글이 없습니다. 첫 번째 댓글을 작성해보세요!</p>
          </div>
        ) : (
          comments.map((comment) => (
            <div key={comment.id} className="comment-item">
              <div className="comment-header-info">
                <span className="comment-author">{comment.authorName}</span>
                <span className="comment-date">
                  {formatDate(comment.createdAt)}
                </span>
              </div>
              <div className="comment-content">
                <p>{comment.content}</p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default CommentSection;
