import React, { useState, useEffect } from 'react';
import { Mail, Search, Trash2, CheckCircle, Download, User, Calendar } from 'lucide-react';
import { fetchPublicPortfolio, api } from '../../services/api';
import { Message } from '../../types';

export const MessagesManager: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [search, setSearch] = useState('');
  const [filterUnread, setFilterUnread] = useState(false);

  useEffect(() => {
    loadMessages();
  }, []);

  const loadMessages = async () => {
    try {
      const res = await api.get('/admin/messages');
      if (res.data?.data) {
        setMessages(res.data.data);
        return;
      }
    } catch (e) {}
    const data = await fetchPublicPortfolio();
    setMessages(data.messages || []);
  };

  const handleMarkRead = async (id?: string) => {
    if (!id) return;
    try { await api.put(`/admin/messages/${id}/read`); } catch (e) {}
    setMessages(messages.map(m => (m.id === id || m._id === id) ? { ...m, isRead: true } : m));
  };

  const handleDelete = async (id?: string) => {
    if (!id) return;
    if (confirm('Delete this message?')) {
      try { await api.delete(`/admin/messages/${id}`); } catch (e) {}
      setMessages(messages.filter(m => m.id !== id && m._id !== id));
    }
  };

  const handleExport = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(messages, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `contact_messages_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const filtered = messages.filter(m => {
    const matchesSearch = m.name.toLowerCase().includes(search.toLowerCase()) || 
                          m.email.toLowerCase().includes(search.toLowerCase()) || 
                          m.message.toLowerCase().includes(search.toLowerCase());
    const matchesUnread = filterUnread ? !m.isRead : true;
    return matchesSearch && matchesUnread;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">Contact Messages Inbox</h1>
          <p className="text-xs text-slate-400 mt-1">Review inquiries and messages sent by recruiters and portfolio visitors.</p>
        </div>
        <button
          onClick={handleExport}
          className="px-4 py-2.5 text-xs font-bold rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 flex items-center space-x-2 shadow-sm"
        >
          <Download className="w-4 h-4 text-blue-400" />
          <span>Export Inbox (JSON)</span>
        </button>
      </div>

      {/* Filters Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 glass-panel p-4 rounded-2xl border border-slate-800">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by name, email or keyword..."
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs"
          />
        </div>

        <label className="flex items-center space-x-2 text-xs text-slate-300 cursor-pointer">
          <input
            type="checkbox"
            checked={filterUnread}
            onChange={e => setFilterUnread(e.target.checked)}
            className="w-4 h-4 rounded border-slate-800 bg-slate-900 text-blue-600"
          />
          <span>Show Unread Only ({messages.filter(m => !m.isRead).length})</span>
        </label>
      </div>

      {/* Messages List */}
      <div className="space-y-4">
        {filtered.length === 0 ? (
          <div className="glass-panel p-12 rounded-3xl text-center text-slate-400 text-sm border border-slate-800">
            No messages found in inbox.
          </div>
        ) : (
          filtered.map((msg) => {
            const id = msg.id || msg._id;
            return (
              <div
                key={id}
                className={`glass-panel p-6 rounded-2xl border transition-all ${
                  !msg.isRead ? 'border-blue-500/40 bg-blue-500/5' : 'border-slate-800'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-800/80">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 rounded-full bg-blue-600/20 text-blue-400 flex items-center justify-center font-bold text-xs">
                      {msg.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white flex items-center gap-2">
                        {msg.name}
                        {!msg.isRead && (
                          <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-blue-600 text-white">
                            NEW
                          </span>
                        )}
                      </h4>
                      <p className="text-xs text-slate-400">{msg.email}</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3 text-xs text-slate-500">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" />
                      {new Date(msg.createdAt).toLocaleDateString()}
                    </span>
                    {!msg.isRead && (
                      <button
                        onClick={() => handleMarkRead(id)}
                        className="px-2.5 py-1 rounded-lg bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 text-[11px] font-semibold border border-blue-500/20"
                      >
                        Mark Read
                      </button>
                    )}
                    <button
                      onClick={() => handleDelete(id)}
                      className="p-1.5 text-slate-400 hover:text-red-400 hover:bg-slate-800 rounded-lg"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="pt-3 space-y-1">
                  {msg.subject && <p className="text-xs font-semibold text-slate-300">Subject: {msg.subject}</p>}
                  <p className="text-xs text-slate-300 leading-relaxed whitespace-pre-wrap">{msg.message}</p>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
