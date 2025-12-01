import React from 'react';

export const HowItWorks: React.FC = () => {
  const steps = [
    {
      num: "01",
      title: "Crie a Ordem",
      desc: "Receba o pedido do cliente e crie uma ordem de serviço em segundos."
    },
    {
      num: "02",
      title: "Atribua ao Técnico",
      desc: "O técnico recebe a notificação na App com todos os detalhes e localização."
    },
    {
      num: "03",
      title: "Execução e Relatório",
      desc: "O técnico preenche o relatório, tira fotos e recolhe a assinatura do cliente."
    },
    {
      num: "04",
      title: "Faturação Automática",
      desc: "O relatório é enviado por email e a fatura pode ser emitida de imediato."
    }
  ];

  return (
    <section id="how-it-works" className="py-20 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Simples como deve ser</h2>
          <p className="text-lg text-slate-500">Fluxo de trabalho otimizado para a sua equipa.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <div key={index} className="relative group">
              <div className="text-6xl font-black text-slate-100 absolute -top-8 -left-4 z-0 group-hover:text-blue-50 transition-colors duration-300 select-none">
                {step.num}
              </div>
              <div className="relative z-10 pt-4">
                <h3 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-blue-600 transition-colors">{step.title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed">
                  {step.desc}
                </p>
              </div>
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-12 right-0 w-full h-0.5 bg-slate-200 -z-10 transform translate-x-1/2"></div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
