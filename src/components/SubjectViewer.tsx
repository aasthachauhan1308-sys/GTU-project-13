import React, { useState } from 'react';
import { Subject, MaterialType } from '../types';
import { useGTU } from '../context/GTUContext';
import { MaterialCard } from './MaterialCard';
import { BookOpen, FileText, ArrowLeft, UploadCloud, ShieldQuestion, Award, CheckCircle } from 'lucide-react';

interface SubjectViewerProps {
  subjectCode: string;
  onBack: () => void;
  onNavigateToAdmin: () => void;
}

export const SubjectViewer: React.FC<SubjectViewerProps> = ({ subjectCode, onBack, onNavigateToAdmin }) => {
  const { subjects, materials, departments } = useGTU();
  
  // Find subject details
  const subject = subjects.find(sub => sub.code === subjectCode);
  const department = departments.find(d => d.id === subject?.departmentId);

  // Define tabs for the study material types requested by the user
  const materialTypes: MaterialType[] = [
    'Study Material',
    'Notes',
    'IMP Questions',
    'Question Bank',
    'Assignment',
    'Syllabus',
    'Reference Books'
  ];

  const [activeTab, setActiveTab] = useState<MaterialType>('Study Material');

  if (!subject) {
    return (
      <div className="p-8 text-center glass-card rounded-2xl border border-red-200">
        <p className="text-red-500 font-bold font-display">Subject Error</p>
        <p className="text-xs text-slate-500 mt-1">The requested subject with code {subjectCode} was not found.</p>
        <button onClick={onBack} className="mt-4 px-4 py-2 bg-slate-100 rounded-xl text-xs font-semibold">
          Go Back
        </button>
      </div>
    );
  }

  // Filter materials for this subject matching the active material type
  const filteredMaterials = materials.filter(
    mat => mat.subjectCode === subject.code && mat.type === activeTab
  );

  return (
    <div className="space-y-6">
      {/* Back & Breadcrumbs */}
      <div className="flex items-center gap-3">
        <button
          onClick={onBack}
          className="p-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition-colors"
        >
          <ArrowLeft size={16} />
        </button>
        <div className="text-xs text-slate-400 font-mono">
          <span>Departments</span> / <span className="uppercase">{department?.shortName || 'Common'}</span> / <span>Sem {subject.semester}</span> / <span className="font-semibold text-slate-600 dark:text-slate-300">{subject.name}</span>
        </div>
      </div>

      {/* Subject Header */}
      <div className="glass-card rounded-2xl p-6 border border-slate-200 dark:border-slate-800 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-brand-teal/10 text-brand-teal dark:bg-brand-teal/20">
              GTU CODE: {subject.code}
            </span>
            <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400">
              CREDITS: {subject.credits}
            </span>
            <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-brand-purple/10 text-brand-purple dark:bg-brand-purple/20">
              SEMESTER {subject.semester}
            </span>
          </div>
          
          <h2 className="text-xl md:text-2xl font-bold font-display text-slate-800 dark:text-slate-100 mt-2">
            {subject.name}
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Official GTU diploma syllabus study material hub • {department?.name || 'All Departments'}
          </p>
        </div>

        <button
          onClick={onNavigateToAdmin}
          className="px-4 py-2 bg-gradient-to-r from-brand-teal to-brand-emerald text-white text-xs font-semibold rounded-xl shadow-md hover:shadow-lg transition-all flex items-center gap-1.5 self-stretch md:self-center justify-center"
        >
          <UploadCloud size={14} /> Contribute Notes
        </button>
      </div>

      {/* Main Grid: Tabs & Content */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Left Side: Sidebar Tabs list */}
        <div className="lg:col-span-1 space-y-2">
          <div className="glass-card rounded-2xl p-4 border border-slate-200 dark:border-slate-800">
            <h3 className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-3 px-2">
              Syllabus Categories
            </h3>
            
            <nav className="space-y-1 max-h-[60vh] overflow-y-auto pr-1">
              {materialTypes.map(type => {
                // Count materials in this category for this subject code
                const count = materials.filter(m => m.subjectCode === subject.code && m.type === type).length;
                const isActive = activeTab === type;

                return (
                  <button
                    key={type}
                    onClick={() => setActiveTab(type)}
                    className={`w-full text-left px-3 py-2 rounded-xl text-xs font-semibold flex justify-between items-center transition-all ${
                      isActive
                        ? 'bg-gradient-to-r from-teal-50 to-emerald-50 dark:from-slate-800 dark:to-slate-700 text-brand-teal dark:text-teal-300 shadow-sm border border-teal-100/30 dark:border-teal-900/30'
                        : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50'
                    }`}
                  >
                    <span>{type}</span>
                    <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full ${
                      isActive
                        ? 'bg-teal-500 text-white'
                        : count > 0 
                          ? 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                          : 'bg-slate-100/50 dark:bg-slate-800/30 text-slate-400'
                    }`}>
                      {count}
                    </span>
                  </button>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Right Side: Tab Materials Display Panel */}
        <div className="lg:col-span-3 space-y-4">
          <div className="flex justify-between items-center px-1">
            <h3 className="text-sm font-bold text-slate-700 dark:text-slate-300 font-display">
              {activeTab} Listings
            </h3>
            <span className="text-xs text-slate-400 font-mono">
              Found {filteredMaterials.length} file(s)
            </span>
          </div>

          {filteredMaterials.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredMaterials.map(mat => (
                <MaterialCard key={mat.id} material={mat} />
              ))}
            </div>
          ) : (
            <div className="p-12 text-center glass-card rounded-2xl border border-dashed border-slate-200 dark:border-slate-800">
              <BookOpen className="mx-auto mb-3 text-slate-300 dark:text-slate-700" size={48} />
              <h4 className="text-base font-semibold text-slate-700 dark:text-slate-300">
                No {activeTab} Published Yet
              </h4>
              <p className="text-xs text-slate-400 mt-1 max-w-md mx-auto leading-relaxed">
                We are actively looking for high-quality syllabus materials, notes, lab manuals, and papers for <span className="font-semibold text-slate-600 dark:text-slate-300">{subject.name}</span>.
              </p>
              
              <div className="mt-6 flex flex-col sm:flex-row justify-center gap-3">
                <button
                  onClick={onNavigateToAdmin}
                  className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold rounded-xl shadow transition-colors flex items-center justify-center gap-1.5"
                >
                  <UploadCloud size={14} /> Be the First to Upload
                </button>
                
                <a
                  href="https://www.gtu.ac.in/Syllabus.aspx"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 text-xs font-semibold rounded-xl transition-colors flex items-center justify-center gap-1"
                >
                  Visit Official GTU Website
                </a>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
export default SubjectViewer;
