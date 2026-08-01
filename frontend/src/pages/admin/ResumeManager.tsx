import React, { useState, useEffect } from 'react';
import { Upload, FileText, Download, CheckCircle2, Eye } from 'lucide-react';
import { fetchPublicPortfolio, api, uploadFile } from '../../services/api';
import { Profile } from '../../types';

export const ResumeManager: React.FC = () => {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [uploading, setUploading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    fetchPublicPortfolio().then(data => setProfile(data.profile));
  }, []);

  const handleResumeUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0] && profile) {
      setUploading(true);
      const res = await uploadFile(e.target.files[0]);
      setUploading(false);

      if (res.url) {
        const updatedProfile = { ...profile, resumeUrl: res.url };
        setProfile(updatedProfile);
        try {
          await api.put('/admin/profile', updatedProfile);
          setSuccessMsg('Resume file uploaded and published successfully!');
        } catch (err) {
          setSuccessMsg('Resume updated in local mode!');
        }
        setTimeout(() => setSuccessMsg(''), 5000);
      }
    }
  };

  if (!profile) return <div>Loading...</div>;

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-2xl font-extrabold text-white tracking-tight">Resume File Manager</h1>
        <p className="text-xs text-slate-400 mt-1">Upload, replace, preview, and test your public resume download link.</p>
      </div>

      {successMsg && (
        <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-sm flex items-center space-x-3">
          <CheckCircle2 className="w-5 h-5" />
          <span>{successMsg}</span>
        </div>
      )}

      <div className="glass-panel p-8 rounded-3xl border border-slate-800 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-2xl bg-slate-900 border border-slate-800">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 rounded-2xl bg-blue-600/20 text-blue-400 flex items-center justify-center">
              <FileText className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Current Active Resume</h3>
              <p className="text-xs text-slate-400 font-mono mt-0.5">{profile.resumeUrl}</p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <a
              href={profile.resumeUrl}
              target="_blank"
              rel="noreferrer"
              className="px-4 py-2 text-xs font-semibold rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 flex items-center space-x-2"
            >
              <Eye className="w-4 h-4" />
              <span>Preview</span>
            </a>
            <a
              href={profile.resumeUrl}
              download
              className="px-4 py-2 text-xs font-bold rounded-xl bg-blue-600 text-white shadow-glow flex items-center space-x-2"
            >
              <Download className="w-4 h-4" />
              <span>Download</span>
            </a>
          </div>
        </div>

        <div className="border-2 border-dashed border-slate-800 rounded-3xl p-10 text-center space-y-4 hover:border-slate-700 transition-colors">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-slate-900 flex items-center justify-center text-blue-400 border border-slate-800">
            <Upload className="w-7 h-7" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-white">Upload / Replace Resume Document</h4>
            <p className="text-xs text-slate-400 mt-1">Supports PDF, DOCX files up to 10MB.</p>
          </div>

          <label className="inline-flex items-center space-x-2 px-6 py-3 text-xs font-bold rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-glow cursor-pointer">
            <Upload className="w-4 h-4" />
            <span>{uploading ? 'Uploading File...' : 'Select File to Upload'}</span>
            <input type="file" accept=".pdf,.doc,.docx" onChange={handleResumeUpload} className="hidden" />
          </label>
        </div>
      </div>
    </div>
  );
};
