
import React from 'react';
import { Search, Filter, MoreHorizontal, Edit2, Trash2, Download } from 'lucide-react';

interface Column<T> {
  header: string;
  accessor: keyof T | ((item: T) => React.ReactNode);
  className?: string;
}

interface PremiumTableProps<T> {
  title: string;
  data: T[];
  columns: Column<T>[];
  onAdd?: () => void;
  onEdit?: (item: T) => void;
  onDelete?: (item: T) => void;
  actions?: (item: T) => React.ReactNode;
}

export function PremiumTable<T extends { id: string }>({ 
  title, data, columns, onAdd, onEdit, onDelete, actions 
}: PremiumTableProps<T>) {
  
  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
      {/* Header Toolbar */}
      <div className="p-5 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
            <h2 className="text-lg font-bold text-slate-800">{title}</h2>
            <p className="text-xs text-slate-500">{data.length} registos encontrados</p>
        </div>
        <div className="flex gap-2">
            <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                <input 
                    type="text" 
                    placeholder="Pesquisar..." 
                    className="pl-9 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none w-full sm:w-48"
                />
            </div>
            <button className="p-2 border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50">
                <Filter size={18} />
            </button>
            <button className="p-2 border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50">
                <Download size={18} />
            </button>
            {onAdd && (
                <button onClick={onAdd} className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-bold hover:bg-blue-700 shadow-sm">
                    + Novo
                </button>
            )}
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 text-xs font-bold text-slate-500 uppercase border-b border-slate-200">
              {columns.map((col, idx) => (
                <th key={idx} className={`px-6 py-4 ${col.className || ''}`}>{col.header}</th>
              ))}
              <th className="px-6 py-4 text-right">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-sm">
            {data.map((item) => (
              <tr key={item.id} className="hover:bg-slate-50/80 transition-colors group">
                {columns.map((col, idx) => (
                  <td key={idx} className={`px-6 py-3.5 text-slate-700 ${col.className || ''}`}>
                    {typeof col.accessor === 'function' ? col.accessor(item) : (item[col.accessor] as any)}
                  </td>
                ))}
                <td className="px-6 py-3.5 text-right">
                  <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    {actions && actions(item)}
                    {onEdit && (
                        <button onClick={() => onEdit(item)} className="p-1.5 text-slate-400 hover:text-blue-600 rounded hover:bg-blue-50">
                            <Edit2 size={16} />
                        </button>
                    )}
                    {onDelete && (
                        <button onClick={() => onDelete(item)} className="p-1.5 text-slate-400 hover:text-red-600 rounded hover:bg-red-50">
                            <Trash2 size={16} />
                        </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
            {data.length === 0 && (
                <tr>
                    <td colSpan={columns.length + 1} className="px-6 py-12 text-center text-slate-400 italic">
                        Nenhum dado disponível.
                    </td>
                </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
