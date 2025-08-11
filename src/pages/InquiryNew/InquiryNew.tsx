import React from 'react';
import { useNavigate } from 'react-router-dom';
import InquiryForm from '../../components/InquiryForm/InquiryForm';
import './InquiryNew.css';

const InquiryNew: React.FC = () => {
  const navigate = useNavigate();

  const handleFormSuccess = () => {
    // 성공적으로 작성되면 문의하기 목록으로 이동
    navigate('/inquiry');
  };

  const handleFormCancel = () => {
    // 취소하면 문의하기 목록으로 이동
    navigate('/inquiry');
  };

  return (
    <div className="inquiry-new-page">
      <InquiryForm 
        onSuccess={handleFormSuccess}
        onCancel={handleFormCancel}
      />
    </div>
  );
};

export default InquiryNew;
