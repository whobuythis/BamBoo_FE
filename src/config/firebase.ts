import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  // 여기에 Firebase 프로젝트 설정을 입력하세요
  apiKey: "AIzaSyAzqoNOwpA9vQEwhbel1gNWMyfrW6qHyLM",
  authDomain: "bamboo-3658e.firebaseapp.com",
  projectId: "bamboo-3658e",
  storageBucket: "bamboo-3658e.firebasestorage.app",
  messagingSenderId: "940592148544",
  appId: "1:940592148544:web:86fea4bfe320c6de752fa5",
};

// Firebase 초기화
const app = initializeApp(firebaseConfig);

// Auth와 Firestore 인스턴스 내보내기
export const auth = getAuth(app);
export const db = getFirestore(app);
export default app;
