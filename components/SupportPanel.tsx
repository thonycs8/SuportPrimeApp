
import React, { useState } from 'react';
import { SupportTicket, TicketStatus, Priority, User, TicketMessage } from '../types';
import { MessageSquare, Send, Plus, Search, AlertCircle, CheckCircle, Clock } from 'lucide-react';

interface SupportPanelProps {
  tickets: SupportTicket[];
  currentUser: User;
  onCreateTicket: (subject: string, priority: Priority, message: string) => void;
  onReplyTicket: (ticketId: string, message: string) => void;
}

export const SupportPanel: React.FC<SupportPanelProps> = ({ tickets, currentUser, onCreateTicket, onReplyTicket }) => {
  const [view, setView] = useState<'list' | 'create' | 'detail'>('list');
  const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(null);
  
  // Forms
  const [subject, setSubject] = useState('');
  const [priority, setPriority] = useState<Priority>(Priority.NORMAL);
  const [message, setMessage] = useState('');
  const [reply, setReply] = useState('');

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    onCreateTicket(subject, priority, message);
    setSubject('');
    setMessage('');
    setView('list');
  };

  const handleReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedTicket && reply.trim()) {
        onReplyTicket(selectedTicket.id, reply);
        setReply('');
    }
  };

  const openTicket = (t: SupportTicket) => {
      setSelectedTicket(t);
      setView('detail');
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-12">
      <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-slate-800">Suporte Técnico</h2>
            <p className="text-slate-500">Estamos aqui para ajudar com o seu ambiente.</p>
          </div>
          {view === 'list' && (
              <button 
                onClick={() => setView('create')}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg font-bold shadow-sm hover:bg-blue-700 flex items-center gap-2 transition-colors"
              >
                  <Plus size={18} /> Abrir Chamada
              </button>
          )}
          {view !== 'list' && (
              <button 
                onClick={() => setView('list')}
                className="text-slate-500 hover:text-slate-800 font-medium text-sm underline"
              >
                  Voltar à lista
              </button>
          )}
      </div>

      {view === 'list' && (
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
             {tickets.length === 0 ? (
                 <div className="p-12 text-center text-slate-400">
                     <MessageSquare size={48} className="mx-auto mb-4 opacity-50"/>
                     <p className="font-medium">Nenhum ticket aberto.</p>
                 </div>
             ) : (
                 <div className="divide-y divide-slate-100">
                     {tickets.map(t => (
                         <div 
                            key={t.id} 
                            onClick={() => openTicket(t)}
                            className="p-4 hover:bg-slate-50 cursor-pointer transition-colors flex items-center justify-between"
                         >
                             <div className="flex items-center gap-4">
                                 <div className={`w-2 h-2 rounded-full ${t.status === TicketStatus.OPEN ? 'bg-red-500' : 'bg-emerald-500'}`}></div>
                                 <div>
                                     <h4 className="font-bold text-slate-800">{t.subject}</h4>
                                     <p className="text-xs text-slate-500 flex items-center gap-2">
                                         #{t.id} • {new Date(t.createdAt).toLocaleDateString()}
                                         <span className="bg-slate-100 px-2 rounded-full text-[10px] font-bold uppercase">{t.status}</span>
                                     </p>
                                 </div>
                             </div>
                             <div className="flex items-center gap-4">
                                 <span className={`text-[10px] font-bold px-2 py-1 rounded border ${
                                     t.priority === Priority.CRITICAL ? 'bg-red-50 text-red-600 border-red-100' : 'bg-blue-50 text-blue-600 border-blue-100'
                                 }`}>{t.priority}</span>
                             </div>
                         </div>
                     ))}
                 </div>
             )}
          </div>
      )}

      {view === 'create' && (
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 max-w-2xl mx-auto">
              <h3 className="text-lg font-bold text-slate-800 mb-6">Nova Solicitação</h3>
              <form onSubmit={handleCreate} className="space-y-4">
                  <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Assunto</label>
                      <input type="text" required className="w-full p-3 border border-slate-300 rounded-lg" value={subject} onChange={e => setSubject(e.target.value)} />
                  </div>
                  <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Prioridade</label>
                      <select className="w-full p-3 border border-slate-300 rounded-lg" value={priority} onChange={e => setPriority(e.target.value as Priority)}>
                          {Object.values(Priority).map(p => <option key={p} value={p}>{p}</option>)}
                      </select>
                  </div>
                  <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Mensagem</label>
                      <textarea required className="w-full p-3 border border-slate-300 rounded-lg h-32" value={message} onChange={e => setMessage(e.target.value)} />
                  </div>
                  <button type="submit" className="w-full bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-700">Enviar</button>
              </form>
          </div>
      )}

      {view === 'detail' && selectedTicket && (
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden flex flex-col h-[600px]">
              <div className="p-4 border-b border-slate-200 bg-slate-50 flex justify-between items-center">
                   <div>
                       <h3 className="font-bold text-slate-800">{selectedTicket.subject}</h3>
                       <p className="text-xs text-slate-500">#{selectedTicket.id}</p>
                   </div>
                   <div className="text-xs font-bold bg-white px-3 py-1 rounded border border-slate-200">
                       {selectedTicket.status}
                   </div>
              </div>
              
              <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/50">
                  {selectedTicket.messages.map(msg => (
                      <div key={msg.id} className={`flex ${msg.isAdmin ? 'justify-start' : 'justify-end'}`}>
                          <div className={`max-w-[80%] rounded-xl p-4 shadow-sm ${
                              msg.isAdmin ? 'bg-white border border-slate-200 text-slate-700' : 'bg-blue-600 text-white'
                          }`}>
                              <p className="text-sm">{msg.content}</p>
                              <p className={`text-[10px] mt-2 opacity-70 ${msg.isAdmin ? 'text-slate-400' : 'text-blue-100'}`}>
                                  {msg.sender} • {new Date(msg.timestamp).toLocaleString()}
                              </p>
                          </div>
                      </div>
                  ))}
              </div>

              <div className="p-4 bg-white border-t border-slate-200">
                  <form onSubmit={handleReply} className="flex gap-2">
                      <input 
                        type="text" 
                        className="flex-1 border border-slate-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                        placeholder="Escreva uma resposta..."
                        value={reply}
                        onChange={e => setReply(e.target.value)}
                        disabled={selectedTicket.status === TicketStatus.CLOSED}
                      />
                      <button 
                        type="submit" 
                        disabled={selectedTicket.status === TicketStatus.CLOSED}
                        className="bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
                      >
                          <Send size={20} />
                      </button>
                  </form>
              </div>
          </div>
      )}
    </div>
  );
};
