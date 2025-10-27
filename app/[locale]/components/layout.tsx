import type { ReactNode } from 'react';

// import DefaultLayout from '@/layout/default';

async function Layout({
  children
}: {
  children: ReactNode;
}): Promise<ReactNode> {
  // 這裡的 layout 會被 app/[locale]/layout.tsx 的 layout 包覆
  // return <DefaultLayout>{children}</DefaultLayout>;
  return children;
}

export default Layout;
