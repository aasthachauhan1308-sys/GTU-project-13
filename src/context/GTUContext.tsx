import React, { createContext, useContext, useState, useEffect } from 'react';
import { Department, Subject, StudyMaterial, ExamPaper, Notice, Feedback, UserPreferences } from '../types';
import { DEPARTMENTS, getSubjects, INITIAL_STUDY_MATERIALS, INITIAL_EXAM_PAPERS, INITIAL_NOTICES } from '../data/gtuData';
import { collection, getDocs, setDoc, doc, deleteDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';

interface GTUContextType {
  departments: Department[];
  subjects: Subject[];
  materials: StudyMaterial[];
  examPapers: ExamPaper[];
  notices: Notice[];
  feedbacks: Feedback[];
  preferences: UserPreferences;
  activePdfViewerItem: { type: 'material' | 'paper'; id: string } | null;
  setActivePdfViewerItem: (item: { type: 'material' | 'paper'; id: string } | null) => void;
  
  // Student features
  toggleBookmark: (id: string) => void;
  addToHistory: (id: string) => void;
  addDownloadHistory: (id: string) => void;
  submitFeedback: (feedback: Omit<Feedback, 'id' | 'date'>) => void;
  toggleTheme: () => void;

  // Admin features for materials
  addMaterial: (material: Omit<StudyMaterial, 'id' | 'uploadDate' | 'downloadCount'>) => void;
  updateMaterial: (material: StudyMaterial) => void;
  deleteMaterial: (id: string) => void;

  // Admin features for departments
  addDepartment: (dept: Omit<Department, 'id'>) => void;
  updateDepartment: (dept: Department) => void;
  deleteDepartment: (id: string) => void;

  // Admin features for subjects
  addSubject: (subject: Subject) => void;
  updateSubject: (subject: Subject) => void;
  deleteSubject: (id: string) => void;

  // Admin features for exam papers
  addExamPaper: (paper: Omit<ExamPaper, 'id' | 'uploadDate'>) => void;
  updateExamPaper: (paper: ExamPaper) => void;
  deleteExamPaper: (id: string) => void;

  // Admin features for notices
  addNotice: (notice: Omit<Notice, 'id' | 'date'>) => void;
  updateNotice: (notice: Notice) => void;
  deleteNotice: (id: string) => void;
}

const GTUContext = createContext<GTUContextType | undefined>(undefined);

export const GTUProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Load initial values from localStorage or default static seeds
  const [departments, setDepartments] = useState<Department[]>(() => {
    const saved = localStorage.getItem('gtu_departments');
    return saved ? JSON.parse(saved) : DEPARTMENTS;
  });

  const [subjects, setSubjects] = useState<Subject[]>(() => {
    const saved = localStorage.getItem('gtu_subjects');
    return saved ? JSON.parse(saved) : getSubjects();
  });

  const [materials, setMaterials] = useState<StudyMaterial[]>(() => {
    const saved = localStorage.getItem('gtu_materials');
    return saved ? JSON.parse(saved) : INITIAL_STUDY_MATERIALS;
  });

  const [examPapers, setExamPapers] = useState<ExamPaper[]>(() => {
    const saved = localStorage.getItem('gtu_exampapers');
    return saved ? JSON.parse(saved) : INITIAL_EXAM_PAPERS;
  });

  const [notices, setNotices] = useState<Notice[]>(() => {
    const saved = localStorage.getItem('gtu_notices');
    return saved ? JSON.parse(saved) : INITIAL_NOTICES;
  });

  const [feedbacks, setFeedbacks] = useState<Feedback[]>(() => {
    const saved = localStorage.getItem('gtu_feedbacks');
    return saved ? JSON.parse(saved) : [];
  });

  const [preferences, setPreferences] = useState<UserPreferences>(() => {
    const saved = localStorage.getItem('gtu_preferences');
    if (saved) {
      return JSON.parse(saved);
    }
    return {
      theme: 'light',
      bookmarks: [],
      recentlyViewed: [],
      downloadHistory: []
    };
  });

  const [activePdfViewerItem, setActivePdfViewerItem] = useState<{ type: 'material' | 'paper'; id: string } | null>(null);

  // Persist states to localStorage
  useEffect(() => {
    localStorage.setItem('gtu_departments', JSON.stringify(departments));
  }, [departments]);

  useEffect(() => {
    localStorage.setItem('gtu_subjects', JSON.stringify(subjects));
  }, [subjects]);

  useEffect(() => {
    localStorage.setItem('gtu_materials', JSON.stringify(materials));
  }, [materials]);

  useEffect(() => {
    localStorage.setItem('gtu_exampapers', JSON.stringify(examPapers));
  }, [examPapers]);

  useEffect(() => {
    localStorage.setItem('gtu_notices', JSON.stringify(notices));
  }, [notices]);

  useEffect(() => {
    localStorage.setItem('gtu_feedbacks', JSON.stringify(feedbacks));
  }, [feedbacks]);

  useEffect(() => {
    localStorage.setItem('gtu_preferences', JSON.stringify(preferences));
    // Apply theme class to document element
    if (preferences.theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [preferences]);

  // Synchronize Firestore uploaded PDFs
  useEffect(() => {
    const syncCloudData = async () => {
      try {
        const materialsSnapshot = await getDocs(collection(db, 'materials'));
        const cloudMaterials: StudyMaterial[] = [];
        materialsSnapshot.forEach(doc => {
          cloudMaterials.push({ id: doc.id, ...doc.data() } as StudyMaterial);
        });

        if (cloudMaterials.length > 0) {
          setMaterials(prev => {
            const merged = [...prev];
            cloudMaterials.forEach(cm => {
              const idx = merged.findIndex(item => item.id === cm.id);
              if (idx > -1) {
                merged[idx] = cm;
              } else {
                merged.unshift(cm);
              }
            });
            return merged;
          });
        }

        const papersSnapshot = await getDocs(collection(db, 'examPapers'));
        const cloudPapers: ExamPaper[] = [];
        papersSnapshot.forEach(doc => {
          cloudPapers.push({ id: doc.id, ...doc.data() } as ExamPaper);
        });

        if (cloudPapers.length > 0) {
          setExamPapers(prev => {
            const merged = [...prev];
            cloudPapers.forEach(cp => {
              const idx = merged.findIndex(item => item.id === cp.id);
              if (idx > -1) {
                merged[idx] = cp;
              } else {
                merged.unshift(cp);
              }
            });
            return merged;
          });
        }
      } catch (err) {
        console.error('Failed to sync Firestore collections:', err);
      }
    };

    syncCloudData();
  }, []);

  // STUDENT INTERACTIONS
  const toggleBookmark = (id: string) => {
    setPreferences(prev => {
      const isBookmarked = prev.bookmarks.includes(id);
      const newBookmarks = isBookmarked
        ? prev.bookmarks.filter(bId => bId !== id)
        : [...prev.bookmarks, id];
      return { ...prev, bookmarks: newBookmarks };
    });
  };

  const addToHistory = (id: string) => {
    setPreferences(prev => {
      const filtered = prev.recentlyViewed.filter(bId => bId !== id);
      return {
        ...prev,
        recentlyViewed: [id, ...filtered].slice(0, 10) // Limit to 10 items
      };
    });
  };

  const addDownloadHistory = (id: string) => {
    setMaterials(prev =>
      prev.map(mat => (mat.id === id ? { ...mat, downloadCount: mat.downloadCount + 1 } : mat))
    );
    setPreferences(prev => {
      const historyItem = { materialId: id, downloadedAt: new Date().toISOString().split('T')[0] };
      return {
        ...prev,
        downloadHistory: [historyItem, ...prev.downloadHistory].slice(0, 30)
      };
    });
  };

  const submitFeedback = (fb: Omit<Feedback, 'id' | 'date'>) => {
    const newFeedback: Feedback = {
      ...fb,
      id: `fb-${Date.now()}`,
      date: new Date().toISOString().split('T')[0]
    };
    setFeedbacks(prev => [newFeedback, ...prev]);
  };

  const toggleTheme = () => {
    setPreferences(prev => ({
      ...prev,
      theme: prev.theme === 'light' ? 'dark' : 'light'
    }));
  };

  // ADMIN OPERATIONS - MATERIALS
  const addMaterial = async (mat: Omit<StudyMaterial, 'id' | 'uploadDate' | 'downloadCount'>) => {
    const id = `mat-${Date.now()}`;
    const newMaterial: StudyMaterial = {
      ...mat,
      id,
      uploadDate: new Date().toISOString().split('T')[0],
      downloadCount: 0
    };
    try {
      await setDoc(doc(db, 'materials', id), newMaterial);
    } catch (err) {
      console.error('Error adding material to Firestore:', err);
    }
    setMaterials(prev => [newMaterial, ...prev]);
  };

  const updateMaterial = async (updatedMat: StudyMaterial) => {
    try {
      await setDoc(doc(db, 'materials', updatedMat.id), updatedMat);
    } catch (err) {
      console.error('Error updating material in Firestore:', err);
    }
    setMaterials(prev => prev.map(mat => (mat.id === updatedMat.id ? updatedMat : mat)));
  };

  const deleteMaterial = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'materials', id));
    } catch (err) {
      console.error('Error deleting material from Firestore:', err);
    }
    setMaterials(prev => prev.filter(mat => mat.id !== id));
    // Clean up bookmarks and download histories too
    setPreferences(prev => ({
      ...prev,
      bookmarks: prev.bookmarks.filter(bId => bId !== id),
      recentlyViewed: prev.recentlyViewed.filter(bId => bId !== id)
    }));
  };

  // ADMIN OPERATIONS - DEPARTMENTS
  const addDepartment = (dept: Omit<Department, 'id'>) => {
    const id = dept.shortName.toLowerCase();
    const newDept: Department = { ...dept, id };
    setDepartments(prev => [...prev, newDept]);
  };

  const updateDepartment = (updatedDept: Department) => {
    setDepartments(prev => prev.map(d => (d.id === updatedDept.id ? updatedDept : d)));
  };

  const deleteDepartment = (id: string) => {
    setDepartments(prev => prev.filter(d => d.id !== id));
  };

  // ADMIN OPERATIONS - SUBJECTS
  const addSubject = (subject: Subject) => {
    setSubjects(prev => [...prev, subject]);
  };

  const updateSubject = (updatedSubject: Subject) => {
    setSubjects(prev => prev.map(s => (s.id === updatedSubject.id ? updatedSubject : s)));
  };

  const deleteSubject = (id: string) => {
    setSubjects(prev => prev.filter(s => s.id !== id));
  };

  // ADMIN OPERATIONS - EXAM PAPERS
  const addExamPaper = async (paper: Omit<ExamPaper, 'id' | 'uploadDate'>) => {
    const id = `paper-${Date.now()}`;
    const newPaper: ExamPaper = {
      ...paper,
      id,
      uploadDate: new Date().toISOString().split('T')[0]
    };
    try {
      await setDoc(doc(db, 'examPapers', id), newPaper);
    } catch (err) {
      console.error('Error saving paper to Firestore:', err);
    }
    setExamPapers(prev => [newPaper, ...prev]);
  };

  const updateExamPaper = async (updatedPaper: ExamPaper) => {
    try {
      await setDoc(doc(db, 'examPapers', updatedPaper.id), updatedPaper);
    } catch (err) {
      console.error('Error updating paper in Firestore:', err);
    }
    setExamPapers(prev => prev.map(p => (p.id === updatedPaper.id ? updatedPaper : p)));
  };

  const deleteExamPaper = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'examPapers', id));
    } catch (err) {
      console.error('Error deleting paper from Firestore:', err);
    }
    setExamPapers(prev => prev.filter(p => p.id !== id));
  };

  // ADMIN OPERATIONS - NOTICES
  const addNotice = (notice: Omit<Notice, 'id' | 'date'>) => {
    const newNotice: Notice = {
      ...notice,
      id: `not-${Date.now()}`,
      date: new Date().toISOString().split('T')[0]
    };
    setNotices(prev => [newNotice, ...prev]);
  };

  const updateNotice = (updatedNotice: Notice) => {
    setNotices(prev => prev.map(n => (n.id === updatedNotice.id ? updatedNotice : n)));
  };

  const deleteNotice = (id: string) => {
    setNotices(prev => prev.filter(n => n.id !== id));
  };

  return (
    <GTUContext.Provider
      value={{
        departments,
        subjects,
        materials,
        examPapers,
        notices,
        feedbacks,
        preferences,
        activePdfViewerItem,
        setActivePdfViewerItem,
        toggleBookmark,
        addToHistory,
        addDownloadHistory,
        submitFeedback,
        toggleTheme,
        addMaterial,
        updateMaterial,
        deleteMaterial,
        addDepartment,
        updateDepartment,
        deleteDepartment,
        addSubject,
        updateSubject,
        deleteSubject,
        addExamPaper,
        updateExamPaper,
        deleteExamPaper,
        addNotice,
        updateNotice,
        deleteNotice
      }}
    >
      {children}
    </GTUContext.Provider>
  );
};

export const useGTU = () => {
  const context = useContext(GTUContext);
  if (!context) {
    throw new Error('useGTU must be used within a GTUProvider');
  }
  return context;
};
