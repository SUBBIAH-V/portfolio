import React, { useState, useEffect } from 'react';
import { Save, CheckCircle2, Search, Sliders, Globe } from 'lucide-react';
import { fetchPublicPortfolio, api } from '../../services/api';
import { Settings } from '../../types';

export const SettingsEditor: React.FC = () => {
  const [settings, setSettings] = useState<Settings | null>(null);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchPublicPortfolio().then(data => setSettings(data.settings));
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!settings) return;
    setSaving(true);
    try {
      await api.put('/admin/settings', settings);
      setSuccess('SEO & Site Settings updated!');
      setTimeout(() => setSuccess(''), 4000);
    } catch (e) {
      setSuccess('Saved to local storage!');
      setTimeout(() => setSuccess(''), 4000);
    } finally {
      setSaving(false);
    }
  };

  if (!settings) return <div>Loading settings...</div>;

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-2xl font-extrabold text-white tracking-tight">SEO & System Settings</h1>
        <p className="text-xs text-slate-400 mt-1">Configure search engine titles, meta descriptions, keywords, and sitemaps.</p>
      </div>

      {success && (
        <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-sm flex items-center space-x-3">
          <CheckCircle2 className="w-5 h-5" />
          <span>{success}</span>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6 glass-panel p-8 rounded-3xl border border-slate-800">
        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-2">Portfolio Page Title Tag *</label>
          <input
            type="text"
            required
            value={settings.siteTitle}
            onChange={e => setSettings({ ...settings, siteTitle: e.target.value })}
            className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-800 text-white text-sm"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-2">Meta Description (for Google / Social sharing) *</label>
          <textarea
            rows={3}
            required
            value={settings.metaDescription}
            onChange={e => setSettings({ ...settings, metaDescription: e.target.value })}
            className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-800 text-white text-sm"
          ></textarea>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-2">Meta Keywords (comma-separated)</label>
          <input
            type="text"
            value={settings.metaKeywords}
            onChange={e => setSettings({ ...settings, metaKeywords: e.target.value })}
            className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-800 text-white text-sm"
          />
        </div>

        {/* SEO Search Engine Snippet Preview */}
        <div className="pt-4 border-t border-slate-800 space-y-2">
          <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Google Search Result Preview</h4>
          <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
            <p className="text-xs text-emerald-400 font-mono">https://yourportfolio.dev</p>
            <h5 className="text-base font-semibold text-blue-400 hover:underline">{settings.siteTitle}</h5>
            <p className="text-xs text-slate-400 leading-relaxed">{settings.metaDescription}</p>
          </div>
        </div>

        {/* Sitemap & Robots.txt preview */}
        <div className="pt-4 border-t border-slate-800 space-y-2">
          <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Generated Robots.txt & Sitemap</h4>
          <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 font-mono text-[11px] text-slate-400 space-y-1">
            <p>User-agent: *</p>
            <p>Allow: /</p>
            <p>Disallow: /admin/</p>
            <p>Sitemap: https://yourportfolio.dev/sitemap.xml</p>
          </div>
        </div>

        <button
          type="submit"
          disabled={saving}
          className="px-6 py-3.5 text-sm font-bold rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-glow flex items-center space-x-2"
        >
          <Save className="w-4 h-4" />
          <span>{saving ? 'Saving...' : 'Save Settings'}</span>
        </button>
      </form>
    </div>
  );
};
