import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { FileText, Menu, X, Code2 } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

interface NavbarProps {
  resumeUrl?: string;
  name?: string;
}

export const Navbar: React.FC<NavbarProps> = ({ resumeUrl = '/resume.pdf', name = 'Subbiah V.' }) => {
  const { theme } = useTheme();
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);

      const sections = ['home', 'about', 'skills', 'experience', 'projects', 'research', 'certifications', 'achievements', 'contact'];
      const scrollPosition = window.scrollY + 200;

      for (const section of sections) {
        const el = document.getElementById(section);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', path: '#home', id: 'home' },
    { name: 'About', path: '#about', id: 'about' },
    { name: 'Skills', path: '#skills', id: 'skills' },
    { name: 'Experience', path: '#experience', id: 'experience' },
    { name: 'Projects', path: '#projects', id: 'projects' },
    { name: 'Research', path: '#research', id: 'research' },
    { name: 'Certifications', path: '#certifications', id: 'certifications' },
    { name: 'Achievements', path: '#achievements', id: 'achievements' },
    { name: 'Contact', path: '#contact', id: 'contact' },
  ];

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
      scrolled 
        ? 'glass-panel py-3 shadow-2xl border-b border-slate-800/80 bg-[#070a12]/90 backdrop-blur-xl' 
        : 'bg-transparent py-5'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Brand Logo */}
          <a href="#home" className="flex items-center space-x-3 group">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-cyan-500 via-blue-600 to-purple-600 flex items-center justify-center text-white shadow-glow group-hover:scale-105 transition-transform duration-300">
              <Code2 className="w-5 h-5" />
            </div>
            <div>
              <span className="text-lg font-extrabold tracking-tight text-white group-hover:text-cyan-400 transition-colors">
                {name}
              </span>
              <span className="block text-[10px] text-cyan-400 font-mono tracking-wider uppercase">AI & Data Science</span>
            </div>
          </a>

          {/* Desktop Nav Links */}
          <div className="hidden lg:flex items-center space-x-1 glass-panel px-3 py-1.5 rounded-full border border-slate-800/90 shadow-xl bg-slate-950/60">
            {navLinks.map((link) => {
              const isActive = activeSection === link.id;
              return (
                <a
                  key={link.name}
                  href={link.path}
                  className={`px-3.5 py-1.5 text-xs font-semibold rounded-full transition-all duration-300 ${
                    isActive 
                      ? 'text-white bg-gradient-to-r from-cyan-500/20 to-blue-600/30 border border-cyan-500/40 shadow-sm text-cyan-300' 
                      : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                  }`}
                >
                  {link.name}
                </a>
              );
            })}
          </div>

          {/* Right Action Button */}
          <div className="hidden md:flex items-center space-x-3">
            <a
              href={resumeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-2 px-5 py-2.5 text-xs font-bold rounded-xl bg-gradient-to-r from-cyan-500 via-blue-600 to-purple-600 text-white shadow-glow hover:opacity-95 transition-all hover:scale-[1.03]"
            >
              <FileText className="w-4 h-4" />
              <span>Download Resume</span>
            </a>
          </div>

          {/* Mobile Navigation Toggle */}
          <div className="lg:hidden flex items-center space-x-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-200"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden glass-panel mt-3 mx-4 p-5 rounded-3xl border border-slate-800/90 space-y-2 bg-[#090d16]/95 backdrop-blur-2xl shadow-2xl">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.path}
              onClick={() => setMobileMenuOpen(false)}
              className="block px-4 py-2.5 text-sm font-semibold text-slate-300 hover:text-cyan-400 hover:bg-slate-800/60 rounded-2xl transition-colors"
            >
              {link.name}
            </a>
          ))}
          <a
            href={resumeUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center justify-center space-x-2 w-full mt-4 py-3 text-xs font-bold rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-glow"
          >
            <FileText className="w-4 h-4" />
            <span>Download Resume</span>
          </a>
        </div>
      )}
    </nav>
  );
};
