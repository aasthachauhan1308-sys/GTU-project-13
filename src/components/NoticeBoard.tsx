import React, { useState } from 'react';
import { useGTU } from '../context/GTUContext';
import { Calendar, Megaphone, Bell, Info, ShieldAlert } from 'lucide-react';

export const NoticeBoard: React.FC = () => {
  const { notices } = useGTU();
  const [selectedCategory, setSelectedCategory] = useState<'All' | 'Exam' | 'Academic' | 'Results' | 'General'>('All');

  const categories: ('All' | 'Exam' | 'Academic' | 'Results' | 'General')[] = [
    'All',
    'Exam',
    'Academic',
    'Results',
    'General'
  ];

  const filteredNotices = notices.filter(
    notice => selectedCategory === 'All' || notice.category === selectedCategory
  );

  return (
    <div className="glass-card rounded-2xl p-6 shadow-sm border border-slate-200 dark:border-slate-800">
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-6">
        <div className="flex items-center gap-2.5">
          <div className="p-2 bg-brand-orange/10 text-brand-orange rounded-xl dark:bg-brand-orange/20">
            <Megaphone size={20} className="animate-pulse" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 font-display">
              GTU Circulars & Updates
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Live announcement feed from Gujarat Technological University
            </p>
          </div>
        </div>

        {/* Categories Tab Selector */}
        <div className="flex flex-wrap gap-1 p-1 bg-slate-100 dark:bg-slate-900 rounded-xl max-w-max self-start sm:self-center">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                selectedCategory === cat
                  ? 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 shadow-sm'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Notices List */}
      <div className="space-y-4">
        {filteredNotices.length > 0 ? (
          filteredNotices.map((notice, idx) => (
            <div
              key={notice.id || idx}
              className={`p-5 rounded-xl border transition-all duration-200 ${
                notice.isImportant
                  ? 'border-l-4 border-l-brand-orange border-brand-orange/20 bg-brand-orange/5 dark:bg-brand-orange/5'
                  : 'border-slate-100 dark:border-slate-800 bg-white/40 dark:bg-slate-900/40 hover:bg-white/70 dark:hover:bg-slate-900/60'
              }`}
            >
              <div className="flex justify-between items-start gap-4 flex-wrap mb-2">
                <div className="flex items-center gap-2">
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase ${
                      notice.category === 'Exam'
                        ? 'bg-red-50 text-red-600 dark:bg-red-950/30 dark:text-red-400'
                        : notice.category === 'Academic'
                        ? 'bg-teal-50 text-teal-600 dark:bg-teal-950/30 dark:text-teal-400'
                        : notice.category === 'Results'
                        ? 'bg-purple-50 text-purple-600 dark:bg-purple-950/30 dark:text-purple-400'
                        : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
                    }`}
                  >
                    {notice.category}
                  </span>
                  
                  {notice.isImportant && (
                    <span className="flex items-center gap-1 text-[10px] text-brand-orange font-bold font-mono tracking-wider animate-pulse">
                      <ShieldAlert size={12} /> CRITICAL UPDATE
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-1.5 text-xs text-slate-400 font-mono">
                  <Calendar size={13} />
                  <span>{notice.date}</span>
                </div>
              </div>

              <h4 className="text-sm font-semibold text-slate-800 dark:text-slate-100 mb-1.5">
                {notice.title}
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                {notice.content}
              </p>
            </div>
          ))
        ) : (
          <div className="text-center py-12 text-slate-400 border border-dashed border-slate-200 dark:border-slate-800 rounded-xl">
            <Bell className="mx-auto mb-2 text-slate-300" size={32} />
            <p className="text-sm font-semibold">No notices published in this category yet.</p>
            <p className="text-xs">Select another channel or check back later.</p>
          </div>
        )}
      </div>
    </div>
  );
};
