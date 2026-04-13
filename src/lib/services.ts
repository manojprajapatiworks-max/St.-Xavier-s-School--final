import { 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  setDoc, 
  updateDoc, 
  deleteDoc, 
  onSnapshot,
  query,
  where,
  orderBy,
  addDoc
} from 'firebase/firestore';
import { db } from '../firebase';
import { handleFirestoreError, OperationType } from './firebase-utils';
import { SchoolInfo, Announcement, Student, ClassWork, SchoolDocument } from '../types';

const SCHOOL_INFO_PATH = 'school/info';

export const schoolService = {
  async getInfo(): Promise<SchoolInfo | null> {
    try {
      const snap = await getDoc(doc(db, SCHOOL_INFO_PATH));
      return snap.exists() ? snap.data() as SchoolInfo : null;
    } catch (error) {
      handleFirestoreError(error, OperationType.GET, SCHOOL_INFO_PATH);
      return null;
    }
  },
  async updateInfo(info: SchoolInfo) {
    try {
      await setDoc(doc(db, SCHOOL_INFO_PATH), info);
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, SCHOOL_INFO_PATH);
    }
  },
  subscribeToInfo(callback: (info: SchoolInfo | null) => void) {
    return onSnapshot(doc(db, SCHOOL_INFO_PATH), (snap) => {
      callback(snap.exists() ? snap.data() as SchoolInfo : null);
    }, (error) => {
      handleFirestoreError(error, OperationType.GET, SCHOOL_INFO_PATH);
    });
  }
};

export const announcementService = {
  subscribe(callback: (announcements: Announcement[]) => void) {
    const q = query(collection(db, 'announcements'), orderBy('date', 'desc'));
    return onSnapshot(q, (snap) => {
      callback(snap.docs.map(d => ({ id: d.id, ...d.data() } as Announcement)));
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, 'announcements');
    });
  },
  async add(announcement: Omit<Announcement, 'id'>) {
    try {
      await addDoc(collection(db, 'announcements'), announcement);
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, 'announcements');
    }
  },
  async delete(id: string) {
    try {
      await deleteDoc(doc(db, 'announcements', id));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, 'announcements');
    }
  }
};

export const studentService = {
  async getByCode(portalCode: string): Promise<Student | null> {
    try {
      const snap = await getDoc(doc(db, 'students', portalCode));
      return snap.exists() ? { id: snap.id, ...snap.data() } as Student : null;
    } catch (error) {
      handleFirestoreError(error, OperationType.GET, `students/${portalCode}`);
      return null;
    }
  },
  async getAll(): Promise<Student[]> {
    try {
      const snap = await getDocs(collection(db, 'students'));
      return snap.docs.map(d => ({ id: d.id, ...d.data() } as Student));
    } catch (error) {
      handleFirestoreError(error, OperationType.LIST, 'students');
      return [];
    }
  },
  async upsert(student: Student) {
    try {
      await setDoc(doc(db, 'students', student.portalCode), student);
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, 'students');
    }
  },
  async delete(portalCode: string) {
    try {
      await deleteDoc(doc(db, 'students', portalCode));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, 'students');
    }
  }
};

export const classWorkService = {
  subscribe(callback: (classWork: ClassWork[]) => void) {
    const q = query(collection(db, 'classwork'), orderBy('date', 'desc'));
    return onSnapshot(q, (snap) => {
      callback(snap.docs.map(d => ({ id: d.id, ...d.data() } as ClassWork)));
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, 'classwork');
    });
  },
  async add(work: Omit<ClassWork, 'id'>) {
    try {
      await addDoc(collection(db, 'classwork'), work);
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, 'classwork');
    }
  },
  async delete(id: string) {
    try {
      await deleteDoc(doc(db, 'classwork', id));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, 'classwork');
    }
  }
};

export const documentService = {
  subscribe(callback: (docs: SchoolDocument[]) => void) {
    const q = query(collection(db, 'documents'), orderBy('uploadedAt', 'desc'));
    return onSnapshot(q, (snap) => {
      callback(snap.docs.map(d => ({ id: d.id, ...d.data() } as SchoolDocument)));
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, 'documents');
    });
  },
  async add(docData: Omit<SchoolDocument, 'id'>) {
    try {
      await addDoc(collection(db, 'documents'), docData);
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, 'documents');
    }
  },
  async delete(id: string) {
    try {
      await deleteDoc(doc(db, 'documents', id));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, 'documents');
    }
  }
};
