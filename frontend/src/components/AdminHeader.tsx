import React from 'react';
import { LogOut, Sun, Moon, ShieldCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

export const AdminHeader: React.FC = () => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="h-16 bg-slate-900/60 border-b border-slate-800 px-6 flex items-center justify-between sticky top-0 z-30 backdrop-blur-md">
      <div className="flex items-center space-x-2">
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Admin Session Active</span>
        </span>
      </div>

      <div className="flex items-center space-x-4">
        <button
          onClick={toggleTheme}
          className="p-2 rounded-xl bg-slate-800 border border-slate-700 text-slate-300 hover:text-white"
          title="Toggle Theme"
        >
          {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-indigo-400" />}
        </button>

        <div className="flex items-center space-x-3 pl-4 border-l border-slate-800">
          <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center font-bold text-xs text-white">
            {user?.username?.substring(0, 2).toUpperCase() || 'AD'}
          </div>
          <div className="hidden sm:block text-left">
            <p className="text-xs font-semibold text-white">{user?.username || 'Administrator'}</p>
            <p className="text-[10px] text-slate-400">Admin Role</p>
          </div>

          <button
            onClick={logout}
            className="p-2 rounded-xl bg-red-500/10 text-red-400 hover:bg-red-500/20 hover:text-red-300 border border-red-500/20 transition-all text-xs flex items-center gap-1.5 font-medium"
            title="Log Out"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Logout</span>
          </button>
        </div>
      </div>
    </header>
  );
};
