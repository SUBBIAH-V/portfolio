import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Award, ExternalLink } from 'lucide-react';
import { fetchPublicPortfolio, api } from '../../services/api';
import { Certification } from '../../types';
import { Modal } from '../../components/Modal';

export const CertificationsManager: React.FC = () => {
  const [certifications, setCertifications] = useState<Certification[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCert, setEditingCert] = useState<Certification | null>(null);

  const [formData, setFormData] = useState<Certification>({
    title: '',
    organization: '',
    date: '',
    credentialId: '',
    verificationLink: ''
  });

  useEffect(() => {
    fetchPublicPortfolio().then(data => setCertifications(data.certifications));
  }, []);

  const handleOpenAdd = () => {
    setEditingCert(null);
    setFormData({ title: '', organization: '', date: '', credentialId: '', verificationLink: '' });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (cert: Certification) => {
    setEditingCert(cert);
    setFormData(cert);
    setIsModalOpen(true);
  };

  const handleDelete = async (id?: string) => {
    if (!id) return;
    if (confirm('Delete certification record?')) {
      try { await api.delete(`/admin/certifications/${id}`); } catch (e) {}
      setCertifications(certifications.filter(c => c.id !== id && c._id !== id));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingCert) {
      const targetId = editingCert.id || editingCert._id;
      try { await api.put(`/admin/certifications/${targetId}`, formData); } catch (e) {}
      setCertifications(certifications.map(c => (c.id === targetId || c._id === targetId) ? { ...c, ...formData } : c));
    } else {
      try {
        const res = await api.post('/admin/certifications', formData);
        if (res.data?.data) {
          setCertifications([...certifications, res.data.data]);
        } else {
          setCertifications([...certifications, { ...formData, id: `cert-${Date.now()}` }]);
        }
      } catch (e) {
        setCertifications([...certifications, { ...formData, id: `cert-${Date.now()}` }]);
      }
    }
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">Certifications Manager</h1>
          <p className="text-xs text-slate-400 mt-1">Manage professional credentials and verification links.</p>
        </div>
        <button
          onClick={handleOpenAdd}
          className="px-4 py-2.5 text-xs font-bold rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-glow flex items-center space-x-2"
        >
          <Plus className="w-4 h-4" />
          <span>Add Certification</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {certifications.map((cert) => {
          const id = cert.id || cert._id;
          return (
            <div key={id} className="glass-panel p-5 rounded-2xl border border-slate-800 flex items-start justify-between">
              <div className="space-y-2">
                <h4 className="text-base font-bold text-white">{cert.title}</h4>
                <p className="text-xs text-slate-400">{cert.organization} • <span className="text-slate-300">{cert.date}</span></p>
                {cert.credentialId && <p className="text-[11px] font-mono text-slate-500">ID: {cert.credentialId}</p>}
              </div>

              <div className="flex items-center space-x-1">
                <button onClick={() => handleOpenEdit(cert)} className="p-2 text-slate-400 hover:text-white"><Edit2 className="w-4 h-4" /></button>
                <button onClick={() => handleDelete(id)} className="p-2 text-slate-400 hover:text-red-400"><Trash2 className="w-4 h-4" /></button>
              </div>
            </div>
          );
        })}
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingCert ? 'Edit Certification' : 'Add Certification'}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-2">Certification Title *</label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={e => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-800 text-white text-sm"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-2">Organization *</label>
              <input
                type="text"
                required
                value={formData.organization}
                onChange={e => setFormData({ ...formData, organization: e.target.value })}
                className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-800 text-white text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-2">Issue Date *</label>
              <input
                type="text"
                required
                value={formData.date}
                onChange={e => setFormData({ ...formData, date: e.target.value })}
                className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-800 text-white text-sm"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-2">Credential ID</label>
            <input
              type="text"
              value={formData.credentialId}
              onChange={e => setFormData({ ...formData, credentialId: e.target.value })}
              className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-800 text-white text-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-2">Verification URL</label>
            <input
              type="text"
              value={formData.verificationLink}
              onChange={e => setFormData({ ...formData, verificationLink: e.target.value })}
              className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-800 text-white text-sm"
            />
          </div>

          <div className="flex justify-end space-x-3 pt-4 border-t border-slate-800">
            <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2.5 text-xs font-semibold rounded-xl bg-slate-800 text-slate-300">
              Cancel
            </button>
            <button type="submit" className="px-5 py-2.5 text-xs font-bold rounded-xl bg-blue-600 text-white shadow-glow">
              Save Record
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
