"use client";

import type React from "react";
import { useState } from "react";
import type { Comment, User } from "../../types";
import "./CommentSection.css";

interface CommentSectionProps {
  comments: Comment[];
  onAddComment: (content: string) => void;
  onUpdateComment?: (commentId: string, content: string) => void;
  onDeleteComment?: (commentId: string) => void;
  currentUser: User | null;
}

const CommentSection: React.FC<CommentSectionProps> = ({
  comments,
  onAddComment,
  onUpdateComment,
  onDeleteComment,
  currentUser,
}) => {
  const [newComment, setNewComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingCommentId, setEditingCommentId] = useState<string | null>(null);
  const [editContent, setEditContent] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);

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

  const handleEditClick = (comment: Comment) => {
    setEditingCommentId(comment.id);
    setEditContent(comment.content);
  };

  const handleCancelEdit = () => {
    setEditingCommentId(null);
    setEditContent("");
  };

  const handleUpdateComment = async () => {
    if (!editingCommentId || !editContent.trim() || !onUpdateComment) return;

    try {
      setIsUpdating(true);
      await onUpdateComment(editingCommentId, editContent.trim());
      setEditingCommentId(null);
      setEditContent("");
    } catch (error) {
      console.error("댓글 수정 실패:", error);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    if (!onDeleteComment) return;

    if (!window.confirm("정말로 이 댓글을 삭제하시겠습니까?")) return;

    try {
      setIsDeleting(commentId);
      await onDeleteComment(commentId);
    } catch (error) {
      console.error("댓글 삭제 실패:", error);
    } finally {
      setIsDeleting(null);
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
          comments.map((comment) => {
            const isEditing = editingCommentId === comment.id;
            const isAuthor = currentUser && comment.authorId === currentUser.uid;

            return (
              <div key={comment.id} className="comment-item">
                <div className="comment-header-info">
                  <div className="comment-author-info">
                    <span className="comment-author">{comment.authorName}</span>
                    <span className="comment-date">
                      {formatDate(comment.createdAt)}
                      {comment.updatedAt && comment.updatedAt !== comment.createdAt && (
                        <span className="comment-updated"> (수정됨)</span>
                      )}
                    </span>
                  </div>
                  {isAuthor && (
                    <div className="comment-actions">
                      {isEditing ? (
                        <>
                          <button
                            onClick={handleUpdateComment}
                            disabled={!editContent.trim() || isUpdating}
                            className="comment-action-btn comment-update-btn"
                          >
                            {isUpdating ? "수정 중..." : "완료"}
                          </button>
                          <button
                            onClick={handleCancelEdit}
                            className="comment-action-btn comment-cancel-btn"
                          >
                            취소
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            onClick={() => handleEditClick(comment)}
                            className="comment-action-btn comment-edit-btn"
                          >
                            ✏️ 수정
                          </button>
                          <button
                            onClick={() => handleDeleteComment(comment.id)}
                            disabled={isDeleting === comment.id}
                            className="comment-action-btn comment-delete-btn"
                          >
                            {isDeleting === comment.id ? "삭제 중..." : "🗑️ 삭제"}
                          </button>
                        </>
                      )}
                    </div>
                  )}
                </div>
                <div className="comment-content">
                  {isEditing ? (
                    <textarea
                      value={editContent}
                      onChange={(e) => setEditContent(e.target.value)}
                      className="comment-edit-input"
                      rows={3}
                    />
                  ) : (
                    <p>{comment.content}</p>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default CommentSection;
