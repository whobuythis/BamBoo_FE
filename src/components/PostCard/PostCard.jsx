import "./PostCard.css";

const PostCard = (PostListprops) => {
  // console.log(`PostList에서 보내는 값`, PostListprops.sendMessage);
  return (
    <div className="post-card">
      <div className="post-meta">
        <div>post-category</div>
        <div>시계</div>
      </div>

      <h3>[공지]</h3>
      <p>
        안녕하세요! BamBoo하우스에 오신 것을 환영합니다. 이곳은 웹 개발팀과
        데이터 분석팀이 함께 소통할 수 있는 익명 공간입니다. 서로 존중하며
        건설적인 대화를 나누어 주세요.
      </p>
      <div className="post-actions">
        <button>하트</button>
        <button>말풍선</button>
        <button>자세히 보기</button>
      </div>
    </div>
  );
};

export default PostCard;
