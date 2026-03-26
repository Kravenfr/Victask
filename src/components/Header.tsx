import React from 'react';
import { useUIStore } from '../store/uiStore';
import { useAuth } from '../hooks/useAuth';
import { 
  Menu, 
  Settings, 
  LogOut, 
  User as UserIcon,
} from 'lucide-react';
import { cn } from '../lib/utils';

const Header: React.FC = () => {
  const { toggleSidebar, setSettingsOpen } = useUIStore();
  const { user, logout } = useAuth();
  const [isOnline, setIsOnline] = React.useState(navigator.onLine);

  React.useEffect(() => {
    const handleStatus = () => setIsOnline(navigator.onLine);
    window.addEventListener('online', handleStatus);
    window.addEventListener('offline', handleStatus);
    return () => {
      window.removeEventListener('online', handleStatus);
      window.removeEventListener('offline', handleStatus);
    };
  }, []);

  return (
    <header className="h-14 bg-[#0e0e0e]/95 backdrop-blur-md z-40 w-full flex items-center justify-between px-4 border-b border-white/10">
      <div className="flex items-center gap-4">
        <button 
          onClick={toggleSidebar}
          className="p-2 hover:bg-white/10 rounded-full transition-colors md:hidden text-white"
        >
          <Menu size={22} />
        </button>
        
        {/* Sync Status Badge */}
        <div className={cn(
          "flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-[10px] font-bold uppercase tracking-wider transition-all",
          isOnline ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" : "bg-error/10 text-error border-error/20 animate-pulse"
        )}>
          <div className={cn("h-1.5 w-1.5 rounded-full", isOnline ? "bg-emerald-500" : "bg-error")} />
          {isOnline ? 'Synced' : 'Offline Mode'}
        </div>
      </div>

      <div className="flex items-center gap-2">
        <div className="relative group">
          <button className="flex items-center gap-2 p-1 hover:bg-white/10 rounded-full transition-colors ml-2">
            {user?.photoURL ? (
              <img src={user.photoURL} alt={user.displayName || ''} className="h-8 w-8 rounded-full border border-primary/50" />
            ) : (
              <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center border border-primary/20">
                <UserIcon size={16} className="text-primary" />
              </div>
            )}
          </button>
          
          <div className="absolute right-0 top-full mt-2 w-56 bg-black/80 backdrop-blur-xl border border-white/10 rounded-xl shadow-2xl py-1 hidden group-hover:block transition-all z-50">
            {/* Hover Bridge: Invisible element to fill the mt-2 gap */}
            <div className="absolute -top-2 left-0 w-full h-2 bg-transparent" />
            
            <div className="px-4 py-2 border-b border-white/5 mb-1 bg-black/40">
              <p className="text-sm font-medium truncate text-white">{user?.displayName || 'User Profile'}</p>
              <p className="text-xs text-slate-400 truncate">{user?.email || 'Authenticated Account'}</p>
              <p className="text-[9px] text-slate-500 mt-1 truncate font-mono">ID: {user?.uid}</p>
            </div>
            <button 
              onClick={() => setSettingsOpen(true)}
              className="w-full flex items-center gap-2 px-4 py-2 text-sm hover:bg-white/5 transition-colors text-left text-slate-300"
            >
              <Settings size={16} />
              Settings
            </button>
            <button 
              onClick={() => logout()}
              className="w-full flex items-center gap-2 px-4 py-2 text-sm text-error hover:bg-error/10 transition-colors text-left"
            >
              <LogOut size={16} />
              Sign Out
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
