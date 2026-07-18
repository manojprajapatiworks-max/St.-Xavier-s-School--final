export interface SchoolInfo {
  name: string;
  logoUrl: string;
  heroTitle: string;
  heroSubtitle: string;
  heroImages: string[];
  faculty: FacultyMember[];
  facilities: Facility[];
  footer: FooterInfo;
}

export interface FooterInfo {
  address: string;
  email: string;
  phone: string;
  about: string;
}

export interface FacultyMember {
  id: string;
  name: string;
  role: string;
  imageUrl: string;
  qualification?: string;
}

export interface Facility {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  date: string;
  priority: 'low' | 'medium' | 'high';
}

export interface AcademicRecord {
  year: string;
  class: string;
  achievement: string;
  remarks: string;
}

export interface Student {
  id: string;
  name: string;
  imageUrl?: string;
  portalCode: string;
  class: string;
  rollNumber: string;
  parentName: string;
  results: TestResult[];
  attendance: number;
  lastEditedBy?: string;
  lastEditedAt?: string;
  academicHistory?: AcademicRecord[];
}

export interface Teacher {
  id: string;
  name: string;
  email: string;
  password?: string;
  subject: string;
  privileges: {
    results: boolean;
    classwork: boolean;
    students: boolean;
  };
}

export interface TestResult {
  subject: string;
  score: number;
  total: number;
  term: string;
}

export interface ClassWork {
  id: string;
  className: string;
  subject: string;
  topic: string;
  description: string;
  date: string;
  lastEditedBy?: string;
  postedById?: string;
  expiryDate?: string;
}

export interface HallOfFameEntry {
  id: string;
  studentName: string;
  imageUrl?: string;
  class: string;
  achievementTitle: string;
  description: string;
  competitionLevel?: string;
  awardRank?: string;
  certificateUrl?: string;
  uploadedAt: string;
}

export interface SchoolDocument {
  id: string;
  title: string;
  url: string;
  type: 'profarma' | 'form' | 'result' | 'report';
  uploadedAt: string;
}

export interface JobPosting {
  id: string;
  title: string;
  department: string;
  description: string;
  requirements: string;
  postedAt: string;
  status: 'open' | 'closed';
}

export interface ActionLog {
  id: string;
  userId: string;
  userName: string;
  userRole: 'admin' | 'teacher';
  action: string;
  target: string;
  timestamp: string;
  details?: string;
}
