'use client';

import { createContext, useContext, type ReactNode } from 'react';

const NonceContext = createContext<string | undefined>(undefined);

interface NonceProviderProps {
  nonce?: string;
  children: ReactNode;
}

export function NonceProvider({ nonce, children }: NonceProviderProps) {
  return (
    <NonceContext.Provider value={nonce}>{children}</NonceContext.Provider>
  );
}

export function useNonce(): string | undefined {
  return useContext(NonceContext);
}
