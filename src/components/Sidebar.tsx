import React, { useState } from 'react';
import { useUIStore } from '../store/uiStore';
import { useAuth } from '../hooks/useAuth';
import { useLists, useListMutations } from '../hooks/useTasks';
import { 
  Plus, 
  CheckCircle2, 
  Hash,
  Star,
  Settings,
  HelpCircle,
  Menu
} from 'lucide-react';
import { cn } from '../lib/utils';
import SettingsModal from './SettingsModal';

const Sidebar: React.FC = () => {
  const { sidebarOpen, setSidebarOpen, filter, setFilter, selectedListId, setSelectedListId } = useUIStore();
  const { user } = useAuth();
  const { lists } = useLists(user?.uid);
  const { addList } = useListMutations();
  const [newListTitle, setNewListTitle] = useState('');
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const handleSetFilter = (newFilter: any) => {
    setFilter(newFilter);
    if (window.innerWidth < 768) setSidebarOpen(false);
  };

  const handleSetList = (listId: string) => {
    setSelectedListId(listId);
    if (window.innerWidth < 768) setSidebarOpen(false);
  };

  const handleCreateList = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newListTitle.trim() || !user) return;
    try {
      await addList({ 
        userId: user.uid, 
        title: newListTitle.trim() 
      });
      setNewListTitle('');
    } catch (err) {
      console.error("Error creating list", err);
    }
  };

  return (
    <>
      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside className={cn(
        "fixed md:sticky top-0 left-0 z-50 h-screen w-72 bg-card border-r border-border transition-transform duration-300 flex flex-col",
        sidebarOpen ? "translate-x-0" : "-translate-x-full md:hidden"
      )}>
        <div className="p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setSidebarOpen(false)}
              className="p-2 hover:bg-muted rounded-full transition-colors md:hidden"
            >
              <Menu size={22} />
            </button>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="text-primary h-6 w-6" />
              <h1 className="text-xl font-bold tracking-tight">Victask</h1>
            </div>
          </div>
        </div>

        <nav className="flex-1 overflow-y-auto px-2 space-y-1 scrollbar-hide pb-6">
          <button 
            onClick={() => handleSetFilter('starred')}
            className={cn(
              "w-full flex items-center gap-3 px-4 py-3 rounded-r-full text-[14px] font-medium transition-colors",
              filter === 'starred' ? "bg-primary/10 text-primary" : "hover:bg-muted text-foreground"
            )}
          >
            <Star size={20} fill={filter === 'starred' ? "currentColor" : "none"} />
            Starred
          </button>

          <div className="h-px bg-border/50 my-2 mx-4" />

          {lists.map(list => (
            <button 
              key={list.id}
              onClick={() => handleSetList(list.id)}
              className={cn(
                "w-full flex items-center gap-3 px-4 py-3 rounded-r-full text-[14px] font-medium transition-colors",
                selectedListId === list.id && filter !== 'starred' ? "bg-primary/10 text-primary" : "hover:bg-muted text-foreground"
              )}
            >
              <Hash size={20} className={cn(
                selectedListId === list.id && filter !== 'starred' ? "text-primary" : "text-muted-foreground/50"
              )} />
              <span className="truncate">{list.title}</span>
            </button>
          ))}

          <form onSubmit={handleCreateList} className="pt-2 px-4 flex items-center gap-3 group">
            <Plus size={20} className="text-muted-foreground/50 group-hover:text-primary transition-colors" />
            <input 
              type="text" 
              placeholder="Create new list" 
              className="w-full bg-transparent border-none text-[14px] py-1.5 focus:outline-none placeholder:text-muted-foreground/50 font-medium"
              value={newListTitle}
              onChange={(e) => setNewListTitle(e.target.value)}
            />
          </form>
        </nav>

        <div className="p-4 border-t border-border mt-auto flex flex-col gap-1">
          <button 
            onClick={() => setIsSettingsOpen(true)}
            className="flex items-center gap-3 px-4 py-3 text-[14px] hover:bg-muted rounded-r-full transition-colors text-foreground font-medium"
          >
            <Settings size={20} />
            Settings
          </button>
          <button className="flex items-center gap-3 px-4 py-3 text-[14px] hover:bg-muted rounded-r-full transition-colors text-foreground font-medium">
            <HelpCircle size={20} />
            Help
          </button>
        </div>
      </aside>

      {isSettingsOpen && <SettingsModal onClose={() => setIsSettingsOpen(false)} />}
    </>
  );
};

export default Sidebar;
