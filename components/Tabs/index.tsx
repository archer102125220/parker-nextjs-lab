'use client';

import { useState, ReactNode } from 'react';
import './index.scss';

export interface Tab {
  label: string;
  value: string | number;
  content?: ReactNode;
  disabled?: boolean;
}

export interface TabsProps {
  value?: string | number;
  onChange?: (value: string | number, index: number) => void;
  tabs: Tab[];
  className?: string;
  variant?: 'standard' | 'fullWidth';
}

export function Tabs({
  value,
  onChange,
  tabs = [],
  className = '',
  variant = 'standard'
}: TabsProps) {
  const [activeTab, setActiveTab] = useState(value ?? tabs[0]?.value ?? 0);

  const handleTabClick = (tabValue: string | number, index: number) => {
    if (tabs[index]?.disabled) return;
    
    setActiveTab(tabValue);
    onChange?.(tabValue, index);
  };

  const activeIndex = tabs.findIndex(tab => tab.value === activeTab);

  return (
    <div className={`tabs ${className}`}>
      <div className={`tabs-header tabs-header_${variant}`}>
        {tabs.map((tab, index) => (
          <div
            key={tab.value}
            className={`tabs-header-item ${
              tab.value === activeTab ? 'tabs-header-item_active' : ''
            } ${tab.disabled ? 'tabs-header-item_disabled' : ''}`}
            onClick={() => handleTabClick(tab.value, index)}
          >
            {tab.label}
          </div>
        ))}
        <div
          className="tabs-header-indicator"
          style={{
            left: variant === 'fullWidth' 
              ? `${(activeIndex / tabs.length) * 100}%`
              : `${activeIndex * 100}px`, // Simplified calculation
            width: variant === 'fullWidth'
              ? `${100 / tabs.length}%`
              : '100px' // Simplified width
          }}
        />
      </div>
    </div>
  );
}

export default Tabs;
