
import React from 'react';
import { PremiumTable } from './PremiumTable';
import { MOCK_VEHICLES, MOCK_INVOICES, MOCK_EMPLOYEES } from '../services/mockData';
import { Vehicle, Invoice, InvoiceStatus, Employee } from '../types';
import { Car, AlertTriangle, CheckCircle, FileText, User } from 'lucide-react';

// --- FLEET MODULE ---
export const FleetList = () => {
  return (
    <PremiumTable<Vehicle>
        title="Gestão de Viaturas"
        data={MOCK_VEHICLES}
        onAdd={() => alert('Nova viatura')}
        onEdit={(v) => alert(`Editar ${v.plate}`)}
        columns={[
            { header: 'Viatura', accessor: (v) => (
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-slate-100 rounded-lg text-slate-500"><Car size={18}/></div>
                    <div>
                        <p className="font-bold text-slate-900">{v.plate}</p>
                        <p className="text-xs text-slate-500">{v.brand} {v.model}</p>
                    </div>
                </div>
            )},
            { header: 'Estado', accessor: (v) => (
                <span className={`px-2 py-1 rounded text-xs font-bold uppercase ${
                    v.status === 'active' ? 'bg-emerald-100 text-emerald-700' : 
                    v.status === 'maintenance' ? 'bg-amber-100 text-amber-700' : 'bg-slate-100 text-slate-600'
                }`}>
                    {v.status === 'active' ? 'Ativo' : v.status === 'maintenance' ? 'Manutenção' : 'Inativo'}
                </span>
            )},
            { header: 'Quilometragem', accessor: (v) => <span className="font-mono">{v.mileage.toLocaleString()} km</span> },
            { header: 'Atribuído a', accessor: (v) => v.assignedTo || <span className="text-slate-400 italic">Livre</span> },
            { header: 'Última Revisão', accessor: 'lastService' }
        ]}
    />
  );
};

// --- FINANCE MODULE ---
export const InvoiceList = () => {
    return (
      <PremiumTable<Invoice>
          title="Faturas & Recebimentos"
          data={MOCK_INVOICES}
          onAdd={() => alert('Nova fatura')}
          columns={[
              { header: 'Número', accessor: (i) => <span className="font-bold text-blue-600">{i.number}</span>},
              { header: 'Cliente', accessor: 'customerName'},
              { header: 'Valor', accessor: (i) => <span className="font-bold text-slate-900">{i.amount.toFixed(2)}€</span>},
              { header: 'Vencimento', accessor: (i) => (
                  <div className="flex items-center gap-2">
                      <span className="text-sm">{new Date(i.dueDate).toLocaleDateString()}</span>
                      {new Date(i.dueDate) < new Date() && i.status !== InvoiceStatus.PAID && (
                          <AlertTriangle size={14} className="text-red-500" />
                      )}
                  </div>
              )},
              { header: 'Estado', accessor: (i) => (
                  <span className={`px-2 py-1 rounded text-xs font-bold uppercase border ${
                      i.status === InvoiceStatus.PAID ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 
                      i.status === InvoiceStatus.OVERDUE ? 'bg-red-50 text-red-700 border-red-200' : 
                      'bg-slate-50 text-slate-600 border-slate-200'
                  }`}>
                      {i.status}
                  </span>
              )}
          ]}
      />
    );
};

// --- HR MODULE ---
export const EmployeeList = () => {
    return (
      <PremiumTable<Employee>
          title="Recursos Humanos"
          data={MOCK_EMPLOYEES}
          onAdd={() => alert('Novo funcionário')}
          columns={[
              { header: 'Colaborador', accessor: (e) => (
                  <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-xs">
                          {e.name.charAt(0)}
                      </div>
                      <div>
                          <p className="font-bold text-slate-900">{e.name}</p>
                          <p className="text-xs text-slate-500">{e.email}</p>
                      </div>
                  </div>
              )},
              { header: 'Cargo', accessor: 'role'},
              { header: 'Departamento', accessor: (e) => <span className="px-2 py-1 bg-slate-100 rounded text-xs font-medium">{e.department}</span>},
              { header: 'Telefone', accessor: 'phone'},
              { header: 'Status', accessor: (e) => (
                  <span className="flex items-center gap-1 text-xs font-bold text-emerald-600">
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div> {e.status}
                  </span>
              )}
          ]}
      />
    );
};
