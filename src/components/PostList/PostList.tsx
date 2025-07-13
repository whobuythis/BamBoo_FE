import type React from "react";
import PostCard from "../PostCard/PostCard";
import type { Post } from "../../types";
import "./PostList.css";

//TS는 interface를 도입하여 JS의 약한 타입시스템을 보완한다.
//props의 타입만 정의할 것이므로 class가 아닌(인터페이스 생성) interface가 적절
interface PostListProps {
  posts: Post[]; //types의 index.ts에서 가져온다
  //Post: 게시글 하나의 구조를 정의
  //Post[]: Post 객체들이 들어있는 배열
  searchQuery: string;
  onLike: (postId: number) => void;
}

//컴포넌트 PostList
//const PostList: React.FC<PostListProps> = ({ posts, searchQuery, onLike }) => {
const PostList = ({ posts, searchQuery, onLike }: PostListProps) => {
  if (posts.length === 0) {
    //검색결과가 없을 때
    return (
      <div className="empty-state">
        <div className="empty-icon">📝</div>
        {searchQuery ? ( //사용자가 검색어를 입력했는지 여부
          <>
            {/* 삼항연산자의 결과는 반드시 하나의 표현식이어야 한다.
            <React.Fragment>로 감싸서 하나의 요소로 만들어야 */}
            <p className="empty-title">
              "{searchQuery}"에 대한 검색 결과가 없습니다.
            </p>
            <p className="empty-subtitle">다른 키워드로 검색해보세요.</p>
          </>
        ) : (
          //검색어 입력 X일 경우
          <>
            <p className="empty-title">아직 게시글이 없습니다.</p>
            <p className="empty-subtitle">첫 번째 글을 작성해보세요!</p>
          </>
        )}
      </div>
    );
  }

  return (
    <div className="post-list">
      {posts.map((post) => (
        //array.map((item, index, array)
        // item: 배열 요소 하나
        // index: 그 요소의 인덱스 (0, 1, 2, ...)
        // array: 원래 배열 전체

        <PostCard key={post.id} post={post} onLike={onLike} />
        //이 props들을 PostCard에 넘겨줌
        /*리액트는 부모 → 자식으로만 데이터가 흐른다. (단방향 데이터 흐름)
          그리고 상태(state)는 상위 컴포넌트에서 관리하고
          하위 컴포넌트는 그 상태를 읽기만 할 수 있다. */

        //post= 자식 컴포넌트에서 사용할 props 이름
        //{post} 지금 부모 컴포넌트 안에서 쓰고 있는 변수
      ))}
    </div>
  );
};

export default PostList;
