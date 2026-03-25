import React, { useState, useEffect } from 'react';
import type { Task, TaskList } from '../types';
import { X, Calendar, Trash2, AlignLeft, List, Star, Plus, Check } from 'lucide-react';
import { cn } from '../lib/utils';
import { useTaskMutations, useTasks } from '../hooks/useTasks';

interface TaskDetailProps {
  task: Task;
  lists: TaskList[];
  onUpdate: (id: string, updates: Partial<Task>) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
  onClose: () => void;
}

const TaskDetail: React.FC<TaskDetailProps> = ({ task, lists, onUpdate, onDelete, onClose }) => {
  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description || '');
  const [dueDate, setDueDate] = useState(task.dueDate || '');
  const [listId, setListId] = useState(task.listId);
  const [subtaskTitle, setSubtaskTitle] = useState('');
  
  const { addTask } = useTaskMutations();
  const { tasks: allTasks } = useTasks(task.userId, null, 'all');
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
    <div className="fixed inset-y-0 right-0 w-full max-w-md bg-card border-l border-border shadow-2xl z-50 animate-in slide-in-from-right duration-300 flex flex-col">
      <div className="p-4 flex items-center justify-between border-b border-border/50">
        <button 
          onClick={() => onUpdate(task.id, { starred: !task.starred })}
          className={cn(
            "p-2 hover:bg-muted rounded-full transition-colors",
            task.starred ? "text-yellow-500" : "text-muted-foreground"
          )}
        >
          <Star size={22} fill={task.starred ? "currentColor" : "none"} />
        </button>
        <div className="flex items-center gap-1">
          <button 
            onClick={() => { onDelete(task.id); onClose(); }}
            className="p-2 hover:bg-destructive/10 text-muted-foreground hover:text-destructive rounded-full transition-colors"
            title="Delete task"
          >
            <Trash2 size={22} />
          </button>
          <button 
            onClick={onClose} 
            className="p-2 hover:bg-muted rounded-full transition-colors"
            title="Close details"
          >
            <X size={22} />
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-8 scrollbar-hide">
        <div className="space-y-1">
          <textarea 
            className="text-2xl font-normal bg-transparent border-none w-full focus:outline-none resize-none placeholder:text-muted-foreground/30 leading-tight py-1"
            placeholder="Title"
            rows={1}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>

        <div className="space-y-8">
          <div className="flex items-start gap-5 group">
            <AlignLeft size={22} className="mt-1 text-muted-foreground shrink-0" />
            <textarea 
              className="w-full bg-transparent border-none text-[15px] p-0 focus:outline-none resize-none min-h-[100px] placeholder:text-muted-foreground/50 leading-relaxed"
              placeholder="Add details"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div className="flex items-center gap-5 group hover:bg-muted/30 p-2 -mx-2 rounded-xl transition-colors cursor-pointer">
            <Calendar size={22} className="text-muted-foreground shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground mb-0.5">Due Date</p>
              <input 
                type="date" 
                className="bg-transparent border-none text-[15px] focus:outline-none cursor-pointer w-full text-primary font-medium"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-start gap-5">
              <List size={22} className="mt-1 text-muted-foreground shrink-0" />
              <div className="flex-1">
                <p className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground mb-4">Subtasks</p>
                <div className="space-y-4 mb-4">
                  {subtasks.map(st => (
                    <div key={st.id} className="flex items-center gap-4 group">
                      <div 
                        onClick={() => onUpdate(st.id, { completed: !st.completed })}
                        className={cn("h-5 w-5 rounded-full border-2 flex items-center justify-center cursor-pointer transition-all shrink-0", 
                          st.completed ? "bg-primary border-primary" : "border-muted-foreground/30 hover:border-primary/50")}
                      >
                        {st.completed && <Check size={12} className="text-black stroke-[4px]" />}
                      </div>
                      <span className={cn("text-[14px] flex-1 truncate", st.completed && "text-muted-foreground line-through")}>
                        {st.title}
                      </span>
                    </div>
                  ))}
                </div>
                <form onSubmit={handleAddSubtask} className="flex items-center gap-4 group mt-2">
                  <Plus size={20} className="text-primary shrink-0" />
                  <input 
                    type="text" 
                    placeholder="Add subtasks"
                    className="bg-transparent border-none text-[14px] focus:outline-none w-full placeholder:text-muted-foreground/40"
                    value={subtaskTitle}
                    onChange={(e) => setSubtaskTitle(e.target.value)}
                  />
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="p-4 bg-muted/10 border-t border-border/50">
        <p className="text-[10px] text-muted-foreground uppercase text-center font-medium tracking-tight">
          Created {task.createdAt?.toDate ? task.createdAt.toDate().toLocaleDateString() : 'recently'}
        </p>
      </div>
    </div>
  );
};

export default TaskDetail;
