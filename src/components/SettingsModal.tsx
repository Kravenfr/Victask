import React from 'react';
import { X, LogOut, Settings, Github, Moon } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

interface SettingsModalProps {
  onClose: () => void;
}

const SettingsModal: React.FC<SettingsModalProps> = ({ onClose }) => {
  const { user, logout } = useAuth();

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm" 
        onClick={onClose}
      />
      
      {/* Modal Content */}
      <div className="relative w-full max-w-md bg-card border border-border rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="p-6 border-b border-border flex items-center justify-between">
          <h2 className="text-xl font-semibold">Settings</h2>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-muted rounded-full transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-6 space-y-8">
          {/* Profile Section */}
          <div className="flex items-center gap-4 p-4 bg-muted/30 rounded-2xl border border-border/50">
            {user?.photoURL ? (
              <img src={user.photoURL} alt="" className="h-12 w-12 rounded-full border-2 border-primary/20" />
            ) : (
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center border-2 border-primary/20">
                <span className="text-primary font-bold text-lg">{user?.displayName?.[0] || 'U'}</span>
              </div>
            )}
            <div className="flex-1 min-w-0">
              <p className="font-semibold truncate">{user?.displayName}</p>
              <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
            </div>
          </div>

          {/* Preferences */}
          <div className="space-y-4">
            <p className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground px-1">App Preferences</p>
            
            <div className="flex items-center justify-between px-1">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-muted rounded-lg text-primary">
                  <Moon size={18} />
                </div>
                <div>
                  <p className="text-sm font-medium">Dark Mode</p>
                  <p className="text-[11px] text-muted-foreground">Force dark appearance</p>
                </div>
              </div>
              <div className="h-6 w-10 bg-primary rounded-full flex items-center px-1">
                <div className="h-4 w-4 bg-primary-foreground rounded-full ml-auto shadow-sm" />
              </div>
            </div>

            <div className="flex items-center justify-between px-1">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-muted rounded-lg text-muted-foreground">
                  <Github size={18} />
                </div>
                <div>
                  <p className="text-sm font-medium">Open Source</p>
                  <p className="text-[11px] text-muted-foreground">View on GitHub</p>
                </div>
              </div>
              <button className="text-[11px] font-bold text-primary hover:underline">VIEW</button>
            </div>
          </div>

          {/* Danger Zone */}
          <div className="pt-4">
            <button 
              onClick={logout}
              className="w-full flex items-center justify-center gap-2 py-3 border border-destructive/30 text-destructive hover:bg-destructive/5 rounded-2xl font-semibold transition-all"
            >
              <LogOut size={18} />
              Sign Out
            </button>
          </div>
        </div>

        <div className="p-4 bg-muted/20 text-center border-t border-border/50">
          <p className="text-[10px] text-muted-foreground uppercase font-medium">Victask v1.0.0 • Made with ❤️</p>
        </div>
      </div>
    </div>
  );
};

export default SettingsModal;
