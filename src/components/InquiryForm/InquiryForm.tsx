import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { createInquiry } from '../../services/inquiryService';
import { InquiryFormData, NewInquiry } from '../../types';
import './InquiryForm.css';

interface InquiryFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
}

const InquiryForm: React.FC<InquiryFormProps> = ({ onSuccess, onCancel }) => {
  const { currentUser } = useAuth();
  const [formData, setFormData] = useState<InquiryFormData>({
    title: '',
    content: '',
    authorName: currentUser?.displayName || '',
    authorEmail: currentUser?.email || '',
    isAnonymous: false,
    isSecret: false,
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({
        ...prev,
        [name]: checked
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const validateForm = (): boolean => {
    if (!formData.title.trim()) {
      setError('제목을 입력해주세요.');
      return false;
    }
    
    if (!formData.content.trim()) {
      setError('내용을 입력해주세요.');
      return false;
    }

    if (!formData.isAnonymous && !formData.authorName.trim()) {
      setError('작성자 이름을 입력해주세요.');
      return false;
    }

    if (!formData.isAnonymous && !formData.authorEmail.trim()) {
      setError('이메일을 입력해주세요.');
      return false;
    }

    if (formData.isSecret && formData.password.length !== 4) {
      setError('비밀번호는 4자리 숫자로 입력해주세요.');
      return false;
    }

    if (formData.isSecret && !/^\d{4}$/.test(formData.password)) {
      setError('비밀번호는 숫자 4자리만 입력 가능합니다.');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const inquiryData: NewInquiry = {
        title: formData.title.trim(),
        content: formData.content.trim(),
        authorName: formData.isAnonymous ? '익명' : formData.authorName.trim(),
        isAnonymous: formData.isAnonymous,
        isSecret: formData.isSecret,
      };

      // 익명이 아닌 경우에만 authorEmail과 authorId 추가
      if (!formData.isAnonymous) {
        inquiryData.authorEmail = formData.authorEmail.trim();
        if (currentUser?.uid) {
          inquiryData.authorId = currentUser.uid;
        }
      }

      // 비밀글인 경우에만 password 추가
      if (formData.isSecret) {
        inquiryData.password = formData.password;
      }

      await createInquiry(inquiryData);
      
      // 폼 초기화
      setFormData({
        title: '',
        content: '',
        authorName: currentUser?.displayName || '',
        authorEmail: currentUser?.email || '',
        isAnonymous: false,
        isSecret: false,
        password: ''
      });

      onSuccess?.();
    } catch (error) {
      setError(error instanceof Error ? error.message : '문의하기 작성에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="inquiry-form-container">
      <h2>문의하기</h2>
      <form onSubmit={handleSubmit} className="inquiry-form">
        {error && <div className="error-message">{error}</div>}
        
        <div className="form-group">
          <label htmlFor="title">제목 *</label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            placeholder="제목을 입력해주세요"
            maxLength={100}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="content">내용 *</label>
          <textarea
            id="content"
            name="content"
            value={formData.content}
            onChange={handleInputChange}
            placeholder="문의 내용을 자세히 작성해주세요"
            rows={8}
            required
          />
        </div>

        <div className="form-group">
          <label className="checkbox-label">
            <input
              type="checkbox"
              name="isAnonymous"
              checked={formData.isAnonymous}
              onChange={handleInputChange}
            />
            익명으로 작성하기
          </label>
        </div>

        {!formData.isAnonymous && (
          <>
            <div className="form-group">
              <label htmlFor="authorName">작성자 이름 *</label>
              <input
                type="text"
                id="authorName"
                name="authorName"
                value={formData.authorName}
                onChange={handleInputChange}
                placeholder="작성자 이름을 입력해주세요"
                maxLength={50}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="authorEmail">이메일 *</label>
              <input
                type="email"
                id="authorEmail"
                name="authorEmail"
                value={formData.authorEmail}
                onChange={handleInputChange}
                placeholder="이메일을 입력해주세요"
                required
              />
            </div>
          </>
        )}

        <div className="form-group">
          <label className="checkbox-label">
            <input
              type="checkbox"
              name="isSecret"
              checked={formData.isSecret}
              onChange={handleInputChange}
            />
            비밀글로 작성하기
          </label>
        </div>

        {formData.isSecret && (
          <div className="form-group">
            <label htmlFor="password">비밀번호 (4자리 숫자) *</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              placeholder="0000"
              maxLength={4}
              pattern="[0-9]{4}"
              required
            />
            <small>비밀글 조회 시 본인 확인을 위한 비밀번호입니다.</small>
          </div>
        )}

        <div className="form-actions">
          <button
            type="button"
            onClick={onCancel}
            className="btn btn-secondary"
            disabled={loading}
          >
            취소
          </button>
          <button
            type="submit"
            className="btn btn-primary"
            disabled={loading}
          >
            {loading ? '등록 중...' : '등록하기'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default InquiryForm;
