import type { ReactNode } from 'react';
import DefaultLayoutClient from './DefaultLayoutClient';

interface DefaultLayoutProps {
  children: ReactNode;
}

export default async function DefaultLayout({ children }: DefaultLayoutProps) {
  return <DefaultLayoutClient>{children}</DefaultLayoutClient>;
}
