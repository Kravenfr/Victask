import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useUIStore } from '../store/uiStore';
import { useTaskMutations } from '../hooks/useTasks';
import { Plus, Star } from 'lucide-react';
import { cn } from '../lib/utils';
import GlassDatePicker from './GlassDatePicker';

const AddTaskInput: React.FC = () => {
  const { user } = useAuth();
  const { selectedListId } = useUIStore();
  const { addTask } = useTaskMutations();
  
  const [title, setTitle] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isStarred, setIsStarred] = useState(false);

  const [dueDate, setDueDate] = useState<string | null>(null);

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!title.trim() || !user || loading) return;

    setLoading(true);
    
    // Fire and forget: Firestore handles local caching and optimistic UI updates
    addTask({
      userId: user.uid,
      listId: selectedListId || 'inbox',
      title: title.trim(),
      description: '',
      completed: false,
      starred: isStarred,
      dueDate: dueDate,
      order: Date.now(),
    }).catch(err => {
      console.error("Error adding task", err);
    });

    // Clear UI immediately so user can type the next task
    setTitle('');
    setDueDate(null);
    setIsStarred(false);
    setIsFocused(true);
    setLoading(false);
  };

  return (
    <div className="fixed bottom-0 left-0 md:left-72 right-0 p-4 md:p-10 flex justify-center z-30 pointer-events-none">
      <form 
        onSubmit={handleSubmit}
        className={cn(
          "w-full max-w-2xl bg-[#1a1a1a]/95 backdrop-blur-md border border-white/20 shadow-[0px_20px_60px_rgba(0,0,0,0.6)] rounded-3xl transition-all duration-300 pointer-events-auto",
          isFocused ? 'ring-2 ring-primary/30 border-primary' : ''
        )}
      >
        <div className="flex items-center gap-4 p-2 md:p-4">
          <div className="h-10 w-10 flex items-center justify-center text-primary shrink-0">
            <Plus size={28} />
          </div>
          <input 
            type="text" 
            placeholder="Add a task"
            className="flex-1 bg-transparent border-none py-2 text-[18px] focus:outline-none placeholder:text-slate-500 font-light text-white"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onFocus={() => setIsFocused(true)}
          />
          
          {(isFocused || title) && (
            <div className="flex items-center gap-2 pr-2">
              <button 
                type="button"
                onClick={() => setIsStarred(!isStarred)}
                className={cn(
                  "p-2.5 hover:bg-white/10 rounded-full transition-colors",
                  isStarred ? "text-primary active-glow" : "text-slate-500"
                )}
              >
                <Star size={22} fill={isStarred ? "currentColor" : "none"} />
              </button>
              <button 
                type="submit"
                disabled={!title.trim() || loading}
                className="ml-2 bg-primary text-on-primary px-6 py-2.5 rounded-2xl text-sm font-bold hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg active:scale-95 relative z-[110]"
              >
                Save
              </button>
            </div>
          )}
        </div>
        
        {isFocused && (
          <div className="px-16 pb-4 flex items-center gap-6 border-t border-white/5 pt-4 bg-white/5">
            <GlassDatePicker 
              value={dueDate}
              onChange={setDueDate}
              label="Add date/time"
              position="top"
            />
          </div>
        )}
      </form>
    </div>
  );
};

export default AddTaskInput;
