'use client';
import type { ReactNode } from 'react';
import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';

import IconButton from '@mui/material/IconButton';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

interface GoBackProps {
  nonce?: string;
}
export function GoBack({ nonce }: GoBackProps): ReactNode {
  const pathname = usePathname();
  const router = useRouter();

  const [clientNonce, setClientNonce] = useState<string>('');

  const handleBack = () => {
    router.back();
  };

  console.log(JSON.stringify({ GoBackNonce: nonce }));

  useEffect(() => {
    if (typeof nonce === 'string' && nonce !== '') {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setClientNonce(nonce);
    }
  }, [nonce]);

  return ['/', '/zh-tw', '/en'].includes(pathname) === false ? (
    <IconButton color="primary" nonce={clientNonce} onClick={handleBack}>
      <ArrowBackIcon />
    </IconButton>
  ) : (
    ''
  );
}

export default GoBack;
