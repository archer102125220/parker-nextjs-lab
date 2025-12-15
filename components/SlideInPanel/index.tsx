'use client';

import { useState, useEffect, useCallback, ReactNode } from 'react';
import './index.scss';

export interface SlideInMessage {
  content: ReactNode | string;
  timestamp: number;
  id: string;
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
  onClose,
  onRemove,
  children
}: SlideInPanelProps) {
  const [messageList, setMessageList] = useState<SlideInMessage[]>([]);

  // Add new message when value changes
  // Note: Calling setState in useEffect is the correct pattern here because we're
  // responding to an external prop change (value) to update internal state (messageList).
  // This is explicitly allowed by React: https://react.dev/learn/you-might-not-need-an-effect#adjusting-some-state-when-a-prop-changes
  useEffect(() => {
    if (!value || value === '' || value === null || value === undefined) {
      return;
    }

    const timestamp = Date.now();
    const id = `${timestamp}-${Math.random()}`;
    const newMessage: SlideInMessage = { content: value, timestamp, id };
    
    // eslint-disable-next-line react-hooks/set-state-in-effect
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

    // Schedule auto removal
    const timer = setTimeout(() => {
      setMessageList((prev) => prev.filter((m) => m.id !== id));
    }, timeout);

    return () => clearTimeout(timer);
  }, [value, timeout, maxRow, onRemove]);

  const handleRemoveMessage = useCallback((message: SlideInMessage, index: number) => {
    onClose?.(message, index);
    setMessageList((prev) => prev.filter((m) => m.id !== message.id));
    onRemove?.(message, index);
  }, [onClose, onRemove]);

  const handleClick = useCallback((message: SlideInMessage, index: number) => {
    if (userRemoveType === 'click') {
      handleRemoveMessage(message, index);
    }
  }, [userRemoveType, handleRemoveMessage]);

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
      css-left-enter={leftEnter ? 'true' : 'false'}
    >
      {messageList.map((message, index) => {
        const bottomPosition = `calc(var(--message_item_height, 60px) * ${messageList.length - index - 1} + var(--slide_in_panel_list_item_spacing, 0px) * ${messageList.length - index})`;
        
        return (
          <div
            key={message.id}
            className="slide_in_panel_list-message"
            style={{
              '--message_bottom': bottomPosition
            } as React.CSSProperties}
            css-left-enter={leftEnter ? 'true' : 'false'}
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
