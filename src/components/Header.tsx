import React from 'react';
import { useUIStore } from '../store/uiStore';
import { useAuth } from '../hooks/useAuth';
import { 
  Menu, 
  Settings, 
  LogOut, 
  User as UserIcon,
} from 'lucide-react';

const Header: React.FC = () => {
  const { toggleSidebar } = useUIStore();
  const { user, logout } = useAuth();

  return (
    <header className="h-14 bg-background/95 backdrop-blur z-40 w-full flex items-center justify-between px-4">
      <div className="flex items-center gap-4">
        <button 
          onClick={toggleSidebar}
          className="p-2 hover:bg-muted rounded-full transition-colors md:hidden"
        >
          <Menu size={22} />
        </button>
      </div>

      <div className="flex items-center gap-2">
        <div className="relative group">
          <button className="flex items-center gap-2 p-1 hover:bg-muted rounded-full transition-colors ml-2">
            {user?.photoURL ? (
              <img src={user.photoURL} alt={user.displayName || ''} className="h-8 w-8 rounded-full border border-border" />
            ) : (
              <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center border border-border">
                <UserIcon size={16} className="text-primary" />
              </div>
            )}
          </button>
          
          <div className="absolute right-0 top-full mt-2 w-48 bg-card border border-border rounded-xl shadow-lg py-1 hidden group-hover:block transition-all z-50">
            <div className="px-4 py-2 border-b border-border mb-1">
              <p className="text-sm font-medium truncate">{user?.displayName}</p>
              <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
            </div>
            <button className="w-full flex items-center gap-2 px-4 py-2 text-sm hover:bg-muted transition-colors text-left">
              <Settings size={16} />
              Settings
            </button>
            <button 
              onClick={logout}
              className="w-full flex items-center gap-2 px-4 py-2 text-sm text-destructive hover:bg-destructive/10 transition-colors text-left"
            >
              <LogOut size={16} />
              Logout
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
