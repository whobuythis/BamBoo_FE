function Header({ title }) {
  return (
    <header>
      <h1>{title}</h1>
      <input type="text" placeholder="게시글 검색"></input>
      <button>+ 글쓰기</button>
      <button>로그인</button>
    </header>
  );
}

export default Header;
