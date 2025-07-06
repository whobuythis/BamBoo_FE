import PostList from "../PostList/PostList";

function PostCard(PostListprops) {
  console.log(`PostList에서 보내는 값`, PostListprops.sendMessage);
  return (
    <main>
      <article>화면 출력용</article>
    </main>
  );
}

export default PostCard;
