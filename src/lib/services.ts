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
import { SchoolInfo, Announcement, Student, ClassWork, SchoolDocument, Teacher, ActionLog, JobPosting, HallOfFameEntry } from '../types';

export const logService = {
  async add(log: Omit<ActionLog, 'id' | 'timestamp'>) {
    try {
      await addDoc(collection(db, 'logs'), {
        ...log,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, 'logs');
    }
  },
  subscribe(callback: (logs: ActionLog[]) => void, filters?: { userId?: string, role?: 'admin' | 'teacher' }) {
    let q;
    if (filters?.userId) {
      q = query(collection(db, 'logs'), where('userId', '==', filters.userId));
    } else if (filters?.role) {
      q = query(collection(db, 'logs'), where('userRole', '==', filters.role));
    } else {
      q = query(collection(db, 'logs'), orderBy('timestamp', 'desc'));
    }
    return onSnapshot(q, (snap) => {
      let logs = snap.docs.map(d => ({ id: d.id, ...d.data() } as ActionLog));
      if (filters?.userId || filters?.role) {
        logs.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
      }
      callback(logs);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, 'logs');
    });
  }
};

export const jobService = {
  subscribe(callback: (jobs: JobPosting[]) => void) {
    const q = query(collection(db, 'jobs'), orderBy('postedAt', 'desc'));
    return onSnapshot(q, (snap) => {
      callback(snap.docs.map(d => ({ id: d.id, ...d.data() } as JobPosting)));
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, 'jobs');
    });
  },
  async add(job: Omit<JobPosting, 'id' | 'postedAt'>, editor: { name: string, role: 'admin' | 'teacher', id: string }) {
    try {
      const data = { ...job, postedAt: new Date().toISOString() };
      await addDoc(collection(db, 'jobs'), data);
      await logService.add({
        userId: editor.id,
        userName: editor.name,
        userRole: editor.role,
        action: 'CREATE',
        target: `Job: ${job.title}`,
        details: `Posted new job in ${job.department}`
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, 'jobs');
    }
  },
  async update(id: string, job: Partial<JobPosting>, editor: { name: string, role: 'admin' | 'teacher', id: string }) {
    try {
      await updateDoc(doc(db, 'jobs', id), job);
      await logService.add({
        userId: editor.id,
        userName: editor.name,
        userRole: editor.role,
        action: 'UPDATE',
        target: `Job ID: ${id}`,
        details: `Updated job posting: ${JSON.stringify(job)}`
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `jobs/${id}`);
    }
  },
  async delete(id: string, jobTitle: string, editor: { name: string, role: 'admin' | 'teacher', id: string }) {
    try {
      await deleteDoc(doc(db, 'jobs', id));
      await logService.add({
        userId: editor.id,
        userName: editor.name,
        userRole: editor.role,
        action: 'DELETE',
        target: `Job: ${jobTitle}`,
        details: `Deleted job posting ID: ${id}`
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `jobs/${id}`);
    }
  }
};

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
  async updateInfo(info: SchoolInfo, editor: { name: string, role: 'admin' | 'teacher', id: string }) {
    try {
      await setDoc(doc(db, SCHOOL_INFO_PATH), info);
      await logService.add({
        userId: editor.id,
        userName: editor.name,
        userRole: editor.role,
        action: 'UPDATE',
        target: 'School Info',
        details: 'Updated school general information'
      });
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
  async add(announcement: Omit<Announcement, 'id'>, editor: { name: string, role: 'admin' | 'teacher', id: string }) {
    try {
      await addDoc(collection(db, 'announcements'), announcement);
      await logService.add({
        userId: editor.id,
        userName: editor.name,
        userRole: editor.role,
        action: 'CREATE',
        target: `Announcement: ${announcement.title}`,
        details: announcement.content.substring(0, 100) + '...'
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, 'announcements');
    }
  },
  async delete(id: string, title: string, editor: { name: string, role: 'admin' | 'teacher', id: string }) {
    try {
      await deleteDoc(doc(db, 'announcements', id));
      await logService.add({
        userId: editor.id,
        userName: editor.name,
        userRole: editor.role,
        action: 'DELETE',
        target: `Announcement: ${title}`,
        details: `Deleted announcement ID: ${id}`
      });
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
  async upsert(student: Student, editor: { name: string, role: 'admin' | 'teacher', id: string }) {
    try {
      const data = {
        ...student,
        lastEditedBy: editor.name,
        lastEditedAt: new Date().toISOString()
      };
      await setDoc(doc(db, 'students', student.portalCode), data);
      await logService.add({
        userId: editor.id,
        userName: editor.name,
        userRole: editor.role,
        action: 'UPSERT',
        target: `Student: ${student.name}`,
        details: `Updated/Created student record for ${student.portalCode}`
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, 'students');
    }
  },
  async delete(portalCode: string, studentName: string, editor: { name: string, role: 'admin' | 'teacher', id: string }) {
    try {
      await deleteDoc(doc(db, 'students', portalCode));
      await logService.add({
        userId: editor.id,
        userName: editor.name,
        userRole: editor.role,
        action: 'DELETE',
        target: `Student: ${studentName}`,
        details: `Deleted student record for ${portalCode}`
      });
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
  async add(work: Omit<ClassWork, 'id'>, editor: { name: string, role: 'admin' | 'teacher', id: string }) {
    try {
      await addDoc(collection(db, 'classwork'), {
        ...work,
        lastEditedBy: editor.name,
        postedById: editor.id,
        date: work.date || new Date().toISOString()
      });
      await logService.add({
        userId: editor.id,
        userName: editor.name,
        userRole: editor.role,
        action: 'CREATE',
        target: `ClassWork: ${work.topic}`,
        details: `Posted work for ${work.className} in ${work.subject}`
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, 'classwork');
    }
  },
  async update(id: string, work: Partial<ClassWork>, editor: { name: string, role: 'admin' | 'teacher', id: string }) {
    try {
      await updateDoc(doc(db, 'classwork', id), {
        ...work,
        lastEditedBy: editor.name
      });
      await logService.add({
        userId: editor.id,
        userName: editor.name,
        userRole: editor.role,
        action: 'UPDATE',
        target: `ClassWork ID: ${id}`,
        details: `Updated classwork: ${work.topic}`
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `classwork/${id}`);
    }
  },
  async delete(id: string, topic: string, editor: { name: string, role: 'admin' | 'teacher', id: string }) {
    try {
      await deleteDoc(doc(db, 'classwork', id));
      await logService.add({
        userId: editor.id,
        userName: editor.name,
        userRole: editor.role,
        action: 'DELETE',
        target: `ClassWork: ${topic}`,
        details: `Deleted classwork ID: ${id}`
      });
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
  async add(docData: Omit<SchoolDocument, 'id'>, editor: { name: string, role: 'admin' | 'teacher', id: string }) {
    try {
      await addDoc(collection(db, 'documents'), docData);
      await logService.add({
        userId: editor.id,
        userName: editor.name,
        userRole: editor.role,
        action: 'CREATE',
        target: `Document: ${docData.title}`,
        details: `Uploaded ${docData.type} document`
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, 'documents');
    }
  },
  async delete(id: string, title: string, editor: { name: string, role: 'admin' | 'teacher', id: string }) {
    try {
      await deleteDoc(doc(db, 'documents', id));
      await logService.add({
        userId: editor.id,
        userName: editor.name,
        userRole: editor.role,
        action: 'DELETE',
        target: `Document: ${title}`,
        details: `Deleted document ID: ${id}`
      });
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
  async add(teacher: Omit<Teacher, 'id'>, editor: { name: string, role: 'admin' | 'teacher', id: string }) {
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
      await logService.add({
        userId: editor.id,
        userName: editor.name,
        userRole: editor.role,
        action: 'CREATE',
        target: `Teacher: ${teacher.name}`,
        details: `Added teacher account for ${email}`
      });
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
      if (!snap.exists()) {
        console.error("Teacher document not found for", lowerEmail);
        return null;
      }
      const data = snap.data() as Teacher;
      
      return { id: snap.id, ...data };
    } catch (error: any) {
      // If Auth failed, we don't return the teacher
      console.error("Teacher login failed:", error.code, error.message);
      throw error; // Throw so UI can show specific error if needed
    }
  },
  async syncAuth(email: string, password: string) {
    const lowerEmail = email.toLowerCase();
    try {
      await createUserWithEmailAndPassword(secondaryAuth, lowerEmail, password);
      return { success: true, message: "Auth account created successfully" };
    } catch (error: any) {
      if (error.code === 'auth/email-already-in-use') {
        return { success: true, message: "Auth account already exists" };
      }
      throw error;
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
  async delete(id: string, teacherName: string, editor: { name: string, role: 'admin' | 'teacher', id: string }) {
    try {
      await deleteDoc(doc(db, 'teachers', id));
      await logService.add({
        userId: editor.id,
        userName: editor.name,
        userRole: editor.role,
        action: 'DELETE',
        target: `Teacher: ${teacherName}`,
        details: `Deleted teacher account for ${id}`
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, 'teachers');
    }
  }
};

export const hallOfFameService = {
  subscribe(callback: (entries: HallOfFameEntry[]) => void) {
    const q = query(collection(db, 'hall_of_fame'), orderBy('uploadedAt', 'desc'));
    return onSnapshot(q, (snap) => {
      callback(snap.docs.map(d => ({ id: d.id, ...d.data() } as HallOfFameEntry)));
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, 'hall_of_fame');
    });
  },
  async add(entry: Omit<HallOfFameEntry, 'id' | 'uploadedAt'>, editor: { name: string, role: 'admin' | 'teacher', id: string }) {
    try {
      const data = { ...entry, uploadedAt: new Date().toISOString() };
      await addDoc(collection(db, 'hall_of_fame'), data);
      await logService.add({
        userId: editor.id,
        userName: editor.name,
        userRole: editor.role,
        action: 'CREATE',
        target: `Hall of Fame: ${entry.studentName}`,
        details: `Added achievement: ${entry.achievementTitle}`
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, 'hall_of_fame');
    }
  },
  async delete(id: string, name: string, editor: { name: string, role: 'admin' | 'teacher', id: string }) {
    try {
      await deleteDoc(doc(db, 'hall_of_fame', id));
      await logService.add({
        userId: editor.id,
        userName: editor.name,
        userRole: editor.role,
        action: 'DELETE',
        target: `Hall of Fame ID: ${id}`,
        details: `Deleted entry for ${name}`
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `hall_of_fame/${id}`);
    }
  }
};
