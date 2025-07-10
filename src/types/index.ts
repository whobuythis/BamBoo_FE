export interface Post {
  id: number;
  title: string;
  content: string;
  category: string;
  timestamp: string;
  likes: number;
  comments: number;
  isLiked: boolean;
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
