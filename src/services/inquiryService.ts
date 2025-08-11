import {
  collection,
  addDoc,
  getDocs,
  getDoc,
  doc,
  updateDoc,
  query,
  orderBy,
  Timestamp,
  deleteDoc
} from 'firebase/firestore';
import { db } from '../config/firebase';
import { Inquiry, NewInquiry } from '../types';

const INQUIRIES_COLLECTION = 'inquiries';

// 문의하기 작성
export const createInquiry = async (inquiryData: NewInquiry): Promise<string> => {
  try {
    const docRef = await addDoc(collection(db, INQUIRIES_COLLECTION), {
      ...inquiryData,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
      status: 'pending' as const
    });
    return docRef.id;
  } catch (error) {
    console.error('Error creating inquiry:', error);
    throw new Error('문의하기 작성에 실패했습니다.');
  }
};

// 모든 문의하기 조회 (관리자용)
export const getAllInquiries = async (): Promise<Inquiry[]> => {
  try {
    const q = query(
      collection(db, INQUIRIES_COLLECTION),
      orderBy('createdAt', 'desc')
    );
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Inquiry[];
  } catch (error) {
    console.error('Error fetching inquiries:', error);
    throw new Error('문의하기 목록을 불러오는데 실패했습니다.');
  }
};

// 특정 문의하기 조회
export const getInquiryById = async (id: string): Promise<Inquiry | null> => {
  try {
    const docRef = doc(db, INQUIRIES_COLLECTION, id);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return {
        id: docSnap.id,
        ...docSnap.data()
      } as Inquiry;
    } else {
      return null;
    }
  } catch (error) {
    console.error('Error fetching inquiry:', error);
    throw new Error('문의하기를 불러오는데 실패했습니다.');
  }
};

// 비밀글 비밀번호 확인
export const verifyInquiryPassword = async (
  id: string, 
  password: string
): Promise<boolean> => {
  try {
    const inquiry = await getInquiryById(id);
    if (!inquiry) {
      return false;
    }
    
    return inquiry.isSecret && inquiry.password === password;
  } catch (error) {
    console.error('Error verifying password:', error);
    return false;
  }
};

// 관리자 답변 작성
export const addAdminReply = async (
  id: string, 
  reply: string
): Promise<void> => {
  try {
    const docRef = doc(db, INQUIRIES_COLLECTION, id);
    await updateDoc(docRef, {
      adminReply: reply,
      adminReplyAt: Timestamp.now(),
      status: 'answered' as const,
      updatedAt: Timestamp.now()
    });
  } catch (error) {
    console.error('Error adding admin reply:', error);
    throw new Error('답변 작성에 실패했습니다.');
  }
};

// 문의하기 상태 변경
export const updateInquiryStatus = async (
  id: string, 
  status: 'pending' | 'answered' | 'closed'
): Promise<void> => {
  try {
    const docRef = doc(db, INQUIRIES_COLLECTION, id);
    await updateDoc(docRef, {
      status,
      updatedAt: Timestamp.now()
    });
  } catch (error) {
    console.error('Error updating inquiry status:', error);
    throw new Error('상태 변경에 실패했습니다.');
  }
};

// 문의하기 삭제
export const deleteInquiry = async (id: string): Promise<void> => {
  try {
    const docRef = doc(db, INQUIRIES_COLLECTION, id);
    await deleteDoc(docRef);
  } catch (error) {
    console.error('Error deleting inquiry:', error);
    throw new Error('문의하기 삭제에 실패했습니다.');
  }
};
