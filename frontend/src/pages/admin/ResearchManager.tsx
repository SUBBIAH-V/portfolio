import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, BookOpen } from 'lucide-react';
import { fetchPublicPortfolio, api } from '../../services/api';
import { Research } from '../../types';
import { Modal } from '../../components/Modal';

export const ResearchManager: React.FC = () => {
  const [research, setResearch] = useState<Research[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Research | null>(null);

  const [formData, setFormData] = useState<Research>({
    title: '',
    abstract: '',
    publisher: '',
    doi: '',
    publicationLink: '',
    date: ''
  });

  useEffect(() => {
    fetchPublicPortfolio().then(data => setResearch(data.research));
  }, []);

  const handleOpenAdd = () => {
    setEditingItem(null);
    setFormData({ title: '', abstract: '', publisher: '', doi: '', publicationLink: '', date: '' });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item: Research) => {
    setEditingItem(item);
    setFormData(item);
    setIsModalOpen(true);
  };

  const handleDelete = async (id?: string) => {
    if (!id) return;
    if (confirm('Delete research publication entry?')) {
      try { await api.delete(`/admin/research/${id}`); } catch (e) {}
      setResearch(research.filter(r => r.id !== id && r._id !== id));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingItem) {
      const targetId = editingItem.id || editingItem._id;
      try { await api.put(`/admin/research/${targetId}`, formData); } catch (e) {}
      setResearch(research.map(r => (r.id === targetId || r._id === targetId) ? { ...r, ...formData } : r));
    } else {
      try {
        const res = await api.post('/admin/research', formData);
        if (res.data?.data) {
          setResearch([...research, res.data.data]);
        } else {
          setResearch([...research, { ...formData, id: `res-${Date.now()}` }]);
        }
      } catch (e) {
        setResearch([...research, { ...formData, id: `res-${Date.now()}` }]);
      }
    }
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">Research & Publications Manager</h1>
          <p className="text-xs text-slate-400 mt-1">Manage academic papers, technical journals, DOI links, and abstracts.</p>
        </div>
        <button
          onClick={handleOpenAdd}
          className="px-4 py-2.5 text-xs font-bold rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-glow flex items-center space-x-2"
        >
          <Plus className="w-4 h-4" />
          <span>Add Research</span>
        </button>
      </div>

      <div className="space-y-4">
        {research.map((item) => {
          const id = item.id || item._id;
          return (
            <div key={id} className="glass-panel p-6 rounded-2xl border border-slate-800 flex items-start justify-between gap-4">
              <div className="space-y-2 flex-1">
                <h4 className="text-lg font-bold text-white">{item.title}</h4>
                <p className="text-xs text-slate-400 leading-relaxed">{item.abstract}</p>
                <div className="flex flex-wrap items-center space-x-4 text-xs text-slate-500 pt-1">
                  <span>Publisher: <strong className="text-slate-300">{item.publisher}</strong></span>
                  {item.doi && <span>DOI: {item.doi}</span>}
                  {item.date && <span>Date: {item.date}</span>}
                </div>
              </div>

              <div className="flex items-center space-x-1">
                <button onClick={() => handleOpenEdit(item)} className="p-2 text-slate-400 hover:text-white"><Edit2 className="w-4 h-4" /></button>
                <button onClick={() => handleDelete(id)} className="p-2 text-slate-400 hover:text-red-400"><Trash2 className="w-4 h-4" /></button>
              </div>
            </div>
          );
        })}
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingItem ? 'Edit Research Paper' : 'Add Research Paper'}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-2">Paper Title *</label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={e => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-800 text-white text-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-2">Abstract Summary *</label>
            <textarea
              rows={4}
              required
              value={formData.abstract}
              onChange={e => setFormData({ ...formData, abstract: e.target.value })}
              className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-800 text-white text-sm"
            ></textarea>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-2">Publisher (e.g. IEEE / ACM)</label>
              <input
                type="text"
                value={formData.publisher}
                onChange={e => setFormData({ ...formData, publisher: e.target.value })}
                className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-800 text-white text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-2">Publication Date</label>
              <input
                type="text"
                value={formData.date}
                onChange={e => setFormData({ ...formData, date: e.target.value })}
                className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-800 text-white text-sm"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-2">DOI Reference Number</label>
            <input
              type="text"
              value={formData.doi}
              onChange={e => setFormData({ ...formData, doi: e.target.value })}
              className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-800 text-white text-sm"
            />
          </div>

          <div className="flex justify-end space-x-3 pt-4 border-t border-slate-800">
            <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2.5 text-xs font-semibold rounded-xl bg-slate-800 text-slate-300">
              Cancel
            </button>
            <button type="submit" className="px-5 py-2.5 text-xs font-bold rounded-xl bg-blue-600 text-white shadow-glow">
              Save Research
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
