import React, { useState } from 'react';
import InquiryList from '../../components/InquiryList/InquiryList';
import InquiryForm from '../../components/InquiryForm/InquiryForm';
import './Inquiry.css';

const Inquiry: React.FC = () => {
  const [showForm, setShowForm] = useState(false);

  const handleFormSuccess = () => {
    setShowForm(false);
    // 폼이 성공적으로 제출되면 목록을 새로고침하기 위해 페이지를 리로드
    window.location.reload();
  };

  const handleFormCancel = () => {
    setShowForm(false);
  };

  if (showForm) {
    return (
      <div className="inquiry-page">
        <InquiryForm 
          onSuccess={handleFormSuccess}
          onCancel={handleFormCancel}
        />
      </div>
    );
  }

  return (
    <div className="inquiry-page">
      <InquiryList />
    </div>
  );
};

export default Inquiry;
