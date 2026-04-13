export interface SchoolInfo {
  name: string;
  logoUrl: string;
  heroTitle: string;
  heroSubtitle: string;
  heroImageUrl: string;
  faculty: FacultyMember[];
  facilities: Facility[];
}

export interface FacultyMember {
  name: string;
  role: string;
  imageUrl: string;
}

export interface Facility {
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

export interface Student {
  id: string;
  name: string;
  portalCode: string;
  class: string;
  rollNumber: string;
  parentName: string;
  results: TestResult[];
  attendance: number;
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
}

export interface SchoolDocument {
  id: string;
  title: string;
  url: string;
  type: 'profarma' | 'form' | 'result' | 'report';
  uploadedAt: string;
}
