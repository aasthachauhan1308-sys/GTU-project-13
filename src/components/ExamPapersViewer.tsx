import React, { useState } from 'react';
import { useGTU } from '../context/GTUContext';
import { ExamPaper, ExamPaperType, LanguageType } from '../types';
import { Download, Eye, Languages, Search, Calendar, BookOpen, AlertCircle, RefreshCw, X, GraduationCap, CheckCircle } from 'lucide-react';

export const ExamPapersViewer: React.FC = () => {
  const { examPapers, departments, subjects, setActivePdfViewerItem } = useGTU();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDept, setSelectedDept] = useState<string>('all');
  const [selectedSem, setSelectedSem] = useState<string>('all');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedLang, setSelectedLang] = useState<string>('all');

  const [showDownloadToast, setShowDownloadToast] = useState(false);

  const paperTypes: ExamPaperType[] = [
    'Winter Papers',
    'Summer Papers',
    'Mid Semester Papers',
    'Internal Test Papers',
    'Unit Test Papers',
    'Model Papers',
    'Practice Papers'
  ];

  // Filter papers
  const filteredPapers = examPapers.filter(paper => {
    const matchesSearch =
      paper.subjectName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      paper.subjectCode.includes(searchTerm);
    const matchesDept = selectedDept === 'all' || paper.departmentId === selectedDept || paper.departmentId === 'all';
    const matchesSem = selectedSem === 'all' || paper.semester.toString() === selectedSem;
    const matchesType = selectedType === 'all' || paper.type === selectedType;
    const matchesLang = selectedLang === 'all' || paper.language === selectedLang;
    
    return matchesSearch && matchesDept && matchesSem && matchesType && matchesLang;
  });

  const handleDownloadPaper = (paper: ExamPaper) => {
    setShowDownloadToast(true);
    setTimeout(() => setShowDownloadToast(false), 3000);

    if (paper.pdfUrl) {
      window.open(paper.pdfUrl, '_blank');
      return;
    }

    // Dynamic text download
    const element = document.createElement('a');
    let content = `GUJARAT TECHNOLOGICAL UNIVERSITY (GTU)\n`;
    content += `${paper.isOfficial ? 'OFFICIAL PAST PAPER' : 'PRACTICE / MODEL PAPER'}\n`;
    content += `==============================================\n`;
    content += `Subject Name: ${paper.subjectName}\n`;
    content += `Subject Code: ${paper.subjectCode}\n`;
    content += `Semester: ${paper.semester}\n`;
    content += `Year: ${paper.year}\n`;
    content += `Type: ${paper.type}\n`;
    content += `Language: ${paper.language}\n`;
    content += `==============================================\n\n`;

    paper.questions.forEach((q, idx) => {
      content += `${q.section} [${q.marks} Marks]\n`;
      content += `Question: ${q.text}\n`;
      if (q.textGuj) {
        content += `ગુજરાતીમાં: ${q.textGuj}\n`;
      }
      content += `----------------------------------------------\n`;
    });

    const file = new Blob([content], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = `GTU_${paper.type.replace(/\s+/g, '_')}_${paper.subjectCode}_${paper.year}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const handleResetFilters = () => {
    setSearchTerm('');
    setSelectedDept('all');
    setSelectedSem('all');
    setSelectedType('all');
    setSelectedLang('all');
  };

  return (
    <div className="space-y-6">
      {/* Title block */}
      <div>
        <h2 className="text-xl md:text-2xl font-bold font-display text-slate-800 dark:text-slate-100 flex items-center gap-2">
          <GraduationCap className="text-brand-emerald" size={26} />
          GTU Exam Question Papers
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Access authentic Gujarat Technological University past papers or practice high-quality model papers in Gujarati & English.
        </p>
      </div>

      {/* Filter and Search Box */}
      <div className="glass-card rounded-2xl p-5 border border-slate-200 dark:border-slate-800 space-y-4">
        {/* Row 1: Search */}
        <div className="relative">
          <Search className="absolute left-3.5 top-3 text-slate-400" size={18} />
          <input
            type="text"
            placeholder="Search by Subject Name, GTU Subject Code..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-emerald text-slate-700 dark:text-slate-300 transition-all"
          />
        </div>

        {/* Row 2: Select Dropdowns */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          <div>
            <label className="text-[10px] font-bold text-slate-400 block mb-1">Department</label>
            <select
              value={selectedDept}
              onChange={(e) => setSelectedDept(e.target.value)}
              className="w-full p-2 text-xs rounded-lg border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900 text-slate-700 dark:text-slate-300"
            >
              <option value="all">All Departments</option>
              {departments.map(dept => (
                <option key={dept.id} value={dept.id}>{dept.shortName} - {dept.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-[10px] font-bold text-slate-400 block mb-1">Semester</label>
            <select
              value={selectedSem}
              onChange={(e) => setSelectedSem(e.target.value)}
              className="w-full p-2 text-xs rounded-lg border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900 text-slate-700 dark:text-slate-300"
            >
              <option value="all">All Semesters</option>
              {[1, 2, 3, 4, 5, 6].map(sem => (
                <option key={sem} value={sem.toString()}>Semester {sem}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-[10px] font-bold text-slate-400 block mb-1">Paper Type</label>
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="w-full p-2 text-xs rounded-lg border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900 text-slate-700 dark:text-slate-300"
            >
              <option value="all">All Paper Types</option>
              {paperTypes.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-[10px] font-bold text-slate-400 block mb-1">Language</label>
            <select
              value={selectedLang}
              onChange={(e) => setSelectedLang(e.target.value)}
              className="w-full p-2 text-xs rounded-lg border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900 text-slate-700 dark:text-slate-300"
            >
              <option value="all">Any Language</option>
              <option value="English">English Only</option>
              <option value="Gujarati">Gujarati Only</option>
            </select>
          </div>

          <div className="flex items-end">
            <button
              onClick={handleResetFilters}
              className="w-full py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 text-xs font-semibold rounded-lg flex items-center justify-center gap-1.5 transition-colors"
            >
              <RefreshCw size={13} /> Reset Filters
            </button>
          </div>
        </div>
      </div>

      {/* Grid List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredPapers.length > 0 ? (
          filteredPapers.map(paper => {
            const dept = departments.find(d => d.id === paper.departmentId);
            return (
              <div
                key={paper.id}
                className="glass-card rounded-2xl p-5 border border-slate-200 dark:border-slate-800 hover-glow transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  <div className="flex justify-between items-start mb-3">
                    <span className="text-xs font-mono font-bold text-brand-emerald bg-brand-emerald/10 px-2.5 py-1 rounded-full dark:bg-brand-emerald/20">
                      {paper.type} ({paper.year})
                    </span>
                    
                    {paper.isOfficial ? (
                      <span className="text-[10px] font-semibold tracking-wider text-emerald-600 dark:text-emerald-400 border border-emerald-300 dark:border-emerald-800 px-1.5 py-0.5 rounded uppercase flex items-center gap-1 bg-emerald-50 dark:bg-emerald-950/30">
                        <CheckCircle size={10} /> Official GTU Paper
                      </span>
                    ) : (
                      <span className="text-[10px] font-semibold tracking-wider text-orange-600 dark:text-orange-400 border border-orange-300 dark:border-orange-800 px-1.5 py-0.5 rounded uppercase bg-orange-50 dark:bg-orange-950/30">
                        Practice/Model Paper
                      </span>
                    )}
                  </div>

                  <h3 className="text-base font-bold text-slate-800 dark:text-slate-100 leading-snug line-clamp-1">
                    {paper.subjectName}
                  </h3>
                  
                  <div className="mt-2 space-y-1 font-mono text-xs text-slate-500 dark:text-slate-400">
                    <p>GTU Code: {paper.subjectCode} • Semester {paper.semester}</p>
                    <p>Department: {dept ? dept.name : 'All Departments / Common'}</p>
                    <p className="flex items-center gap-1">
                      <Languages size={13} className="text-slate-400" /> Paper Language: <span className="font-semibold text-slate-600 dark:text-slate-300">{paper.language}</span>
                    </p>
                  </div>
                </div>

                <div className="mt-6 pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center text-xs">
                  <span className="text-slate-400 font-mono">Size: {paper.fileSize}</span>
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        setActivePdfViewerItem({ type: 'paper', id: paper.id });
                      }}
                      className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 font-semibold flex items-center gap-1 transition-colors"
                    >
                      <Eye size={14} /> Exam View
                    </button>
                    <button
                      onClick={() => handleDownloadPaper(paper)}
                      className="px-3 py-1.5 rounded-lg bg-teal-600 hover:bg-teal-700 text-white font-semibold flex items-center gap-1 transition-colors shadow-sm"
                    >
                      <Download size={14} /> Download PDF
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="col-span-1 md:col-span-2 p-12 text-center glass-card rounded-2xl border border-dashed border-slate-200 dark:border-slate-800">
            <BookOpen className="mx-auto mb-3 text-slate-300" size={48} />
            <h4 className="text-base font-semibold text-slate-700 dark:text-slate-300">
              No Question Papers Matched
            </h4>
            <p className="text-xs text-slate-400 mt-1">
              Adjust search keywords or select other filters to fetch additional academic papers.
            </p>
          </div>
        )}
      </div>

      {/* Global alert toast */}
      {showDownloadToast && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 bg-slate-900 text-white px-4 py-3 rounded-xl shadow-2xl border border-slate-800 text-xs animate-float-once max-w-sm">
          <CheckCircle size={16} className="text-emerald-400 shrink-0" />
          <span>Starting PDF compilation... Saved in download history.</span>
        </div>
      )}
    </div>
  );
};
export default ExamPapersViewer;
