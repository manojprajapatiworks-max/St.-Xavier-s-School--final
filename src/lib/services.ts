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
import { 
  getAuth, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  updatePassword
} from 'firebase/auth';
import { initializeApp, getApp, FirebaseApp } from 'firebase/app';
import { db, auth } from '../firebase';
import firebaseConfig from '../../firebase-applet-config.json';
import { handleFirestoreError, OperationType } from './firebase-utils';
import { SchoolInfo, Announcement, Student, ClassWork, SchoolDocument, Teacher } from '../types';

// Secondary app for creating users without signing out admin
let secondaryApp: FirebaseApp;
try {
  secondaryApp = getApp('Secondary');
} catch (e) {
  secondaryApp = initializeApp(firebaseConfig, 'Secondary');
}
const secondaryAuth = getAuth(secondaryApp);

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
  subscribeAll(callback: (students: Student[]) => void) {
    return onSnapshot(collection(db, 'students'), (snap) => {
      callback(snap.docs.map(d => ({ id: d.id, ...d.data() } as Student)));
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, 'students');
    });
  },
  async upsert(student: Student, editorEmail?: string) {
    try {
      const data = {
        ...student,
        lastEditedBy: editorEmail || 'system',
        lastEditedAt: new Date().toISOString()
      };
      await setDoc(doc(db, 'students', student.portalCode), data);
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
  async add(work: Omit<ClassWork, 'id'>, editorName?: string) {
    try {
      await addDoc(collection(db, 'classwork'), {
        ...work,
        lastEditedBy: editorName || 'system'
      });
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

export const teacherService = {
  subscribe(callback: (teachers: Teacher[]) => void) {
    return onSnapshot(collection(db, 'teachers'), (snap) => {
      callback(snap.docs.map(d => ({ id: d.id, ...d.data() } as Teacher)));
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, 'teachers');
    });
  },
  async add(teacher: Omit<Teacher, 'id'>) {
    if (!teacher.email) throw new Error("Teacher email is required");
    const email = teacher.email.toLowerCase();
    try {
      // 1. Create user in Firebase Auth (if password provided)
      if (teacher.password) {
        try {
          await createUserWithEmailAndPassword(secondaryAuth, email, teacher.password);
        } catch (authError: any) {
          if (authError.code === 'auth/email-already-in-use') {
            console.log("Auth user already exists for", email);
          } else if (authError.code === 'auth/operation-not-allowed') {
            throw new Error("Email/Password authentication is not enabled in Firebase Console. Please enable it to use teacher passwords.");
          } else {
            throw authError;
          }
        }
      }
      // 2. Save teacher doc to Firestore
      await setDoc(doc(db, 'teachers', email), { ...teacher, email });
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, 'teachers');
      throw error;
    }
  },
  async login(email: string, password: string): Promise<Teacher | null> {
    const lowerEmail = email.toLowerCase();
    try {
      // 1. Sign in with Firebase Auth
      await signInWithEmailAndPassword(auth, lowerEmail, password);

      // 2. Get teacher data from Firestore
      const snap = await getDoc(doc(db, 'teachers', lowerEmail));
      if (!snap.exists()) return null;
      const data = snap.data() as Teacher;
      
      return { id: snap.id, ...data };
    } catch (error) {
      // If Auth failed, we don't return the teacher
      console.error("Teacher login failed:", error);
      return null;
    }
  },
  async checkIsTeacher(email: string): Promise<Teacher | null> {
    try {
      const lowerEmail = email.toLowerCase();
      const snap = await getDoc(doc(db, 'teachers', lowerEmail));
      return snap.exists() ? { id: snap.id, ...snap.data() } as Teacher : null;
    } catch (error) {
      return null;
    }
  },
  async delete(id: string) {
    try {
      await deleteDoc(doc(db, 'teachers', id));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, 'teachers');
    }
  }
};
