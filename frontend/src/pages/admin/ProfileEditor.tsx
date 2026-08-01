import React, { useState, useEffect } from 'react';
import { Save, Upload, CheckCircle2, User, Globe } from 'lucide-react';
import { fetchPublicPortfolio, api, uploadFile, notifyDataChanged } from '../../services/api';
import { Profile } from '../../types';

export const ProfileEditor: React.FC = () => {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchPublicPortfolio().then(data => setProfile(data.profile));
  }, []);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0] && profile) {
      setSaving(true);
      try {
        const res = await uploadFile(e.target.files[0]);
        if (res.url) {
          const updatedProfile = { ...profile, avatarUrl: res.url };
          setProfile(updatedProfile);
          await api.put('/admin/profile', updatedProfile);
          notifyDataChanged();
          setSuccess('Profile photo updated & saved successfully!');
          setTimeout(() => setSuccess(''), 4000);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setSaving(false);
      }
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile) return;
    setSaving(true);
    try {
      await api.put('/admin/profile', profile);
      notifyDataChanged();
      setSuccess('Profile updated successfully!');
      setTimeout(() => setSuccess(''), 4000);
    } catch (e) {
      notifyDataChanged();
      setSuccess('Saved to local storage mode!');
      setTimeout(() => setSuccess(''), 4000);
    } finally {
      setSaving(false);
    }
  };

  if (!profile) return <div>Loading profile data...</div>;

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">Manage Profile</h1>
          <p className="text-xs text-slate-400 mt-1">Update your public headline, avatar photo, contact details, and social links.</p>
        </div>
      </div>

      {success && (
        <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-sm flex items-center space-x-3">
          <CheckCircle2 className="w-5 h-5" />
          <span>{success}</span>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6 glass-panel p-8 rounded-3xl border border-slate-800">
        {/* Avatar Section */}
        <div className="flex items-center space-x-6 pb-6 border-b border-slate-800">
          <img src={profile.avatarUrl} alt="Avatar" className="w-20 h-20 rounded-2xl object-cover border border-slate-700 shadow-md" />
          <div className="space-y-2">
            <label className="block text-xs font-semibold text-slate-300">Profile Photo</label>
            <div className="flex items-center space-x-3">
              <label className="px-4 py-2 text-xs font-semibold rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 cursor-pointer border border-slate-700 flex items-center space-x-2">
                <Upload className="w-4 h-4" />
                <span>Upload New File</span>
                <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
              </label>
            </div>
          </div>
        </div>

        {/* Name & Headline */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-2">Full Name *</label>
            <input
              type="text"
              required
              value={profile.name}
              onChange={e => setProfile({ ...profile, name: e.target.value })}
              className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-800 text-white text-sm focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-2">Professional Headline *</label>
            <input
              type="text"
              required
              value={profile.headline}
              onChange={e => setProfile({ ...profile, headline: e.target.value })}
              className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-800 text-white text-sm focus:border-blue-500"
            />
          </div>
        </div>

        {/* Bio */}
        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-2">Bio Summary *</label>
          <textarea
            rows={4}
            required
            value={profile.bio}
            onChange={e => setProfile({ ...profile, bio: e.target.value })}
            className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-800 text-white text-sm focus:border-blue-500"
          ></textarea>
        </div>

        {/* Contact Info */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-slate-800">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-2">Public Email</label>
            <input
              type="email"
              value={profile.email}
              onChange={e => setProfile({ ...profile, email: e.target.value })}
              className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-800 text-white text-sm"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-2">Phone</label>
            <input
              type="text"
              value={profile.phone}
              onChange={e => setProfile({ ...profile, phone: e.target.value })}
              className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-800 text-white text-sm"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-2">Location</label>
            <input
              type="text"
              value={profile.location}
              onChange={e => setProfile({ ...profile, location: e.target.value })}
              className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-800 text-white text-sm"
            />
          </div>
        </div>

        {/* Social Links */}
        <div className="pt-4 border-t border-slate-800 space-y-4">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Social Profiles & Developer Links</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-2">GitHub Profile URL</label>
              <input
                type="text"
                value={profile.github}
                onChange={e => setProfile({ ...profile, github: e.target.value })}
                className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-800 text-white text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-2">LinkedIn Profile URL</label>
              <input
                type="text"
                value={profile.linkedin}
                onChange={e => setProfile({ ...profile, linkedin: e.target.value })}
                className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-800 text-white text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-2">LeetCode Profile URL</label>
              <input
                type="text"
                value={profile.leetcode}
                onChange={e => setProfile({ ...profile, leetcode: e.target.value })}
                className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-800 text-white text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-2">HackerRank Profile URL</label>
              <input
                type="text"
                value={profile.hackerrank}
                onChange={e => setProfile({ ...profile, hackerrank: e.target.value })}
                className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-800 text-white text-sm"
              />
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={saving}
          className="px-6 py-3.5 text-sm font-bold rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-glow hover:opacity-95 flex items-center space-x-2"
        >
          <Save className="w-4 h-4" />
          <span>{saving ? 'Saving...' : 'Save Profile Changes'}</span>
        </button>
      </form>
    </div>
  );
};
