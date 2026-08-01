import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, CheckCircle2, Cpu } from 'lucide-react';
import { fetchPublicPortfolio, api } from '../../services/api';
import { Skill } from '../../types';
import { Modal } from '../../components/Modal';

export const SkillsManager: React.FC = () => {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSkill, setEditingSkill] = useState<Skill | null>(null);

  const [formData, setFormData] = useState<Skill>({
    name: '',
    category: 'Frontend',
    level: 90,
    icon: 'code'
  });

  useEffect(() => {
    loadSkills();
  }, []);

  const loadSkills = async () => {
    const data = await fetchPublicPortfolio();
    setSkills(data.skills);
  };

  const handleOpenAdd = () => {
    setEditingSkill(null);
    setFormData({ name: '', category: 'Frontend', level: 90, icon: 'code' });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (skill: Skill) => {
    setEditingSkill(skill);
    setFormData(skill);
    setIsModalOpen(true);
  };

  const handleDelete = async (id?: string) => {
    if (!id) return;
    if (confirm('Are you sure you want to delete this skill?')) {
      try {
        await api.delete(`/admin/skills/${id}`);
      } catch (e) {}
      setSkills(skills.filter(s => s.id !== id && s._id !== id));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingSkill) {
      const targetId = editingSkill.id || editingSkill._id;
      try {
        await api.put(`/admin/skills/${targetId}`, formData);
      } catch (e) {}
      setSkills(skills.map(s => (s.id === targetId || s._id === targetId) ? { ...s, ...formData } : s));
    } else {
      try {
        const res = await api.post('/admin/skills', formData);
        if (res.data?.data) {
          setSkills([...skills, res.data.data]);
        } else {
          setSkills([...skills, { ...formData, id: `skill-${Date.now()}` }]);
        }
      } catch (e) {
        setSkills([...skills, { ...formData, id: `skill-${Date.now()}` }]);
      }
    }
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">Skills Catalog Manager</h1>
          <p className="text-xs text-slate-400 mt-1">Add, update, or remove technical skills and proficiency levels.</p>
        </div>
        <button
          onClick={handleOpenAdd}
          className="px-4 py-2.5 text-xs font-bold rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-glow hover:opacity-95 flex items-center space-x-2"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Skill</span>
        </button>
      </div>

      {/* Skills Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {skills.map((skill) => {
          const id = skill.id || skill._id;
          return (
            <div key={id} className="glass-panel p-5 rounded-2xl border border-slate-800 flex items-center justify-between">
              <div className="space-y-1">
                <span className="text-xs font-bold text-blue-400 uppercase tracking-wider">{skill.category}</span>
                <h4 className="text-base font-bold text-white">{skill.name}</h4>
                <div className="flex items-center space-x-2 pt-1">
                  <div className="w-24 bg-slate-900 rounded-full h-2 overflow-hidden border border-slate-800">
                    <div className="bg-blue-500 h-full rounded-full" style={{ width: `${skill.level}%` }}></div>
                  </div>
                  <span className="text-xs font-mono text-slate-400 font-bold">{skill.level}%</span>
                </div>
              </div>

              <div className="flex items-center space-x-1">
                <button onClick={() => handleOpenEdit(skill)} className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800">
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

      {/* Add / Edit Skill Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingSkill ? 'Edit Skill' : 'Add New Skill'}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-2">Skill Name *</label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={e => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g. React.js"
              className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-800 text-white text-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-2">Category *</label>
            <select
              value={formData.category}
              onChange={e => setFormData({ ...formData, category: e.target.value })}
              className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-800 text-white text-sm"
            >
              <option value="Frontend">Frontend</option>
              <option value="Backend">Backend</option>
              <option value="DevOps">DevOps</option>
              <option value="Architecture">Architecture</option>
              <option value="AI/ML">AI / Machine Learning</option>
              <option value="Tools">Tools & Testing</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-2">Proficiency Level: {formData.level}%</label>
            <input
              type="range"
              min="10"
              max="100"
              value={formData.level}
              onChange={e => setFormData({ ...formData, level: Number(e.target.value) })}
              className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer"
            />
          </div>

          <div className="flex justify-end space-x-3 pt-4 border-t border-slate-800">
            <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2.5 text-xs font-semibold rounded-xl bg-slate-800 text-slate-300">
              Cancel
            </button>
            <button type="submit" className="px-5 py-2.5 text-xs font-bold rounded-xl bg-blue-600 text-white shadow-glow">
              Save Skill
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
