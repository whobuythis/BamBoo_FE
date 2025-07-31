import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  collection,
  query,
  where,
  getDocs,
  Timestamp,
} from "firebase/firestore";
import type { User } from "../types";

export const userService = {
  async createUser(userData: {
    uid: string;
    email: string;
    displayName?: string;
    photoURL?: string;
  }): Promise<void> {
    const { db } = await import("../config/firebase");
    const user: User = {
      ...userData,
      createdAt: Timestamp.now(),
    };

    await setDoc(doc(db, "users", userData.uid), user);
  },

  async getUser(uid: string): Promise<User | null> {
    const { db } = await import("../config/firebase");
    const docRef = doc(db, "users", uid);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return { uid: docSnap.id, ...docSnap.data() } as User;
    }
    return null;
  },

  async updateUser(uid: string, updates: Partial<User>): Promise<void> {
    const { db } = await import("../config/firebase");
    const userRef = doc(db, "users", uid);
    await updateDoc(userRef, {
      ...updates,
      updatedAt: Timestamp.now(),
    });
  },

  async getUserPosts(uid: string): Promise<any[]> {
    const { db } = await import("../config/firebase");
    const q = query(
      collection(db, "posts"),
      where("authorId", "==", uid)
    );
    const querySnapshot = await getDocs(q);

    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  },

  async getUserComments(uid: string): Promise<any[]> {
    const { db } = await import("../config/firebase");
    const q = query(
      collection(db, "comments"),
      where("authorId", "==", uid)
    );
    const querySnapshot = await getDocs(q);

    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  },
}; 