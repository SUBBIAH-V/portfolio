import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Briefcase } from 'lucide-react';
import { fetchPublicPortfolio, api } from '../../services/api';
import { Experience } from '../../types';
import { Modal } from '../../components/Modal';

export const ExperienceManager: React.FC = () => {
  const [experience, setExperience] = useState<Experience[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingExp, setEditingExp] = useState<Experience | null>(null);

  const [formData, setFormData] = useState<Experience>({
    company: '',
    position: '',
    duration: '',
    location: '',
    description: '',
    technologies: []
  });
  const [techInput, setTechInput] = useState('');

  useEffect(() => {
    fetchPublicPortfolio().then(data => setExperience(data.experience));
  }, []);

  const handleOpenAdd = () => {
    setEditingExp(null);
    setFormData({ company: '', position: '', duration: '', location: '', description: '', technologies: [] });
    setTechInput('');
    setIsModalOpen(true);
  };

  const handleOpenEdit = (exp: Experience) => {
    setEditingExp(exp);
    setFormData(exp);
    setTechInput(exp.technologies ? exp.technologies.join(', ') : '');
    setIsModalOpen(true);
  };

  const handleDelete = async (id?: string) => {
    if (!id) return;
    if (confirm('Delete this work experience entry?')) {
      try { await api.delete(`/admin/experience/${id}`); } catch (e) {}
      setExperience(experience.filter(e => e.id !== id && e._id !== id));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const techs = techInput.split(',').map(t => t.trim()).filter(Boolean);
    const payload = { ...formData, technologies: techs };

    if (editingExp) {
      const targetId = editingExp.id || editingExp._id;
      try { await api.put(`/admin/experience/${targetId}`, payload); } catch (e) {}
      setExperience(experience.map(x => (x.id === targetId || x._id === targetId) ? { ...x, ...payload } : x));
    } else {
      try {
        const res = await api.post('/admin/experience', payload);
        if (res.data?.data) {
          setExperience([...experience, res.data.data]);
        } else {
          setExperience([...experience, { ...payload, id: `exp-${Date.now()}` }]);
        }
      } catch (e) {
        setExperience([...experience, { ...payload, id: `exp-${Date.now()}` }]);
      }
    }
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">Work Experience Manager</h1>
          <p className="text-xs text-slate-400 mt-1">Manage positions, companies, descriptions, and technology stacks.</p>
        </div>
        <button
          onClick={handleOpenAdd}
          className="px-4 py-2.5 text-xs font-bold rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-glow flex items-center space-x-2"
        >
          <Plus className="w-4 h-4" />
          <span>Add Experience</span>
        </button>
      </div>

      <div className="space-y-4">
        {experience.map((exp) => {
          const id = exp.id || exp._id;
          return (
            <div key={id} className="glass-panel p-6 rounded-2xl border border-slate-800 flex flex-col md:flex-row items-start justify-between gap-4">
              <div className="space-y-2 flex-1">
                <div className="flex items-center space-x-3">
                  <h3 className="text-lg font-bold text-white">{exp.position}</h3>
                  <span className="px-2.5 py-0.5 text-xs font-semibold rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20">
                    {exp.duration}
                  </span>
                </div>
                <p className="text-xs font-semibold text-slate-300">{exp.company} — <span className="text-slate-400 font-normal">{exp.location}</span></p>
                <p className="text-xs text-slate-400 leading-relaxed max-w-3xl">{exp.description}</p>
                <div className="flex flex-wrap gap-1.5 pt-2">
                  {exp.technologies?.map((t, i) => (
                    <span key={i} className="px-2 py-0.5 text-[10px] rounded bg-slate-900 border border-slate-800 text-slate-400">
                      {t}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <button onClick={() => handleOpenEdit(exp)} className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800">
                  <Edit2 className="w-4 h-4" />
                </button>
                <button onClick={() => handleDelete(id)} className="p-2 rounded-lg text-slate-400 hover:text-red-400 hover:bg-slate-800">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingExp ? 'Edit Experience' : 'Add Experience'}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-2">Company Name *</label>
              <input
                type="text"
                required
                value={formData.company}
                onChange={e => setFormData({ ...formData, company: e.target.value })}
                className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-800 text-white text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-2">Position Title *</label>
              <input
                type="text"
                required
                value={formData.position}
                onChange={e => setFormData({ ...formData, position: e.target.value })}
                className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-800 text-white text-sm"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-2">Duration (e.g. 2023 - Present) *</label>
              <input
                type="text"
                required
                value={formData.duration}
                onChange={e => setFormData({ ...formData, duration: e.target.value })}
                className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-800 text-white text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-2">Location</label>
              <input
                type="text"
                value={formData.location}
                onChange={e => setFormData({ ...formData, location: e.target.value })}
                className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-800 text-white text-sm"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-2">Description *</label>
            <textarea
              rows={4}
              required
              value={formData.description}
              onChange={e => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-800 text-white text-sm"
            ></textarea>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-2">Technologies (comma-separated)</label>
            <input
              type="text"
              value={techInput}
              onChange={e => setTechInput(e.target.value)}
              placeholder="React, TypeScript, Node.js, Kubernetes"
              className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-800 text-white text-sm"
            />
          </div>

          <div className="flex justify-end space-x-3 pt-4 border-t border-slate-800">
            <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2.5 text-xs font-semibold rounded-xl bg-slate-800 text-slate-300">
              Cancel
            </button>
            <button type="submit" className="px-5 py-2.5 text-xs font-bold rounded-xl bg-blue-600 text-white shadow-glow">
              Save Entry
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
