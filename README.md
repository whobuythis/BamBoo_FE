# BamBoo_FE - React 커뮤니티 플랫폼

BamBoo_FE는 React와 Firebase를 사용하여 구축된 커뮤니티 플랫폼입니다.

## 참여자

> `윤찬우` : 팀장 / Header, WritePostModal, Firebase Auth & Firestore Database

> `문승연` : 팀원 / Statistics, PostDetail, Firebase Hosting

> `공주원` : 팀원 / PostCard, PostList, UI & UX 디자인

> `윤지영` : 팀원 / CategorySidebar, CommentSection, UI & UX 디자인

## 주요 기능

- ✅ 사용자 인증 (로그인/회원가입)
- ✅ 게시글 작성 및 조회
- ✅ 댓글 시스템
- ✅ 마이페이지 (내 게시글/댓글 관리)
- ✅ 카테고리별 게시글 필터링
- ✅ 좋아요 기능
- ✅ 문의하기 시스템
  - 익명 문의 작성
  - 비밀글 기능 (4자리 숫자 비밀번호)
  - 관리자 답변 시스템
  - 문의 상태 관리 (대기중/답변완료/종료)
- ✅ 반응형 디자인

## 기술 스택

- **Frontend**: React 18, TypeScript
- **Backend**: Firebase (Authentication, Firestore)
- **Styling**: CSS3
- **Routing**: React Router DOM
- **hosting**: Firebase Hosting

## 설치 및 실행

### 1. 의존성 설치

```bash
npm install
```

### 2. 환경변수 설정

프로젝트 루트에 `.env` 파일을 생성하고 다음 내용을 추가하세요:

```env
REACT_APP_FIREBASE_API_KEY=your_firebase_api_key
REACT_APP_FIREBASE_AUTH_DOMAIN=your-project-id.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=your-project-id
REACT_APP_FIREBASE_STORAGE_BUCKET=your-project-id.firebasestorage.app
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
REACT_APP_FIREBASE_APP_ID=your_app_id
```

**⚠️ 보안 주의사항:**

- `.env` 파일은 절대 GitHub에 업로드하지 마세요
- `.gitignore`에 `.env`가 포함되어 있는지 확인하세요
- 실제 Firebase 프로젝트 설정값을 사용하세요

### 3. 개발 서버 실행

```bash
npm start
```

브라우저에서 [http://localhost:3000](http://localhost:3000)으로 접속하세요.

## 프로젝트 구조

```
src/
├── components/          # 재사용 가능한 컴포넌트
│   ├── Header/         # 헤더 컴포넌트
│   ├── PostCard/       # 게시글 카드 컴포넌트
│   ├── CommentSection/ # 댓글 섹션 컴포넌트
│   └── ...
├── pages/              # 페이지 컴포넌트
│   ├── Home/           # 홈 페이지
│   ├── Login/          # 로그인 페이지
│   ├── MyPage/         # 마이페이지
│   └── ...
├── services/           # API 서비스
│   ├── postService.ts  # 게시글 관련 서비스
│   ├── userService.ts  # 사용자 관련 서비스
│   └── inquiryService.ts # 문의하기 관련 서비스
├── contexts/           # React Context
│   └── AuthContext.tsx # 인증 컨텍스트
├── config/             # 설정 파일
│   └── firebase.ts     # Firebase 설정
└── types/              # TypeScript 타입 정의
    └── index.ts        # 공통 타입들
```

## 사용 가능한 스크립트

### `npm start`

개발 모드로 앱을 실행합니다.
브라우저에서 [http://localhost:3000](http://localhost:3000)으로 접속하세요.

### `npm test`

테스트 러너를 대화형 감시 모드로 실행합니다.

### `npm run build`

프로덕션용 앱을 `build` 폴더에 빌드합니다.
최적화된 프로덕션 빌드가 생성됩니다.

### `npm run eject`

**주의: 이 작업은 되돌릴 수 없습니다!**

빌드 도구와 설정 선택에 만족하지 못하는 경우 언제든지 `eject`할 수 있습니다.

## 문제 해결

자세한 오류 해결 과정은 [report.md](./report.md) 파일을 참조하세요.

## 라이선스

이 프로젝트는 MIT 라이선스 하에 배포됩니다.

---

_프로젝트: BamBoo_FE_
_상태: 개발 완료 ✅_