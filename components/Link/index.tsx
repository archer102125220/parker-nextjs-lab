'use client';
import type { ReactNode } from 'react';
import { useEffect, useState } from 'react';
import MuiLink, { LinkProps as MuiLinkProps } from '@mui/material/Link';

import { Link as I18nLink } from '@/i18n/navigation';

// 讓 MuiLink 支援 MUI Link 的所有 props，並且 component={Link} 時型別正確
export type _MuiLinkProps = Omit<MuiLinkProps<typeof I18nLink>, 'component'>;
export interface LinkProps extends _MuiLinkProps {
  nonce?: string;
}

export function Link(props: LinkProps): ReactNode {
  const { nonce, ...boxProps } = props;

  // console.log(JSON.stringify({ LinkNonce: nonce }));
  const [clientNonce, setClientNonce] = useState<string>('');

  useEffect(() => {
    if (typeof nonce === 'string' && nonce !== '') {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setClientNonce(nonce);
    }
  }, [nonce]);

  return <MuiLink {...boxProps} component={I18nLink} nonce={clientNonce} />;
}

export default Link;
