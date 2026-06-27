import React, { useState } from 'react';
import { useGTU } from '../context/GTUContext';
import { StudyMaterial, ExamPaper, Notice, Department, Subject, MaterialType, ExamPaperType, LanguageType } from '../types';
import { Plus, Trash, Edit, Check, X, ShieldAlert, Folder, BookOpen, MessageSquare, Bell, FileText, UploadCloud, ChevronRight } from 'lucide-react';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { storage } from '../lib/firebase';

export const AdminPanel: React.FC = () => {
  const {
    departments,
    subjects,
    materials,
    examPapers,
    notices,
    feedbacks,
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
  } = useGTU();

  const [activeAdminTab, setActiveAdminTab] = useState<'materials' | 'departments' | 'subjects' | 'papers' | 'notices' | 'feedbacks'>('materials');

  // Success messaging states
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const showSuccess = (msg: string) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(null), 3000);
  };

  // -------------------------------------------------------------
  // FORM STATES - MATERIALS
  // -------------------------------------------------------------
  // FORM STATES - MATERIALS / PDF UPLOAD
  // -------------------------------------------------------------
  const [materialFormOpen, setMaterialFormOpen] = useState(false);
  const [editingMaterialId, setEditingMaterialId] = useState<string | null>(null);
  
  const [matTitle, setMatTitle] = useState('');
  const [matType, setMatType] = useState<MaterialType>('Study Material');
  const [matSubCode, setMatSubCode] = useState('');
  const [matSem, setMatSem] = useState(1);
  const [matDept, setMatDept] = useState('it');
  const [matSize, setMatSize] = useState('1.8 MB');
  const [matDesc, setMatDesc] = useState('');
  const [matPreview, setMatPreview] = useState('');
  const [matOfficial, setMatOfficial] = useState(true);

  // PDF File upload state variables
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);
  const [paperTypeSelection, setPaperTypeSelection] = useState<'Summer' | 'Winter' | 'Internal' | 'Unit Test' | 'IMP Notes'>('IMP Notes');

  const handleMaterialSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const matchedSubject = subjects.find(s => s.code === matSubCode);
    const subName = matchedSubject ? matchedSubject.name : 'Selected Subject';

    setIsUploading(true);
    setUploadProgress(0);

    const onComplete = async (downloadURL?: string) => {
      const calculatedSize = pdfFile ? (pdfFile.size / (1024 * 1024)).toFixed(1) + ' MB' : matSize;

      if (paperTypeSelection === 'IMP Notes') {
        if (editingMaterialId) {
          const original = materials.find(m => m.id === editingMaterialId);
          if (original) {
            updateMaterial({
              ...original,
              title: matTitle,
              type: 'IMP Questions', // Maps IMP Notes to IMP Questions type
              subjectCode: matSubCode,
              subjectName: subName,
              semester: matSem,
              departmentId: matDept,
              fileSize: calculatedSize,
              description: matDesc,
              previewContent: matPreview,
              isOfficial: matOfficial,
              ...(downloadURL ? { pdfUrl: downloadURL } : {})
            });
            showSuccess('Study material successfully updated.');
          }
        } else {
          addMaterial({
            title: matTitle,
            type: 'IMP Questions',
            subjectCode: matSubCode,
            subjectName: subName,
            semester: matSem,
            departmentId: matDept,
            fileSize: calculatedSize,
            description: matDesc,
            previewContent: matPreview,
            isOfficial: matOfficial,
            ...(downloadURL ? { pdfUrl: downloadURL } : {})
          });
          showSuccess('New study material successfully uploaded.');
        }
      } else {
        // Exam Paper mapping
        let paperTypeVal: ExamPaperType = 'Practice Papers';
        if (paperTypeSelection === 'Summer') paperTypeVal = 'Summer Papers';
        if (paperTypeSelection === 'Winter') paperTypeVal = 'Winter Papers';
        if (paperTypeSelection === 'Internal') paperTypeVal = 'Internal Test Papers';
        if (paperTypeSelection === 'Unit Test') paperTypeVal = 'Unit Test Papers';

        addExamPaper({
          year: new Date().getFullYear(),
          type: paperTypeVal,
          subjectCode: matSubCode,
          subjectName: subName,
          semester: matSem,
          departmentId: matDept,
          language: 'English',
          fileSize: calculatedSize,
          isOfficial: matOfficial,
          questions: [
            { section: 'Full PDF Paper', marks: 70, text: 'This exam paper has been uploaded as a PDF file.' }
          ],
          ...(downloadURL ? { pdfUrl: downloadURL } : {})
        });
        showSuccess(`New ${paperTypeSelection} Exam Paper successfully uploaded.`);
      }

      // Reset Form
      setMaterialFormOpen(false);
      setEditingMaterialId(null);
      setPdfFile(null);
      setIsUploading(false);
      setUploadProgress(null);
      setMatTitle('');
      setMatSubCode('');
      setMatDesc('');
      setMatPreview('');
    };

    if (pdfFile) {
      try {
        const storageRef = ref(storage, `pdfs/${Date.now()}_${pdfFile.name}`);
        const uploadTask = uploadBytesResumable(storageRef, pdfFile);

        uploadTask.on(
          'state_changed',
          (snapshot) => {
            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            setUploadProgress(Math.round(progress));
          },
          (error) => {
            console.error('File upload failed:', error);
            alert('File upload failed: ' + error.message);
            setIsUploading(false);
            setUploadProgress(null);
          },
          async () => {
            const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
            await onComplete(downloadURL);
          }
        );
      } catch (err: any) {
        console.error('Storage error:', err);
        alert('Storage upload setup error: ' + err.message);
        setIsUploading(false);
        setUploadProgress(null);
      }
    } else {
      await onComplete();
    }
  };

  const startEditMaterial = (mat: StudyMaterial) => {
    setEditingMaterialId(mat.id);
    setMatTitle(mat.title);
    setMatType(mat.type);
    setMatSubCode(mat.subjectCode);
    setMatSem(mat.semester);
    setMatDept(mat.departmentId);
    setMatSize(mat.fileSize);
    setMatDesc(mat.description);
    setMatPreview(mat.previewContent || '');
    setMatOfficial(mat.isOfficial || false);
    setPaperTypeSelection('IMP Notes');
    setMaterialFormOpen(true);
  };

  // -------------------------------------------------------------
  // FORM STATES - DEPARTMENTS
  // -------------------------------------------------------------
  const [deptFormOpen, setDeptFormOpen] = useState(false);
  const [editingDeptId, setEditingDeptId] = useState<string | null>(null);
  const [deptName, setDeptName] = useState('');
  const [deptShort, setDeptShort] = useState('');
  const [deptDesc, setDeptDesc] = useState('');
  const [deptIcon, setDeptIcon] = useState('GraduationCap');

  const handleDeptSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingDeptId) {
      updateDepartment({
        id: editingDeptId,
        name: deptName,
        shortName: deptShort,
        description: deptDesc,
        iconName: deptIcon
      });
      showSuccess('Department updated successfully.');
    } else {
      addDepartment({
        name: deptName,
        shortName: deptShort,
        description: deptDesc,
        iconName: deptIcon
      });
      showSuccess('New department registered successfully.');
    }
    setDeptFormOpen(false);
    setEditingDeptId(null);
    setDeptName('');
    setDeptShort('');
    setDeptDesc('');
  };

  // -------------------------------------------------------------
  // FORM STATES - SUBJECTS
  // -------------------------------------------------------------
  const [subFormOpen, setSubFormOpen] = useState(false);
  const [editingSubId, setEditingSubId] = useState<string | null>(null);
  const [subCode, setSubCode] = useState('');
  const [subName, setSubName] = useState('');
  const [subDept, setSubDept] = useState('it');
  const [subSem, setSubSem] = useState(1);
  const [subCredits, setSubCredits] = useState(4);

  const handleSubjectSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingSubId) {
      updateSubject({
        id: editingSubId,
        code: subCode,
        name: subName,
        departmentId: subDept,
        semester: subSem,
        credits: subCredits
      });
      showSuccess('Subject parameters updated.');
    } else {
      addSubject({
        id: `sub-${subCode}`,
        code: subCode,
        name: subName,
        departmentId: subDept,
        semester: subSem,
        credits: subCredits
      });
      showSuccess('New subject added to registry.');
    }
    setSubFormOpen(false);
    setEditingSubId(null);
    setSubCode('');
    setSubName('');
  };

  // -------------------------------------------------------------
  // FORM STATES - EXAM PAPERS
  // -------------------------------------------------------------
  const [paperFormOpen, setPaperFormOpen] = useState(false);
  const [editingPaperId, setEditingPaperId] = useState<string | null>(null);
  
  const [paperYear, setPaperYear] = useState(2026);
  const [paperType, setPaperType] = useState<ExamPaperType>('Winter Papers');
  const [paperSubCode, setPaperSubCode] = useState('');
  const [paperSem, setPaperSem] = useState(1);
  const [paperDept, setPaperDept] = useState('it');
  const [paperLang, setPaperLang] = useState<LanguageType>('English');
  const [paperSize, setPaperSize] = useState('1.5 MB');
  const [paperOfficial, setPaperOfficial] = useState(false);

  // Custom compiled questions state
  const [q1Text, setQ1Text] = useState('');
  const [q1Guj, setQ1Guj] = useState('');
  const [q2Text, setQ2Text] = useState('');
  const [q2Guj, setQ2Guj] = useState('');

  const handlePaperSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const matchedSubject = subjects.find(s => s.code === paperSubCode);
    const subName = matchedSubject ? matchedSubject.name : 'Selected Subject';

    const questionsList = [
      { section: 'Question 1 (A)', marks: 3, text: q1Text || 'Define core subject terms and parameters.', textGuj: q1Guj || undefined },
      { section: 'Question 1 (B)', marks: 4, text: q2Text || 'Differentiate key structural techniques.', textGuj: q2Guj || undefined }
    ];

    if (editingPaperId) {
      const original = examPapers.find(p => p.id === editingPaperId);
      if (original) {
        updateExamPaper({
          ...original,
          year: paperYear,
          type: paperType,
          subjectCode: paperSubCode,
          subjectName: subName,
          semester: paperSem,
          departmentId: paperDept,
          language: paperLang,
          fileSize: paperSize,
          isOfficial: paperOfficial,
          questions: questionsList
        });
        showSuccess('Examination past paper updated.');
      }
    } else {
      addExamPaper({
        year: paperYear,
        type: paperType,
        subjectCode: paperSubCode,
        subjectName: subName,
        semester: paperSem,
        departmentId: paperDept,
        language: paperLang,
        fileSize: paperSize,
        isOfficial: paperOfficial,
        questions: questionsList
      });
      showSuccess('New evaluation paper appended.');
    }

    setPaperFormOpen(false);
    setEditingPaperId(null);
    setPaperSubCode('');
    setQ1Text('');
    setQ1Guj('');
    setQ2Text('');
    setQ2Guj('');
  };

  // -------------------------------------------------------------
  // FORM STATES - NOTICES
  // -------------------------------------------------------------
  const [noticeFormOpen, setNoticeFormOpen] = useState(false);
  const [editingNoticeId, setEditingNoticeId] = useState<string | null>(null);
  
  const [notTitle, setNotTitle] = useState('');
  const [notContent, setNotContent] = useState('');
  const [notCat, setNotCat] = useState<'Exam' | 'Academic' | 'Results' | 'General'>('General');
  const [notImportant, setNotImportant] = useState(false);

  const handleNoticeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingNoticeId) {
      const original = notices.find(n => n.id === editingNoticeId);
      if (original) {
        updateNotice({
          ...original,
          title: notTitle,
          content: notContent,
          category: notCat,
          isImportant: notImportant
        });
        showSuccess('Notice successfully modified.');
      }
    } else {
      addNotice({
        title: notTitle,
        content: notContent,
        category: notCat,
        isImportant: notImportant
      });
      showSuccess('Notice drafted and broadcasted.');
    }
    setNoticeFormOpen(false);
    setEditingNoticeId(null);
    setNotTitle('');
    setNotContent('');
  };

  const materialTypes: MaterialType[] = [
    'Study Material',
    'Notes',
    'IMP Questions',
    'Question Bank',
    'Assignment',
    'Syllabus',
    'Reference Books'
  ];

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-xl md:text-2xl font-bold font-display text-slate-800 dark:text-slate-100 flex items-center gap-2">
            <ShieldAlert className="text-brand-purple" size={24} />
            GTU Academic Administration Dashboard
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Publish syllabus, update past question papers, manage course databases, and audit student feedbacks.
          </p>
        </div>
        
        {/* Quick action buttons based on selected tab */}
        <div>
          {activeAdminTab === 'materials' && (
            <button
              onClick={() => { setEditingMaterialId(null); setMaterialFormOpen(true); }}
              className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold rounded-xl flex items-center gap-1.5 shadow transition-all"
            >
              <Plus size={15} /> Upload PDF Material
            </button>
          )}
          {activeAdminTab === 'departments' && (
            <button
              onClick={() => { setEditingDeptId(null); setDeptFormOpen(true); }}
              className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold rounded-xl flex items-center gap-1.5 shadow transition-all"
            >
              <Plus size={15} /> Add Department
            </button>
          )}
          {activeAdminTab === 'subjects' && (
            <button
              onClick={() => { setEditingSubId(null); setSubFormOpen(true); }}
              className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold rounded-xl flex items-center gap-1.5 shadow transition-all"
            >
              <Plus size={15} /> Register Subject
            </button>
          )}
          {activeAdminTab === 'papers' && (
            <button
              onClick={() => { setEditingPaperId(null); setPaperFormOpen(true); }}
              className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold rounded-xl flex items-center gap-1.5 shadow transition-all"
            >
              <Plus size={15} /> Add Exam Paper
            </button>
          )}
          {activeAdminTab === 'notices' && (
            <button
              onClick={() => { setEditingNoticeId(null); setNoticeFormOpen(true); }}
              className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold rounded-xl flex items-center gap-1.5 shadow transition-all"
            >
              <Plus size={15} /> Publish Circular
            </button>
          )}
        </div>
      </div>

      {/* Admin Nav Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-slate-200 dark:border-slate-800 pb-px">
        {[
          { id: 'materials', label: 'Study Materials', icon: FileText, count: materials.length },
          { id: 'departments', label: 'Departments', icon: Folder, count: departments.length },
          { id: 'subjects', label: 'Subjects', icon: BookOpen, count: subjects.length },
          { id: 'papers', label: 'Past Papers', icon: UploadCloud, count: examPapers.length },
          { id: 'notices', label: 'Notices', icon: Bell, count: notices.length },
          { id: 'feedbacks', label: 'Feedbacks', icon: MessageSquare, count: feedbacks.length }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveAdminTab(tab.id as any)}
            className={`px-4 py-2 text-xs font-bold transition-all border-b-2 flex items-center gap-1.5 ${
              activeAdminTab === tab.id
                ? 'border-brand-purple text-brand-purple'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <tab.icon size={14} />
            <span>{tab.label}</span>
            <span className="px-1.5 py-0.5 text-[10px] bg-slate-100 dark:bg-slate-800 rounded font-mono">
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      {/* Floating Success Alert */}
      {successMsg && (
        <div className="p-3 bg-emerald-50 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400 text-xs font-semibold rounded-xl border border-emerald-100 dark:border-emerald-900/50 flex items-center gap-2">
          <Check size={16} /> {successMsg}
        </div>
      )}

      {/* -------------------------------------------------------------
          TAB CONTENT: STUDY MATERIALS MANAGER
          ------------------------------------------------------------- */}
      {activeAdminTab === 'materials' && (
        <div className="glass-card rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-100 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 text-slate-500 font-bold uppercase">
                  <th className="p-4">Material Details</th>
                  <th className="p-4">Type</th>
                  <th className="p-4">Code / Sem</th>
                  <th className="p-4">Downloads</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-600 dark:text-slate-300">
                {materials.map(mat => (
                  <tr key={mat.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/30 transition-colors">
                    <td className="p-4">
                      <p className="font-bold text-slate-800 dark:text-slate-200">{mat.title}</p>
                      <p className="text-[10px] text-slate-400 mt-0.5 truncate max-w-sm">{mat.subjectName}</p>
                    </td>
                    <td className="p-4">
                      <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-mono text-[10px]">
                        {mat.type}
                      </span>
                    </td>
                    <td className="p-4 font-mono">
                      <p>{mat.subjectCode}</p>
                      <p className="text-[10px] text-slate-400">Sem {mat.semester}</p>
                    </td>
                    <td className="p-4 font-mono">{mat.downloadCount} downloads</td>
                    <td className="p-4">
                      {mat.isOfficial ? (
                        <span className="text-[10px] text-emerald-600 font-bold">Official</span>
                      ) : (
                        <span className="text-[10px] text-orange-500 font-bold">Practice</span>
                      )}
                    </td>
                    <td className="p-4 text-right space-x-1.5 whitespace-nowrap">
                      <button
                        onClick={() => startEditMaterial(mat)}
                        className="p-1 text-slate-400 hover:text-brand-purple transition-colors"
                        title="Edit entry"
                      >
                        <Edit size={14} />
                      </button>
                      <button
                        onClick={() => {
                          if (confirm('Delete this material item permanently?')) {
                            deleteMaterial(mat.id);
                            showSuccess('Material deleted.');
                          }
                        }}
                        className="p-1 text-slate-400 hover:text-red-500 transition-colors"
                        title="Delete entry"
                      >
                        <Trash size={14} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* -------------------------------------------------------------
          TAB CONTENT: DEPARTMENTS MANAGER
          ------------------------------------------------------------- */}
      {activeAdminTab === 'departments' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {departments.map(dept => (
            <div
              key={dept.id}
              className="glass-card rounded-2xl p-4 border border-slate-200 dark:border-slate-800 flex justify-between items-start"
            >
              <div>
                <span className="text-xs font-mono font-bold bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded">
                  {dept.shortName}
                </span>
                <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200 mt-2">{dept.name}</h4>
                <p className="text-xs text-slate-400 mt-1 line-clamp-2 leading-relaxed">{dept.description}</p>
              </div>
              <div className="flex gap-1 shrink-0">
                <button
                  onClick={() => {
                    setEditingDeptId(dept.id);
                    setDeptName(dept.name);
                    setDeptShort(dept.shortName);
                    setDeptDesc(dept.description);
                    setDeptIcon(dept.iconName);
                    setDeptFormOpen(true);
                  }}
                  className="p-1.5 rounded hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
                >
                  <Edit size={14} />
                </button>
                <button
                  onClick={() => {
                    if (confirm('Delete this department? Active subjects and materials will remain orphaned.')) {
                      deleteDepartment(dept.id);
                      showSuccess('Department deleted.');
                    }
                  }}
                  className="p-1.5 rounded hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-red-500"
                >
                  <Trash size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* -------------------------------------------------------------
          TAB CONTENT: SUBJECTS MANAGER
          ------------------------------------------------------------- */}
      {activeAdminTab === 'subjects' && (
        <div className="glass-card rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-100 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 text-slate-500 font-bold uppercase">
                  <th className="p-4">Subject Name</th>
                  <th className="p-4">GTU Code</th>
                  <th className="p-4">Branch</th>
                  <th className="p-4">Semester</th>
                  <th className="p-4">Credits</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-600 dark:text-slate-300">
                {subjects.slice(0, 40).map(sub => (
                  <tr key={sub.id}>
                    <td className="p-4 font-bold text-slate-800 dark:text-slate-200">{sub.name}</td>
                    <td className="p-4 font-mono">{sub.code}</td>
                    <td className="p-4 uppercase font-bold text-brand-teal">{sub.departmentId}</td>
                    <td className="p-4">Sem {sub.semester}</td>
                    <td className="p-4 font-mono">{sub.credits}</td>
                    <td className="p-4 text-right space-x-1 whitespace-nowrap">
                      <button
                        onClick={() => {
                          setEditingSubId(sub.id);
                          setSubCode(sub.code);
                          setSubName(sub.name);
                          setSubDept(sub.departmentId);
                          setSubSem(sub.semester);
                          setSubCredits(sub.credits);
                          setSubFormOpen(true);
                        }}
                        className="p-1 text-slate-400 hover:text-brand-purple"
                      >
                        <Edit size={14} />
                      </button>
                      <button
                        onClick={() => {
                          if (confirm('Remove this subject from GTU mapping registry?')) {
                            deleteSubject(sub.id);
                            showSuccess('Subject deleted.');
                          }
                        }}
                        className="p-1 text-slate-400 hover:text-red-500"
                      >
                        <Trash size={14} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="p-4 bg-slate-50 dark:bg-slate-900/60 border-t text-center text-[10px] text-slate-400">
            Showing top mapped subjects. Total subjects mapped: {subjects.length}
          </div>
        </div>
      )}

      {/* -------------------------------------------------------------
          TAB CONTENT: PAST EXAM PAPERS MANAGER
          ------------------------------------------------------------- */}
      {activeAdminTab === 'papers' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {examPapers.map(paper => (
            <div
              key={paper.id}
              className="glass-card rounded-2xl p-4 border border-slate-200 dark:border-slate-800 flex justify-between items-start"
            >
              <div>
                <span className="text-[10px] font-mono font-bold bg-brand-emerald/10 text-brand-emerald px-2 py-0.5 rounded uppercase">
                  {paper.type} ({paper.year})
                </span>
                <h4 className="text-sm font-bold text-slate-800 dark:text-slate-100 mt-2">{paper.subjectName}</h4>
                <p className="text-xs text-slate-400 font-mono mt-0.5">Code: {paper.subjectCode} • Sem {paper.semester} • {paper.language}</p>
                <p className="text-xs text-slate-400 font-mono">Q count: {paper.questions.length} blocks</p>
              </div>

              <div className="flex gap-1 shrinking-0">
                <button
                  onClick={() => {
                    setEditingPaperId(paper.id);
                    setPaperYear(paper.year);
                    setPaperType(paper.type);
                    setPaperSubCode(paper.subjectCode);
                    setPaperSem(paper.semester);
                    setPaperDept(paper.departmentId);
                    setPaperLang(paper.language);
                    setPaperSize(paper.fileSize);
                    setPaperOfficial(paper.isOfficial);
                    // Load questions
                    setQ1Text(paper.questions[0]?.text || '');
                    setQ1Guj(paper.questions[0]?.textGuj || '');
                    setQ2Text(paper.questions[1]?.text || '');
                    setQ2Guj(paper.questions[1]?.textGuj || '');
                    setPaperFormOpen(true);
                  }}
                  className="p-1 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-700"
                >
                  <Edit size={14} />
                </button>
                <button
                  onClick={() => {
                    if (confirm('Delete this past examination paper?')) {
                      deleteExamPaper(paper.id);
                      showSuccess('Paper deleted.');
                    }
                  }}
                  className="p-1 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-400 hover:text-red-500"
                >
                  <Trash size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* -------------------------------------------------------------
          TAB CONTENT: SYSTEM NOTICES MANAGER
          ------------------------------------------------------------- */}
      {activeAdminTab === 'notices' && (
        <div className="space-y-4">
          {notices.map(notice => (
            <div
              key={notice.id}
              className="glass-card rounded-xl p-4 border border-slate-200 dark:border-slate-800 flex justify-between items-start"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold font-mono px-2 py-0.5 rounded bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                    {notice.category}
                  </span>
                  {notice.isImportant && (
                    <span className="text-[10px] text-brand-orange font-bold font-mono">CRITICAL BROADCAST</span>
                  )}
                  <span className="text-[10px] text-slate-400 font-mono">{notice.date}</span>
                </div>
                <h4 className="text-sm font-bold text-slate-800 dark:text-slate-100">{notice.title}</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed max-w-2xl">{notice.content}</p>
              </div>

              <div className="flex gap-1 shrink-0">
                <button
                  onClick={() => {
                    setEditingNoticeId(notice.id);
                    setNotTitle(notice.title);
                    setNotContent(notice.content);
                    setNotCat(notice.category);
                    setNotImportant(notice.isImportant || false);
                    setNoticeFormOpen(true);
                  }}
                  className="p-1 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
                >
                  <Edit size={14} />
                </button>
                <button
                  onClick={() => {
                    if (confirm('Delete circular broadcast?')) {
                      deleteNotice(notice.id);
                      showSuccess('Notice deleted.');
                    }
                  }}
                  className="p-1 text-slate-400 hover:text-red-500"
                >
                  <Trash size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* -------------------------------------------------------------
          TAB CONTENT: STUDENT FEEDBACKS VIEWER
          ------------------------------------------------------------- */}
      {activeAdminTab === 'feedbacks' && (
        <div className="space-y-4">
          {feedbacks.length > 0 ? (
            feedbacks.map(fb => {
              const dept = departments.find(d => d.id === fb.departmentId);
              return (
                <div
                  key={fb.id}
                  className="glass-card rounded-2xl p-5 border border-slate-200 dark:border-slate-800"
                >
                  <div className="flex justify-between items-start gap-4 flex-wrap mb-2">
                    <div>
                      <h4 className="text-sm font-bold text-slate-800 dark:text-slate-100">{fb.name}</h4>
                      <p className="text-[10px] font-mono text-slate-400 mt-0.5">
                        {fb.email} {fb.enrollmentNo ? `• Enroll No: ${fb.enrollmentNo}` : ''}
                      </p>
                    </div>

                    <div className="text-right font-mono text-xs text-slate-400">
                      <p className="font-semibold text-brand-purple uppercase">{dept?.shortName} • Sem {fb.semester}</p>
                      <p className="text-[10px] mt-0.5">{fb.date}</p>
                    </div>
                  </div>

                  <div className="flex gap-1 text-brand-orange my-2">
                    {Array.from({ length: fb.rating }).map((_, idx) => (
                      <span key={idx}>★</span>
                    ))}
                    {Array.from({ length: 5 - fb.rating }).map((_, idx) => (
                      <span key={idx} className="text-slate-200 dark:text-slate-800">★</span>
                    ))}
                  </div>

                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed bg-slate-50 dark:bg-slate-900/60 p-3 rounded-xl border border-slate-100 dark:border-slate-800 mt-2">
                    {fb.message}
                  </p>
                </div>
              );
            })
          ) : (
            <div className="p-12 text-center glass-card rounded-2xl border border-dashed border-slate-200 dark:border-slate-800">
              <MessageSquare className="mx-auto mb-2 text-slate-300" size={32} />
              <p className="text-sm font-semibold">No Student Reviews Logged</p>
              <p className="text-xs mt-1">Student submissions from the portal will populate here dynamically.</p>
            </div>
          )}
        </div>
      )}

      {/* -------------------------------------------------------------
          MODALS SECTION - FORMS MODALS
          ------------------------------------------------------------- */}

      {/* 1. Material Add/Edit Modal */}
      {materialFormOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
          <div className="glass-card w-full max-w-xl rounded-2xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
            <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center">
              <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100">
                {editingMaterialId ? 'Modify Study Material' : 'Upload PDF Study Material'}
              </h3>
              <button 
                onClick={() => {
                  if (!isUploading) setMaterialFormOpen(false);
                }} 
                disabled={isUploading}
                className="p-1 text-slate-400 hover:text-slate-600 disabled:opacity-50"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleMaterialSubmit} className="p-6 overflow-y-auto space-y-4 text-xs flex-1">
              
              {/* File Upload Area */}
              <div className="space-y-1">
                <label className="font-bold block text-slate-400 mb-1">Select Material PDF File</label>
                <div className="border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-xl p-5 text-center hover:bg-slate-50 dark:hover:bg-slate-900/40 transition relative cursor-pointer group">
                  <input
                    type="file"
                    accept="application/pdf"
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        setPdfFile(e.target.files[0]);
                      }
                    }}
                    required={!editingMaterialId}
                    disabled={isUploading}
                    className="absolute inset-0 opacity-0 cursor-pointer disabled:cursor-not-allowed"
                  />
                  <UploadCloud className="mx-auto text-slate-300 dark:text-slate-700 group-hover:text-teal-500 transition mb-2" size={32} />
                  {pdfFile ? (
                    <div>
                      <p className="font-semibold text-slate-700 dark:text-slate-300">{pdfFile.name}</p>
                      <p className="text-[10px] text-slate-400">{(pdfFile.size / (1024 * 1024)).toFixed(2)} MB</p>
                    </div>
                  ) : (
                    <div>
                      <p className="font-semibold text-slate-600 dark:text-slate-400">Drag & drop or Click to choose a PDF file</p>
                      <p className="text-[10px] text-slate-400">PDF documents only</p>
                    </div>
                  )}
                </div>
              </div>

              <div>
                <label className="font-bold block text-slate-400 mb-1">Material Display Title</label>
                <input
                  type="text"
                  required
                  disabled={isUploading}
                  placeholder="e.g., Unit 3: Normalization & Keys Notes"
                  value={matTitle}
                  onChange={(e) => setMatTitle(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white/40 dark:bg-slate-900/60 text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-1 focus:ring-brand-purple disabled:opacity-60"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="font-bold block text-slate-400 mb-1">Syllabus / Paper Type</label>
                  <select
                    value={paperTypeSelection}
                    disabled={isUploading}
                    onChange={(e) => setPaperTypeSelection(e.target.value as any)}
                    className="w-full text-xs p-2.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white/40 dark:bg-slate-900/60 text-slate-700 dark:text-slate-300 disabled:opacity-60"
                  >
                    <option value="IMP Notes">IMP Notes (Study Materials)</option>
                    <option value="Summer">Summer Exam Paper (Official Past Paper)</option>
                    <option value="Winter">Winter Exam Paper (Official Past Paper)</option>
                    <option value="Internal">Internal Test Paper (Mid-Semester)</option>
                    <option value="Unit Test">Unit Test Paper</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold block text-slate-400 mb-1">Official Verification status</label>
                  <div className="flex items-center gap-2 mt-2">
                    <input
                      type="checkbox"
                      id="official_mat"
                      disabled={isUploading}
                      checked={matOfficial}
                      onChange={(e) => setMatOfficial(e.target.checked)}
                      className="w-4 h-4 text-brand-purple disabled:opacity-60"
                    />
                    <label htmlFor="official_mat" className="text-slate-600 dark:text-slate-400 select-none">
                      Verified GTU Resource
                    </label>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="font-bold block text-slate-400 mb-1">Department</label>
                  <select
                    value={matDept}
                    disabled={isUploading}
                    onChange={(e) => {
                      const dVal = e.target.value;
                      setMatDept(dVal);
                      const subjs = subjects.filter(sub => sub.departmentId === dVal && sub.semester === matSem);
                      if (subjs.length > 0) setMatSubCode(subjs[0].code);
                      else setMatSubCode('');
                    }}
                    className="w-full text-xs p-2.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white/40 dark:bg-slate-900/60 text-slate-700 dark:text-slate-300 disabled:opacity-60"
                  >
                    {departments.map(d => (
                      <option key={d.id} value={d.id}>{d.shortName}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="font-bold block text-slate-400 mb-1">Semester</label>
                  <select
                    value={matSem}
                    disabled={isUploading}
                    onChange={(e) => {
                      const sVal = parseInt(e.target.value);
                      setMatSem(sVal);
                      const subjs = subjects.filter(sub => sub.departmentId === matDept && sub.semester === sVal);
                      if (subjs.length > 0) setMatSubCode(subjs[0].code);
                      else setMatSubCode('');
                    }}
                    className="w-full text-xs p-2.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white/40 dark:bg-slate-900/60 text-slate-700 dark:text-slate-300 disabled:opacity-60"
                  >
                    {[1, 2, 3, 4, 5, 6].map(sem => (
                      <option key={sem} value={sem}>Sem {sem}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="font-bold block text-slate-400 mb-1">GTU Subject Code</label>
                  <select
                    value={matSubCode}
                    disabled={isUploading}
                    onChange={(e) => setMatSubCode(e.target.value)}
                    required
                    className="w-full text-xs p-2.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white/40 dark:bg-slate-900/60 text-slate-700 dark:text-slate-300 disabled:opacity-60"
                  >
                    <option value="">Choose Code</option>
                    {subjects
                      .filter(sub => sub.departmentId === matDept && sub.semester === matSem)
                      .map(sub => (
                        <option key={sub.id} value={sub.code}>{sub.code} - {sub.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="font-bold block text-slate-400 mb-1">Brief Description</label>
                <textarea
                  rows={2}
                  disabled={isUploading}
                  placeholder="e.g. Hand-written structural drafting notes compiled by department experts."
                  value={matDesc}
                  onChange={(e) => setMatDesc(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white/40 dark:bg-slate-900/60 text-slate-700 dark:text-slate-300 focus:outline-none disabled:opacity-60"
                />
              </div>

              {isUploading && (
                <div className="bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-4 rounded-xl space-y-2">
                  <div className="flex justify-between font-semibold text-slate-700 dark:text-slate-300">
                    <span>Uploading PDF to Firebase Storage...</span>
                    <span>{uploadProgress}%</span>
                  </div>
                  <div className="w-full bg-slate-200 dark:bg-slate-800 rounded-full h-2 overflow-hidden">
                    <div
                      className="bg-teal-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${uploadProgress}%` }}
                    />
                  </div>
                </div>
              )}

              <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex justify-end gap-2">
                <button
                  type="button"
                  disabled={isUploading}
                  onClick={() => setMaterialFormOpen(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 rounded-lg disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isUploading}
                  className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-lg flex items-center gap-1.5 disabled:opacity-60"
                >
                  {isUploading ? 'Uploading...' : 'Confirm Upload'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 2. Department Add/Edit Modal */}
      {deptFormOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
          <div className="glass-card w-full max-w-md rounded-2xl overflow-hidden shadow-2xl p-6">
            <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100 mb-4">
              {editingDeptId ? 'Modify Department Profile' : 'Register New Diploma Department'}
            </h3>
            <form onSubmit={handleDeptSubmit} className="space-y-4 text-xs">
              <div>
                <label className="font-bold block text-slate-400 mb-1">Department Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g., Computer Engineering"
                  value={deptName}
                  onChange={(e) => setDeptName(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white/40 dark:bg-slate-900/60 text-slate-700 dark:text-slate-300 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="font-bold block text-slate-400 mb-1">Acronym / Abbreviation</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g., CE"
                    value={deptShort}
                    onChange={(e) => setDeptShort(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white/40 dark:bg-slate-900/60 text-slate-700 dark:text-slate-300 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="font-bold block text-slate-400 mb-1">Launcher Icon</label>
                  <select
                    value={deptIcon}
                    onChange={(e) => setDeptIcon(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white/40 dark:bg-slate-900/60 text-slate-700 dark:text-slate-300"
                  >
                    <option value="Laptop">Laptop (Software)</option>
                    <option value="Cpu">Cpu (Hardware)</option>
                    <option value="Settings">Settings (Mechanical)</option>
                    <option value="Building2">Building2 (Civil)</option>
                    <option value="Zap">Zap (Electrical)</option>
                    <option value="Radio">Radio (Electronics)</option>
                    <option value="Car">Car (Automobile)</option>
                    <option value="Leaf">Leaf (Environment)</option>
                    <option value="FlaskConical">Flask (Chemical)</option>
                    <option value="GraduationCap">GraduationCap (Default)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-bold block text-slate-400 mb-1">Brief Syllabus Overview</label>
                <textarea
                  required
                  rows={3}
                  placeholder="Describe academic frameworks..."
                  value={deptDesc}
                  onChange={(e) => setDeptDesc(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white/40 dark:bg-slate-900/60 text-slate-700 dark:text-slate-300 focus:outline-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t">
                <button
                  type="button"
                  onClick={() => setDeptFormOpen(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-teal-600 text-white font-bold rounded-lg"
                >
                  Save Department
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 3. Subject Add/Edit Modal */}
      {subFormOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
          <div className="glass-card w-full max-w-md rounded-2xl overflow-hidden shadow-2xl p-6">
            <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100 mb-4">
              {editingSubId ? 'Modify Subject Parameters' : 'Map New GTU Subject'}
            </h3>
            <form onSubmit={handleSubjectSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="font-bold block text-slate-400 mb-1">GTU Subject Code</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g., 4330701"
                    value={subCode}
                    onChange={(e) => setSubCode(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white/40 dark:bg-slate-900/60 text-slate-700 dark:text-slate-300 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="font-bold block text-slate-400 mb-1">Subject Credits</label>
                  <input
                    type="number"
                    required
                    min={1}
                    max={10}
                    value={subCredits}
                    onChange={(e) => setSubCredits(parseInt(e.target.value))}
                    className="w-full text-xs p-2.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white/40 dark:bg-slate-900/60 text-slate-700 dark:text-slate-300"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold block text-slate-400 mb-1">Subject Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g., Database Management Systems"
                  value={subName}
                  onChange={(e) => setSubName(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white/40 dark:bg-slate-900/60 text-slate-700 dark:text-slate-300 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="font-bold block text-slate-400 mb-1">Department Mapping</label>
                  <select
                    value={subDept}
                    onChange={(e) => setSubDept(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white/40 dark:bg-slate-900/60 text-slate-700 dark:text-slate-300"
                  >
                    {departments.map(d => (
                      <option key={d.id} value={d.id}>{d.shortName}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="font-bold block text-slate-400 mb-1">Academic Semester</label>
                  <select
                    value={subSem}
                    onChange={(e) => setSubSem(parseInt(e.target.value))}
                    className="w-full text-xs p-2.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white/40 dark:bg-slate-900/60 text-slate-700 dark:text-slate-300"
                  >
                    {[1, 2, 3, 4, 5, 6].map(sem => (
                      <option key={sem} value={sem}>Semester {sem}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t">
                <button
                  type="button"
                  onClick={() => setSubFormOpen(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-teal-600 text-white font-bold rounded-lg"
                >
                  Confirm Mapping
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 4. Exam Paper Add/Edit Modal */}
      {paperFormOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
          <div className="glass-card w-full max-w-xl rounded-2xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
            <div className="p-4 border-b flex justify-between items-center">
              <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100">
                {editingPaperId ? 'Modify Past Exam Paper' : 'Upload GTU Exam Question Paper'}
              </h3>
              <button onClick={() => setPaperFormOpen(false)} className="p-1 text-slate-400 hover:text-slate-600"><X size={18} /></button>
            </div>

            <form onSubmit={handlePaperSubmit} className="p-6 overflow-y-auto space-y-4 text-xs flex-1">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="font-bold block text-slate-400 mb-1">Academic Year</label>
                  <input
                    type="number"
                    required
                    min={2020}
                    max={2030}
                    value={paperYear}
                    onChange={(e) => setPaperYear(parseInt(e.target.value))}
                    className="w-full text-xs p-2.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white/40 dark:bg-slate-900/60 text-slate-700 dark:text-slate-300"
                  />
                </div>

                <div>
                  <label className="font-bold block text-slate-400 mb-1">Paper Type</label>
                  <select
                    value={paperType}
                    onChange={(e) => setPaperType(e.target.value as ExamPaperType)}
                    className="w-full text-xs p-2.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white/40 dark:bg-slate-900/60 text-slate-700 dark:text-slate-300"
                  >
                    <option value="Winter Papers">Winter Papers</option>
                    <option value="Summer Papers">Summer Papers</option>
                    <option value="Mid Semester Papers">Mid Semester Papers</option>
                    <option value="Model Papers">Model Papers</option>
                    <option value="Practice Papers">Practice Papers</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="font-bold block text-slate-400 mb-1">Subject Code</label>
                  <select
                    value={paperSubCode}
                    onChange={(e) => setPaperSubCode(e.target.value)}
                    required
                    className="w-full text-xs p-2.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white/40 dark:bg-slate-900/60 text-slate-700 dark:text-slate-300"
                  >
                    <option value="">Select Code</option>
                    {subjects.map(sub => (
                      <option key={sub.id} value={sub.code}>{sub.code} - {sub.name.slice(0, 18)}...</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="font-bold block text-slate-400 mb-1">Language</label>
                  <select
                    value={paperLang}
                    onChange={(e) => setPaperLang(e.target.value as LanguageType)}
                    className="w-full text-xs p-2.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white/40 dark:bg-slate-900/60 text-slate-700 dark:text-slate-300"
                  >
                    <option value="English">English</option>
                    <option value="Gujarati">Gujarati</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold block text-slate-400 mb-1">Department</label>
                  <select
                    value={paperDept}
                    onChange={(e) => setPaperDept(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white/40 dark:bg-slate-900/60 text-slate-700 dark:text-slate-300"
                  >
                    {departments.map(d => (
                      <option key={d.id} value={d.id}>{d.shortName}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="font-bold block text-slate-400 mb-1">Semester</label>
                  <select
                    value={paperSem}
                    onChange={(e) => setPaperSem(parseInt(e.target.value))}
                    className="w-full text-xs p-2.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white/40 dark:bg-slate-900/60 text-slate-700 dark:text-slate-300"
                  >
                    {[1, 2, 3, 4, 5, 6].map(sem => (
                      <option key={sem} value={sem}>Sem {sem}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="font-bold block text-slate-400 mb-1">Verification</label>
                  <div className="flex items-center gap-2 mt-2">
                    <input
                      type="checkbox"
                      id="official_paper"
                      checked={paperOfficial}
                      onChange={(e) => setPaperOfficial(e.target.checked)}
                      className="w-4 h-4 text-brand-purple"
                    />
                    <label htmlFor="official_paper" className="text-slate-500 font-semibold">
                      Official Past Paper (unticked = Practice Paper)
                    </label>
                  </div>
                </div>
              </div>

              {/* Multi-question Builder section */}
              <div className="p-4 bg-slate-50 dark:bg-slate-900 rounded-xl space-y-3">
                <p className="font-bold text-slate-700 dark:text-slate-300 border-b pb-1">Simulated Question Sheet Builder</p>
                
                <div>
                  <label className="font-semibold text-slate-500">Question 1 (A) English Draft [3 Marks]</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g., Define Database Management System."
                    value={q1Text}
                    onChange={(e) => setQ1Text(e.target.value)}
                    className="w-full text-xs p-2 rounded border bg-white dark:bg-slate-800 mt-1"
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-500">Question 1 (A) Gujarati Draft (Optional)</label>
                  <input
                    type="text"
                    placeholder="e.g., ડેટાબેઝ મેનેજમેન્ટ સિસ્ટમ (DBMS) ની વ્યાખ્યા આપો."
                    value={q1Guj}
                    onChange={(e) => setQ1Guj(e.target.value)}
                    className="w-full text-xs p-2 rounded border bg-white dark:bg-slate-800 mt-1"
                  />
                </div>

                <div className="pt-2 border-t border-dashed">
                  <label className="font-semibold text-slate-500">Question 1 (B) English Draft [4 Marks]</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g., Explain database schemas in detail."
                    value={q2Text}
                    onChange={(e) => setQ2Text(e.target.value)}
                    className="w-full text-xs p-2 rounded border bg-white dark:bg-slate-800 mt-1"
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-500">Question 1 (B) Gujarati Draft (Optional)</label>
                  <input
                    type="text"
                    placeholder="e.g., ડેટાબેઝ સ્કીમા વિગતવાર સમજાવો."
                    value={q2Guj}
                    onChange={(e) => setQ2Guj(e.target.value)}
                    className="w-full text-xs p-2 rounded border bg-white dark:bg-slate-800 mt-1"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t">
                <button
                  type="button"
                  onClick={() => setPaperFormOpen(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-lg"
                >
                  Confirm Upload
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 5. Notice Add/Edit Modal */}
      {noticeFormOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
          <div className="glass-card w-full max-w-md rounded-2xl overflow-hidden shadow-2xl p-6">
            <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100 mb-4">
              {editingNoticeId ? 'Modify Circular' : 'Publish GTU Circular / Notice'}
            </h3>
            <form onSubmit={handleNoticeSubmit} className="space-y-4 text-xs">
              <div>
                <label className="font-bold block text-slate-400 mb-1">Circular Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g., Summer 2026 Diploma Hall Tickets Declared"
                  value={notTitle}
                  onChange={(e) => setNotTitle(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white/40 dark:bg-slate-900/60 text-slate-700 dark:text-slate-300 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="font-bold block text-slate-400 mb-1">Notice Category</label>
                  <select
                    value={notCat}
                    onChange={(e) => setNotCat(e.target.value as any)}
                    className="w-full text-xs p-2.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white/40 dark:bg-slate-900/60 text-slate-700 dark:text-slate-300"
                  >
                    <option value="Exam">Exam</option>
                    <option value="Academic">Academic</option>
                    <option value="Results">Results</option>
                    <option value="General">General</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold block text-slate-400 mb-1">Critical Priority</label>
                  <div className="flex items-center gap-2 mt-2">
                    <input
                      type="checkbox"
                      id="not_important"
                      checked={notImportant}
                      onChange={(e) => setNotImportant(e.target.checked)}
                      className="w-4 h-4 text-brand-purple"
                    />
                    <label htmlFor="not_important" className="text-slate-500 font-semibold">
                      Pin to Top / Highlight
                    </label>
                  </div>
                </div>
              </div>

              <div>
                <label className="font-bold block text-slate-400 mb-1">Detailed Content</label>
                <textarea
                  required
                  rows={4}
                  placeholder="Enter details about exam timetables, counseling lists, etc."
                  value={notContent}
                  onChange={(e) => setNotContent(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white/40 dark:bg-slate-900/60 text-slate-700 dark:text-slate-300 focus:outline-none leading-relaxed"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t">
                <button
                  type="button"
                  onClick={() => setNoticeFormOpen(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-teal-600 text-white font-bold rounded-lg"
                >
                  Broadcast Circular
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
export default AdminPanel;
