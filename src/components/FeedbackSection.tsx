import React, { useState } from 'react';
import { useGTU } from '../context/GTUContext';
import { ThumbsUp, CheckCircle, HelpCircle, Star, MessageSquare } from 'lucide-react';

export const FeedbackSection: React.FC = () => {
  const { submitFeedback, departments } = useGTU();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [enrollmentNo, setEnrollmentNo] = useState('');
  const [selectedDept, setSelectedDept] = useState('it');
  const [selectedSem, setSelectedSem] = useState(1);
  const [rating, setRating] = useState(5);
  const [message, setMessage] = useState('');
  
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !message) return;

    submitFeedback({
      name,
      email,
      enrollmentNo: enrollmentNo || undefined,
      departmentId: selectedDept,
      semester: selectedSem,
      rating,
      message
    });

    setSubmitted(true);
    // Reset form fields
    setName('');
    setEmail('');
    setEnrollmentNo('');
    setMessage('');
    setRating(5);

    setTimeout(() => {
      setSubmitted(false);
    }, 5000);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Left side info block */}
      <div className="lg:col-span-1 glass-card rounded-2xl p-6 border border-slate-200 dark:border-slate-800 flex flex-col justify-between">
        <div>
          <div className="p-2.5 bg-brand-emerald/10 text-brand-emerald rounded-xl dark:bg-brand-emerald/20 w-max mb-4">
            <MessageSquare size={22} />
          </div>
          <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 font-display">
            Student Feedback & Requests
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">
            Your reviews and requests help our admin committee optimize the study files. Tell us:
          </p>
          <ul className="mt-4 space-y-2 text-xs text-slate-600 dark:text-slate-400">
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-brand-teal"></span>
              Is a file contains outdated syllabus?
            </li>
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-brand-teal"></span>
              Are any download files corrupted?
            </li>
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-brand-teal"></span>
              Request custom notes for missing codes.
            </li>
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-brand-teal"></span>
              Report general performance improvements.
            </li>
          </ul>
        </div>

        <div className="mt-6 p-4 bg-emerald-50/50 dark:bg-slate-900 rounded-xl border border-emerald-100/30 dark:border-slate-800 text-xs">
          <h4 className="font-semibold text-emerald-800 dark:text-emerald-400 flex items-center gap-1.5 mb-1">
            <HelpCircle size={14} /> Did You Know?
          </h4>
          <p className="text-slate-500 dark:text-slate-400 leading-normal">
            Approved student requests are typically reviewed and resolved by department moderators within 48 academic hours.
          </p>
        </div>
      </div>

      {/* Right side form */}
      <div className="lg:col-span-2 glass-card rounded-2xl p-6 border border-slate-200 dark:border-slate-800 relative overflow-hidden">
        {submitted ? (
          <div className="absolute inset-0 bg-white/95 dark:bg-slate-900/95 flex flex-col items-center justify-center text-center p-6 transition-all duration-300">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-4 dark:bg-emerald-950/40 dark:text-emerald-400">
              <CheckCircle size={36} />
            </div>
            <h4 className="text-lg font-bold text-slate-800 dark:text-slate-100">
              Feedback Successfully Submitted!
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 max-w-sm">
              Thank you for contributing your voice. Our moderators have received your report and logged your profile variables.
            </p>
          </div>
        ) : null}

        <h3 className="text-base font-bold text-slate-800 dark:text-slate-100 mb-4 font-display">
          Feedback Submission Portal
        </h3>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-slate-400 block mb-1">Your Full Name <span className="text-red-500">*</span></label>
              <input
                type="text"
                required
                placeholder="Enter your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/40 dark:bg-slate-900/60 focus:outline-none focus:ring-2 focus:ring-brand-emerald text-slate-700 dark:text-slate-300 transition-all"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-400 block mb-1">Email Address <span className="text-red-500">*</span></label>
              <input
                type="email"
                required
                placeholder="email@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/40 dark:bg-slate-900/60 focus:outline-none focus:ring-2 focus:ring-brand-emerald text-slate-700 dark:text-slate-300 transition-all"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-xs font-semibold text-slate-400 block mb-1">Enrollment No. (Optional)</label>
              <input
                type="text"
                maxLength={12}
                placeholder="12-digit enrollment code"
                value={enrollmentNo}
                onChange={(e) => setEnrollmentNo(e.target.value.replace(/\D/g, ''))}
                className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/40 dark:bg-slate-900/60 focus:outline-none focus:ring-2 focus:ring-brand-emerald text-slate-700 dark:text-slate-300 font-mono transition-all"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-400 block mb-1">Your Branch</label>
              <select
                value={selectedDept}
                onChange={(e) => setSelectedDept(e.target.value)}
                className="w-full text-xs p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/40 dark:bg-slate-900/60 focus:outline-none focus:ring-2 focus:ring-brand-emerald text-slate-700 dark:text-slate-300"
              >
                {departments.map(dept => (
                  <option key={dept.id} value={dept.id}>{dept.shortName} - {dept.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-400 block mb-1">Semester</label>
              <select
                value={selectedSem}
                onChange={(e) => setSelectedSem(parseInt(e.target.value))}
                className="w-full text-xs p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/40 dark:bg-slate-900/60 focus:outline-none focus:ring-2 focus:ring-brand-emerald text-slate-700 dark:text-slate-300"
              >
                {[1, 2, 3, 4, 5, 6].map(sem => (
                  <option key={sem} value={sem}>Semester {sem}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Star Rating Selection */}
          <div>
            <label className="text-xs font-semibold text-slate-400 block mb-1.5">Rate Study Material Quality</label>
            <div className="flex gap-1.5 items-center">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  type="button"
                  key={star}
                  onClick={() => setRating(star)}
                  className="p-1 rounded-md text-slate-300 hover:text-brand-orange transition-colors"
                >
                  <Star
                    size={24}
                    className={rating >= star ? 'text-brand-orange fill-brand-orange' : ''}
                  />
                </button>
              ))}
              <span className="text-xs text-slate-400 ml-2 font-mono">
                ({rating}/5 Rating Given)
              </span>
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-400 block mb-1">Your Detailed Message / Request <span className="text-red-500">*</span></label>
            <textarea
              required
              rows={4}
              placeholder="State the subject name, GTU code, or specific topic you are looking for, or list errors found in any uploaded syllabus..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/40 dark:bg-slate-900/60 focus:outline-none focus:ring-2 focus:ring-brand-emerald text-slate-700 dark:text-slate-300 transition-all leading-relaxed"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-gradient-to-r from-brand-teal to-brand-emerald text-white rounded-xl font-bold shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-1.5 text-xs uppercase tracking-wider"
          >
            <ThumbsUp size={14} /> Submit Feedback to Admin Board
          </button>
        </form>
      </div>
    </div>
  );
};
export default FeedbackSection;
