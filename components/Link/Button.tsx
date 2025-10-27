'use client';
import type { ReactNode } from 'react';
import Button, { ButtonProps } from '@mui/material/Button';

import { Link } from '@/i18n/navigation';

// 讓 LinkButton 支援 MUI Button 的所有 props，並且 component={Link} 時型別正確
export type _LinkButtonProps = Omit<ButtonProps<typeof Link>, 'component'>;
export interface LinkButtonProps extends _LinkButtonProps {
  nonce?: string;
}

export function LinkButton(props: LinkButtonProps): ReactNode {
  const { nonce, ...buttonProps } = props;

  console.log(JSON.stringify({ LinkButtonNonce: nonce }));

  return <Button {...buttonProps} component={Link} />;
}

export default LinkButton;
