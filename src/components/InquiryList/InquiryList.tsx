import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllInquiries } from '../../services/inquiryService';
import { Inquiry } from '../../types';
import './InquiryList.css';

interface InquiryListProps {
  isAdmin?: boolean;
}

const InquiryList: React.FC<InquiryListProps> = ({ isAdmin = false }) => {
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchInquiries();
  }, []);

  const fetchInquiries = async () => {
    try {
      setLoading(true);
      const data = await getAllInquiries();
      setInquiries(data);
    } catch (error) {
      setError(error instanceof Error ? error.message : '문의하기 목록을 불러오는데 실패했습니다.');
    } finally {
      setLoading(false);
    }
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

  const getStatusClass = (status: string) => {
    switch (status) {
      case 'pending':
        return 'status-pending';
      case 'answered':
        return 'status-answered';
      case 'closed':
        return 'status-closed';
      default:
        return '';
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

  const handleInquiryClick = (inquiry: Inquiry) => {
    if (inquiry.isSecret && !isAdmin) {
      // 비밀글인 경우 비밀번호 입력 페이지로 이동
      navigate(`/inquiry/${inquiry.id}/password`);
    } else {
      // 일반 글인 경우 바로 상세 페이지로 이동
      navigate(`/inquiry/${inquiry.id}`);
    }
  };

  const handleWriteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    navigate('/inquiry/new');
  };

  if (loading) {
    return (
      <div className="inquiry-list-container">
        <div className="loading">문의하기 목록을 불러오는 중...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="inquiry-list-container">
        <div className="error-message">{error}</div>
        <button onClick={fetchInquiries} className="btn btn-primary">
          다시 시도
        </button>
      </div>
    );
  }

  return (
    <div className="inquiry-list-container">
      <div className="inquiry-list-header">
        <h2>{isAdmin ? '문의하기 관리' : '문의하기 목록'}</h2>
        {!isAdmin && (
          <button
            onClick={handleWriteClick}
            className="btn btn-primary"
            onMouseDown={(e) => e.stopPropagation()}
          >
            문의하기 작성
          </button>
        )}
      </div>

      {inquiries.length === 0 ? (
        <div className="empty-state">
          <p>등록된 문의가 없습니다.</p>
          {!isAdmin && (
            <button
              onClick={handleWriteClick}
              className="btn btn-primary"
              onMouseDown={(e) => e.stopPropagation()}
            >
              첫 번째 문의하기 작성하기
            </button>
          )}
        </div>
      ) : (
        <div className="inquiry-list">
          {inquiries.map((inquiry) => (
            <div
              key={inquiry.id}
              className="inquiry-item"
              onClick={() => handleInquiryClick(inquiry)}
            >
              <div className="inquiry-header">
                <div className="inquiry-title">
                  {inquiry.title}
                  {inquiry.isSecret && (
                    <span className="secret-badge">🔒</span>
                  )}
                  {inquiry.isAnonymous && (
                    <span className="anonymous-badge">익명</span>
                  )}
                </div>
                <div className="inquiry-meta">
                  <span className={`status ${getStatusClass(inquiry.status)}`}>
                    {getStatusText(inquiry.status)}
                  </span>
                  <span className="date">
                    {formatDate(inquiry.createdAt)}
                  </span>
                </div>
              </div>
              <div className="inquiry-author">
                작성자: {inquiry.authorName}
              </div>
              {inquiry.adminReply && (
                <div className="admin-reply-indicator">
                  ✓ 관리자 답변 완료
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default InquiryList;
