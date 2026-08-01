import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  FolderGit2, Cpu, Award, Briefcase, Mail, Eye, 
  Plus, ExternalLink, ArrowUpRight, FileText, CheckCircle2 
} from 'lucide-react';
import { fetchAdminStats } from '../../services/api';
import { AdminStats } from '../../types';

export const DashboardOverview: React.FC = () => {
  const [stats, setStats] = useState<AdminStats | null>(null);

  useEffect(() => {
    fetchAdminStats().then(setStats);
  }, []);

  if (!stats) {
    return <div className="animate-pulse space-y-6">Loading dashboard statistics...</div>;
  }

  const statCards = [
    { title: 'Total Projects', value: stats.totalProjects, icon: FolderGit2, color: 'from-blue-600 to-indigo-600', link: '/admin/projects' },
    { title: 'Skills Catalog', value: stats.totalSkills, icon: Cpu, color: 'from-purple-600 to-pink-600', link: '/admin/skills' },
    { title: 'Certifications', value: stats.totalCertifications, icon: Award, color: 'from-amber-500 to-orange-600', link: '/admin/certifications' },
    { title: 'Experience Roles', value: stats.totalExperience, icon: Briefcase, color: 'from-emerald-600 to-teal-600', link: '/admin/experience' },
    { title: 'Contact Messages', value: stats.totalMessages, badge: stats.unreadMessages > 0 ? `${stats.unreadMessages} New` : null, icon: Mail, color: 'from-cyan-600 to-blue-600', link: '/admin/messages' },
    { title: 'Total Visitors (Est.)', value: stats.estimatedVisitors, icon: Eye, color: 'from-indigo-600 to-purple-600', link: '#' },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-extrabold text-white tracking-tight">Dashboard Overview</h1>
        <p className="text-xs text-slate-400 mt-1">Manage public portfolio content, monitor inquiries, and perform live updates.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {statCards.map((card, i) => {
          const Icon = card.icon;
          return (
            <Link
              key={i}
              to={card.link}
              className="glass-panel p-6 rounded-3xl border border-slate-800 hover:border-slate-700 transition-all flex flex-col justify-between group"
            >
              <div className="flex items-center justify-between">
                <div className={`w-12 h-12 rounded-2xl bg-gradient-to-tr ${card.color} flex items-center justify-center text-white shadow-glow`}>
                  <Icon className="w-6 h-6" />
                </div>
                {card.badge && (
                  <span className="px-2.5 py-1 text-xs font-bold rounded-full bg-blue-500 text-white animate-pulse">
                    {card.badge}
                  </span>
                )}
              </div>

              <div className="mt-6">
                <span className="text-3xl font-extrabold text-white group-hover:text-blue-400 transition-colors">
                  {card.value}
                </span>
                <p className="text-xs font-medium text-slate-400 mt-1">{card.title}</p>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Quick Action Shortcuts */}
      <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-4">
        <h3 className="text-sm font-bold text-white uppercase tracking-wider">Quick CMS Actions</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Link
            to="/admin/projects"
            className="flex items-center space-x-3 p-4 rounded-2xl bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-200 transition-all text-xs font-semibold"
          >
            <Plus className="w-4 h-4 text-blue-400" />
            <span>Add New Project</span>
          </Link>
          <Link
            to="/admin/skills"
            className="flex items-center space-x-3 p-4 rounded-2xl bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-200 transition-all text-xs font-semibold"
          >
            <Plus className="w-4 h-4 text-purple-400" />
            <span>Add Skill Tag</span>
          </Link>
          <Link
            to="/admin/resume"
            className="flex items-center space-x-3 p-4 rounded-2xl bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-200 transition-all text-xs font-semibold"
          >
            <FileText className="w-4 h-4 text-emerald-400" />
            <span>Update Resume File</span>
          </Link>
        </div>
      </div>
    </div>
  );
};
