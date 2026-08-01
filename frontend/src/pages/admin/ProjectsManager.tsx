import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Upload, Star, ExternalLink, Github } from 'lucide-react';
import { fetchPublicPortfolio, api, uploadFile, notifyDataChanged } from '../../services/api';
import { Project } from '../../types';
import { Modal } from '../../components/Modal';

export const ProjectsManager: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);

  const [formData, setFormData] = useState<Project>({
    title: '',
    description: '',
    techStack: [],
    features: [],
    githubLink: '',
    liveDemo: '',
    category: 'Full Stack',
    image: '',
    featured: false
  });
  const [techInput, setTechInput] = useState('');
  const [featuresInput, setFeaturesInput] = useState('');

  useEffect(() => {
    fetchPublicPortfolio().then(data => setProjects(data.projects));
  }, []);

  const handleOpenAdd = () => {
    setEditingProject(null);
    setFormData({
      title: '',
      description: '',
      techStack: [],
      features: [],
      githubLink: '',
      liveDemo: '',
      category: 'Full Stack',
      image: '',
      featured: false
    });
    setTechInput('');
    setFeaturesInput('');
    setIsModalOpen(true);
  };

  const handleOpenEdit = (project: Project) => {
    setEditingProject(project);
    setFormData(project);
    setTechInput(project.techStack ? project.techStack.join(', ') : '');
    setFeaturesInput(project.features ? project.features.join('\n') : '');
    setIsModalOpen(true);
  };

  const handleDelete = async (id?: string) => {
    if (!id) return;
    if (confirm('Delete this project?')) {
      try { await api.delete(`/admin/projects/${id}`); } catch (e) {}
      setProjects(projects.filter(p => p.id !== id && p._id !== id));
      notifyDataChanged();
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const res = await uploadFile(e.target.files[0]);
      if (res.url) {
        setFormData({ ...formData, image: res.url });
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const techs = techInput.split(',').map(t => t.trim()).filter(Boolean);
    const feats = featuresInput.split('\n').map(f => f.trim()).filter(Boolean);
    const payload = { ...formData, techStack: techs, features: feats };

    if (editingProject) {
      const targetId = editingProject.id || editingProject._id;
      try { await api.put(`/admin/projects/${targetId}`, payload); } catch (e) {}
      setProjects(projects.map(p => (p.id === targetId || p._id === targetId) ? { ...p, ...payload } : p));
    } else {
      try {
        const res = await api.post('/admin/projects', payload);
        if (res.data?.data) {
          setProjects([...projects, res.data.data]);
        } else {
          setProjects([...projects, { ...payload, id: `proj-${Date.now()}` }]);
        }
      } catch (e) {
        setProjects([...projects, { ...payload, id: `proj-${Date.now()}` }]);
      }
    }
    notifyDataChanged();
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">Projects Manager</h1>
          <p className="text-xs text-slate-400 mt-1">Manage project showcase, categories, tech stack, and links.</p>
        </div>
        <button
          onClick={handleOpenAdd}
          className="px-4 py-2.5 text-xs font-bold rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-glow flex items-center space-x-2"
        >
          <Plus className="w-4 h-4" />
          <span>Add Project</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project) => {
          const id = project.id || project._id;
          return (
            <div key={id} className="glass-panel rounded-3xl overflow-hidden border border-slate-800 flex flex-col justify-between">
              {project.image && (
                <div className="relative h-44 bg-slate-900">
                  <img src={project.image} alt={project.title} className="w-full h-full object-cover" />
                  {project.featured && (
                    <span className="absolute top-3 left-3 px-2.5 py-1 text-[10px] font-bold rounded-full bg-blue-600 text-white">
                      Featured
                    </span>
                  )}
                </div>
              )}
              <div className="p-5 space-y-3 flex-1 flex flex-col justify-between">
                <div>
                  <span className="text-[11px] font-bold text-blue-400 uppercase tracking-wider">{project.category}</span>
                  <h3 className="text-lg font-bold text-white mt-0.5">{project.title}</h3>
                  <p className="text-xs text-slate-400 mt-2 line-clamp-2">{project.description}</p>
                </div>
                <div className="flex items-center justify-between pt-4 border-t border-slate-800">
                  <div className="flex items-center space-x-2">
                    {project.githubLink && <a href={project.githubLink} target="_blank" rel="noreferrer" className="text-slate-400 hover:text-white"><Github className="w-4 h-4" /></a>}
                    {project.liveDemo && <a href={project.liveDemo} target="_blank" rel="noreferrer" className="text-slate-400 hover:text-white"><ExternalLink className="w-4 h-4" /></a>}
                  </div>
                  <div className="flex items-center space-x-1">
                    <button onClick={() => handleOpenEdit(project)} className="p-2 text-slate-400 hover:text-white"><Edit2 className="w-4 h-4" /></button>
                    <button onClick={() => handleDelete(id)} className="p-2 text-slate-400 hover:text-red-400"><Trash2 className="w-4 h-4" /></button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingProject ? 'Edit Project' : 'Add Project'}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-2">Project Image</label>
            <div className="flex items-center space-x-4">
              {formData.image && <img src={formData.image} alt="Preview" className="w-16 h-16 rounded-xl object-cover border border-slate-800" />}
              <label className="px-4 py-2 text-xs font-semibold rounded-xl bg-slate-800 text-slate-200 cursor-pointer border border-slate-700 flex items-center space-x-2">
                <Upload className="w-4 h-4" />
                <span>Upload Image</span>
                <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
              </label>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-2">Title *</label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={e => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-800 text-white text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-2">Category</label>
              <select
                value={formData.category}
                onChange={e => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-800 text-white text-sm"
              >
                <option value="Full Stack">Full Stack</option>
                <option value="Frontend">Frontend</option>
                <option value="Backend">Backend</option>
                <option value="AI/ML">AI / Machine Learning</option>
              </select>
            </div>
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
            <label className="block text-xs font-semibold text-slate-300 mb-2">Tech Stack (comma-separated)</label>
            <input
              type="text"
              value={techInput}
              onChange={e => setTechInput(e.target.value)}
              placeholder="React, TypeScript, Tailwind CSS, Node.js"
              className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-800 text-white text-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-2">Features (one per line)</label>
            <textarea
              rows={3}
              value={featuresInput}
              onChange={e => setFeaturesInput(e.target.value)}
              placeholder="Real-time web sockets&#10;RBAC permissions"
              className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-800 text-white text-sm"
            ></textarea>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-2">GitHub Repository Link</label>
              <input
                type="text"
                value={formData.githubLink}
                onChange={e => setFormData({ ...formData, githubLink: e.target.value })}
                className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-800 text-white text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-2">Live Demo Link</label>
              <input
                type="text"
                value={formData.liveDemo}
                onChange={e => setFormData({ ...formData, liveDemo: e.target.value })}
                className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-800 text-white text-sm"
              />
            </div>
          </div>

          <div className="flex items-center space-x-2 pt-2">
            <input
              type="checkbox"
              id="featuredToggle"
              checked={formData.featured}
              onChange={e => setFormData({ ...formData, featured: e.target.checked })}
              className="w-4 h-4 rounded border-slate-800 bg-slate-900 text-blue-600"
            />
            <label htmlFor="featuredToggle" className="text-xs font-semibold text-slate-300 cursor-pointer">
              Mark as Featured Project
            </label>
          </div>

          <div className="flex justify-end space-x-3 pt-4 border-t border-slate-800">
            <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2.5 text-xs font-semibold rounded-xl bg-slate-800 text-slate-300">
              Cancel
            </button>
            <button type="submit" className="px-5 py-2.5 text-xs font-bold rounded-xl bg-blue-600 text-white shadow-glow">
              Save Project
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
