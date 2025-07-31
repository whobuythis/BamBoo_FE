"use client";

import type React from "react";
import { useState, useCallback } from "react";
import { Link } from "react-router-dom";
import type { Post, User, Comment } from "../../types";
import "./PostCard.css";

interface PostCardProps {
  post: Post;
  onLike: (postId: string) => void;
  onCommentAdded?: (postId: string) => void;
  currentUser: User | null;
}

const getCategoryColor = (category: string): string => {
  switch (category) {
    case "공지사항":
      return "category-notice";
    case "웹 개발팀":
      return "category-web";
    case "데이터 분석팀":
      return "category-data";
    case "일반":
      return "category-general";
    default:
      return "category-default";
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

const PostCard: React.FC<PostCardProps> = ({ post, onLike, onCommentAdded, currentUser }) => {
  const [showComments, setShowComments] = useState(false);
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [editingCommentId, setEditingCommentId] = useState<string | null>(null);
  const [editContent, setEditContent] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);

  const handleLikeClick = () => {
    if (currentUser) {
      onLike(post.id);
    }
  };

  const handleCommentClick = useCallback(async () => {
    if (!showComments) {
      setLoading(true);
      try {
        const { commentService } = await import("../../services/postService");
        const commentsData = await commentService.getCommentsByPost(post.id);
        setComments(commentsData);
      } catch (error) {
        console.error("댓글 로드 실패:", error);
      } finally {
        setLoading(false);
      }
    }
    setShowComments(!showComments);
  }, [showComments, post.id]);

  const handleAddComment = async () => {
    if (!currentUser || !newComment.trim()) return;

    setSubmitting(true);
    try {
      const { commentService } = await import("../../services/postService");
      await commentService.createComment(
        { content: newComment.trim() },
        post.id,
        currentUser.uid,
        currentUser.displayName || "익명사용자"
      );

      // 댓글 목록 새로고침
      const updatedComments = await commentService.getCommentsByPost(post.id);
      setComments(updatedComments);
      setNewComment("");
      
      // 부모 컴포넌트에 댓글 추가 알림
      if (onCommentAdded) {
        onCommentAdded(post.id);
      }
    } catch (error) {
      console.error("댓글 작성 실패:", error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpdateComment = async (commentId: string, content: string) => {
    if (!currentUser) return;

    try {
      const { commentService } = await import("../../services/postService");
      await commentService.updateComment(commentId, { content });

      // 댓글 목록 새로고침
      const updatedComments = await commentService.getCommentsByPost(post.id);
      setComments(updatedComments);
    } catch (error) {
      console.error("댓글 수정 실패:", error);
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    if (!currentUser) return;

    try {
      const { commentService } = await import("../../services/postService");
      await commentService.deleteComment(commentId, post.id);

      // 댓글 목록 새로고침
      const updatedComments = await commentService.getCommentsByPost(post.id);
      setComments(updatedComments);
      
      // 부모 컴포넌트에 댓글 삭제 알림
      if (onCommentAdded) {
        onCommentAdded(post.id);
      }
    } catch (error) {
      console.error("댓글 삭제 실패:", error);
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

  const handleUpdateCommentLocal = async (commentId: string) => {
    if (!editContent.trim()) return;

    setIsUpdating(true);
    try {
      await handleUpdateComment(commentId, editContent.trim());
      setEditingCommentId(null);
      setEditContent("");
    } catch (error) {
      console.error("댓글 수정 실패:", error);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDeleteCommentLocal = async (commentId: string) => {
    if (!window.confirm("정말로 이 댓글을 삭제하시겠습니까?")) return;

    setIsDeleting(commentId);
    try {
      await handleDeleteComment(commentId);
    } catch (error) {
      console.error("댓글 삭제 실패:", error);
    } finally {
      setIsDeleting(null);
    }
  };

  const isLiked = currentUser ? post.likes.includes(currentUser.uid) : false;

  return (
    <div className="post-card">
      <div className="post-header">
        <div className="post-meta">
          <span className={`category-badge ${getCategoryColor(post.category)}`}>
            {post.category}
          </span>
          <div className="post-info">
            <span className="author-name">{post.authorName}</span>
            <span className="post-time">
              <span className="time-icon">🕒</span>
              {formatDate(post.createdAt)}
            </span>
          </div>
        </div>
        <h3 className="post-title">{post.title}</h3>
        <p className="post-content">
          {post.content.length > 200
            ? `${post.content.substring(0, 200)}...`
            : post.content}
        </p>
      </div>

      <div className="post-actions">
        <div className="post-stats">
          <button
            className={`stat-button ${isLiked ? "liked" : ""}`}
            onClick={handleLikeClick}
            disabled={!currentUser}
          >
            <span className="stat-icon">{isLiked ? "❤️" : "🤍"}</span>
            <span>{post.likesCount}</span>
          </button>
          <button 
            className={`stat-button ${showComments ? "active" : ""}`}
            onClick={handleCommentClick}
          >
            <span className="stat-icon">💬</span>
            <span>{post.commentsCount}</span>
          </button>
        </div>
        <Link to={`/post/${post.id}`} className="detail-button">
          자세히 보기
        </Link>
      </div>

      {/* 댓글 확장 영역 */}
      {showComments && (
        <div className="comments-expanded">
          <div className="comments-header">
            <h4>댓글 ({comments.length})</h4>
          </div>
          
          {/* 댓글 작성 폼 */}
          {currentUser && (
            <div className="comment-form">
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="댓글을 작성하세요..."
                className="comment-input"
                rows={3}
              />
              <button
                onClick={handleAddComment}
                disabled={!newComment.trim() || submitting}
                className="comment-submit-btn"
              >
                {submitting ? "작성 중..." : "댓글 작성"}
              </button>
            </div>
          )}

          {/* 댓글 목록 */}
          <div className="comments-list">
            {loading ? (
              <div className="loading-comments">댓글을 불러오는 중...</div>
            ) : comments.length === 0 ? (
              <div className="no-comments">아직 댓글이 없습니다.</div>
            ) : (
              comments.map((comment) => {
                const isAuthor = currentUser && comment.authorId === currentUser.uid;
                const isEditing = editingCommentId === comment.id;

                return (
                  <div key={comment.id} className="comment-item">
                    <div className="comment-header">
                      <div className="comment-author-info">
                        <span className="comment-author">{comment.authorName}</span>
                        <span className="comment-time">
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
                                onClick={() => handleUpdateCommentLocal(comment.id)}
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
                                onClick={() => handleDeleteCommentLocal(comment.id)}
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
                        <div>{comment.content}</div>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default PostCard;
