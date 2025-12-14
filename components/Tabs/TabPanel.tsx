'use client';

import { ReactNode } from 'react';

export interface TabPanelProps {
  value: string | number;
  activeValue: string | number;
  children: ReactNode;
  className?: string;
}

export function TabPanel({
  value,
  activeValue,
  children,
  className = ''
}: TabPanelProps) {
  if (value !== activeValue) {
    return null;
  }

  return (
    <div className={`tab-panel ${className}`} role="tabpanel">
      {children}
    </div>
  );
}

export default TabPanel;
