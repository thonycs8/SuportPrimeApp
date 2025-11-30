
import React, { useState } from 'react';
import { ServiceOrder, ServiceStatus, Priority } from '../types';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Clock, MapPin } from 'lucide-react';

interface CalendarViewProps {
  orders: ServiceOrder[];
  onSelectOrder: (order: ServiceOrder) => void;
}

type CalendarMode = 'month' | 'week' | 'day';

export const CalendarView: React.FC<CalendarViewProps> = ({ orders, onSelectOrder }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<CalendarMode>('month');

  // --- Helpers ---
  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const days = new Date(year, month + 1, 0).getDate();
    const firstDay = new Date(year, month, 1).getDay(); // 0 is Sunday
    return { days, firstDay };
  };

  const getStartOfWeek = (date: Date) => {
    const d = new Date(date);
    const day = d.getDay();
    const diff = d.getDate() - day; // adjust when day is sunday
    return new Date(d.setDate(diff));
  };

  const addDays = (date: Date, days: number) => {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
  };

  const isSameDay = (d1: Date, d2: Date) => {
    return d1.getDate() === d2.getDate() &&
           d1.getMonth() === d2.getMonth() &&
           d1.getFullYear() === d2.getFullYear();
  };

  // --- Navigation Handlers ---
  const handlePrev = () => {
    const newDate = new Date(currentDate);
    if (viewMode === 'month') newDate.setMonth(newDate.getMonth() - 1);
    else if (viewMode === 'week') newDate.setDate(newDate.getDate() - 7);
    else newDate.setDate(newDate.getDate() - 1);
    setCurrentDate(newDate);
  };

  const handleNext = () => {
    const newDate = new Date(currentDate);
    if (viewMode === 'month') newDate.setMonth(newDate.getMonth() + 1);
    else if (viewMode === 'week') newDate.setDate(newDate.getDate() + 7);
    else newDate.setDate(newDate.getDate() + 1);
    setCurrentDate(newDate);
  };

  const handleToday = () => setCurrentDate(new Date());

  // --- Data Filtering ---
  const getOrdersForDay = (date: Date) => {
    return orders.filter(o => isSameDay(new Date(o.startDate), date));
  };

  // --- Styling Helpers ---
  const getStatusColor = (status: ServiceStatus) => {
    switch (status) {
      case ServiceStatus.DONE: return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case ServiceStatus.PENDING: return 'bg-amber-100 text-amber-800 border-amber-200';
      case ServiceStatus.IN_PROGRESS: return 'bg-blue-100 text-blue-800 border-blue-200';
      case ServiceStatus.CANCELED: return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-slate-100 text-slate-800 border-slate-200';
    }
  };

  const monthNames = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
  ];

  // --- Views ---

  const MonthView = () => {
    const { days, firstDay } = getDaysInMonth(currentDate);
    const today = new Date();

    return (
      <div className="grid grid-cols-7 gap-px bg-slate-200 border border-slate-200 rounded-lg overflow-hidden flex-1">
        {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].map(day => (
          <div key={day} className="bg-slate-50 p-2 text-center text-xs font-semibold text-slate-500 uppercase">
            {day}
          </div>
        ))}

        {Array.from({ length: firstDay }).map((_, i) => (
          <div key={`empty-${i}`} className="bg-white min-h-[100px] md:min-h-[120px]" />
        ))}

        {Array.from({ length: days }).map((_, i) => {
          const day = i + 1;
          const currentDayDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
          const dayOrders = getOrdersForDay(currentDayDate);
          const isToday = isSameDay(currentDayDate, today);

          return (
            <div key={day} className={`bg-white min-h-[100px] md:min-h-[120px] p-1 md:p-2 hover:bg-slate-50 transition-colors ${isToday ? 'bg-blue-50/30' : ''}`}>
              <div className="flex justify-between items-start mb-1">
                <span className={`text-xs md:text-sm font-medium w-6 h-6 md:w-7 md:h-7 flex items-center justify-center rounded-full ${isToday ? 'bg-blue-600 text-white' : 'text-slate-700'}`}>
                  {day}
                </span>
                {dayOrders.length > 0 && (
                   <span className="hidden md:inline text-[10px] text-slate-400 font-medium">{dayOrders.length} OS</span>
                )}
              </div>
              
              <div className="space-y-1 overflow-hidden">
                {dayOrders.slice(0, 3).map(order => (
                  <button
                    key={order.id}
                    onClick={(e) => { e.stopPropagation(); onSelectOrder(order); }}
                    className={`w-full text-left text-[10px] truncate px-1.5 py-0.5 rounded border-l-2 ${
                       getStatusColor(order.status).replace('bg-', 'hover:brightness-95 bg-')
                    }`}
                  >
                    <span className="font-bold">{new Date(order.startDate).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span> {order.customer.name}
                  </button>
                ))}
                {dayOrders.length > 3 && (
                  <div className="text-center text-[10px] text-slate-400 font-medium">
                    + {dayOrders.length - 3} mais
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  const TimeGridEvent = ({ order }: { order: ServiceOrder }) => {
    const start = new Date(order.startDate);
    const end = new Date(order.endDate);
    
    // Simple positioning calculation (assuming 08:00 start for grid)
    const startHour = start.getHours();
    const startMin = start.getMinutes();
    const durationMin = (end.getTime() - start.getTime()) / (1000 * 60);
    
    // Grid starts at 7:00 AM. Each hour is 60px height.
    const topOffset = ((startHour - 7) * 60) + startMin;
    const height = Math.max(durationMin, 30); // Minimum 30 mins visual height

    if (startHour < 7 || startHour > 20) return null; // Hide out of bounds for simplified view

    return (
      <button
        onClick={(e) => { e.stopPropagation(); onSelectOrder(order); }}
        style={{ top: `${topOffset}px`, height: `${height}px` }}
        className={`absolute inset-x-1 rounded-md border text-left p-2 shadow-sm text-xs overflow-hidden transition-all hover:z-10 hover:shadow-md hover:scale-[1.02] flex flex-col gap-0.5 ${getStatusColor(order.status)}`}
      >
        <div className="flex justify-between items-start">
             <span className="font-bold truncate">{order.customer.name}</span>
             {order.priority === Priority.CRITICAL && <span className="w-2 h-2 rounded-full bg-red-500 shrink-0 animate-pulse"/>}
        </div>
        <div className="flex items-center gap-1 opacity-75">
             <MapPin size={10} /> <span className="truncate">{order.customer.city}</span>
        </div>
        <div className="mt-auto pt-1 font-mono text-[10px] opacity-80 border-t border-current/20">
            {start.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})} - {end.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
        </div>
      </button>
    );
  };

  const WeekView = () => {
    const startOfWeek = getStartOfWeek(currentDate);
    const weekDays = Array.from({ length: 7 }).map((_, i) => addDays(startOfWeek, i));
    const hours = Array.from({ length: 14 }).map((_, i) => i + 7); // 07:00 to 20:00

    return (
      <div className="flex flex-col h-full bg-white rounded-lg border border-slate-200 overflow-hidden flex-1 min-h-[600px]">
        {/* Header */}
        <div className="grid grid-cols-8 border-b border-slate-200 bg-slate-50">
          <div className="p-4 border-r border-slate-200"></div> {/* Time Col */}
          {weekDays.map(day => {
            const isToday = isSameDay(day, new Date());
            return (
                <div key={day.toISOString()} className={`p-2 text-center border-r border-slate-200 last:border-r-0 ${isToday ? 'bg-blue-50/50' : ''}`}>
                    <p className="text-xs font-bold text-slate-500 uppercase">{day.toLocaleDateString('pt-PT', { weekday: 'short' })}</p>
                    <div className={`mx-auto w-8 h-8 flex items-center justify-center rounded-full mt-1 font-bold text-sm ${isToday ? 'bg-blue-600 text-white' : 'text-slate-800'}`}>
                        {day.getDate()}
                    </div>
                </div>
            );
          })}
        </div>

        {/* Scrollable Grid */}
        <div className="flex-1 overflow-y-auto relative custom-scrollbar">
           <div className="grid grid-cols-8 min-h-[840px]"> {/* 14 hours * 60px */}
              {/* Time Column */}
              <div className="border-r border-slate-200 bg-slate-50 text-xs text-slate-400 font-medium">
                  {hours.map(h => (
                      <div key={h} className="h-[60px] border-b border-slate-200 flex items-start justify-center pt-2">
                          {h}:00
                      </div>
                  ))}
              </div>

              {/* Days Columns */}
              {weekDays.map(day => (
                  <div key={day.toISOString()} className="relative border-r border-slate-200 last:border-r-0 border-b border-slate-200">
                      {/* Grid Lines */}
                      {hours.map(h => (
                          <div key={h} className="h-[60px] border-b border-slate-100 box-border"></div>
                      ))}
                      
                      {/* Events */}
                      {getOrdersForDay(day).map(order => (
                          <TimeGridEvent key={order.id} order={order} />
                      ))}
                  </div>
              ))}
           </div>
        </div>
      </div>
    );
  };

  const DayView = () => {
    const hours = Array.from({ length: 14 }).map((_, i) => i + 7); // 07:00 to 20:00
    const dayOrders = getOrdersForDay(currentDate);

    return (
       <div className="flex flex-col h-full bg-white rounded-lg border border-slate-200 overflow-hidden flex-1 min-h-[600px]">
          {/* Header */}
          <div className="p-4 border-b border-slate-200 bg-slate-50 text-center">
              <h3 className="text-lg font-bold text-slate-800 capitalize">
                  {currentDate.toLocaleDateString('pt-PT', { weekday: 'long', day: 'numeric', month: 'long' })}
              </h3>
          </div>

          <div className="flex-1 overflow-y-auto relative custom-scrollbar">
             <div className="flex min-h-[840px]">
                 {/* Time Column */}
                 <div className="w-20 shrink-0 border-r border-slate-200 bg-slate-50 text-xs text-slate-400 font-medium">
                      {hours.map(h => (
                          <div key={h} className="h-[60px] border-b border-slate-200 flex items-start justify-center pt-2">
                              {h}:00
                          </div>
                      ))}
                  </div>

                  {/* Events Area */}
                  <div className="flex-1 relative bg-white">
                      {hours.map(h => (
                          <div key={h} className="h-[60px] border-b border-slate-100"></div>
                      ))}
                      {dayOrders.map(order => (
                          <TimeGridEvent key={order.id} order={order} />
                      ))}
                  </div>
             </div>
          </div>
       </div>
    );
  };

  const getHeaderTitle = () => {
      if (viewMode === 'day') return 'Agenda do Dia';
      if (viewMode === 'week') return 'Agenda Semanal';
      return `${monthNames[currentDate.getMonth()]} ${currentDate.getFullYear()}`;
  }

  return (
    <div className="h-full flex flex-col gap-4">
      {/* Control Bar */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 bg-white p-4 rounded-xl shadow-sm border border-slate-200">
        
        {/* Navigation */}
        <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-start">
            <h2 className="text-lg font-bold text-slate-800 w-48 truncate">{getHeaderTitle()}</h2>
            <div className="flex items-center gap-1 bg-slate-100 rounded-lg p-1">
                <button onClick={handlePrev} className="p-1.5 hover:bg-white rounded-md text-slate-600 shadow-sm transition-all"><ChevronLeft size={18}/></button>
                <button onClick={handleToday} className="px-3 py-1.5 text-xs font-bold hover:bg-white rounded-md text-slate-700 transition-all">Hoje</button>
                <button onClick={handleNext} className="p-1.5 hover:bg-white rounded-md text-slate-600 shadow-sm transition-all"><ChevronRight size={18}/></button>
            </div>
        </div>

        {/* View Switcher */}
        <div className="flex p-1 bg-slate-100 rounded-lg w-full md:w-auto">
          <button 
            onClick={() => setViewMode('month')} 
            className={`flex-1 md:flex-none px-4 py-2 rounded-md text-sm font-medium transition-all ${viewMode === 'month' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
          >
            Mês
          </button>
          <button 
            onClick={() => setViewMode('week')} 
            className={`flex-1 md:flex-none px-4 py-2 rounded-md text-sm font-medium transition-all ${viewMode === 'week' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
          >
            Semana
          </button>
          <button 
            onClick={() => setViewMode('day')} 
            className={`flex-1 md:flex-none px-4 py-2 rounded-md text-sm font-medium transition-all ${viewMode === 'day' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
          >
            Dia
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-0">
          {viewMode === 'month' && <MonthView />}
          {viewMode === 'week' && <WeekView />}
          {viewMode === 'day' && <DayView />}
      </div>
    </div>
  );
};
