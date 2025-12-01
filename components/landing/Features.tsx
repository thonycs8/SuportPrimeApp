import React from 'react';
import { Smartphone, FileText, Users, Calendar, BarChart, Lock } from 'lucide-react';

export const Features: React.FC = () => {
  const features = [
    {
      icon: <Smartphone size={24} />,
      title: "Mobilidade Total",
      description: "App nativa para Android e iOS. Funciona offline.",
      color: "bg-blue-100 text-blue-600"
    },
    {
      icon: <FileText size={24} />,
      title: "Relatórios PDF",
      description: "Gere documentos profissionais com um clique.",
      color: "bg-emerald-100 text-emerald-600"
    },
    {
      icon: <Users size={24} />,
      title: "Gestão de Equipa",
      description: "Saiba onde estão os seus técnicos em tempo real.",
      color: "bg-purple-100 text-purple-600"
    },
    {
      icon: <Calendar size={24} />,
      title: "Agendamento Inteligente",
      description: "Distribua tarefas com base na localização.",
      color: "bg-amber-100 text-amber-600"
    },
    {
      icon: <BarChart size={24} />,
      title: "Analytics",
      description: "Métricas de produtividade e faturação.",
      color: "bg-rose-100 text-rose-600"
    },
    {
      icon: <Lock size={24} />,
      title: "Segurança",
      description: "Dados encriptados e backups diários.",
      color: "bg-slate-100 text-slate-600"
    }
  ];

  return (
    <section id="features" className="py-20 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Tudo o que precisa para crescer</h2>
          <p className="text-lg text-slate-500 max-w-2xl mx-auto">
            Ferramentas poderosas desenhadas especificamente para empresas de assistência técnica.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 hover:shadow-md transition-all hover:-translate-y-1">
              <div className={`w-12 h-12 ${feature.color} rounded-xl flex items-center justify-center mb-6`}>
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">{feature.title}</h3>
              <p className="text-slate-500 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
