import type { Timestamp } from "firebase/firestore";

export interface User {
  uid: string;
  email: string;
  displayName?: string;
  photoURL?: string;
  createdAt: Timestamp;
}

export interface Post {
  id: string;
  title: string;
  content: string;
  category: string;
  authorId: string;
  authorName: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  likes: string[];
  likesCount: number;
  commentsCount: number;
}

export interface Comment {
  id: string;
  postId: string;
  content: string;
  authorId: string;
  authorName: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface Category {
  value: string;
  label: string;
  icon: string;
}

export interface NewPost {
  title: string;
  content: string;
  category: string;
}

export interface NewComment {
  content: string;
}

export interface AuthContextType {
  currentUser: User | null;
  login: (email: string, password: string) => Promise<void>;
  register: (
    email: string,
    password: string,
    displayName: string
  ) => Promise<void>;
  logout: () => Promise<void>;
  loading: boolean;
}

// 문의하기 관련 타입들
export interface Inquiry {
  id: string;
  title: string;
  content: string;
  authorId?: string; // 익명인 경우 없음
  authorName: string;
  authorEmail?: string; // 익명인 경우 없음
  isAnonymous: boolean;
  isSecret: boolean;
  password?: string; // 비밀글인 경우 4자리 숫자
  createdAt: Timestamp;
  updatedAt: Timestamp;
  status: 'pending' | 'answered' | 'closed';
  adminReply?: string;
  adminReplyAt?: Timestamp;
}

export interface NewInquiry {
  title: string;
  content: string;
  authorName: string;
  authorEmail?: string;
  authorId?: string;
  isAnonymous: boolean;
  isSecret: boolean;
  password?: string;
}

export interface InquiryFormData {
  title: string;
  content: string;
  authorName: string;
  authorEmail: string;
  isAnonymous: boolean;
  isSecret: boolean;
  password: string;
}
