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
