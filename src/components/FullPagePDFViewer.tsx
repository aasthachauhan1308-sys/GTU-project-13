import React, { useState, useRef, useEffect } from 'react';
import { useGTU } from '../context/GTUContext';
import { StudyMaterial, ExamPaper, LanguageType } from '../types';
import {
  ArrowLeft,
  ZoomIn,
  ZoomOut,
  Printer,
  Download,
  ChevronLeft,
  ChevronRight,
  Calendar,
  Award,
  CheckCircle,
  FileText,
  Bookmark,
  Share2,
  Maximize2,
  RotateCw,
  RefreshCw,
  BookOpen
} from 'lucide-react';

export const FullPagePDFViewer: React.FC = () => {
  const {
    activePdfViewerItem,
    setActivePdfViewerItem,
    materials,
    examPapers,
    departments,
    subjects,
    preferences,
    toggleBookmark,
    addDownloadHistory
  } = useGTU();

  const [zoom, setZoom] = useState<number>(100);
  const [rotation, setRotation] = useState<number>(0);
  const [activeLangMode, setActiveLangMode] = useState<LanguageType>('English');
  const [showToast, setShowToast] = useState<'bookmark' | 'share' | 'download' | null>(null);
  
  const iframeRef = useRef<HTMLIFrameElement>(null);

  // Scroll to top on load or document switch
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [activePdfViewerItem]);

  if (!activePdfViewerItem) return null;

  const { type, id } = activePdfViewerItem;

  // 1. Fetch Item Data
  let material: StudyMaterial | undefined;
  let paper: ExamPaper | undefined;

  if (type === 'material') {
    material = materials.find(m => m.id === id);
  } else {
    paper = examPapers.find(p => p.id === id);
  }

  const currentItem = material || paper;

  if (!currentItem) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center text-center p-8">
        <div className="p-4 bg-red-50 dark:bg-red-950/20 text-red-600 dark:text-red-400 rounded-2xl mb-4">
          <FileText size={48} />
        </div>
        <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">Document Not Found</h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 max-w-md">
          The study file or exam paper requested might have been deleted, moved, or is temporarily inaccessible.
        </p>
        <button
          onClick={() => setActivePdfViewerItem(null)}
          className="mt-6 px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white font-bold rounded-xl text-xs flex items-center gap-1.5"
        >
          <ArrowLeft size={14} /> Back to Hub
        </button>
      </div>
    );
  }

  // Common Metadata Lookups
  const department = departments.find(d => d.id === currentItem.departmentId);
  const subject = subjects.find(s => s.code === currentItem.subjectCode);

  const subjectCode = currentItem.subjectCode;
  const subjectName = currentItem.subjectName || subject?.name || 'GTU Course';
  const semester = currentItem.semester;
  const examType = type === 'paper' ? (paper?.type || 'Exam Paper') : (material?.type || 'Study Material');
  const year = type === 'paper' ? (paper?.year || 'Recent') : new Date(material?.uploadDate || '').getFullYear() || 'Recent';
  const title = type === 'material' ? (material?.title || '') : `${subjectName} ${examType} (${year})`;
  const pdfUrl = currentItem.pdfUrl;
  const isOfficial = currentItem.isOfficial;

  // Helper to safely extract title from a sibling item
  const getItemTitle = (item: StudyMaterial | ExamPaper) => {
    if ('title' in item) {
      return item.title;
    }
    const siblingExamType = item.type || 'Exam Paper';
    return `${item.subjectName} ${siblingExamType} (${item.year})`;
  };

  // Determine lists of siblings for Previous/Next Paper Navigation
  let siblingItems: (StudyMaterial | ExamPaper)[] = [];
  let currentIndex = -1;

  if (type === 'material') {
    // Filter materials by the same subject and same type (category)
    siblingItems = materials.filter(m => m.subjectCode === subjectCode && m.type === material?.type);
    currentIndex = siblingItems.findIndex(m => m.id === id);
  } else {
    // Filter exam papers by subject code if available, else by department & semester
    siblingItems = examPapers.filter(p => p.subjectCode === subjectCode);
    currentIndex = siblingItems.findIndex(p => p.id === id);
  }

  const hasPrevious = currentIndex > 0;
  const hasNext = currentIndex > -1 && currentIndex < siblingItems.length - 1;

  const handlePrevious = () => {
    if (hasPrevious) {
      const prevItem = siblingItems[currentIndex - 1];
      setActivePdfViewerItem({ type, id: prevItem.id });
    }
  };

  const handleNext = () => {
    if (hasNext) {
      const nextItem = siblingItems[currentIndex + 1];
      setActivePdfViewerItem({ type, id: nextItem.id });
    }
  };

  // Zoom Operations
  const handleZoomIn = () => {
    if (zoom < 180) setZoom(prev => prev + 10);
  };

  const handleZoomOut = () => {
    if (zoom > 60) setZoom(prev => prev - 10);
  };

  const handleResetZoom = () => {
    setZoom(100);
    setRotation(0);
  };

  const handleRotate = () => {
    setRotation(prev => (prev + 90) % 360);
  };

  // Toast Trigger Helper
  const triggerToast = (toastType: 'bookmark' | 'share' | 'download') => {
    setShowToast(toastType);
    setTimeout(() => {
      setShowToast(null);
    }, 3000);
  };

  // Bookmark Toggle
  const isBookmarked = type === 'material' ? preferences.bookmarks.includes(id) : false;
  const handleBookmarkToggle = () => {
    if (type === 'material') {
      toggleBookmark(id);
      triggerToast('bookmark');
    }
  };

  // Share direct link
  const handleShare = () => {
    const shareUrl = `${window.location.origin}/?material=${id}&type=${type}`;
    navigator.clipboard.writeText(shareUrl);
    triggerToast('share');
  };

  // Download Trigger
  const handleDownload = () => {
    addDownloadHistory(id);
    triggerToast('download');

    if (pdfUrl) {
      window.open(pdfUrl, '_blank');
      return;
    }

    const element = document.createElement('a');
    let downloadContent = '';
    let filename = '';

    if (type === 'material' && material) {
      downloadContent = material.previewContent || `GTU STUDY MATERIAL HUB\n\nTitle: ${material.title}\nSubject: ${material.subjectName} (${material.subjectCode})\nSemester: ${material.semester}\nSize: ${material.fileSize}\nDate: ${material.uploadDate}\n\nDisclaimer: This is a student resource from the GTU Study Material Hub.`;
      filename = `${material.title.replace(/\s+/g, '_')}_GTU_Sem${material.semester}.txt`;
    } else if (type === 'paper' && paper) {
      downloadContent = `GUJARAT TECHNOLOGICAL UNIVERSITY (GTU)\n`;
      downloadContent += `${paper.isOfficial ? 'OFFICIAL PAST PAPER' : 'PRACTICE / MODEL PAPER'}\n`;
      downloadContent += `==============================================\n`;
      downloadContent += `Subject Name: ${paper.subjectName}\n`;
      downloadContent += `Subject Code: ${paper.subjectCode}\n`;
      downloadContent += `Semester: ${paper.semester}\n`;
      downloadContent += `Year: ${paper.year}\n`;
      downloadContent += `Type: ${paper.type}\n`;
      downloadContent += `Language: ${paper.language}\n`;
      downloadContent += `==============================================\n\n`;

      paper.questions.forEach((q, idx) => {
        downloadContent += `${q.section} [${q.marks} Marks]\n`;
        downloadContent += `Question: ${q.text}\n`;
        if (q.textGuj) {
          downloadContent += `ગુજરાતીમાં: ${q.textGuj}\n`;
        }
        downloadContent += `----------------------------------------------\n`;
      });
      filename = `GTU_${paper.type.replace(/\s+/g, '_')}_${paper.subjectCode}_${paper.year}.txt`;
    }

    const file = new Blob([downloadContent], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = filename;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  // Print function
  const handlePrint = () => {
    if (pdfUrl) {
      const printWindow = window.open(pdfUrl, '_blank');
      if (printWindow) {
        printWindow.focus();
        printWindow.print();
      }
    } else {
      window.print();
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-slate-900 text-slate-100 font-sans">
      
      {/* -------------------------------------------------------------
          TOP BAR METADATA & BREADCRUMBS ABOVE PDF (Google Drive/GTUpedia Style)
          ------------------------------------------------------------- */}
      <div className="bg-slate-950 border-b border-slate-800 p-4 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          
          {/* Left Metadata & Title Block */}
          <div className="flex items-start gap-3">
            <button
              onClick={() => setActivePdfViewerItem(null)}
              className="p-2 rounded-xl bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-300 transition-colors shrink-0"
              title="Return to Hub"
            >
              <ArrowLeft size={16} />
            </button>
            
            <div className="min-w-0">
              {/* Hierarchical Breadcrumbs (Department, Semester, Subject, Code) */}
              <div className="flex flex-wrap items-center gap-1.5 text-[10px] font-mono text-slate-400">
                <span className="bg-slate-900 px-2 py-0.5 rounded font-semibold text-teal-400">
                  {department?.shortName || 'Common'} Branch
                </span>
                <span>/</span>
                <span>Sem {semester}</span>
                <span>/</span>
                <span className="truncate max-w-[120px] sm:max-w-[200px]">{subjectName}</span>
                <span>/</span>
                <span className="font-semibold text-brand-orange">{subjectCode}</span>
              </div>

              {/* Title & Badge */}
              <div className="flex items-center gap-2 mt-1 flex-wrap">
                <h2 className="text-sm sm:text-base font-bold text-slate-100 truncate max-w-[300px] sm:max-w-[500px]">
                  {title}
                </h2>
                <div className="flex gap-1 shrink-0">
                  <span className="text-[9px] font-bold font-mono px-2 py-0.5 rounded bg-brand-teal/20 text-brand-teal border border-brand-teal/30 uppercase">
                    {examType}
                  </span>
                  <span className="text-[9px] font-bold font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                    Year: {year}
                  </span>
                  {isOfficial && (
                    <span className="text-[9px] font-semibold text-emerald-400 border border-emerald-500/30 px-1.5 py-0.5 rounded uppercase bg-emerald-950/40 flex items-center gap-1">
                      <CheckCircle size={10} /> Verified GTU
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Right Toolbar Action Controls */}
          <div className="flex items-center gap-2 flex-wrap w-full md:w-auto justify-end">
            
            {/* Language switch for multilingual papers */}
            {type === 'paper' && paper && (
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-0.5 flex gap-0.5 text-xs mr-2 shrink-0">
                <button
                  onClick={() => setActiveLangMode('English')}
                  className={`px-2.5 py-1 rounded-lg font-semibold transition-colors ${
                    activeLangMode === 'English' ? 'bg-teal-600 text-white' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  English
                </button>
                <button
                  onClick={() => setActiveLangMode('Gujarati')}
                  className={`px-2.5 py-1 rounded-lg font-semibold transition-colors ${
                    activeLangMode === 'Gujarati' ? 'bg-teal-600 text-white' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Gujarati
                </button>
              </div>
            )}

            {/* Zoom controls */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-0.5 flex items-center text-xs mr-2 shrink-0">
              <button
                onClick={handleZoomOut}
                disabled={zoom <= 60}
                className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white disabled:opacity-30 transition-colors"
                title="Zoom Out"
              >
                <ZoomOut size={14} />
              </button>
              <span className="px-2 font-mono font-bold text-slate-300 select-none text-[10px] min-w-[40px] text-center">
                {zoom}%
              </span>
              <button
                onClick={handleZoomIn}
                disabled={zoom >= 180}
                className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white disabled:opacity-30 transition-colors"
                title="Zoom In"
              >
                <ZoomIn size={14} />
              </button>
              <button
                onClick={handleResetZoom}
                className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors border-l border-slate-800/80 ml-0.5"
                title="Reset Zoom"
              >
                <RefreshCw size={12} />
              </button>
              <button
                onClick={handleRotate}
                className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
                title="Rotate 90°"
              >
                <RotateCw size={12} />
              </button>
            </div>

            {/* Bookmark button for materials */}
            {type === 'material' && (
              <button
                onClick={handleBookmarkToggle}
                className={`p-2 rounded-xl border transition-colors ${
                  isBookmarked
                    ? 'bg-slate-900 border-brand-orange text-brand-orange'
                    : 'bg-slate-900 border-slate-800 hover:bg-slate-800 text-slate-300 hover:text-white'
                }`}
                title={isBookmarked ? 'Remove bookmark' : 'Bookmark material'}
              >
                <Bookmark size={15} fill={isBookmarked ? 'currentColor' : 'none'} />
              </button>
            )}

            {/* Share button */}
            <button
              onClick={handleShare}
              className="p-2 rounded-xl bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-300 hover:text-white transition-colors"
              title="Share Document Link"
            >
              <Share2 size={15} />
            </button>

            {/* Print button */}
            <button
              onClick={handlePrint}
              className="p-2 rounded-xl bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-300 hover:text-white transition-colors"
              title="Print Document"
            >
              <Printer size={15} />
            </button>

            {/* Download button */}
            <button
              onClick={handleDownload}
              className="px-4 py-2 bg-gradient-to-r from-brand-teal to-brand-emerald hover:brightness-110 text-white text-xs font-bold rounded-xl shadow-lg transition-all flex items-center gap-1.5 shrink-0"
              title="Download File"
            >
              <Download size={14} /> Download PDF
            </button>

          </div>
        </div>
      </div>

      {/* -------------------------------------------------------------
          NAVIGATOR: PREVIOUS PAPER AND NEXT PAPER BAR (Floating Sticky HUD)
          ------------------------------------------------------------- */}
      <div className="bg-slate-950/80 backdrop-blur-sm border-b border-slate-800/80 px-4 py-2 text-xs">
        <div className="max-w-7xl mx-auto flex justify-between items-center text-slate-400 font-medium">
          
          {/* Previous Button */}
          <button
            onClick={handlePrevious}
            disabled={!hasPrevious}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-left transition-all max-w-[45%] ${
              hasPrevious
                ? 'bg-slate-900 border-slate-800 text-slate-200 hover:bg-slate-800 hover:border-slate-700'
                : 'opacity-30 cursor-not-allowed border-slate-900 text-slate-600'
            }`}
          >
            <ChevronLeft size={14} className="shrink-0" />
            <div className="truncate">
              <span className="block text-[8px] font-mono text-slate-500 uppercase font-bold">PREVIOUS PAPER</span>
              <span className="block text-[10px] font-semibold truncate leading-tight">
                {hasPrevious ? getItemTitle(siblingItems[currentIndex - 1]) : 'First Paper reached'}
              </span>
            </div>
          </button>

          <span className="font-mono text-[10px] text-slate-500 shrink-0 select-none">
            Paper {currentIndex + 1} of {siblingItems.length}
          </span>

          {/* Next Button */}
          <button
            onClick={handleNext}
            disabled={!hasNext}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-right justify-end transition-all max-w-[45%] ${
              hasNext
                ? 'bg-slate-900 border-slate-800 text-slate-200 hover:bg-slate-800 hover:border-slate-700'
                : 'opacity-30 cursor-not-allowed border-slate-900 text-slate-600'
            }`}
          >
            <div className="truncate">
              <span className="block text-[8px] font-mono text-slate-500 uppercase font-bold">NEXT PAPER</span>
              <span className="block text-[10px] font-semibold truncate leading-tight">
                {hasNext ? getItemTitle(siblingItems[currentIndex + 1]) : 'Last Paper reached'}
              </span>
            </div>
            <ChevronRight size={14} className="shrink-0" />
          </button>

        </div>
      </div>

      {/* -------------------------------------------------------------
          PDF RENDERER EMBED AREA (WITH TRANSITION & SCALE)
          ------------------------------------------------------------- */}
      <div className="flex-1 overflow-auto p-4 sm:p-6 md:p-8 flex justify-center items-start bg-slate-900 min-h-[75vh]">
        
        <div
          className="w-full transition-transform duration-300"
          style={{
            transform: `scale(${zoom / 100}) rotate(${rotation}deg)`,
            transformOrigin: 'top center',
            maxWidth: '1000px',
            margin: '0 auto'
          }}
        >
          {/* If there is an actual PDF URL uploaded, show it in Google Drive / Standard iframe style */}
          {pdfUrl ? (
            <div className="w-full h-[78vh] bg-slate-950 rounded-2xl overflow-hidden shadow-2xl border border-slate-800/60 relative">
              <iframe
                ref={iframeRef}
                src={`${pdfUrl}#view=FitH&toolbar=0`}
                className="w-full h-full bg-white text-slate-900"
                title={title}
              />
            </div>
          ) : (
            /* -------------------------------------------------------------
                TEXT-BASED SIMULATED DOCUMENT / PAPER SHEET (Highly polished fallback!)
                ------------------------------------------------------------- */
            <div className="bg-white text-slate-900 p-8 sm:p-12 rounded-2xl shadow-2xl max-w-4xl mx-auto border border-slate-300 relative font-serif print:p-0 print:border-0 print:shadow-none min-h-[75vh]">
              
              {/* GTU Official Exam paper letterhead look for papers */}
              {type === 'paper' && paper ? (
                <div className="space-y-6">
                  {/* Paper Banner Header */}
                  <div className="text-center border-b-2 border-slate-950 pb-4 space-y-1">
                    <h1 className="text-sm sm:text-base font-bold tracking-wider uppercase font-sans">
                      GUJARAT TECHNOLOGICAL UNIVERSITY
                    </h1>
                    <p className="text-[10px] font-semibold text-slate-600 font-sans tracking-wide">
                      {paper.type.toUpperCase()} - {paper.year}
                    </p>
                    <div className="grid grid-cols-2 gap-4 text-[11px] font-sans font-medium text-left pt-3">
                      <div>
                        <p><span className="font-bold">Subject Code:</span> {paper.subjectCode}</p>
                        <p><span className="font-bold">Subject Name:</span> {paper.subjectName}</p>
                      </div>
                      <div className="text-right">
                        <p><span className="font-bold">Semester:</span> {paper.semester}</p>
                        <p><span className="font-bold">Total Marks:</span> 70</p>
                      </div>
                    </div>
                  </div>

                  {/* General Instructions */}
                  <div className="border border-slate-300 p-3 rounded-lg text-[10px] leading-relaxed font-sans bg-slate-50/50 space-y-1">
                    <p className="font-bold">Instructions:</p>
                    <ol className="list-decimal pl-4 space-y-0.5 text-slate-600">
                      <li>Attempt all questions as per requirements.</li>
                      <li>Make suitable assumptions wherever necessary.</li>
                      <li>Figures to the right indicate full marks.</li>
                      <li>English version is authoritative. Gujarati translations are for convenience only.</li>
                    </ol>
                  </div>

                  {/* Multilingual Questions */}
                  <div className="space-y-6 mt-6">
                    {paper.questions.map((q, idx) => {
                      const showGuj = activeLangMode === 'Gujarati' && q.textGuj;
                      return (
                        <div key={idx} className="border-b border-slate-100 pb-4 last:border-b-0">
                          <div className="flex justify-between items-start gap-4 mb-2">
                            <span className="text-xs font-bold font-sans text-teal-700 bg-teal-50 px-2 py-0.5 rounded">
                              {q.section}
                            </span>
                            <span className="text-xs font-bold font-sans text-slate-500 shrink-0">
                              [{q.marks} Marks]
                            </span>
                          </div>
                          <p className="text-xs leading-relaxed font-medium text-slate-800">
                            {showGuj ? q.textGuj : q.text}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ) : (
                /* Study Material fallback sheet */
                <div className="space-y-6">
                  <div className="border-b-2 border-slate-200 pb-4">
                    <span className="text-[10px] font-sans font-bold text-teal-600 uppercase tracking-widest block mb-1">
                      {material?.type || 'STUDY SYLLABUS REFERENCE'}
                    </span>
                    <h1 className="text-lg sm:text-xl font-bold font-sans text-slate-900 leading-tight">
                      {title}
                    </h1>
                    <p className="text-xs font-sans text-slate-500 mt-1">
                      Verified GTU diploma material directory file • Registered upload date: {material?.uploadDate || 'Active'}
                    </p>
                  </div>

                  {/* Description Box */}
                  <div className="p-4 bg-teal-50/50 border border-teal-100 rounded-xl">
                    <p className="text-xs font-sans font-bold text-teal-800 mb-1">Material Summary & Description</p>
                    <p className="text-xs leading-relaxed font-sans text-slate-600">
                      {material?.description || 'This document contains high-yield structural formulas, solved key numerical drafts, and short notes verified by subject matter experts.'}
                    </p>
                  </div>

                  {/* Core Material Content */}
                  <div className="space-y-4 pt-4">
                    <h3 className="text-sm font-bold font-sans text-slate-800 flex items-center gap-1.5 border-b border-slate-100 pb-2">
                      <BookOpen size={16} className="text-teal-600" /> Syllabus Unit Content Preview
                    </h3>

                    <div className="text-xs font-mono bg-slate-50 p-5 rounded-xl border border-slate-200 text-slate-700 leading-relaxed overflow-x-auto whitespace-pre-wrap max-h-[50vh]">
                      {material?.previewContent ? (
                        material.previewContent
                      ) : (
                        `========================================================================
GTU EXAM STUDY WORKSPACE PREVIEW SHEET
========================================================================

Course Subject Code : ${subjectCode}
Course Title        : ${subjectName}
Academic Semester   : Semester ${semester}
File Footprint Size : ${currentItem.fileSize}

This verified resource does not currently have detailed inline textbook contents registered. 
Our moderation team recommends utilizing the "Download PDF" action at the top bar 
to retrieve the complete textbook document, compiled handwritten sheets, or lab manuals.

------------------------------------------------------------------------
GTU Study Material Hub • Guiding diploma scholars to excellence.
------------------------------------------------------------------------`
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Verified Watermark footer */}
              <div className="mt-12 pt-6 border-t border-slate-200 flex justify-between items-center text-[10px] font-sans text-slate-400 font-medium">
                <span>GTU Study Material Portal Document Vault</span>
                <span className="flex items-center gap-1 text-teal-600 font-bold">
                  <CheckCircle size={12} /> SECURE & VERIFIED PREVIEW
                </span>
              </div>

            </div>
          )}
        </div>

      </div>

      {/* -------------------------------------------------------------
          NOTIFICATION TOAST NOTIFICATIONS
          ------------------------------------------------------------- */}
      {showToast && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 bg-slate-950 text-white px-4 py-3 rounded-xl shadow-2xl border border-slate-800 text-xs animate-float-once max-w-sm">
          <CheckCircle size={16} className="text-emerald-400 shrink-0" />
          <span>
            {showToast === 'bookmark' && (isBookmarked ? 'Added material to your Bookmarks!' : 'Removed from Bookmarks.')}
            {showToast === 'share' && 'Direct sharing URL successfully copied to clipboard!'}
            {showToast === 'download' && 'Document download initialized successfully.'}
          </span>
        </div>
      )}

    </div>
  );
};
