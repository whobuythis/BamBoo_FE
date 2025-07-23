// 게시글(Post) 데이터를 표현하는 인터페이스
export interface Post {
  id: number; // 각 게시글 고유 식별 번호 (예: 1, 2, 3...)
  title: string; // 게시글 제목
  content: string; // 게시글 본문 내용
  category: string; // 게시글이 속한 카테고리 (예: "공지사항", "일반" 등)
  timestamp: string; // 게시글 작성 시간 (날짜/시간 문자열로 저장됨, 예: "2025-07-23T12:34:56")
  likes: number; // 좋아요 수 (숫자, 예: 5)
  comments: number; // 댓글 수 (숫자, 예: 2)
  isLiked: boolean; // 현재 사용자가 이 게시글에 좋아요를 눌렀는지 여부 (true/false)
}

// 카테고리 정보를 나타내는 인터페이스
export interface Category {
  value: string; // 카테고리의 값 (내부에서 식별용으로 사용됨, 예: "all", "공지사항")
  label: string; // 사용자에게 보여질 이름 (예: "공지사항", "전체")
  icon: string; // 이모지나 아이콘을 문자열로 표현 (예: "📢", "📊")
}

// 새로 작성할 게시글(NewPost)에 필요한 정보만 담는 인터페이스
export interface NewPost {
  title: string; // 새 게시글의 제목
  content: string; // 새 게시글의 본문
  category: string; // 새 게시글이 속할 카테고리
}
