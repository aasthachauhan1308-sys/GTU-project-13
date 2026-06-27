import React, { useState, useEffect } from 'react';
import { useGTU, GTUProvider } from './context/GTUContext';
import { Department, Subject, StudyMaterial } from './types';
import { HeroSection } from './components/HeroSection';
import { SubjectViewer } from './components/SubjectViewer';
import { ExamPapersViewer } from './components/ExamPapersViewer';
import { NoticeBoard } from './components/NoticeBoard';
import { FeedbackSection } from './components/FeedbackSection';
import { AdminPanel } from './components/AdminPanel';
import { Footer } from './components/Footer';
import { Icon } from './components/Icon';
import { FullPagePDFViewer } from './components/FullPagePDFViewer';
import {
  GraduationCap,
  Bookmark,
  History,
  Sun,
  Moon,
  HelpCircle,
  Menu,
  X,
  ChevronRight,
  Sparkles,
  BookOpen,
  ArrowLeft,
  Download,
  AlertCircle,
  CheckCircle,
  Mail,
  Phone,
  MapPin,
  ThumbsUp,
  Sliders,
  FileText
} from 'lucide-react';

function AppContent() {
  const {
    departments,
    subjects,
    materials,
    preferences,
    toggleBookmark,
    addToHistory,
    toggleTheme,
    activePdfViewerItem
  } = useGTU();

  // Route state
  const [activeTab, setActiveTab] = useState<'home' | 'papers' | 'notices' | 'feedback' | 'admin'>('home');
  const [selectedDept, setSelectedDept] = useState<Department | null>(null);
  const [selectedSem, setSelectedSem] = useState<number | null>(null);
  const [activeSubjectCode, setActiveSubjectCode] = useState<string | null>(null);

  // Layout drawers state
  const [isBookmarkDrawerOpen, setIsBookmarkDrawerOpen] = useState(false);
  const [isHistoryDrawerOpen, setIsHistoryDrawerOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Sync specific materials referenced by URL query parameters (for direct shared links)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const sharedMatId = params.get('material');
    if (sharedMatId) {
      const mat = materials.find(m => m.id === sharedMatId);
      if (mat) {
        // Find subject
        const sub = subjects.find(s => s.code === mat.subjectCode);
        if (sub) {
          setActiveSubjectCode(sub.code);
          setSelectedDept(departments.find(d => d.id === sub.departmentId) || null);
          setSelectedSem(sub.semester);
        }
      }
    }
  }, [materials, subjects, departments]);

  // Handle department card click
  const handleSelectDepartment = (dept: Department) => {
    setSelectedDept(dept);
    setSelectedSem(1); // default to sem 1
    setActiveSubjectCode(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Handle subject code click
  const handleSelectSubject = (code: string) => {
    setActiveSubjectCode(code);
    addToHistory(code); // Log recently viewed
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleGlobalNavigate = (tab: 'home' | 'papers' | 'notices' | 'feedback' | 'admin') => {
    setActiveTab(tab);
    setSelectedDept(null);
    setSelectedSem(null);
    setActiveSubjectCode(null);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Get active subjects based on selected department and semester
  const activeSubjects = selectedDept
    ? subjects.filter(sub => sub.departmentId === selectedDept.id && sub.semester === selectedSem)
    : [];

  // Bookmarked items lookup
  const bookmarkedMaterials = materials.filter(mat => preferences.bookmarks.includes(mat.id));
  
  // Recently viewed subjects lookup
  const recentlyViewedSubjects = subjects.filter(sub => preferences.recentlyViewed.includes(sub.code));

  // Popular downloads calculated by download count
  const popularMaterials = [...materials]
    .sort((a, b) => b.downloadCount - a.downloadCount)
    .slice(0, 5);

  // FAQ Array
  const faqs = [
    {
      q: "Where do I find the GTU Syllabus subject codes?",
      a: "Every subject listed on this portal carries its official 7-digit GTU course code (e.g. 4330701 for DBMS). These codes align with the newly implemented 2024/2025 AICTE diploma structures."
    },
    {
      q: "Are the Gujarati translations on exam papers authentic?",
      a: "Yes! For official GTU papers, the Gujarati questions are transcribed exactly as drafted in the original university sheets. For newly developed practice/model papers, our academic committee provides human-translated references."
    },
    {
      q: "How can I contribute my handwritten notes or class files?",
      a: "Navigate to the 'Admin Board' tab or use the 'Contribute' buttons in subject workspaces. You can append PDF files, draft text notes, specify file sizes, and verify course mappings instantly."
    },
    {
      q: "Are these files safe to download?",
      a: "Absolutely. All materials are hosted on sandboxed database buckets and checked against malicious scripts prior to publication. They download as clean .txt, .pdf, or .csv documents."
    }
  ];

  if (activePdfViewerItem) {
    return <FullPagePDFViewer />;
  }

  return (
    <div className={`min-h-screen flex flex-col justify-between ${preferences.theme === 'dark' ? 'dark' : ''}`}>
      
      {/* -------------------------------------------------------------
          NAVBAR HEADER
          ------------------------------------------------------------- */}
      <header className="glass-nav sticky top-0 z-40 px-6 py-4 transition-colors duration-300">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          
          {/* Logo Brand */}
          <button
            onClick={() => handleGlobalNavigate('home')}
            className="flex items-center gap-2.5 text-left group"
          >
            <div className="p-2 bg-gradient-to-br from-brand-teal to-brand-emerald text-white rounded-xl shadow-md group-hover:scale-105 transition-transform">
              <GraduationCap size={22} />
            </div>
            <div>
              <span className="text-base font-black tracking-tight text-slate-800 dark:text-slate-100 font-display block">
                GTU STUDY MATERIAL
              </span>
              <span className="text-[9px] font-mono font-bold text-slate-400 block -mt-0.5 tracking-wider">
                Gujarat Technological University
              </span>
            </div>
          </button>

          {/* Desktop Nav Links */}
          <nav className="hidden lg:flex items-center gap-1">
            {[
              { id: 'home', label: 'Academic Home' },
              { id: 'papers', label: 'Past Papers' },
              { id: 'notices', label: 'GTU Circulars' },
              { id: 'feedback', label: 'Help Desk' },
              { id: 'admin', label: 'Admin Console' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => handleGlobalNavigate(tab.id as any)}
                className={`px-3.5 py-2 text-xs font-bold rounded-xl transition-all ${
                  activeTab === tab.id && !selectedDept && !activeSubjectCode
                    ? 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-100'
                    : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/40 hover:text-slate-800 dark:hover:text-slate-200'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>

          {/* Action Tools */}
          <div className="flex items-center gap-2">
            
            {/* Bookmarks Toggle button */}
            <button
              onClick={() => {
                setIsBookmarkDrawerOpen(true);
                setIsHistoryDrawerOpen(false);
              }}
              className="p-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors relative"
              title="Saved Materials"
            >
              <Bookmark size={16} />
              {bookmarkedMaterials.length > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-brand-orange text-white text-[9px] font-bold rounded-full flex items-center justify-center font-mono">
                  {bookmarkedMaterials.length}
                </span>
              )}
            </button>

            {/* Recently Viewed History Toggle button */}
            <button
              onClick={() => {
                setIsHistoryDrawerOpen(true);
                setIsBookmarkDrawerOpen(false);
              }}
              className="p-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors relative"
              title="Recently Viewed Subjects"
            >
              <History size={16} />
              {recentlyViewedSubjects.length > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-brand-purple text-white text-[9px] font-bold rounded-full flex items-center justify-center font-mono">
                  {recentlyViewedSubjects.length}
                </span>
              )}
            </button>

            {/* Theme Toggle Button */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
              title={preferences.theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            >
              {preferences.theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
            </button>

            {/* Mobile Menu trigger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 lg:hidden hover:bg-slate-50 transition-colors"
            >
              {mobileMenuOpen ? <X size={16} /> : <Menu size={16} />}
            </button>

          </div>
        </div>

        {/* Mobile Navigation Dropdown */}
        {mobileMenuOpen && (
          <div className="lg:hidden mt-4 pt-4 border-t border-slate-200 dark:border-slate-800 space-y-1">
            {[
              { id: 'home', label: 'Academic Home' },
              { id: 'papers', label: 'Past Papers' },
              { id: 'notices', label: 'GTU Circulars' },
              { id: 'feedback', label: 'Help Desk' },
              { id: 'admin', label: 'Admin Console' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => handleGlobalNavigate(tab.id as any)}
                className={`w-full text-left px-4 py-2.5 text-xs font-bold rounded-xl transition-all ${
                  activeTab === tab.id
                    ? 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-100'
                    : 'text-slate-500 dark:text-slate-400'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        )}
      </header>

      {/* -------------------------------------------------------------
          MAIN CORE APPLICATION SPACE
          ------------------------------------------------------------- */}
      <main className="max-w-7xl mx-auto px-6 py-8 flex-1 w-full relative">
        
        {/* -------------------------------------------------------------
            VIEW: SUBJECT DETAIL WORKSPACE
            ------------------------------------------------------------- */}
        {activeSubjectCode ? (
          <SubjectViewer
            subjectCode={activeSubjectCode}
            onBack={() => {
              setActiveSubjectCode(null);
              if (!selectedDept) {
                setActiveTab('home');
              }
            }}
            onNavigateToAdmin={() => handleGlobalNavigate('admin')}
          />
        ) : selectedDept ? (
          /* -------------------------------------------------------------
              VIEW: DEPARTMENT DETAIL PORTAL
              ------------------------------------------------------------- */
          <div className="space-y-6">
            {/* Breadcrumb row */}
            <button
              onClick={() => setSelectedDept(null)}
              className="px-3.5 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 text-xs font-semibold flex items-center gap-1 transition-colors w-max"
            >
              <ArrowLeft size={14} /> Back to Directory
            </button>

            {/* Department Banner */}
            <div className="glass-card rounded-2xl p-6 border border-slate-200 dark:border-slate-800 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div className="flex items-center gap-4">
                <div className="p-3.5 bg-brand-teal/10 text-brand-teal dark:bg-brand-teal/20 rounded-2xl shrink-0">
                  <Icon name={selectedDept.iconName} size={32} />
                </div>
                <div>
                  <h2 className="text-xl md:text-2xl font-bold font-display text-slate-800 dark:text-slate-100 leading-tight">
                    {selectedDept.name} ({selectedDept.shortName})
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-xl">
                    {selectedDept.description}
                  </p>
                </div>
              </div>
            </div>

            {/* Semesters 1-6 selector tabs */}
            <div className="space-y-4">
              <div className="flex justify-between items-center px-1">
                <h3 className="text-sm font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider font-display">
                  Select Semester
                </h3>
              </div>
              
              <div className="grid grid-cols-2 sm:grid-cols-6 gap-2">
                {[1, 2, 3, 4, 5, 6].map(sem => (
                  <button
                    key={sem}
                    onClick={() => setSelectedSem(sem)}
                    className={`p-3 rounded-xl border text-xs font-bold transition-all text-center ${
                      selectedSem === sem
                        ? 'bg-gradient-to-r from-brand-teal to-brand-emerald border-transparent text-white shadow-md'
                        : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700'
                    }`}
                  >
                    Semester {sem}
                  </button>
                ))}
              </div>
            </div>

            {/* Subject mapped lists */}
            <div className="space-y-4 pt-4">
              <h3 className="text-sm font-bold text-slate-700 dark:text-slate-300 font-display">
                Syllabus Course Outline (Semester {selectedSem})
              </h3>

              {activeSubjects.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {activeSubjects.map(sub => {
                    // Count available materials for this subject
                    const matCount = materials.filter(m => m.subjectCode === sub.code).length;
                    
                    return (
                      <button
                        key={sub.id}
                        onClick={() => handleSelectSubject(sub.code)}
                        className="glass-card text-left p-5 rounded-2xl border border-slate-200 dark:border-slate-800 hover-glow transition-all duration-300 flex flex-col justify-between group"
                      >
                        <div>
                          <div className="flex justify-between items-start mb-2">
                            <span className="text-[10px] font-mono font-bold text-teal-600 bg-teal-50 px-2 py-0.5 rounded dark:bg-teal-950/40 dark:text-teal-300">
                              CODE: {sub.code}
                            </span>
                            <span className="text-[10px] font-mono font-bold text-slate-400">
                              Credits: {sub.credits}
                            </span>
                          </div>
                          
                          <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200 group-hover:text-brand-teal transition-colors leading-snug line-clamp-2">
                            {sub.name}
                          </h4>
                        </div>

                        <div className="mt-6 pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center text-xs text-slate-400">
                          <span className="font-mono">{matCount} study files</span>
                          <span className="flex items-center gap-0.5 text-brand-teal group-hover:translate-x-1 transition-transform font-semibold">
                            Explore Workspace <ChevronRight size={13} />
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              ) : (
                <div className="p-12 text-center glass-card rounded-2xl border border-dashed border-slate-200 dark:border-slate-800">
                  <BookOpen className="mx-auto mb-2 text-slate-300" size={36} />
                  <p className="text-sm font-semibold">No syllabus registered</p>
                  <p className="text-xs text-slate-400">No subjects are currently mapped for {selectedDept.shortName} in Semester {selectedSem}.</p>
                </div>
              )}
            </div>
          </div>
        ) : activeTab === 'papers' ? (
          /* -------------------------------------------------------------
              VIEW: EXAM PAPERS PORTAL
              ------------------------------------------------------------- */
          <ExamPapersViewer />
        ) : activeTab === 'notices' ? (
          /* -------------------------------------------------------------
              VIEW: CIRCULARS PORTAL
              ------------------------------------------------------------- */
          <NoticeBoard />
        ) : activeTab === 'feedback' ? (
          /* -------------------------------------------------------------
              VIEW: FEEDBACK PORTAL
              ------------------------------------------------------------- */
          <FeedbackSection />
        ) : activeTab === 'admin' ? (
          /* -------------------------------------------------------------
              VIEW: ADMIN OPERATIONS CONSOLE
              ------------------------------------------------------------- */
          <AdminPanel />
        ) : (
          /* -------------------------------------------------------------
              VIEW: MASTER ACADEMIC HOME PAGE
              ------------------------------------------------------------- */
          <div className="space-y-12">
            
            {/* Hero search block */}
            <HeroSection
              onSelectSubject={handleSelectSubject}
              onNavigateToTab={(tab) => handleGlobalNavigate(tab)}
            />

            {/* Quick access cards & download trackers */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* Popular downloads widget */}
              <div className="lg:col-span-2 glass-card rounded-2xl p-6 border border-slate-200 dark:border-slate-800 space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider flex items-center gap-2 font-display">
                    <Sparkles size={16} className="text-brand-orange" />
                    Popular Download Resources
                  </h3>
                  <button onClick={() => handleGlobalNavigate('papers')} className="text-xs text-brand-teal font-semibold hover:underline">
                    View Exams
                  </button>
                </div>

                <div className="divide-y divide-slate-100 dark:divide-slate-800">
                  {popularMaterials.map((mat, idx) => (
                    <div key={mat.id || idx} className="py-3 flex justify-between items-center text-xs first:pt-0 last:pb-0 group">
                      <div className="min-w-0 pr-4">
                        <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-500 mr-2 uppercase shrink-0">
                          {mat.type}
                        </span>
                        <button
                          onClick={() => handleSelectSubject(mat.subjectCode)}
                          className="font-bold text-slate-700 dark:text-slate-300 hover:text-brand-teal transition-colors truncate max-w-xs sm:max-w-md inline-block align-middle"
                        >
                          {mat.title}
                        </button>
                        <p className="text-[10px] text-slate-400 font-mono mt-0.5 truncate">{mat.subjectName} • Code: {mat.subjectCode}</p>
                      </div>

                      <div className="flex items-center gap-4 shrink-0">
                        <span className="text-slate-400 font-mono flex items-center gap-1">
                          <Download size={12} /> {mat.downloadCount}
                        </span>
                        <button
                          onClick={() => handleSelectSubject(mat.subjectCode)}
                          className="p-1 text-slate-400 hover:text-brand-teal transition-colors"
                        >
                          <ChevronRight size={16} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Semester Shortcuts */}
              <div className="lg:col-span-1 glass-card rounded-2xl p-6 border border-slate-200 dark:border-slate-800 space-y-4">
                <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider font-display">
                  Syllabus Shortcuts
                </h3>
                <p className="text-xs text-slate-400">
                  Dive directly into academic syllabus frameworks for your target semester:
                </p>

                <div className="grid grid-cols-2 gap-2">
                  {[1, 2, 3, 4, 5, 6].map(sem => (
                    <button
                      key={sem}
                      onClick={() => {
                        // Find first department to open with
                        handleSelectDepartment(departments[0]);
                        setSelectedSem(sem);
                      }}
                      className="p-3 bg-slate-50 dark:bg-slate-900 rounded-xl hover:bg-brand-teal/10 hover:text-brand-teal border border-slate-100 dark:border-slate-800 transition-all text-xs font-bold text-slate-700 dark:text-slate-300"
                    >
                      Semester {sem}
                    </button>
                  ))}
                </div>
              </div>

            </div>

            {/* Department directories portal */}
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 font-display">
                  GTU Diploma Departments Directory
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Select your engineering branch below to explore semester courses and active materials.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {departments.map((dept, idx) => (
                  <button
                    key={dept.id || idx}
                    onClick={() => handleSelectDepartment(dept)}
                    className="glass-card text-left p-5 rounded-2xl border border-slate-200 dark:border-slate-800 hover-glow transition-all duration-300 flex flex-col justify-between group h-full"
                  >
                    <div>
                      <div className="flex justify-between items-start mb-4">
                        <div className="p-3 bg-brand-teal/5 text-brand-teal group-hover:bg-brand-teal/10 rounded-xl dark:bg-brand-teal/15 transition-all">
                          <Icon name={dept.iconName} size={22} />
                        </div>
                        <span className="text-[10px] font-mono font-bold px-2 py-1 bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400 rounded-lg">
                          GTU {dept.shortName}
                        </span>
                      </div>
                      
                      <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200 group-hover:text-brand-teal transition-colors font-display mb-1.5">
                        {dept.name}
                      </h4>
                      
                      <p className="text-xs text-slate-400 line-clamp-3 leading-relaxed">
                        {dept.description}
                      </p>
                    </div>

                    <div className="mt-6 pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center text-xs text-slate-400">
                      <span>Semesters: 1 to 6</span>
                      <span className="flex items-center gap-0.5 text-brand-teal font-semibold group-hover:translate-x-1 transition-transform">
                        Explore Branch <ChevronRight size={13} />
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Updates widget */}
            <NoticeBoard />

            {/* Academic FAQs */}
            <div className="space-y-6">
              <div className="text-center">
                <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 font-display">
                  Frequently Asked Questions (FAQ)
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Understand our directory indexing, file formatting, and academic review standards.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
                {faqs.map((faq, idx) => (
                  <div key={idx} className="p-5 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl shadow-sm space-y-2">
                    <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5 font-mono">
                      <HelpCircle size={14} className="text-brand-teal" />
                      {faq.q}
                    </h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                      {faq.a}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Simplified Contact Desk */}
            <div className="glass-card rounded-2xl p-6 border border-slate-200 dark:border-slate-800 max-w-3xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider font-display flex items-center gap-1.5">
                    <Phone size={15} className="text-brand-purple" />
                    Student Assistance Desk
                  </h3>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Experiencing troubles downloading syllabus files, or want to report an unverified past paper file? Contact our technical help desk.
                  </p>
                  
                  <div className="space-y-2 text-xs font-mono">
                    <p className="flex items-center gap-2">
                      <Mail size={13} className="text-brand-teal" /> support@gtumaterialhub.org
                    </p>
                    <p className="flex items-center gap-2">
                      <Phone size={13} className="text-brand-teal" /> +91 79432 00192 (Mon-Fri)
                    </p>
                  </div>
                </div>

                <div className="bg-slate-50 dark:bg-slate-900 p-5 rounded-2xl border border-slate-100 dark:border-slate-800 flex flex-col justify-between">
                  <div>
                    <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1">
                      <ThumbsUp size={13} className="text-brand-teal" /> Missing Materials?
                    </h4>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-normal">
                      Students can request custom syllabus files directly from our department moderators. Submissions take seconds!
                    </p>
                  </div>
                  
                  <button
                    onClick={() => handleGlobalNavigate('feedback')}
                    className="mt-4 w-full py-2 bg-slate-800 text-white rounded-xl text-xs font-bold shadow hover:bg-slate-950 transition-colors uppercase tracking-wider"
                  >
                    Launch Request Portal
                  </button>
                </div>
              </div>
            </div>

          </div>
        )}
      </main>

      {/* -------------------------------------------------------------
          LAYOUT SLIDEOVER DRAWER: SAVED BOOKMARKS
          ------------------------------------------------------------- */}
      {isBookmarkDrawerOpen && (
        <div className="fixed inset-y-0 right-0 z-50 w-full max-w-sm bg-white dark:bg-slate-900 shadow-2xl border-l border-slate-200 dark:border-slate-800 flex flex-col justify-between animate-float-once">
          <div>
            <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center bg-slate-50 dark:bg-slate-900">
              <h3 className="text-xs font-bold text-slate-800 dark:text-slate-100 flex items-center gap-1.5 uppercase font-display">
                <Bookmark size={14} className="text-brand-orange" />
                Your Saved Bookmarks
              </h3>
              <button
                onClick={() => setIsBookmarkDrawerOpen(false)}
                className="p-1 rounded hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X size={16} />
              </button>
            </div>

            <div className="p-4 overflow-y-auto max-h-[75vh] space-y-3">
              {bookmarkedMaterials.length > 0 ? (
                bookmarkedMaterials.map(mat => (
                  <div key={mat.id} className="p-3 bg-slate-50 dark:bg-slate-900/40 rounded-xl border border-slate-100 dark:border-slate-800 flex justify-between items-start gap-2 text-xs">
                    <div>
                      <span className="text-[9px] font-mono font-bold uppercase text-brand-teal">{mat.type}</span>
                      <p className="font-bold text-slate-700 dark:text-slate-200 mt-0.5 truncate max-w-[180px]">{mat.title}</p>
                      <p className="text-[10px] text-slate-400 truncate max-w-[180px]">{mat.subjectName}</p>
                    </div>

                    <div className="flex gap-1 shrink-0">
                      <button
                        onClick={() => handleSelectSubject(mat.subjectCode)}
                        className="p-1 hover:bg-slate-200 dark:hover:bg-slate-800 rounded text-slate-500"
                        title="Explore Subject workspace"
                      >
                        <ChevronRight size={14} />
                      </button>
                      <button
                        onClick={() => toggleBookmark(mat.id)}
                        className="p-1 hover:bg-slate-200 dark:hover:bg-slate-800 rounded text-brand-orange"
                        title="Remove bookmark"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-12 text-slate-400">
                  <Bookmark className="mx-auto mb-2 text-slate-200" size={32} />
                  <p className="text-xs font-semibold">No Bookmarks Saved</p>
                  <p className="text-[10px] mt-1">Check study materials across subject categories and press bookmark ribbon buttons.</p>
                </div>
              )}
            </div>
          </div>

          <div className="p-4 bg-slate-50 dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 text-center text-[10px] text-slate-400">
            Bookmarks are saved securely in your browser's offline local state.
          </div>
        </div>
      )}

      {/* -------------------------------------------------------------
          LAYOUT SLIDEOVER DRAWER: RECENT SUBJECTS HISTORY
          ------------------------------------------------------------- */}
      {isHistoryDrawerOpen && (
        <div className="fixed inset-y-0 right-0 z-50 w-full max-w-sm bg-white dark:bg-slate-900 shadow-2xl border-l border-slate-200 dark:border-slate-800 flex flex-col justify-between animate-float-once">
          <div>
            <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center bg-slate-50 dark:bg-slate-900">
              <h3 className="text-xs font-bold text-slate-800 dark:text-slate-100 flex items-center gap-1.5 uppercase font-display">
                <History size={14} className="text-brand-purple" />
                Recently Viewed Subjects
              </h3>
              <button
                onClick={() => setIsHistoryDrawerOpen(false)}
                className="p-1 rounded hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X size={16} />
              </button>
            </div>

            <div className="p-4 overflow-y-auto max-h-[75vh] space-y-3">
              {recentlyViewedSubjects.length > 0 ? (
                recentlyViewedSubjects.map(sub => {
                  const dept = departments.find(d => d.id === sub.departmentId);
                  return (
                    <button
                      key={sub.id}
                      onClick={() => {
                        handleSelectSubject(sub.code);
                        setIsHistoryDrawerOpen(false);
                      }}
                      className="w-full text-left p-3 bg-slate-50 dark:bg-slate-900/40 rounded-xl border border-slate-100 dark:border-slate-800 flex justify-between items-center text-xs group"
                    >
                      <div>
                        <p className="font-bold text-slate-700 dark:text-slate-200 group-hover:text-brand-teal transition-colors truncate max-w-[180px]">
                          {sub.name}
                        </p>
                        <p className="text-[10px] text-slate-400 mt-0.5">Code: {sub.code} • Sem {sub.semester}</p>
                      </div>

                      <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded bg-slate-200 text-slate-500 uppercase">
                        {dept?.shortName || 'Common'}
                      </span>
                    </button>
                  );
                })
              ) : (
                <div className="text-center py-12 text-slate-400">
                  <History className="mx-auto mb-2 text-slate-200" size={32} />
                  <p className="text-xs font-semibold">History is empty</p>
                  <p className="text-[10px] mt-1">Explore various subjects to log active shortcuts in this workspace drawer.</p>
                </div>
              )}
            </div>
          </div>

          <div className="p-4 bg-slate-50 dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 text-center text-[10px] text-slate-400">
            Recently viewed lists are automatically cleared after 10 entries.
          </div>
        </div>
      )}

      {/* Footer */}
      <Footer onNavigate={(tab) => handleGlobalNavigate(tab)} />
    </div>
  );
}

export default function App() {
  return (
    <GTUProvider>
      <AppContent />
    </GTUProvider>
  );
}
