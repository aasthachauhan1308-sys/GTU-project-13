import React, { useState } from 'react';
import { StudyMaterial } from '../types';
import { useGTU } from '../context/GTUContext';
import { Bookmark, Download, Eye, Share2, Calendar, FileText, CheckCircle, X } from 'lucide-react';

interface MaterialCardProps {
  material: StudyMaterial;
}

export const MaterialCard: React.FC<MaterialCardProps> = ({ material }) => {
  const { preferences, toggleBookmark, addDownloadHistory, setActivePdfViewerItem } = useGTU();
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [showToast, setShowToast] = useState<'bookmark' | 'download' | 'share' | null>(null);

  const isBookmarked = preferences.bookmarks.includes(material.id);

  const handleDownload = () => {
    addDownloadHistory(material.id);
    triggerToast('download');
    
    if (material.pdfUrl) {
      window.open(material.pdfUrl, '_blank');
      return;
    }
    
    // Simulate downloading a file
    const element = document.createElement('a');
    const fileContent = material.previewContent || `GTU STUDY MATERIAL HUB\n\nTitle: ${material.title}\nSubject: ${material.subjectName} (${material.subjectCode})\nSemester: ${material.semester}\nSize: ${material.fileSize}\nDate: ${material.uploadDate}\n\nDisclaimer: This is a verified student resource from the GTU Study Material Hub.`;
    const file = new Blob([fileContent], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = `${material.title.replace(/\s+/g, '_')}_GTU_Sem${material.semester}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const handleShare = () => {
    const shareUrl = `${window.location.origin}/?material=${material.id}`;
    navigator.clipboard.writeText(shareUrl);
    triggerToast('share');
    setIsShareModalOpen(true);
  };

  const triggerToast = (type: 'bookmark' | 'download' | 'share') => {
    setShowToast(type);
    setTimeout(() => {
      setShowToast(null);
    }, 3000);
  };

  const handleBookmarkToggle = () => {
    toggleBookmark(material.id);
    if (!isBookmarked) {
      triggerToast('bookmark');
    }
  };

  return (
    <>
      <div className="glass-card rounded-2xl p-5 hover-glow transition-all duration-300 flex flex-col justify-between h-full group">
        <div>
          {/* Header */}
          <div className="flex justify-between items-start mb-3">
            <span className="text-xs font-mono font-semibold px-2.5 py-1 rounded-full bg-teal-50 text-teal-700 dark:bg-teal-950/40 dark:text-teal-300">
              {material.type}
            </span>
            <div className="flex gap-1">
              {material.isOfficial && (
                <span className="text-[10px] font-semibold tracking-wider text-emerald-600 dark:text-emerald-400 border border-emerald-300 dark:border-emerald-800 px-1.5 py-0.5 rounded uppercase flex items-center gap-1 bg-emerald-50 dark:bg-emerald-950/30">
                  <CheckCircle size={10} /> Verified
                </span>
              )}
              <button
                onClick={handleBookmarkToggle}
                className={`p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors ${
                  isBookmarked ? 'text-brand-orange' : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'
                }`}
                title={isBookmarked ? 'Remove bookmark' : 'Bookmark material'}
              >
                <Bookmark size={18} fill={isBookmarked ? 'currentColor' : 'none'} />
              </button>
            </div>
          </div>

          {/* Title & Subject */}
          <h4 className="text-base font-semibold text-slate-800 dark:text-slate-100 group-hover:text-brand-teal transition-colors line-clamp-2 min-h-[3rem]">
            {material.title}
          </h4>
          
          <div className="mt-2 text-xs text-slate-500 dark:text-slate-400">
            <p className="font-medium truncate">{material.subjectName}</p>
            <p className="font-mono mt-0.5">Code: {material.subjectCode} • Sem {material.semester}</p>
          </div>

          {/* Description */}
          <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 mt-3 leading-relaxed">
            {material.description || 'No additional description provided.'}
          </p>
        </div>

        {/* Footer */}
        <div className="mt-5 pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center text-xs">
          <div className="flex items-center gap-3 text-slate-400">
            <span className="flex items-center gap-1 font-mono">
              <Download size={13} /> {material.downloadCount}
            </span>
            <span>•</span>
            <span className="font-mono">{material.fileSize}</span>
          </div>
          
          <div className="flex gap-2">
            <button
              onClick={() => setActivePdfViewerItem({ type: 'material', id: material.id })}
              className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors flex items-center justify-center gap-1"
              title="Preview Material"
            >
              <Eye size={15} />
              <span className="hidden sm:inline font-medium">Preview</span>
            </button>
            
            <button
              onClick={handleDownload}
              className="px-3 py-1.5 rounded-lg bg-teal-600 hover:bg-teal-700 text-white font-medium shadow-sm transition-all hover:shadow flex items-center justify-center gap-1"
              title="Download PDF"
            >
              <Download size={15} />
              <span className="font-medium">PDF</span>
            </button>

            <button
              onClick={handleShare}
              className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors flex items-center justify-center"
              title="Share"
            >
              <Share2 size={15} />
            </button>
          </div>
        </div>
      </div>

      {/* Share Modal */}
      {isShareModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
          <div className="glass-card w-full max-w-md rounded-2xl overflow-hidden shadow-2xl p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-base font-semibold text-slate-800 dark:text-slate-100 flex items-center gap-2">
                <Share2 size={18} className="text-brand-teal" /> Share Study Material
              </h3>
              <button
                onClick={() => setIsShareModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X size={18} />
              </button>
            </div>
            
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-4 leading-relaxed">
              Share this study material with your fellow GTU classmates. Anyone with this link can preview and download these files directly!
            </p>

            <div className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-slate-400 block mb-1">Direct Share Link</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    readOnly
                    value={`${window.location.origin}/?material=${material.id}`}
                    className="flex-1 text-xs px-3 py-2 bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-600 dark:text-slate-300 focus:outline-none"
                  />
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(`${window.location.origin}/?material=${material.id}`);
                      triggerToast('share');
                    }}
                    className="px-3 py-2 text-xs bg-teal-600 text-white font-medium rounded-xl hover:bg-teal-700 transition-colors"
                  >
                    Copy Link
                  </button>
                </div>
              </div>

              <div className="pt-2 flex gap-2 justify-center">
                <a
                  href={`https://wa.me/?text=${encodeURIComponent(`Check out this study material: "${material.title}" for ${material.subjectName} on GTU Study Material Hub! ${window.location.origin}/?material=${material.id}`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 rounded-xl text-xs bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 font-semibold border border-emerald-100 dark:border-emerald-900/50 hover:bg-emerald-100 dark:hover:bg-emerald-900/30 flex items-center gap-1.5 flex-1 justify-center"
                >
                  WhatsApp
                </a>
                <a
                  href={`https://t.me/share/url?url=${encodeURIComponent(`${window.location.origin}/?material=${material.id}`)}&text=${encodeURIComponent(`GTU Study Material: ${material.title}`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 rounded-xl text-xs bg-sky-50 text-sky-700 dark:bg-sky-950/40 dark:text-sky-300 font-semibold border border-sky-100 dark:border-sky-900/50 hover:bg-sky-100 dark:hover:bg-sky-900/30 flex items-center gap-1.5 flex-1 justify-center"
                >
                  Telegram
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Notification Toast */}
      {showToast && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 bg-slate-900 text-white px-4 py-3 rounded-xl shadow-2xl border border-slate-800 text-xs animate-float-once max-w-sm">
          <CheckCircle size={16} className="text-emerald-400 shrink-0" />
          <span>
            {showToast === 'bookmark' && 'Added material to bookmarks!'}
            {showToast === 'download' && 'Starting PDF transmission... Logged in download history.'}
            {showToast === 'share' && 'Share link successfully copied to your clipboard!'}
          </span>
        </div>
      )}
    </>
  );
};
