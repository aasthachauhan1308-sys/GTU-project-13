import React, { useState, useRef, useEffect } from 'react';
import { useGTU } from '../context/GTUContext';
import { Subject } from '../types';
import { Search, GraduationCap, ArrowRight, ShieldCheck, DownloadCloud, FileText, Sparkles } from 'lucide-react';

interface HeroSectionProps {
  onSelectSubject: (code: string) => void;
  onNavigateToTab: (tab: 'papers' | 'notices') => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onSelectSubject, onNavigateToTab }) => {
  const { subjects, departments, materials, examPapers } = useGTU();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Subject[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close search dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearchChange = (val: string) => {
    setQuery(val);
    if (!val.trim()) {
      setResults([]);
      setShowDropdown(false);
      return;
    }

    // Filter subjects by name, code, or department shortName
    const matched = subjects.filter(sub => {
      const dept = departments.find(d => d.id === sub.departmentId);
      return (
        sub.name.toLowerCase().includes(val.toLowerCase()) ||
        sub.code.includes(val) ||
        (dept && dept.name.toLowerCase().includes(val.toLowerCase())) ||
        (dept && dept.shortName.toLowerCase().includes(val.toLowerCase()))
      );
    });

    setResults(matched.slice(0, 6)); // Limit to top 6 results
    setShowDropdown(true);
  };

  return (
    <div className="relative py-12 md:py-20 px-6 overflow-hidden rounded-3xl bg-linear-to-br from-teal-500/10 via-emerald-500/5 to-purple-500/10 border border-slate-200/50 dark:border-slate-800/50">
      
      {/* Decorative backdrop glow */}
      <div className="absolute -top-24 -left-24 w-72 h-72 bg-brand-teal/20 rounded-full blur-3xl -z-10 animate-float"></div>
      <div className="absolute -bottom-24 -right-24 w-72 h-72 bg-brand-purple/10 rounded-full blur-3xl -z-10" style={{ animationDelay: '1.5s' }}></div>

      <div className="max-w-4xl mx-auto text-center space-y-6">
        
        {/* Sparkle Badge */}
        <div className="mx-auto max-w-max flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-teal-50 dark:bg-teal-950/40 text-brand-teal text-xs font-bold font-mono tracking-wider shadow-inner">
          <Sparkles size={14} className="animate-spin" style={{ animationDuration: '3s' }} />
          <span>GUJARAT TECHNOLOGICAL UNIVERSITY PORTAL</span>
        </div>

        {/* Hero Title */}
        <h1 className="text-3xl sm:text-5xl font-black font-display tracking-tight text-slate-800 dark:text-slate-100 leading-tight">
          GTU Study <span className="bg-gradient-to-r from-brand-teal via-brand-emerald to-brand-purple bg-clip-text text-transparent">Material Hub</span>
        </h1>

        {/* Subtitle */}
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
          The primary independent portal for GTU Diploma Engineering studies. Instantly search and download past exam papers, lecture notes, lab manuals, and syllabus files customized for all major departments.
        </p>

        {/* Dynamic Search Workspace with dropdown results */}
        <div className="relative max-w-2xl mx-auto" ref={dropdownRef}>
          <div className="relative flex items-center bg-white dark:bg-slate-900 shadow-xl rounded-2xl border border-slate-200/80 dark:border-slate-800 p-1">
            <Search className="text-slate-400 ml-3.5 shrink-0" size={18} />
            <input
              type="text"
              placeholder="Search Subject (e.g. DBMS, Maths, 4330701, civil notes)..."
              value={query}
              onChange={(e) => handleSearchChange(e.target.value)}
              onFocus={() => query.trim() && setShowDropdown(true)}
              className="w-full text-xs md:text-sm pl-2 pr-4 py-2 bg-transparent border-none text-slate-700 dark:text-slate-300 placeholder-slate-400 focus:outline-none focus:ring-0"
            />
            <button className="px-5 py-2.5 bg-gradient-to-r from-brand-teal to-brand-emerald text-white rounded-xl font-bold text-xs shadow hover:shadow-lg transition-all hidden sm:inline-flex items-center gap-1.5 shrink-0">
              Find Files <ArrowRight size={14} />
            </button>
          </div>

          {/* Floated Dropdown Results */}
          {showDropdown && results.length > 0 && (
            <div className="absolute top-full left-0 right-0 z-40 mt-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl p-2 max-h-80 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800/40">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest text-left p-2">
                Matching Syllabus Subjects
              </p>
              {results.map(sub => {
                const dept = departments.find(d => d.id === sub.departmentId);
                return (
                  <button
                    key={sub.id}
                    onClick={() => {
                      onSelectSubject(sub.code);
                      setQuery('');
                      setShowDropdown(false);
                    }}
                    className="w-full text-left p-3 hover:bg-slate-50 dark:hover:bg-slate-800/60 rounded-xl transition-colors flex justify-between items-center group"
                  >
                    <div>
                      <p className="text-xs font-bold text-slate-700 dark:text-slate-200 group-hover:text-brand-teal transition-colors">
                        {sub.name}
                      </p>
                      <p className="text-[10px] text-slate-400 font-mono mt-0.5">
                        Code: {sub.code} • Semester {sub.semester}
                      </p>
                    </div>
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-teal-50 dark:bg-teal-950/40 text-brand-teal uppercase">
                      {dept?.shortName || 'Common'}
                    </span>
                  </button>
                );
              })}
            </div>
          )}

          {showDropdown && results.length === 0 && (
            <div className="absolute top-full left-0 right-0 z-40 mt-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl p-6 text-center">
              <p className="text-xs font-bold text-slate-700 dark:text-slate-300">No subject matched "{query}"</p>
              <p className="text-[10px] text-slate-400 mt-1">Try searching by official 7-digit GTU code or simplified department terms.</p>
            </div>
          )}
        </div>

        {/* Academic statistics section */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto pt-6 border-t border-slate-200/30 dark:border-slate-800/30">
          {[
            { label: 'GTU Departments', val: departments.length.toString(), icon: ShieldCheck, color: 'text-brand-teal' },
            { label: 'Syllabus Subjects', val: subjects.length.toString(), icon: FileText, color: 'text-brand-purple' },
            { label: 'Uploaded Materials', val: materials.length.toString(), icon: DownloadCloud, color: 'text-brand-orange' },
            { label: 'Exam Papers', val: examPapers.length.toString(), icon: GraduationCap, color: 'text-brand-emerald' }
          ].map((stat, idx) => (
            <div key={idx} className="glass-card rounded-2xl p-4 border border-slate-200/20 dark:border-slate-800/20 flex flex-col items-center">
              <stat.icon className={`${stat.color} mb-1`} size={20} />
              <span className="text-lg md:text-xl font-bold text-slate-800 dark:text-slate-100 font-mono">
                {stat.val}
              </span>
              <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">
                {stat.label}
              </span>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
};
export default HeroSection;
