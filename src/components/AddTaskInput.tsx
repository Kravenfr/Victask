import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useUIStore } from '../store/uiStore';
import { useTaskMutations } from '../hooks/useTasks';
import { Plus, Calendar, Star } from 'lucide-react';
import { cn } from '../lib/utils';

const AddTaskInput: React.FC = () => {
  const { user } = useAuth();
  const { selectedListId } = useUIStore();
  const { addTask } = useTaskMutations();
  
  const [title, setTitle] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isStarred, setIsStarred] = useState(false);

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!title.trim() || !user || loading) return;

    setLoading(true);
    try {
      await addTask({
        userId: user.uid,
        listId: selectedListId || 'inbox',
        title: title.trim(),
        description: '',
        completed: false,
        starred: isStarred,
        dueDate: null,
        order: Date.now(),
      });
      setTitle('');
      setIsStarred(false);
      setIsFocused(false);
    } catch (err) {
      console.error("Error adding task", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-0 left-0 md:left-72 right-0 p-4 md:p-10 flex justify-center z-30 pointer-events-none">
      <form 
        onSubmit={handleSubmit}
        className={cn(
          "w-full max-w-2xl bg-card border shadow-2xl rounded-3xl transition-all duration-300 overflow-hidden pointer-events-auto",
          isFocused ? 'ring-2 ring-primary/30 border-primary' : 'border-border/50'
        )}
      >
        <div className="flex items-center gap-4 p-2 md:p-4">
          <div className="h-10 w-10 flex items-center justify-center text-primary shrink-0">
            <Plus size={28} />
          </div>
          <input 
            type="text" 
            placeholder="Add a task"
            className="flex-1 bg-transparent border-none py-2 text-[16px] focus:outline-none placeholder:text-muted-foreground/50 font-medium"
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
                  "p-2.5 hover:bg-muted rounded-full transition-colors",
                  isStarred ? "text-yellow-500" : "text-muted-foreground"
                )}
              >
                <Star size={22} fill={isStarred ? "currentColor" : "none"} />
              </button>
              <button 
                type="submit"
                disabled={!title.trim() || loading}
                className="ml-2 bg-primary text-primary-foreground px-6 py-2.5 rounded-full text-sm font-bold hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg"
              >
                Save
              </button>
            </div>
          )}
        </div>
        
        {isFocused && (
          <div className="px-16 pb-4 flex items-center gap-6 border-t border-border/30 pt-4 bg-muted/10">
            <button type="button" className="flex items-center gap-2.5 text-xs font-bold text-muted-foreground hover:text-primary transition-colors uppercase tracking-widest">
              <Calendar size={16} />
              Add date/time
            </button>
          </div>
        )}
      </form>
    </div>
  );
};

export default AddTaskInput;
