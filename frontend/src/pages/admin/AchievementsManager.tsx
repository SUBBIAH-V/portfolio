import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Trophy } from 'lucide-react';
import { fetchPublicPortfolio, api } from '../../services/api';
import { Achievement } from '../../types';
import { Modal } from '../../components/Modal';

export const AchievementsManager: React.FC = () => {
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Achievement | null>(null);

  const [formData, setFormData] = useState<Achievement>({
    title: '',
    description: '',
    date: ''
  });

  useEffect(() => {
    fetchPublicPortfolio().then(data => setAchievements(data.achievements));
  }, []);

  const handleOpenAdd = () => {
    setEditingItem(null);
    setFormData({ title: '', description: '', date: '' });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item: Achievement) => {
    setEditingItem(item);
    setFormData(item);
    setIsModalOpen(true);
  };

  const handleDelete = async (id?: string) => {
    if (!id) return;
    if (confirm('Delete achievement record?')) {
      try { await api.delete(`/admin/achievements/${id}`); } catch (e) {}
      setAchievements(achievements.filter(a => a.id !== id && a._id !== id));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingItem) {
      const targetId = editingItem.id || editingItem._id;
      try { await api.put(`/admin/achievements/${targetId}`, formData); } catch (e) {}
      setAchievements(achievements.map(a => (a.id === targetId || a._id === targetId) ? { ...a, ...formData } : a));
    } else {
      try {
        const res = await api.post('/admin/achievements', formData);
        if (res.data?.data) {
          setAchievements([...achievements, res.data.data]);
        } else {
          setAchievements([...achievements, { ...formData, id: `ach-${Date.now()}` }]);
        }
      } catch (e) {
        setAchievements([...achievements, { ...formData, id: `ach-${Date.now()}` }]);
      }
    }
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">Achievements Manager</h1>
          <p className="text-xs text-slate-400 mt-1">Manage hackathon awards, honors, and recognitions.</p>
        </div>
        <button
          onClick={handleOpenAdd}
          className="px-4 py-2.5 text-xs font-bold rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-glow flex items-center space-x-2"
        >
          <Plus className="w-4 h-4" />
          <span>Add Achievement</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {achievements.map((item) => {
          const id = item.id || item._id;
          return (
            <div key={id} className="glass-panel p-5 rounded-2xl border border-slate-800 flex items-start justify-between">
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Trophy className="w-4 h-4 text-amber-400" />
                  <h4 className="text-base font-bold text-white">{item.title}</h4>
                </div>
                <p className="text-xs text-slate-400">{item.description}</p>
                {item.date && <span className="text-[11px] font-semibold text-blue-400">{item.date}</span>}
              </div>

              <div className="flex items-center space-x-1">
                <button onClick={() => handleOpenEdit(item)} className="p-2 text-slate-400 hover:text-white"><Edit2 className="w-4 h-4" /></button>
                <button onClick={() => handleDelete(id)} className="p-2 text-slate-400 hover:text-red-400"><Trash2 className="w-4 h-4" /></button>
              </div>
            </div>
          );
        })}
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingItem ? 'Edit Achievement' : 'Add Achievement'}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-2">Achievement Title *</label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={e => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-800 text-white text-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-2">Description *</label>
            <textarea
              rows={3}
              required
              value={formData.description}
              onChange={e => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-800 text-white text-sm"
            ></textarea>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-2">Year / Date</label>
            <input
              type="text"
              value={formData.date}
              onChange={e => setFormData({ ...formData, date: e.target.value })}
              className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-800 text-white text-sm"
            />
          </div>

          <div className="flex justify-end space-x-3 pt-4 border-t border-slate-800">
            <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2.5 text-xs font-semibold rounded-xl bg-slate-800 text-slate-300">
              Cancel
            </button>
            <button type="submit" className="px-5 py-2.5 text-xs font-bold rounded-xl bg-blue-600 text-white shadow-glow">
              Save Achievement
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
