import React from 'react';
import { useAuth } from '../hooks/useAuth';
import { LogIn, CheckCircle2 } from 'lucide-react';

const Login: React.FC = () => {
  const { login } = useAuth();
  const [forceSelect, setForceSelect] = React.useState(false);

  React.useEffect(() => {
    if (localStorage.getItem('victask_force_select') === 'true') {
      setForceSelect(true);
    }
  }, []);

  const handleLogin = () => {
    if (forceSelect) {
      localStorage.removeItem('victask_force_select');
      // 'login' prompt forces the IdP to ask for credentials even if a session exists
      login({ prompt: 'login select_account' });
    } else {
      login();
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-transparent p-4 relative font-body">
      <div className="max-w-md w-full space-y-8 text-center glass-card p-12 rounded-[2.5rem] shadow-2xl animate-in fade-in zoom-in-95 duration-500 relative z-10">
        <div className="flex flex-col items-center text-center">
          <div className="bg-primary/20 p-5 rounded-3xl mb-8 active-glow border border-primary/30">
            <CheckCircle2 className="h-14 w-14 text-primary" />
          </div>
          <h1 className="text-5xl font-black text-white tracking-tighter mb-4">VicTask</h1>
          
          <div className="mb-12 space-y-2">
            <p className="text-slate-400 text-[15px] max-w-[280px] leading-relaxed mx-auto">
              Minimal, modern task management powered by <span className="text-primary font-bold">Asgardeo</span>.
            </p>
            {forceSelect && (
              <p className="text-[11px] font-bold text-primary uppercase tracking-widest animate-pulse">
                Mode: Switch Account Active
              </p>
            )}
          </div>
          
          <button
            onClick={handleLogin}
            className="w-full flex items-center justify-center gap-4 bg-primary text-on-primary hover:bg-primary-container px-8 py-4 rounded-2xl font-bold transition-all shadow-xl active:scale-[0.98] shadow-primary/20"
          >
            <LogIn className="h-5 w-5" />
            {forceSelect ? 'Switch Account / Sign In' : 'Sign in with Asgardeo'}
          </button>

          <p className="text-[10px] text-slate-500 pt-8 uppercase tracking-widest font-bold opacity-50">
            Securely synchronized.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
