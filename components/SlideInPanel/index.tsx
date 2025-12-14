'use client';

import { useState, useEffect, useRef, ReactNode } from 'react';
import './index.scss';

export interface SlideInMessage {
  content: ReactNode | string;
  timestamp: number;
}

export interface SlideInPanelProps {
  value?: ReactNode | string | null;
  timeout?: number;
  maxRow?: number;
  leftEnter?: boolean;
  itemHeight?: number | string;
  itemSpacing?: number | string;
  top?: number | string;
  bottom?: number | string;
  zIndex?: number | string;
  containerPosition?: 'fixed' | 'absolute' | 'relative';
  userRemoveType?: 'none' | 'click' | 'remove';
  removeDeltaX?: number;
  onClose?: (message: SlideInMessage, index: number) => void;
  onRemove?: (message: SlideInMessage, index: number) => void;
  children?: (message: SlideInMessage, index: number) => ReactNode;
}

export function SlideInPanel({
  value,
  timeout = 3000,
  maxRow = 5,
  leftEnter = false,
  itemHeight,
  itemSpacing,
  top,
  bottom,
  zIndex,
  containerPosition = 'fixed',
  userRemoveType = 'none',
  removeDeltaX = 100,
  onClose,
  onRemove,
  children
}: SlideInPanelProps) {
  const [messageList, setMessageList] = useState<SlideInMessage[]>([]);
  const timeoutRefs = useRef<Map<number, NodeJS.Timeout>>(new Map());

  // Add new message
  useEffect(() => {
    if (value !== '' && value !== null && value !== undefined) {
      const timestamp = Date.now();
      const newMessage: SlideInMessage = { content: value, timestamp };
      
      setMessageList((prev) => {
        const updated = [...prev, newMessage];
        // Remove oldest if exceeds maxRow
        if (updated.length > maxRow) {
          const removed = updated.shift();
          if (removed) {
            onRemove?.(removed, 0);
          }
        }
        return updated;
      });
    }
  }, [value, maxRow, onRemove]);

  // Auto remove messages after timeout
  useEffect(() => {
    messageList.forEach((message, index) => {
      if (!timeoutRefs.current.has(message.timestamp)) {
        const timer = setTimeout(() => {
          handleRemoveMessage(message, index);
        }, timeout + index * 100);
        
        timeoutRefs.current.set(message.timestamp, timer);
      }
    });

    return () => {
      timeoutRefs.current.forEach((timer) => clearTimeout(timer));
      timeoutRefs.current.clear();
    };
  }, [messageList, timeout]);

  const handleRemoveMessage = (message: SlideInMessage, index: number) => {
    onClose?.(message, index);
    
    setTimeout(() => {
      setMessageList((prev) => prev.filter((m) => m.timestamp !== message.timestamp));
      timeoutRefs.current.delete(message.timestamp);
      onRemove?.(message, index);
    }, 500); // Wait for animation
  };

  const handleClick = (message: SlideInMessage, index: number) => {
    if (userRemoveType === 'click') {
      handleRemoveMessage(message, index);
    }
  };

  const cssVariables = {
    '--slide_in_panel_list_top': typeof top === 'number' ? `${top}px` : top,
    '--slide_in_panel_list_bottom': typeof bottom === 'number' ? `${bottom}px` : bottom,
    '--slide_in_panel_list_zIndex': zIndex,
    '--message_item_height': typeof itemHeight === 'number' ? `${itemHeight}px` : itemHeight,
    '--slide_in_panel_list_item_spacing': typeof itemSpacing === 'number' ? `${itemSpacing}px` : itemSpacing,
    '--slide_in_panel_list_container_position': containerPosition,
    '--slide_in_panel_list_width': containerPosition === 'fixed' ? '100vw' : '100%',
    '--slide_in_panel_list_right': leftEnter ? undefined : (containerPosition === 'fixed' ? '-100vw' : '-100%'),
    '--slide_in_panel_list_left': leftEnter ? (containerPosition === 'fixed' ? '-100vw' : '-100%') : undefined
  } as React.CSSProperties;

  if (messageList.length === 0) return null;

  return (
    <div
      className="slide_in_panel_list"
      style={cssVariables}
      data-left-enter={leftEnter}
    >
      {messageList.map((message, index) => {
        const bottomPosition = `calc(var(--message_item_height, 60px) * ${messageList.length - index - 1} + var(--slide_in_panel_list_item_spacing, 0px) * ${messageList.length - index})`;
        
        return (
          <div
            key={message.timestamp}
            className="slide_in_panel_list-message"
            style={{
              '--message_bottom': bottomPosition
            } as React.CSSProperties}
            data-left-enter={leftEnter}
            onClick={() => handleClick(message, index)}
          >
            {children ? children(message, index) : <p>{String(message.content)}</p>}
          </div>
        );
      })}
    </div>
  );
}

export default SlideInPanel;
