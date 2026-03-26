import React, { useState, useRef, useEffect } from 'react';
import { Calendar as CalendarIcon, Clock, ChevronLeft, ChevronRight, X } from 'lucide-react';
import { cn } from '../lib/utils';
import { format, addMonths, subMonths, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, isToday, parseISO } from 'date-fns';

interface GlassDatePickerProps {
  value: string | null;
  onChange: (value: string | null) => void;
  label?: string;
  position?: 'top' | 'bottom';
}

const GlassDatePicker: React.FC<GlassDatePickerProps> = ({ 
  value, 
  onChange, 
  label = 'Add date/time',
  position = 'bottom' 
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(value ? parseISO(value) : null);
  const [selectedTime, setSelectedTime] = useState(value ? format(parseISO(value), 'HH:mm') : '12:00');
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const days = eachDayOfInterval({
    start: startOfMonth(currentMonth),
    end: endOfMonth(currentMonth),
  });

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
    const [hours, minutes] = selectedTime.split(':');
    const newDateTime = new Date(date);
    newDateTime.setHours(parseInt(hours), parseInt(minutes));
    onChange(newDateTime.toISOString());
  };

  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedTime(e.target.value);
    if (selectedDate) {
      const [hours, minutes] = e.target.value.split(':');
      const newDateTime = new Date(selectedDate);
      newDateTime.setHours(parseInt(hours), parseInt(minutes));
      onChange(newDateTime.toISOString());
    }
  };

  const clearDate = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedDate(null);
    onChange(null);
  };

  return (
    <div className="relative" ref={containerRef}>
      <button 
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "flex items-center gap-2.5 text-xs font-bold transition-all uppercase tracking-widest px-3 py-1.5 rounded-lg border",
          value 
            ? "text-primary border-primary/30 bg-primary/5 active-glow" 
            : "text-slate-500 border-transparent hover:text-slate-300 hover:bg-white/5"
        )}
      >
        <CalendarIcon size={16} />
        {value ? format(parseISO(value), 'MMM d, HH:mm') : label}
        {value && <X size={14} className="ml-1 hover:text-white" onClick={clearDate} />}
      </button>

      {isOpen && (
        <div className={cn(
          "absolute w-72 glass-card rounded-2xl p-4 shadow-2xl border border-white/10 z-[100] animate-in duration-200",
          position === 'top' ? "bottom-full mb-4 slide-in-from-bottom-2" : "top-full mt-4 slide-in-from-top-2",
          "left-0"
        )}>
          {/* Calendar Header */}
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-white font-bold">{format(currentMonth, 'MMMM yyyy')}</h4>
            <div className="flex gap-1">
              <button 
                type="button"
                onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
                className="p-1.5 hover:bg-white/10 rounded-lg text-slate-400"
              >
                <ChevronLeft size={16} />
              </button>
              <button 
                type="button"
                onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
                className="p-1.5 hover:bg-white/10 rounded-lg text-slate-400"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>

          {/* Weekday Labels */}
          <div className="grid grid-cols-7 mb-2">
            {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(d => (
              <span key={d} className="text-[10px] text-center font-black text-slate-600 uppercase">{d}</span>
            ))}
          </div>

          {/* Days Grid */}
          <div className="grid grid-cols-7 gap-1">
            {/* Pad transition from previous month if needed (simplified here) */}
            {days.map(day => (
              <button
                key={day.toString()}
                type="button"
                onClick={() => handleDateSelect(day)}
                className={cn(
                  "h-8 w-8 rounded-lg flex items-center justify-center text-[13px] transition-all",
                  isSameDay(day, selectedDate || new Date(0)) 
                    ? "bg-primary text-on-primary font-bold shadow-lg shadow-primary/20" 
                    : "text-slate-400 hover:bg-white/10",
                  isToday(day) && !isSameDay(day, selectedDate || new Date(0)) && "text-primary border border-primary/20"
                )}
              >
                {format(day, 'd')}
              </button>
            ))}
          </div>

          {/* Time Picker */}
          <div className="mt-4 pt-4 border-t border-white/5 flex items-center justify-between">
            <div className="flex items-center gap-2 text-slate-400">
              <Clock size={16} />
              <span className="text-[11px] font-bold uppercase tracking-widest text-slate-500">Time</span>
            </div>
            <input 
              type="time" 
              value={selectedTime}
              onChange={handleTimeChange}
              className="bg-white/5 border border-white/10 rounded-lg px-2 py-1 text-sm text-white focus:outline-none focus:border-primary/50"
            />
          </div>

          <button 
            type="button"
            onClick={() => setIsOpen(false)}
            className="w-full mt-4 bg-primary/10 hover:bg-primary/20 text-primary py-2 rounded-xl text-xs font-bold uppercase tracking-widest transition-all"
          >
            Done
          </button>
        </div>
      )}
    </div>
  );
};

export default GlassDatePicker;
