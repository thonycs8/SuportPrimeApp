import React from 'react';
import { ServiceOrder, ServiceStatus } from '../types';

interface CalendarViewProps {
  orders: ServiceOrder[];
  onSelectOrder: (order: ServiceOrder) => void;
}

export const CalendarView: React.FC<CalendarViewProps> = ({ orders, onSelectOrder }) => {
  const today = new Date();
  const [currentDate, setCurrentDate] = React.useState(new Date());

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const days = new Date(year, month + 1, 0).getDate();
    const firstDay = new Date(year, month, 1).getDay(); // 0 is Sunday
    return { days, firstDay };
  };

  const { days, firstDay } = getDaysInMonth(currentDate);

  const prevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const getOrdersForDay = (day: number) => {
    return orders.filter(o => {
      const d = new Date(o.startDate);
      return d.getDate() === day && d.getMonth() === currentDate.getMonth() && d.getFullYear() === currentDate.getFullYear();
    });
  };

  const monthNames = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
  ];

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-slate-800">
          {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
        </h2>
        <div className="flex gap-2">
          <button onClick={prevMonth} className="p-2 hover:bg-slate-100 rounded-lg text-slate-600">
            &lt; Anterior
          </button>
          <button onClick={() => setCurrentDate(new Date())} className="p-2 hover:bg-slate-100 rounded-lg text-sm font-medium text-blue-600">
            Hoje
          </button>
          <button onClick={nextMonth} className="p-2 hover:bg-slate-100 rounded-lg text-slate-600">
            Próximo &gt;
          </button>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-7 gap-px bg-slate-200 border border-slate-200 rounded-lg overflow-hidden">
        {/* Days Header */}
        {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].map(day => (
          <div key={day} className="bg-slate-50 p-2 text-center text-xs font-semibold text-slate-500 uppercase">
            {day}
          </div>
        ))}

        {/* Empty cells before first day */}
        {Array.from({ length: firstDay }).map((_, i) => (
          <div key={`empty-${i}`} className="bg-white min-h-[120px]" />
        ))}

        {/* Days */}
        {Array.from({ length: days }).map((_, i) => {
          const day = i + 1;
          const dayOrders = getOrdersForDay(day);
          const isToday = day === today.getDate() && currentDate.getMonth() === today.getMonth() && currentDate.getFullYear() === today.getFullYear();

          return (
            <div key={day} className={`bg-white min-h-[120px] p-2 hover:bg-slate-50 transition-colors ${isToday ? 'bg-blue-50/30' : ''}`}>
              <div className="flex justify-between items-start mb-2">
                <span className={`text-sm font-medium w-7 h-7 flex items-center justify-center rounded-full ${isToday ? 'bg-blue-600 text-white' : 'text-slate-700'}`}>
                  {day}
                </span>
                {dayOrders.length > 0 && (
                   <span className="text-xs text-slate-400">{dayOrders.length} serviços</span>
                )}
              </div>
              
              <div className="space-y-1">
                {dayOrders.slice(0, 3).map(order => (
                  <button
                    key={order.id}
                    onClick={() => onSelectOrder(order)}
                    className={`w-full text-left text-xs truncate px-2 py-1 rounded border-l-2 ${
                      order.status === ServiceStatus.DONE ? 'border-green-500 bg-green-50 text-green-800' :
                      order.status === ServiceStatus.PENDING ? 'border-amber-500 bg-amber-50 text-amber-800' :
                      'border-blue-500 bg-blue-50 text-blue-800'
                    }`}
                  >
                    {order.startDate.substring(11, 16)} - {order.customer.name.substring(0, 15)}...
                  </button>
                ))}
                {dayOrders.length > 3 && (
                  <div className="text-center text-xs text-slate-400 pt-1">
                    + {dayOrders.length - 3} mais
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
