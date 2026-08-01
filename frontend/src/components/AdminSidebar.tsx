import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, User, Info, Cpu, Briefcase, FolderGit2, 
  Award, BookOpen, Trophy, FileText, Mail, Settings, ExternalLink, Globe
} from 'lucide-react';

interface AdminSidebarProps {
  unreadCount?: number;
}

export const AdminSidebar: React.FC<AdminSidebarProps> = ({ unreadCount = 0 }) => {
  const menuItems = [
    { name: 'Overview', path: '/admin/dashboard', icon: LayoutDashboard },
    { name: 'Profile', path: '/admin/profile', icon: User },
    { name: 'About', path: '/admin/about', icon: Info },
    { name: 'Skills', path: '/admin/skills', icon: Cpu },
    { name: 'Experience', path: '/admin/experience', icon: Briefcase },
    { name: 'Projects', path: '/admin/projects', icon: FolderGit2 },
    { name: 'Certifications', path: '/admin/certifications', icon: Award },
    { name: 'Research', path: '/admin/research', icon: BookOpen },
    { name: 'Achievements', path: '/admin/achievements', icon: Trophy },
    { name: 'Resume', path: '/admin/resume', icon: FileText },
    { name: 'Contact Messages', path: '/admin/messages', icon: Mail, badge: unreadCount },
    { name: 'Social & Links', path: '/admin/social', icon: Globe },
    { name: 'Settings', path: '/admin/settings', icon: Settings },
  ];

  return (
    <aside className="w-64 bg-slate-900/90 border-r border-slate-800 flex flex-col h-screen sticky top-0 z-40">
      {/* Brand & CMS Banner */}
      <div className="p-5 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-glow">
            <span className="font-extrabold text-sm">CMS</span>
          </div>
          <div>
            <h2 className="text-sm font-bold text-white tracking-tight">Admin CMS</h2>
            <p className="text-[11px] text-slate-400">Content Management</p>
          </div>
        </div>
      </div>

      {/* Navigation List */}
      <nav className="flex-1 overflow-y-auto p-4 space-y-1">
        <div className="px-3 py-1.5 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
          Content Sections
        </div>

        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.name}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30 font-semibold'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                }`
              }
            >
              <div className="flex items-center space-x-3">
                <Icon className="w-4 h-4" />
                <span>{item.name}</span>
              </div>
              {item.badge && item.badge > 0 ? (
                <span className="px-2 py-0.5 text-xs font-bold bg-blue-500 text-white rounded-full">
                  {item.badge}
                </span>
              ) : null}
            </NavLink>
          );
        })}
      </nav>

      {/* Public View Shortcut */}
      <div className="p-4 border-t border-slate-800">
        <a
          href="/"
          target="_blank"
          rel="noreferrer"
          className="flex items-center justify-center space-x-2 w-full py-2.5 text-xs font-semibold rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 transition-all border border-slate-700"
        >
          <ExternalLink className="w-3.5 h-3.5" />
          <span>View Public Site</span>
        </a>
      </div>
    </aside>
  );
};
