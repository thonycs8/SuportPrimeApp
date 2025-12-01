import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

export const FAQ: React.FC = () => {
  const faqs = [
    {
      q: "Preciso de cartão de crédito para testar?",
      a: "Não. O período de teste de 15 dias é totalmente gratuito e não requer dados de pagamento."
    },
    {
      q: "Funciona sem internet?",
      a: "Sim! A App móvel permite trabalhar offline e sincroniza os dados assim que recuperar a ligação."
    },
    {
      q: "Posso cancelar a qualquer momento?",
      a: "Sim. Não temos contratos de fidelização. Pode cancelar a sua subscrição quando quiser."
    },
    {
      q: "Quantos utilizadores posso ter?",
      a: "O plano Pro inclui até 5 utilizadores. Para equipas maiores, contacte-nos para o plano Enterprise."
    }
  ];

  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section className="py-20 bg-white">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-slate-900 mb-4">Perguntas Frequentes</h2>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div key={index} className="border border-slate-200 rounded-xl overflow-hidden">
              <button
                className="w-full flex items-center justify-between p-6 text-left bg-white hover:bg-slate-50 transition-colors"
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
              >
                <span className="font-bold text-slate-800">{faq.q}</span>
                {openIndex === index ? <ChevronUp className="text-slate-400" /> : <ChevronDown className="text-slate-400" />}
              </button>
              {openIndex === index && (
                <div className="p-6 pt-0 bg-white text-slate-600 leading-relaxed border-t border-slate-100">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
