'use client';
import  {memo,type ReactNode } from 'react';

import { useRequestInit } from '@/hooks/useRequest/useRequestInit';

type AxiosInitProps = {
  apiBase?: string;
  children?: ReactNode;
};

export const AxiosInit = memo(({ apiBase, children }: AxiosInitProps): ReactNode =>{
  useRequestInit(apiBase || process.env.NEXT_PUBLIC_API_BASE);

  return children;
})
AxiosInit.displayName = 'AxiosInit';

export default AxiosInit;