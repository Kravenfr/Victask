import React from 'react';
import { useAuth } from '../hooks/useAuth';
import { LogIn, CheckCircle2 } from 'lucide-react';

const Login: React.FC = () => {
  const { loginWithGoogle } = useAuth();

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="max-w-md w-full space-y-8 text-center bg-card p-10 rounded-[2.5rem] shadow-2xl border border-border/50 animate-in fade-in zoom-in-95 duration-500">
        <div className="flex flex-col items-center">
          <div className="bg-primary/10 p-5 rounded-3xl mb-6 ring-1 ring-primary/20">
            <CheckCircle2 className="h-14 w-14 text-primary" />
          </div>
          <h1 className="text-4xl font-bold tracking-tight mb-3">Victask</h1>
          <p className="text-muted-foreground text-[15px] max-w-[260px] leading-relaxed">
            Minimal, modern task management inspired by Google Tasks.
          </p>
        </div>

        <div className="pt-4">
          <button
            onClick={() => loginWithGoogle()}
            className="w-full flex items-center justify-center gap-4 bg-foreground text-background hover:opacity-90 px-8 py-4 rounded-2xl font-bold transition-all shadow-xl active:scale-[0.98]"
          >
            <LogIn className="h-5 w-5" />
            Sign in with Asgardeo
          </button>
        </div>

        <p className="text-[11px] text-muted-foreground pt-4 uppercase tracking-widest font-bold opacity-50">
          Sync across all devices
        </p>
      </div>
    </div>
  );
};

export default Login;
