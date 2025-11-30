
import React, { useState } from 'react';
import { Upload, AlertCircle, Check, FileJson, Copy, X } from 'lucide-react';

interface DataImportProps {
  onImport: (type: 'leads' | 'orders', data: any[]) => void;
  onClose: () => void;
}

export const DataImport: React.FC<DataImportProps> = ({ onImport, onClose }) => {
  const [importType, setImportType] = useState<'leads' | 'orders'>('leads');
  const [jsonContent, setJsonContent] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleImport = () => {
    try {
      if (!jsonContent.trim()) {
        setError('Por favor, cole o conteúdo JSON.');
        return;
      }
      
      const parsed = JSON.parse(jsonContent);
      
      if (!Array.isArray(parsed)) {
        setError('O JSON deve ser um array de objetos [{}, {}].');
        return;
      }

      // Basic validation based on type
      if (importType === 'leads') {
         const valid = parsed.every(i => i.companyName && i.email);
         if (!valid) throw new Error('Dados inválidos para Leads. Campos obrigatórios: companyName, email.');
      } 
      // Add more validations if needed

      onImport(importType, parsed);
      setSuccess(true);
      setError(null);
      setTimeout(() => {
          onClose();
      }, 1500);

    } catch (err: any) {
      setError(`Erro no JSON: ${err.message}`);
      setSuccess(false);
    }
  };

  const schemas = {
      leads: `[
  {
    "name": "Nome do Contacto",
    "companyName": "Empresa Lda",
    "email": "email@empresa.com",
    "phone": "910000000",
    "notes": "Interesse em Plano Pro"
  }
]`,
      orders: `[
  {
    "customerName": "Cliente ABC",
    "nif": "500123456",
    "scope": "Instalação AC",
    "date": "2024-12-01T09:00:00Z"
  }
]`
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[60] p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="bg-slate-900 px-6 py-4 flex justify-between items-center">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Upload size={20} /> Importação de Dados
            </h3>
            <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors">
                <X size={20} />
            </button>
        </div>
        
        <div className="p-6">
            <div className="mb-6">
                <label className="block text-sm font-bold text-slate-700 mb-2">Tipo de Dados</label>
                <div className="flex gap-4">
                    <button 
                        onClick={() => setImportType('leads')}
                        className={`flex-1 py-3 px-4 rounded-lg border-2 font-bold text-sm transition-all ${importType === 'leads' ? 'border-blue-600 text-blue-700 bg-blue-50' : 'border-slate-200 text-slate-500 hover:border-slate-300'}`}
                    >
                        Leads (CRM)
                    </button>
                    <button 
                        onClick={() => setImportType('orders')}
                        className={`flex-1 py-3 px-4 rounded-lg border-2 font-bold text-sm transition-all ${importType === 'orders' ? 'border-blue-600 text-blue-700 bg-blue-50' : 'border-slate-200 text-slate-500 hover:border-slate-300'}`}
                    >
                        Ordens de Serviço
                    </button>
                </div>
            </div>

            <div className="mb-4">
                <div className="flex justify-between items-center mb-2">
                    <label className="text-sm font-bold text-slate-700">Conteúdo JSON</label>
                    <button 
                        onClick={() => navigator.clipboard.writeText(schemas[importType])}
                        className="text-xs text-blue-600 font-bold hover:underline flex items-center gap-1"
                    >
                        <Copy size={12}/> Copiar Exemplo
                    </button>
                </div>
                <textarea 
                    value={jsonContent}
                    onChange={(e) => setJsonContent(e.target.value)}
                    className="w-full h-64 bg-slate-50 border border-slate-300 rounded-lg p-4 font-mono text-xs text-slate-700 focus:ring-2 focus:ring-blue-500 outline-none resize-none"
                    placeholder={`Cole aqui o JSON... \nExemplo:\n${schemas[importType]}`}
                />
            </div>

            {error && (
                <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm flex items-center gap-2 mb-4">
                    <AlertCircle size={16} /> {error}
                </div>
            )}

            {success && (
                <div className="bg-emerald-50 text-emerald-600 p-3 rounded-lg text-sm flex items-center gap-2 mb-4">
                    <Check size={16} /> Importação realizada com sucesso!
                </div>
            )}

            <div className="flex justify-end gap-3 pt-2 border-t border-slate-100">
                <button onClick={onClose} className="px-5 py-2.5 text-slate-500 font-bold hover:bg-slate-50 rounded-lg transition-colors">
                    Cancelar
                </button>
                <button 
                    onClick={handleImport}
                    disabled={success}
                    className="px-6 py-2.5 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 shadow-md transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    <Upload size={18} /> Importar
                </button>
            </div>
        </div>
      </div>
    </div>
  );
};
