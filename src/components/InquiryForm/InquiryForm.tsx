import React, { useState, ChangeEvent, FormEvent } from "react";
import "./InquiryForm.css";

interface InquiryData {
  name: string;
  email: string;
  message: string;
}

const InquiryForm: React.FC = () => {
  const [formData, setFormData] = useState<InquiryData>({
    name: "",
    email: "",
    message: "",
  });

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("문의 내용:", formData); // TODO: 서버 연동 시 API 호출
    alert("문의가 접수되었습니다!");
    setFormData({ name: "", email: "", message: "" });
  };

  return (
    <div className="inquiry-form">
      <h2>문의하기</h2>
      <form onSubmit={handleSubmit}>
        <label>이름</label>
        <input
          type="text"
          name="name"
          placeholder="이름을 입력하세요"
          value={formData.name}
          onChange={handleChange}
          required
        />

        <label>이메일</label>
        <input
          type="email"
          name="email"
          placeholder="이메일을 입력하세요"
          value={formData.email}
          onChange={handleChange}
          required
        />

        <label>문의 내용</label>
        <textarea
          name="message"
          placeholder="문의 내용을 입력하세요"
          value={formData.message}
          onChange={handleChange}
          rows={5}
          required
        />

        <button type="submit" className="btn-submit">보내기</button>
      </form>
    </div>
  );
};

export default InquiryForm;
