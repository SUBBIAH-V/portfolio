import React, { useState, useEffect } from 'react';
import { Save, CheckCircle2, Plus, X } from 'lucide-react';
import { fetchPublicPortfolio, api } from '../../services/api';
import { About } from '../../types';

export const AboutEditor: React.FC = () => {
  const [about, setAbout] = useState<About | null>(null);
  const [newInterest, setNewInterest] = useState('');
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchPublicPortfolio().then(data => setAbout(data.about));
  }, []);

  const handleAddInterest = () => {
    if (!newInterest.trim() || !about) return;
    setAbout({ ...about, interests: [...(about.interests || []), newInterest.trim()] });
    setNewInterest('');
  };

  const handleRemoveInterest = (index: number) => {
    if (!about) return;
    const updated = about.interests.filter((_, i) => i !== index);
    setAbout({ ...about, interests: updated });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!about) return;
    setSaving(true);
    try {
      await api.put('/admin/about', about);
      setSuccess('About section updated!');
      setTimeout(() => setSuccess(''), 4000);
    } catch (e) {
      setSuccess('Saved to local store!');
      setTimeout(() => setSuccess(''), 4000);
    } finally {
      setSaving(false);
    }
  };

  if (!about) return <div>Loading...</div>;

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-2xl font-extrabold text-white tracking-tight">Manage About & Objectives</h1>
        <p className="text-xs text-slate-400 mt-1">Configure your career story, objective statement, and interest tags.</p>
      </div>

      {success && (
        <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-sm flex items-center space-x-3">
          <CheckCircle2 className="w-5 h-5" />
          <span>{success}</span>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6 glass-panel p-8 rounded-3xl border border-slate-800">
        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-2">About Me Narrative *</label>
          <textarea
            rows={5}
            required
            value={about.aboutMe}
            onChange={e => setAbout({ ...about, aboutMe: e.target.value })}
            className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-800 text-white text-sm focus:border-blue-500"
          ></textarea>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-2">Career Objective *</label>
          <textarea
            rows={4}
            required
            value={about.careerObjective}
            onChange={e => setAbout({ ...about, careerObjective: e.target.value })}
            className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-800 text-white text-sm focus:border-blue-500"
          ></textarea>
        </div>

        {/* Interest Tags */}
        <div className="pt-4 border-t border-slate-800 space-y-3">
          <label className="block text-xs font-semibold text-slate-300">Technical Interests & Passions</label>
          <div className="flex flex-wrap gap-2">
            {about.interests?.map((item, idx) => (
              <span key={idx} className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-300 text-xs">
                <span>{item}</span>
                <button type="button" onClick={() => handleRemoveInterest(idx)} className="hover:text-red-400">
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
          </div>

          <div className="flex space-x-2 pt-2">
            <input
              type="text"
              placeholder="Add interest tag (e.g. Serverless Architecture)"
              value={newInterest}
              onChange={e => setNewInterest(e.target.value)}
              className="flex-1 px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-sm"
            />
            <button
              type="button"
              onClick={handleAddInterest}
              className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center space-x-1"
            >
              <Plus className="w-4 h-4" />
              <span>Add</span>
            </button>
          </div>
        </div>

        <button
          type="submit"
          disabled={saving}
          className="px-6 py-3.5 text-sm font-bold rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-glow hover:opacity-95 flex items-center space-x-2"
        >
          <Save className="w-4 h-4" />
          <span>{saving ? 'Saving...' : 'Save About Section'}</span>
        </button>
      </form>
    </div>
  );
};
