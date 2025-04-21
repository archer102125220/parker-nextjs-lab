// import DefaultLayout from '@/layout/default';

export default function Layout({ children }: { children: React.ReactNode }) {
  // 這裡的 layout 會被 app/[locale]/layout.tsx 的 layout 包覆
  // return <DefaultLayout>{children}</DefaultLayout>;
  return children;
}
