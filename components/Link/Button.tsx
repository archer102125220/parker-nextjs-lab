'use client';

import Button, { ButtonProps } from '@mui/material/Button';
import { Link } from '@/i18n/navigation';

// 讓 LinkButton 支援 MUI Button 的所有 props，並且 component={Link} 時型別正確
export type LinkButtonProps = Omit<ButtonProps<typeof Link>, 'component'>;

export function LinkButton(props: LinkButtonProps) {
  return <Button component={Link} {...props} />;
}

export default LinkButton;
