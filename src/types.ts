export type MaterialType =
  | 'Study Material'
  | 'Notes'
  | 'IMP Questions'
  | 'Question Bank'
  | 'Assignment'
  | 'Syllabus'
  | 'Reference Books';

export type ExamPaperType =
  | 'Winter Papers'
  | 'Summer Papers'
  | 'Mid Semester Papers'
  | 'Internal Test Papers'
  | 'Unit Test Papers'
  | 'Model Papers'
  | 'Practice Papers';

export type LanguageType = 'English' | 'Gujarati';

export interface StudyMaterial {
  id: string;
  title: string;
  type: MaterialType;
  subjectCode: string;
  subjectName: string;
  semester: number;
  departmentId: string;
  fileSize: string;
  uploadDate: string;
  downloadCount: number;
  description: string;
  previewContent?: string; // Text preview for the document
  isOfficial?: boolean;
  pdfUrl?: string;
}

export interface ExamPaper {
  id: string;
  year: number;
  type: ExamPaperType;
  subjectCode: string;
  subjectName: string;
  semester: number;
  departmentId: string;
  language: LanguageType;
  fileSize: string;
  uploadDate: string;
  isOfficial: boolean; // Must clearly separate official vs practice/model
  questions: {
    section: string;
    marks: number;
    text: string;
    textGuj?: string;
  }[];
  pdfUrl?: string;
}

export interface Notice {
  id: string;
  title: string;
  content: string;
  category: 'Exam' | 'Academic' | 'Results' | 'General';
  date: string;
  isImportant?: boolean;
}

export interface Department {
  id: string;
  name: string;
  shortName: string;
  description: string;
  iconName: string; // Lucide icon name
}

export interface Subject {
  id: string; // code
  code: string;
  name: string;
  departmentId: string;
  semester: number;
  credits: number;
}

export interface Feedback {
  id: string;
  name: string;
  email: string;
  enrollmentNo?: string;
  departmentId: string;
  semester: number;
  rating: number;
  message: string;
  date: string;
}

export interface UserPreferences {
  theme: 'light' | 'dark';
  bookmarks: string[]; // study material IDs
  recentlyViewed: string[]; // study material IDs
  downloadHistory: { materialId: string; downloadedAt: string }[];
}
