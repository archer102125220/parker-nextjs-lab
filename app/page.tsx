import type { ReactNode } from 'react';
import { redirect } from 'next/navigation';

// This page only renders when the app is built statically (output: 'export')
export function RootPage(): ReactNode {
  redirect('/zh-tw');
}

export default RootPage;
