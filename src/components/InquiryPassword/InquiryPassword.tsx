import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { verifyInquiryPassword } from '../../services/inquiryService';
import './InquiryPassword.css';

const InquiryPassword: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // 숫자만 입력 가능하도록 제한
    if (/^\d*$/.test(value) && value.length <= 4) {
      setPassword(value);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!id) {
      setError('잘못된 접근입니다.');
      return;
    }

    if (password.length !== 4) {
      setError('비밀번호는 4자리 숫자로 입력해주세요.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const isValid = await verifyInquiryPassword(id, password);
      
      if (isValid) {
        // 비밀번호가 맞으면 상세 페이지로 이동
        navigate(`/inquiry/${id}`);
      } else {
        setError('비밀번호가 올바르지 않습니다.');
      }
    } catch (error) {
      setError('비밀번호 확인 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate('/inquiry');
  };

  return (
    <div className="inquiry-password-container">
      <div className="password-form-card">
        <div className="password-form-header">
          <h2>🔒 비밀글 확인</h2>
          <p>이 문의는 비밀글로 설정되어 있습니다.</p>
          <p>본인 확인을 위해 비밀번호를 입력해주세요.</p>
        </div>

        <form onSubmit={handleSubmit} className="password-form">
          {error && <div className="error-message">{error}</div>}
          
          <div className="form-group">
            <label htmlFor="password">비밀번호 (4자리 숫자)</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={handlePasswordChange}
              placeholder="0000"
              maxLength={4}
              pattern="[0-9]{4}"
              required
              autoFocus
            />
          </div>

          <div className="form-actions">
            <button
              type="button"
              onClick={handleCancel}
              className="btn btn-secondary"
              disabled={loading}
            >
              취소
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading || password.length !== 4}
            >
              {loading ? '확인 중...' : '확인'}
            </button>
          </div>
        </form>

        <div className="password-form-footer">
          <p>비밀번호를 잊어버리셨나요?</p>
          <p>관리자에게 문의해주세요.</p>
        </div>
      </div>
    </div>
  );
};

export default InquiryPassword;
