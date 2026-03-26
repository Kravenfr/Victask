import React from 'react';
import { X, LogOut, Github, Moon } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { cn } from '../lib/utils';

interface SettingsModalProps {
  onClose: () => void;
}

const SettingsModal: React.FC<SettingsModalProps> = ({ onClose }) => {
  const { user, logout } = useAuth();

  const [darkMode, setDarkMode] = React.useState(true);

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm" 
        onClick={onClose}
      />
      
      {/* Modal Content */}
      <div className="relative w-full max-w-md bg-black/80 backdrop-blur-3xl border border-white/10 rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="p-6 border-b border-white/5 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-white">Settings</h2>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-white/5 rounded-full transition-colors text-white"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-6 space-y-8">
          {/* Profile Section */}
          <div className="flex items-center gap-4 p-4 bg-white/5 rounded-2xl border border-white/5">
            {user?.photoURL ? (
              <img src={user.photoURL} alt="" className="h-12 w-12 rounded-full border-2 border-primary/20" />
            ) : (
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center border-2 border-primary/20">
                <span className="text-primary font-bold text-lg">{user?.displayName?.[0] || 'U'}</span>
              </div>
            )}
            <div className="flex-1 min-w-0">
              <p className="font-semibold truncate text-white">{user?.displayName}</p>
              <p className="text-xs text-slate-400 truncate">{user?.email}</p>
            </div>
          </div>

          {/* Preferences */}
          <div className="space-y-4">
            <p className="text-[10px] uppercase font-bold tracking-widest text-slate-500 px-1">App Preferences</p>
            
            <div 
              className="flex items-center justify-between px-1 cursor-pointer group"
              onClick={() => setDarkMode(!darkMode)}
            >
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white/5 rounded-lg text-primary">
                  <Moon size={18} />
                </div>
                <div>
                  <p className="text-sm font-medium text-white">Dark Mode</p>
                  <p className="text-[11px] text-slate-500">Force dark appearance</p>
                </div>
              </div>
              <div className={cn(
                "h-6 w-11 rounded-full flex items-center px-1 transition-colors duration-300",
                darkMode ? "bg-primary" : "bg-white/10"
              )}>
                <div className={cn(
                  "h-4 w-4 bg-on-primary rounded-full transition-transform duration-300 shadow-sm",
                  darkMode ? "translate-x-5" : "translate-x-0"
                )} />
              </div>
            </div>

            <div className="flex items-center justify-between px-1">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white/5 rounded-lg text-slate-500">
                  <Github size={18} />
                </div>
                <div>
                  <p className="text-sm font-medium text-white">Open Source</p>
                  <p className="text-[11px] text-slate-500">View on GitHub</p>
                </div>
              </div>
              <button 
                onClick={() => window.open('https://github.com/Kravenfr/Victask', '_blank')}
                className="text-[11px] font-bold text-primary hover:underline"
              >
                VIEW
              </button>
            </div>
          </div>

          {/* Danger Zone */}
          <div className="pt-4">
            <button 
              onClick={() => {
                localStorage.setItem('victask_force_select', 'true');
                logout();
              }}
              className="w-full flex items-center justify-center gap-2 py-3 border border-error/30 text-error hover:bg-error/5 rounded-2xl font-semibold transition-all"
            >
              <LogOut size={18} />
              Sign Out
            </button>
          </div>
        </div>

        <div className="p-4 bg-white/5 text-center border-t border-white/5">
          <p className="text-[10px] text-slate-500 uppercase font-medium tracking-tight">Victask v1.0.0 • Made by Kraven 0_0</p>
        </div>
      </div>
    </div>
  );
};

export default SettingsModal;
