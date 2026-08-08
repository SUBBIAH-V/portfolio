import React from 'react';
import { Github, Linkedin, Mail, Code2 } from 'lucide-react';
import { Profile } from '../types';

interface FooterProps {
  profile?: Profile;
}

export const Footer: React.FC<FooterProps> = ({ profile }) => {
  return (
    <footer className="border-t border-slate-900/80 bg-[#050811] py-12 relative z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Logo & Tagline */}
          <div className="flex items-center space-x-3 text-center md:text-left">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-cyan-500 via-blue-600 to-purple-600 flex items-center justify-center text-white font-bold shadow-glow">
              <Code2 className="w-5 h-5" />
            </div>
            <div>
              <span className="text-lg font-bold text-white tracking-tight">{profile?.name || 'Subbiah V.'}</span>
              <p className="text-xs text-slate-400">Building intelligent solutions with AI, data and code.</p>
            </div>
          </div>

          {/* Social Links */}
          <div className="flex items-center space-x-4">
            {profile?.github && (
              <a href={profile.github} target="_blank" rel="noreferrer" className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-cyan-400 hover:border-cyan-500/50 transition-all" title="GitHub">
                <Github className="w-4 h-4" />
              </a>
            )}
            {profile?.linkedin && (
              <a href={profile.linkedin} target="_blank" rel="noreferrer" className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-cyan-400 hover:border-cyan-500/50 transition-all" title="LinkedIn">
                <Linkedin className="w-4 h-4" />
              </a>
            )}
            {profile?.email && (
              <a href={`mailto:${profile.email}`} className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-cyan-400 hover:border-cyan-500/50 transition-all" title="Email">
                <Mail className="w-4 h-4" />
              </a>
            )}
          </div>

          {/* Copyright */}
          <div className="text-xs text-slate-400">
            <span>© 2026 {profile?.name || 'Subbiah V.'}. All rights reserved.</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
