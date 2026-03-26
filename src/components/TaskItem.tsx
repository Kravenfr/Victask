import React from 'react';
import type { Task } from '../types';
import { Check, GripVertical, Calendar, Star } from 'lucide-react';
import { cn } from '../lib/utils';
import { format } from 'date-fns';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface TaskItemProps {
  task: Task;
  onToggle: (id: string) => void;
  onStar: (id: string) => void;
  onDelete: (id: string) => void;
  onClick: (task: Task) => void;
  isSubtask?: boolean;
}

const TaskItem: React.FC<TaskItemProps> = ({ task, onToggle, onStar, onClick, isSubtask }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id: task.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 50 : 0,
    marginLeft: isSubtask ? '3rem' : '0',
  };

  return (
    <div 
      ref={setNodeRef}
      style={style}
      onClick={() => onClick(task)}
      className={cn(
        "group bg-transparent hover:bg-white/5 border-b border-white/5 py-4 px-4 flex items-center gap-4 transition-all cursor-pointer relative rounded-2xl",
        isDragging && "glass-card active-glow z-50",
        task.completed && "opacity-50 grayscale hover:grayscale-0 hover:opacity-100"
      )}
    >
      <div 
        {...attributes} 
        {...listeners}
        onClick={(e) => e.stopPropagation()}
        className="cursor-grab active:cursor-grabbing text-slate-500/0 group-hover:text-slate-500/40 transition-colors shrink-0"
      >
        <GripVertical size={18} />
      </div>
      
      <div 
        onClick={(e) => { e.stopPropagation(); onToggle(task.id); }}
        className={cn("task-checkbox shrink-0", task.completed && "completed")}
      >
        <Check size={14} className="task-checkbox-inner stroke-[4px]" />
      </div>

      <div className="flex-1 min-w-0 py-0.5">
        <h3 className={cn(
          "text-[15px] font-medium transition-all truncate leading-normal text-white",
          task.completed && "text-slate-500 line-through decoration-primary/50"
        )}>
          {task.title}
        </h3>
        {(task.description || task.dueDate) && (
          <div className="flex items-center gap-3 mt-1">
            {task.description && (
              <p className="text-[13px] text-slate-400 line-clamp-1 italic">{task.description}</p>
            )}
            {task.dueDate && (
              <div className="flex items-center gap-1.5 text-[12px] text-primary font-bold bg-primary/10 px-2 py-0.5 rounded-full border border-primary/20">
                <Calendar size={12} />
                {format(new Date(task.dueDate), 'MMM d')}
              </div>
            )}
          </div>
        )}
      </div>

      <button 
        onClick={(e) => { e.stopPropagation(); onStar(task.id); }}
        className={cn(
          "p-2 hover:bg-white/10 rounded-full transition-colors shrink-0",
          task.starred ? "text-primary active-glow" : "text-slate-500/20 hover:text-slate-500/60"
        )}
      >
        <Star size={20} fill={task.starred ? "currentColor" : "none"} />
      </button>
    </div>
  );
};

export default TaskItem;
