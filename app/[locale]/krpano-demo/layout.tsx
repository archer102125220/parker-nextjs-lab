import type { ReactNode } from 'react';

import { ImmersiveLayout } from '@/layout/immersive';

interface RouteLayoutProps {
  children: ReactNode;
}

async function RouteLayout(
  props: Readonly<RouteLayoutProps>
): Promise<ReactNode> {
  const { children } = props;

  return <ImmersiveLayout>{children}</ImmersiveLayout>;
}

export default RouteLayout;
