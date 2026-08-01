import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Sun, Moon, FileText, Menu, X, Code2 } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

interface NavbarProps {
  resumeUrl?: string;
  name?: string;
}

export const Navbar: React.FC<NavbarProps> = ({ resumeUrl = '#resume', name = 'Alex Rivera' }) => {
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Projects', path: '/#projects' },
    { name: 'Experience', path: '/#experience' },
    { name: 'Skills', path: '/#skills' },
    { name: 'Certifications', path: '/#certifications' },
    { name: 'Research', path: '/#research' },
    { name: 'Contact', path: '/#contact' },
  ];

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      scrolled ? 'glass-panel py-3 shadow-xl' : 'bg-transparent py-5'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Brand Logo */}
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-glow group-hover:scale-105 transition-transform">
              <Code2 className="w-6 h-6" />
            </div>
            <div>
              <span className="text-lg font-bold tracking-tight text-white group-hover:text-blue-400 transition-colors">
                {name}
              </span>
              <span className="block text-xs text-slate-400 font-mono">/ portfolio</span>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center space-x-1 glass-panel px-4 py-1.5 rounded-full">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.path;
              return (
                <a
                  key={link.name}
                  href={link.path}
                  className={`px-4 py-2 text-sm font-medium rounded-full transition-all ${
                    isActive 
                      ? 'text-white bg-blue-600/30 border border-blue-500/40 shadow-sm' 
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
                  }`}
                >
                  {link.name}
                </a>
              );
            })}
          </div>

          {/* Right Action Controls */}
          <div className="hidden md:flex items-center space-x-3">
            <button
              onClick={toggleTheme}
              className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800 text-slate-300 hover:text-white hover:border-slate-700 transition-all"
              title="Toggle Theme"
            >
              {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-indigo-400" />}
            </button>

            <a
              href={resumeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-2 px-4 py-2.5 text-sm font-semibold rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-glow hover:opacity-95 transition-all hover:scale-[1.02]"
            >
              <FileText className="w-4 h-4" />
              <span>Resume</span>
            </a>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center space-x-2">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-300"
            >
              {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden glass-panel mt-2 mx-4 p-4 rounded-2xl border border-slate-800 space-y-2">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.path}
              onClick={() => setMobileMenuOpen(false)}
              className="block px-4 py-2.5 text-sm font-medium text-slate-200 hover:bg-slate-800 rounded-xl"
            >
              {link.name}
            </a>
          ))}
          <a
            href={resumeUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center justify-center space-x-2 w-full mt-3 py-2.5 text-sm font-semibold rounded-xl bg-blue-600 text-white shadow-glow"
          >
            <FileText className="w-4 h-4" />
            <span>Download Resume</span>
          </a>
        </div>
      )}
    </nav>
  );
};
