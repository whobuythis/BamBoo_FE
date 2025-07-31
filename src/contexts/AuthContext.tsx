"use client";

import type React from "react";
import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
  type User as FirebaseUser,
} from "firebase/auth";
import { doc, setDoc, getDoc, Timestamp } from "firebase/firestore";
import type { User, AuthContextType } from "../types";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const register = async (
    email: string,
    password: string,
    displayName: string
  ): Promise<void> => {
    try {
      const { auth, db } = await import("../config/firebase");
      const { user } = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      await updateProfile(user, { displayName });

      const userData: User = {
        uid: user.uid,
        email: user.email!,
        displayName,
        createdAt: Timestamp.now(),
      };

      if (user.photoURL) {
        userData.photoURL = user.photoURL;
      }

      await setDoc(doc(db, "users", user.uid), userData);
    } catch (error) {
      console.error("회원가입 실패:", error);
      throw error;
    }
  };

  const login = async (email: string, password: string): Promise<void> => {
    try {
      const { auth } = await import("../config/firebase");
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
      console.error("로그인 실패:", error);
      throw error;
    }
  };

  const logout = async (): Promise<void> => {
    try {
      const { auth } = await import("../config/firebase");
      await signOut(auth);
    } catch (error) {
      console.error("로그아웃 실패:", error);
      throw error;
    }
  };

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const { auth, db } = await import("../config/firebase");
        
        const unsubscribe = onAuthStateChanged(
          auth,
          async (firebaseUser: FirebaseUser | null) => {
            if (firebaseUser) {
              const userDoc = await getDoc(doc(db, "users", firebaseUser.uid));
              if (userDoc.exists()) {
                setCurrentUser(userDoc.data() as User);
              } else {
                const userData: User = {
                  uid: firebaseUser.uid,
                  email: firebaseUser.email!,
                  displayName: firebaseUser.displayName || "익명사용자",
                  createdAt: Timestamp.now(),
                };

                if (firebaseUser.photoURL) {
                  userData.photoURL = firebaseUser.photoURL;
                }

                await setDoc(doc(db, "users", firebaseUser.uid), userData);
                setCurrentUser(userData);
              }
            } else {
              setCurrentUser(null);
            }
            setLoading(false);
          }
        );

        return unsubscribe;
      } catch (error) {
        console.error("Firebase 초기화 실패:", error);
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const value: AuthContextType = {
    currentUser,
    login,
    register,
    logout,
    loading,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
