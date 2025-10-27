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

  return ['/', '/zh-tw', '/en'].includes(pathname) === false ? (
    <IconButton color="primary" onClick={handleBack} nonce={nonce}>
      <ArrowBackIcon />
    </IconButton>
  ) : (
    ''
  );
}

export default GoBack;
