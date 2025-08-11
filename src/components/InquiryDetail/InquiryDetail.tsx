import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { 
  getInquiryById, 
  addAdminReply, 
  updateInquiryStatus,
  deleteInquiry 
} from '../../services/inquiryService';
import { Inquiry } from '../../types';
import './InquiryDetail.css';

const InquiryDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  
  const [inquiry, setInquiry] = useState<Inquiry | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [adminReply, setAdminReply] = useState('');
  const [replyLoading, setReplyLoading] = useState(false);

  // 관리자 여부 확인 (실제로는 더 정교한 권한 체크가 필요)
  const isAdmin = currentUser?.email === 'admin@example.com'; // 임시 관리자 이메일

  const fetchInquiry = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getInquiryById(id!);
      if (data) {
        setInquiry(data);
      } else {
        setError('문의를 찾을 수 없습니다.');
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : '문의를 불러오는데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    if (id) {
      fetchInquiry();
    }
  }, [id, fetchInquiry]);

  const handleAdminReply = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!inquiry || !adminReply.trim()) return;

    setReplyLoading(true);
    try {
      await addAdminReply(inquiry.id, adminReply.trim());
      setAdminReply('');
      setShowReplyForm(false);
      await fetchInquiry(); // 문의 정보 새로고침
    } catch (error) {
      setError(error instanceof Error ? error.message : '답변 작성에 실패했습니다.');
    } finally {
      setReplyLoading(false);
    }
  };

  const handleStatusChange = async (status: 'pending' | 'answered' | 'closed') => {
    if (!inquiry) return;

    try {
      await updateInquiryStatus(inquiry.id, status);
      await fetchInquiry();
    } catch (error) {
      setError(error instanceof Error ? error.message : '상태 변경에 실패했습니다.');
    }
  };

  const handleDelete = async () => {
    if (!inquiry || !window.confirm('정말로 이 문의를 삭제하시겠습니까?')) return;

    try {
      await deleteInquiry(inquiry.id);
      navigate('/inquiry');
    } catch (error) {
      setError(error instanceof Error ? error.message : '삭제에 실패했습니다.');
    }
  };

  const formatDate = (timestamp: any) => {
    if (!timestamp) return '';
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending':
        return '대기중';
      case 'answered':
        return '답변완료';
      case 'closed':
        return '종료';
      default:
        return status;
    }
  };

  if (loading) {
    return (
      <div className="inquiry-detail-container">
        <div className="loading">문의를 불러오는 중...</div>
      </div>
    );
  }

  if (error || !inquiry) {
    return (
      <div className="inquiry-detail-container">
        <div className="error">
          {error || '문의를 찾을 수 없습니다.'}
          <button onClick={() => navigate('/inquiry')} className="btn btn-primary">
            목록으로 돌아가기
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="inquiry-detail-container">
      <div className="inquiry-detail-header">
        <h1>{inquiry.title}</h1>
        <button onClick={() => navigate('/inquiry')} className="btn btn-outline back-btn">
          ← 목록으로
        </button>
      </div>

      <div className="inquiry-content">
        <div className="inquiry-meta">
          <div className="meta-item">
            <span className="label">작성자:</span>
            <span className="value">
              {inquiry.isAnonymous ? '익명' : inquiry.authorName}
            </span>
          </div>
          <div className="meta-item">
            <span className="label">작성일:</span>
            <span className="value">{formatDate(inquiry.createdAt)}</span>
          </div>
          <div className="meta-item">
            <span className="label">상태:</span>
            <span className={`status status-${inquiry.status}`}>
              {getStatusText(inquiry.status)}
            </span>
          </div>
          {inquiry.isSecret && (
            <div className="meta-item">
              <span className="badge badge-secret">🔒 비밀글</span>
            </div>
          )}
          {inquiry.isAnonymous && (
            <div className="meta-item">
              <span className="badge badge-anonymous">👤 익명</span>
            </div>
          )}
        </div>

        <div className="inquiry-body">
          <p>{inquiry.content}</p>
        </div>

        {inquiry.adminReply && (
          <div className="admin-reply">
            <h3>관리자 답변</h3>
            <div className="reply-meta">
              <span>답변일: {formatDate(inquiry.adminReplyAt)}</span>
            </div>
            <div className="reply-content">
              <p>{inquiry.adminReply}</p>
            </div>
          </div>
        )}

        {isAdmin && (
          <div className="admin-actions">
            <h3>관리자 기능</h3>
            
            {!inquiry.adminReply && (
              <div className="reply-form">
                <button 
                  onClick={() => setShowReplyForm(!showReplyForm)}
                  className="btn btn-primary"
                >
                  {showReplyForm ? '답변 작성 취소' : '답변 작성'}
                </button>
                
                {showReplyForm && (
                  <form onSubmit={handleAdminReply} className="reply-form-content">
                    <textarea
                      value={adminReply}
                      onChange={(e) => setAdminReply(e.target.value)}
                      placeholder="답변을 입력하세요..."
                      required
                      rows={4}
                    />
                    <div className="form-actions">
                      <button 
                        type="submit" 
                        className="btn btn-primary"
                        disabled={replyLoading}
                      >
                        {replyLoading ? '답변 작성 중...' : '답변 등록'}
                      </button>
                    </div>
                  </form>
                )}
              </div>
            )}

            <div className="status-actions">
              <h4>상태 변경</h4>
              <div className="status-buttons">
                <button 
                  onClick={() => handleStatusChange('pending')}
                  className={`btn ${inquiry.status === 'pending' ? 'btn-primary' : 'btn-outline'}`}
                >
                  대기중
                </button>
                <button 
                  onClick={() => handleStatusChange('answered')}
                  className={`btn ${inquiry.status === 'answered' ? 'btn-primary' : 'btn-outline'}`}
                >
                  답변완료
                </button>
                <button 
                  onClick={() => handleStatusChange('closed')}
                  className={`btn ${inquiry.status === 'closed' ? 'btn-primary' : 'btn-outline'}`}
                >
                  종료
                </button>
              </div>
            </div>

            <div className="delete-action">
              <button 
                onClick={handleDelete}
                className="btn btn-danger"
              >
                문의 삭제
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default InquiryDetail;
