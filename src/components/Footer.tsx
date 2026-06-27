import React from 'react';
import { GraduationCap, Github, Globe, Phone, Mail, MapPin } from 'lucide-react';

interface FooterProps {
  onNavigate: (tab: 'home' | 'papers' | 'notices' | 'feedback' | 'admin') => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer className="bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 py-12 px-6 mt-16 transition-colors duration-300">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
        
        {/* Col 1: Brand Info */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-brand-teal">
            <GraduationCap size={28} />
            <span className="text-base font-bold font-display text-slate-800 dark:text-slate-100 tracking-tight">
              GTU Study Material Hub
            </span>
          </div>
          <p className="text-xs leading-relaxed text-slate-500 dark:text-slate-400">
            A premium, high-fidelity academic workspace designed for Gujarat Technological University (GTU) diploma engineering students. Streamlining access to syllabus notes, past papers, and evaluation manuals.
          </p>
          <div className="flex gap-3 text-slate-400">
            <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="p-1.5 rounded-lg border hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
              <Github size={15} />
            </a>
            <a href="https://gtu.ac.in" target="_blank" rel="noopener noreferrer" className="p-1.5 rounded-lg border hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors" title="Official GTU Portal">
              <Globe size={15} />
            </a>
          </div>
        </div>

        {/* Col 2: Fast Nav Links */}
        <div>
          <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider mb-4 font-display">
            Fast Navigation
          </h4>
          <ul className="space-y-2.5 text-xs">
            <li>
              <button onClick={() => onNavigate('home')} className="hover:text-brand-teal transition-colors">
                Academic Portal (Home)
              </button>
            </li>
            <li>
              <button onClick={() => onNavigate('papers')} className="hover:text-brand-teal transition-colors">
                Past Examination Papers
              </button>
            </li>
            <li>
              <button onClick={() => onNavigate('notices')} className="hover:text-brand-teal transition-colors">
                Circular Notice Board
              </button>
            </li>
            <li>
              <button onClick={() => onNavigate('feedback')} className="hover:text-brand-teal transition-colors">
                Submit Feedback / Request Material
              </button>
            </li>
            <li>
              <button onClick={() => onNavigate('admin')} className="hover:text-brand-purple transition-colors font-semibold">
                Admin Panel Access
              </button>
            </li>
          </ul>
        </div>

        {/* Col 3: Academic Contacts */}
        <div>
          <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider mb-4 font-display">
            University Desk
          </h4>
          <ul className="space-y-3 text-xs text-slate-500 dark:text-slate-400">
            <li className="flex items-start gap-2">
              <MapPin size={15} className="text-brand-teal shrink-0 mt-0.5" />
              <span>Gujarat Technological University, Nr. Visat Three Roads, Sabarmati-Koba Highway, Chandkheda, Ahmedabad – 382424.</span>
            </li>
            <li className="flex items-center gap-2">
              <Phone size={15} className="text-brand-teal shrink-0" />
              <span>+91 79232 67500</span>
            </li>
            <li className="flex items-center gap-2">
              <Mail size={15} className="text-brand-teal shrink-0" />
              <span>info@gtu.ac.in</span>
            </li>
          </ul>
        </div>

        {/* Col 4: Important Disclaimer */}
        <div className="space-y-4">
          <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider font-display">
            Important Disclaimer
          </h4>
          <p className="text-[11px] leading-relaxed text-slate-400 dark:text-slate-500">
            This website, <strong>GTU Study Material Hub</strong>, is an independent educational tool designed to assist diploma students. It is <strong>NOT</strong> affiliated with, licensed by, or associated directly with Gujarat Technological University. All past exam papers are presented for self-testing purposes. Practice/Model papers are custom drafted by our academic committee and are explicitly labeled as such.
          </p>
        </div>

      </div>

      <div className="max-w-7xl mx-auto mt-10 pt-6 border-t border-slate-100 dark:border-slate-800 text-center text-[10px] text-slate-400">
        <p>© 2026 GTU Study Material Hub. Developed under creative licensing. All rights reserved.</p>
      </div>
    </footer>
  );
};
export default Footer;
