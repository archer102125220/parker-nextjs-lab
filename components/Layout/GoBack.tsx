'use client';
import type { ReactNode } from 'react';
import { useEffect, useState } from 'react';
import { useNextRouter, usePathnameWithLocale } from '@/i18n/navigation';

import IconButton from '@mui/material/IconButton';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

import './go_back.scss';

interface GoBackProps {
  nonce?: string;
}
export function GoBack({ nonce }: GoBackProps): ReactNode {
  const pathname = usePathnameWithLocale(); // Includes locale for homepage check
  const router = useNextRouter();

  const [clientNonce, setClientNonce] = useState<string>('');

  const handleBack = () => {
    router.back();
  };

  // console.log(JSON.stringify({ GoBackNonce: nonce }));

  useEffect(() => {
    if (typeof nonce === 'string' && nonce !== '') {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setClientNonce(nonce);
    }
  }, [nonce]);

  return ['/', '/zh-tw', '/en'].includes(pathname) === false ? (
    <IconButton 
      color="primary" 
      className="go_back-button"
      nonce={clientNonce} 
      onClick={handleBack}
    >
      <ArrowBackIcon className="go_back-icon" />
    </IconButton>
  ) : (
    ''
  );
}

export default GoBack;

