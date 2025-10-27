'use client';
import type { ReactNode } from 'react';
import { usePathname, useRouter } from 'next/navigation';

import IconButton from '@mui/material/IconButton';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

interface GoBackProps {
  nonce?: string;
}
export function GoBack({ nonce }: GoBackProps): ReactNode {
  const pathname = usePathname();
  const router = useRouter();

  const handleBack = () => {
    router.back();
  };

  console.log(JSON.stringify({ GoBackNonce: nonce }));

  return ['/', '/zh-tw', '/en'].includes(pathname) === false ? (
    <IconButton color="primary" onClick={handleBack}>
      <ArrowBackIcon />
    </IconButton>
  ) : (
    ''
  );
}

export default GoBack;
