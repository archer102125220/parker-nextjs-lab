'use client';

import type { ReactNode } from 'react';

import { useRequestInit } from '@/hooks/useRequest/useRequestInit';

type AxiosInitProps = {
  apiBase?: string;
  children?: ReactNode;
};

export function AxiosInit({ apiBase, children }: AxiosInitProps) {
  useRequestInit(apiBase || process.env.NEXT_PUBLIC_API_BASE);

  return children;
}
