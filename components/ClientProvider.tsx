'use client';
import type { ReactNode } from 'react';
import { useEffect } from 'react';
import { Provider } from 'react-redux';

import type { RootState } from '@/store';
import { storeInit } from '@/store';

import { useWindowSize } from '@/hooks/useWindowSize';
import { useMobile } from '@/hooks/useMobile';
import { useTablet } from '@/hooks/useTablet';

type ProvidersProps = {
  children: React.ReactNode;
  initialState?: RootState;
};

export function ClientProvider({
  children,
  initialState
}: ProvidersProps): ReactNode {
  const store = storeInit(initialState);

  // console.log(JSON.stringify({ ClientProviderInitialState: initialState }));

  return (
    <Provider store={store}>
      <WindowSizeSync store={store} />
      {children}
    </Provider>
  );
}

// 獨立的同步組件，使用 useSyncExternalStore-based hooks 追蹤視窗大小並 dispatch 到 Redux store
function WindowSizeSync({ store }: { store: ReturnType<typeof storeInit> }) {
  const { width, height } = useWindowSize();
  const isMobile = useMobile();
  const isTablet = useTablet();
  // isTabletOnly = 平板尺寸但非手機尺寸（與 styles/mixin.scss @mixin tabletOnly 對應）
  const isTabletOnly = isTablet && !isMobile;

  useEffect(() => {
    store.dispatch({
      type: 'system/setWindowInnerSize',
      payload: { width, height, isMobile, isTabletOnly, isTablet }
    });
  }, [width, height, isMobile, isTabletOnly, isTablet, store]);

  return null;
}

export default ClientProvider;
