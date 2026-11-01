'use client';

import { AuthProvider } from './auth/AuthContext';
import { DialogHost } from './ui/DialogHost';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      {children}
      <DialogHost />
    </AuthProvider>
  );
}
