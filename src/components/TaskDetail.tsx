import React, { useState, useEffect } from 'react';
import type { Task } from '../types';
import { X, Trash2, AlignLeft, List, Star, Plus, Check } from 'lucide-react';
import { cn } from '../lib/utils';
import { useTaskMutations, useTasks } from '../hooks/useTasks';
import GlassDatePicker from './GlassDatePicker';

interface TaskDetailProps {
  task: Task;
  onUpdate: (id: string, updates: Partial<Task>) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
  onClose: () => void;
}

const TaskDetail: React.FC<TaskDetailProps> = ({ task, onUpdate, onDelete, onClose }) => {
  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description || '');
  const [dueDate, setDueDate] = useState<string | null>(task.dueDate || null);
  const [listId, setListId] = useState(task.listId);
  const [subtaskTitle, setSubtaskTitle] = useState('');
  
  const { addTask } = useTaskMutations();
  const { tasks: allTasks } = useTasks(task.userId, task.listId, 'all');
  const subtasks = allTasks.filter(t => t.parentId === task.id);

  useEffect(() => {
    setTitle(task.title);
    setDescription(task.description || '');
    setDueDate(task.dueDate || '');
    setListId(task.listId);
  }, [task.id, task.title, task.description, task.dueDate, task.listId]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (title !== task.title || description !== task.description || dueDate !== task.dueDate || listId !== task.listId) {
        onUpdate(task.id, { title, description, dueDate: dueDate || null, listId });
      }
    }, 800);
    return () => clearTimeout(timer);
  }, [title, description, dueDate, listId]);

  const handleAddSubtask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!subtaskTitle.trim()) return;
    
    await addTask({
      userId: task.userId,
      listId: task.listId,
      parentId: task.id,
      title: subtaskTitle.trim(),
      description: '',
      completed: false,
      starred: false,
      dueDate: null,
      order: Date.now(),
    });
    setSubtaskTitle('');
  };

  return (
    <div className="fixed inset-y-0 right-0 w-full max-w-md bg-[#151515]/95 backdrop-blur-sm border-l border-white/20 shadow-2xl z-50 animate-in slide-in-from-right duration-300 flex flex-col">
      <div className="p-4 flex items-center justify-between border-b border-white/5">
        <button 
          onClick={() => onUpdate(task.id, { starred: !task.starred })}
          className={cn(
            "p-2 hover:bg-white/10 rounded-full transition-colors",
            task.starred ? "text-primary active-glow" : "text-slate-500"
          )}
        >
          <Star size={22} fill={task.starred ? "currentColor" : "none"} />
        </button>
        <div className="flex items-center gap-1">
          <button 
            onClick={() => { onDelete(task.id); onClose(); }}
            className="p-2 hover:bg-error/10 text-slate-500 hover:text-error rounded-full transition-colors"
            title="Delete task"
          >
            <Trash2 size={22} />
          </button>
          <button 
            onClick={onClose} 
            className="p-2 hover:bg-white/10 rounded-full transition-colors text-white"
            title="Close details"
          >
            <X size={22} />
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-8 scrollbar-hide">
        <div className="space-y-1">
          <textarea 
            className="text-2xl font-bold bg-transparent border-none w-full focus:outline-none resize-none placeholder:text-slate-700 leading-tight py-1 text-white"
            placeholder="Title"
            rows={1}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>

        <div className="space-y-8">
          <div className="flex items-start gap-5 group cursor-text" onClick={() => document.getElementById('task-description')?.focus()}>
            <AlignLeft size={22} className="mt-1 text-slate-500 shrink-0" />
            <textarea 
              id="task-description"
              className="w-full bg-transparent border-none text-[15px] p-0 focus:outline-none resize-none min-h-[100px] placeholder:text-slate-600 leading-relaxed text-slate-300"
              placeholder="Add details"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div className="flex items-center gap-5 group p-2 -mx-2 rounded-xl transition-colors">
            <div className="flex-1 min-w-0 flex items-center gap-5">
              <GlassDatePicker 
                value={dueDate}
                onChange={setDueDate}
                label="Set due date"
              />
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-start gap-5">
              <List size={22} className="mt-1 text-slate-500 shrink-0" />
              <div className="flex-1">
                <p className="text-[10px] uppercase font-bold tracking-widest text-slate-500 mb-4">Subtasks</p>
                <div className="space-y-4 mb-4">
                  {subtasks.map(st => (
                    <div key={st.id} className="flex items-center gap-4 group">
                      <div 
                        onClick={() => onUpdate(st.id, { completed: !st.completed })}
                        className={cn("h-5 w-5 rounded-full border-2 flex items-center justify-center cursor-pointer transition-all shrink-0", 
                          st.completed ? "bg-primary border-primary" : "border-muted-foreground/30 hover:border-primary/50")}
                      >
                        {st.completed && <Check size={12} className="text-on-primary stroke-[4px]" />}
                      </div>
                      <span className={cn("text-[14px] flex-1 truncate text-white", st.completed && "text-slate-500 line-through decoration-primary/50")}>
                        {st.title}
                      </span>
                    </div>
                  ))}
                </div>
                <form 
                  onSubmit={handleAddSubtask} 
                  className="flex items-center gap-4 group mt-2 cursor-text"
                  onClick={() => document.getElementById('add-subtask-input')?.focus()}
                >
                  <Plus size={20} className="text-primary shrink-0" />
                  <input 
                    id="add-subtask-input"
                    type="text" 
                    placeholder="Add subtasks"
                    className="bg-transparent border-none text-[14px] focus:outline-none w-full placeholder:text-slate-600 text-white"
                    value={subtaskTitle}
                    onChange={(e) => setSubtaskTitle(e.target.value)}
                  />
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="p-4 bg-white/5 border-t border-white/5 mt-auto">
        <p className="text-[10px] text-slate-500 uppercase text-center font-bold tracking-widest opacity-50">
          Created {task.createdAt?.toDate ? task.createdAt.toDate().toLocaleDateString() : 'recently'}
        </p>
      </div>
    </div>
  );
};

export default TaskDetail;
