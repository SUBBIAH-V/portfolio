import React from 'react';
import { Github, Linkedin, Code2, Globe, Heart } from 'lucide-react';
import { Profile } from '../types';

interface FooterProps {
  profile?: Profile;
}

export const Footer: React.FC<FooterProps> = ({ profile }) => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-slate-900 bg-slate-950/80 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white">
              <Code2 className="w-5 h-5" />
            </div>
            <div>
              <span className="font-bold text-white">{profile?.name || 'Alex Rivera'}</span>
              <p className="text-xs text-slate-400">Public Engineer Portfolio & Content System</p>
            </div>
          </div>

          {/* Social Links */}
          <div className="flex items-center space-x-4">
            {profile?.github && (
              <a href={profile.github} target="_blank" rel="noreferrer" className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:border-slate-700 transition-all">
                <Github className="w-4 h-4" />
              </a>
            )}
            {profile?.linkedin && (
              <a href={profile.linkedin} target="_blank" rel="noreferrer" className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:border-slate-700 transition-all">
                <Linkedin className="w-4 h-4" />
              </a>
            )}
            {profile?.leetcode && (
              <a href={profile.leetcode} target="_blank" rel="noreferrer" className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:border-slate-700 transition-all" title="LeetCode">
                <Globe className="w-4 h-4" />
              </a>
            )}
          </div>

          <div className="text-xs text-slate-500 flex items-center gap-1">
            <span>© {currentYear} {profile?.name || 'Alex Rivera'}. Built with React, TS & Node.</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
