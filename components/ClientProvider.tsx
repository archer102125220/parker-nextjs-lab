'use client';
import type { ReactNode } from 'react';
import { useEffect } from 'react';
import { Provider } from 'react-redux';

import type { RootState } from '@/store';
import { storeInit } from '@/store';

import scssVariable from '@/styles/scss_variable_export.module.scss';

type ProvidersProps = {
  children: React.ReactNode;
  initialState?: RootState;
};

export function ClientProvider({
  children,
  initialState
}: ProvidersProps): ReactNode {
  const store = storeInit(initialState);

  useEffect(() => {
    function _handleResize_() {
      store.dispatch({
        type: 'system/setWindowInnerSize',
        payload: {
          width: window.innerWidth,
          height: window.innerHeight,
          // 最好與 style\mixin.scss 的 @mixin mobile 設定一樣
          isMobile: window.matchMedia(
            `(max-width: ${scssVariable.mobileMaxWidth})`
          ).matches,
          // 最好與 style\mixin.scss 的 @mixin tabletOnly 設定一樣
          isTabletOnly: window.matchMedia(
            `(min-width: calc(${scssVariable.mobileMaxWidth} + 1px)) and (max-width: ${scssVariable.tabletMaxWidth})`
          ).matches,
          // 最好與 style\mixin.scss 的 @mixin tablet 設定一樣
          isTablet: window.matchMedia(
            `(max-width: ${scssVariable.tabletMaxWidth})`
          ).matches
        }
      });
    }
    window.addEventListener('resize', _handleResize_);
    _handleResize_();

    return () => window.removeEventListener('resize', _handleResize_);
  }, []);

  return <Provider store={store}>{children}</Provider>;
}

export default ClientProvider;
