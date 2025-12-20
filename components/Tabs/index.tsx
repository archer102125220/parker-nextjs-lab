'use client';

// Export Bar component (main tabs navigation)
export {
  Tabs as TabsBar,
  type TabsProps as TabsBarProps,
  type Tab
} from './Bar';

// Export Content component (tab panels)
export { TabsContent, type TabsContentProps } from './Content';

// Default export is the Bar component
export { Tabs as default } from './Bar';
