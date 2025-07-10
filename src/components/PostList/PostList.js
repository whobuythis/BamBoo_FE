import PostCard from "../PostCard/PostCard";
import "./PostList.css";

const PostList = ({ posts, searchQuery, onLike }) => {
  if (posts.length === 0) {
    return (
      <div className="empty-state">
        <div className="empty-icon">📝</div>
        {searchQuery ? (
          <>
            <p className="empty-title">
              "{searchQuery}"에 대한 검색 결과가 없습니다.
            </p>
            <p className="empty-subtitle">다른 키워드로 검색해보세요.</p>
          </>
        ) : (
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
        <PostCard key={post.id} post={post} onLike={onLike} />
      ))}
    </div>
  );
};

export default PostList;
