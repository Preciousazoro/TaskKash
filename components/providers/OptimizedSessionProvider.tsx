'use client';

import { useSession as useNextAuthSession } from 'next-auth/react';
import { createContext, useContext, ReactNode } from 'react';

interface SessionContextType {
  data: any;
  status: 'loading' | 'authenticated' | 'unauthenticated';
  update: (data?: any) => Promise<any>;
}

const SessionContext = createContext<SessionContextType | null>(null);

interface SessionProviderProps {
  children: ReactNode;
}

export function OptimizedSessionProvider({ children }: SessionProviderProps) {
  const session = useNextAuthSession();

  return (
    <SessionContext.Provider value={session}>
      {children}
    </SessionContext.Provider>
  );
}

export function useSession() {
  const context = useContext(SessionContext);
  if (!context) {
    throw new Error('useSession must be used within OptimizedSessionProvider');
  }
  return context;
}
