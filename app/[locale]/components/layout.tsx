import type { ReactNode } from 'react';

// import DefaultLayout from '@/layout/default';

export const dynamic = 'force-dynamic';

function Layout({ children }: { children: ReactNode }): ReactNode {
  // 這裡的 layout 會被 app/[locale]/layout.tsx 的 layout 包覆
  // return <DefaultLayout>{children}</DefaultLayout>;
  return children;
}

export default Layout;
