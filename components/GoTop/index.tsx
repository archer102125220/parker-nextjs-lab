'use client';
import type { ReactNode, CSSProperties, RefObject } from 'react';
import { useRef, useState, useMemo, useCallback, useEffect } from 'react';
import IconButton from '@mui/material/IconButton';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';

import '@/components/GoTop/go_top.scss';

interface GoTopProps {
  ref?: RefObject<HTMLDivElement | null>;

  nonce?: string;
  parentElementTrigger?: boolean;
  position?: string;
  limit?: number;
  heddinBottom?: string | number;
  showBottom?: string | number;
  right?: string | number;
  left?: string | number;

  buttonRender?: (props: { isShow: boolean }) => ReactNode;
}
interface GoTopCssVariableType extends CSSProperties {
  '--go_top_position'?: string;
  '--go_top_right'?: string;
  '--go_top_left'?: string;
  '--go_top_hidden_bottom'?: string;
  '--go_top_show_bottom'?: string;
}

export function GoTop(props: GoTopProps): ReactNode {
  const {
    ref = null,
    position = 'fixed',
    right = '25px',
    left = null,
    heddinBottom = '-50px',
    showBottom = '25px',

    limit = 100,
    parentElementTrigger = false,

    nonce,
    buttonRender: ButtonRender
  } = props;
  const defaultRef = useRef<HTMLDivElement>(null);

  const [isShow, setIsShow] = useState(false);

  const safeRef = useMemo(() => ref || defaultRef, [ref, defaultRef]);
  const cssVariable: GoTopCssVariableType = useMemo<GoTopCssVariableType>(
    function () {
      const _cssVariable: GoTopCssVariableType = {};

      if (typeof position === 'string' && position !== '') {
        _cssVariable['--go_top_position'] = position;
      }

      if (typeof right === 'string' && right !== '') {
        _cssVariable['--go_top_right'] = right;
      } else if (typeof right === 'number') {
        _cssVariable['--go_top_right'] = `${right}px`;
      }

      if (typeof left === 'string' && left !== '') {
        _cssVariable['--go_top_left'] = left;
      } else if (typeof left === 'number') {
        _cssVariable['--go_top_left'] = `${left}px`;
      }

      if (typeof heddinBottom === 'string' && heddinBottom !== '') {
        _cssVariable['--go_top_hidden_bottom'] = heddinBottom;
      } else if (typeof heddinBottom === 'number') {
        _cssVariable['--go_top_hidden_bottom'] = `${heddinBottom}px`;
      }

      if (typeof showBottom === 'string' && showBottom !== '') {
        _cssVariable['--go_top_show_bottom'] = showBottom;
      } else if (typeof showBottom === 'number') {
        _cssVariable['--go_top_show_bottom'] = `${showBottom}px`;
      }

      return _cssVariable;
    },
    [position, right, left, heddinBottom, showBottom]
  );

  const goTop = useCallback(
    function () {
      if (isShow === false) return;

      if (
        safeRef?.current &&
        safeRef.current.parentElement instanceof HTMLElement
      ) {
        const parentElementScrollTop =
          safeRef?.current?.parentElement?.scrollTop || 0;

        if (parentElementScrollTop > limit) {
          if (typeof safeRef?.current?.parentElement?.scrollTo === 'function') {
            safeRef?.current.parentElement.scrollTo({
              top: 0,
              behavior: 'smooth'
            });
          } else if (
            typeof safeRef.current.parentElement.scrollTop === 'number'
          ) {
            safeRef.current.parentElement.scrollTop = 0;
          }
        }
      }

      if (parentElementTrigger === true) {
        return;
      }

      if (
        document.body.scrollTop > limit ||
        document.documentElement.scrollTop > limit
      ) {
        if (typeof window.scrollTo === 'function') {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        } else {
          document.body.scrollTop = 0; // For Safari
          document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
        }
      }
    },
    [isShow, safeRef, limit, parentElementTrigger]
  );

  const handleScroll = useCallback(
    function () {
      console.log({ safeRef });

      if (
        (parentElementTrigger !== true &&
          (document.body.scrollTop > limit ||
            document.documentElement.scrollTop > limit)) ||
        (safeRef?.current &&
          safeRef.current.parentElement instanceof HTMLElement &&
          safeRef.current.parentElement.scrollTop > limit)
      ) {
        setIsShow(true);
      } else {
        setIsShow(false);
      }
    },
    [parentElementTrigger, limit, safeRef]
  );

  useEffect(() => {
    console.log({ handleScroll, safeRef });

    window.onscroll = handleScroll;
    window.addEventListener('scroll', handleScroll);
    if (
      typeof safeRef?.current?.parentElement?.addEventListener === 'function'
    ) {
      safeRef?.current.parentElement.addEventListener('scroll', handleScroll);
    }

    return function () {
      window.onscroll = null;
      window.removeEventListener('scroll', handleScroll);
      if (
        typeof safeRef?.current?.parentElement?.removeEventListener ===
        'function'
      ) {
        safeRef?.current.parentElement.removeEventListener(
          'scroll',
          handleScroll
        );
      }
    };
  }, [handleScroll, safeRef]);

  useEffect(() => {
    console.log(JSON.stringify({ GoTopNonce: nonce }));
  }, [nonce]);

  return (
    <div
      ref={safeRef}
      className="go_top"
      css-is-show={isShow}
      style={cssVariable}
      onClick={goTop}
    >
      {ButtonRender ? (
        <ButtonRender isShow={isShow} />
      ) : (
        <IconButton
          color="primary"
          aria-label="go_to_top"
          className="go_top-btn"
        >
          <ArrowUpwardIcon />
        </IconButton>
      )}
    </div>
  );
}
export default GoTop;
