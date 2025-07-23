// React 라이브러리를 가져옴. JSX 문법을 쓰기 위해 필요
import React from "react";

// ReactDOM은 React 컴포넌트를 실제 DOM에 렌더링하는 역할을 함
import ReactDOM from "react-dom/client";

// App 컴포넌트를 가져옴. 우리가 만든 앱의 루트 컴포넌트
import App from "./App";

// 전체 앱에 적용할 CSS를 가져옴
import "./index.css";

// HTML에서 id가 'root'인 DOM 요소를 찾아서 거기에 React 앱을 렌더링함
// createRoot는 React 18부터 사용하는 새로운 렌더링 방식 (Concurrent 모드 지원)
const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement // 이게 public/index.html 안에 있는 <div id="root"></div>임
);
// 실제로 리액트 컴포넌트를 DOM에 렌더링하는 부분
root.render(
  // StrictMode는 개발 중 오류나 잘못된 사용을 경고해주는 모드 (배포 시엔 영향 없음)
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
