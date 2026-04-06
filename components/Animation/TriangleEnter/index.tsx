'use client';
import {
  useEffectEvent,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
  type ElementType
} from 'react';
import animejs from 'animejs';

import '@/components/Triangle/triangle.scss';
import Triangle from '@/components/Triangle';

import triangleEnterStyle from '@/components/Animation/TriangleEnter/triangle_enter.module.scss';

interface promiseAnimeJsType extends anime.AnimeParams {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  complete?: (...arg: any[]) => void;
}
function promiseAnimeJs(payload: promiseAnimeJsType = {}) {
  return new Promise<void>((resolve) => {
    animejs({
      ...payload,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      complete(...arg: any[]) {
        if (typeof payload?.complete === 'function') {
          payload.complete(...arg);
        }
        resolve();
      }
    });
  });
}

interface TriangleEnterPropsType {
  children?: ReactNode;
  renderLeftLabel?: ElementType;
  renderRightLabel?: ElementType;
  className?: string;

  isMobile?: boolean;
  leftLabel?: string;
  label?: string;
  rightLabel?: string;
  leftColor?: string;
  leftBgColor?: string;
  rightColor?: string;
  rightBgColor?: string;

  animationInited?: () => void;
  animationFinish?: () => void;
}

export function TriangleEnter(props: TriangleEnterPropsType): ReactNode {
  const {
    children,
    renderLeftLabel,
    renderRightLabel,
    className = '',

    isMobile,
    leftLabel = '',
    label = '',
    rightLabel = '',
    leftColor = '#89afff',
    leftBgColor = '#fff',
    rightColor = '#89afff',
    rightBgColor = '#fff',

    animationInited,
    animationFinish
  } = props;

  const triangleBgLeft = useRef<HTMLDivElement>(null);
  const triangleLeft = useRef<HTMLDivElement>(null);
  const triangleBgRight = useRef<HTMLDivElement>(null);
  const triangleRight = useRef<HTMLDivElement>(null);

  const [isInited, setIsInited] = useState<boolean>(false);
  const [isOpened, setIsOpened] = useState<boolean>(false);
  // 用 ref 讓 handleAnime 讀取最新的 isInited，避免 stale closure
  const isInitedRef = useRef(isInited);
  useEffect(() => {
    isInitedRef.current = isInited;
  }, [isInited]);

  const memoLeftLabel = useMemo<string>(
    function () {
      if (typeof leftLabel === 'string' && leftLabel !== '') {
        return leftLabel;
      }

      const safeLabel = label || '';
      return safeLabel.substring(0, safeLabel.length / 2);
    },
    [leftLabel, label]
  );
  const memoRightLabel = useMemo<string>(
    function () {
      if (typeof rightLabel === 'string' && rightLabel !== '') {
        return rightLabel;
      }

      const safeLabel = label || '';
      return safeLabel.substring(safeLabel.length / 2, safeLabel.length);
    },
    [rightLabel, label]
  );

  // useEffectEvent 讓 animationInited 不進入 useEffect deps，避免 props 變更重觸發初始化
  const _onAnimationInited = useEffectEvent(() => animationInited?.());
  // animationFinish 是 onClick 事件觸發的，不能用 useEffectEvent，改用 useLayoutEffect 同步 ref
  const animationFinishRef = useRef(animationFinish);
  useEffect(() => {
    animationFinishRef.current = animationFinish;
  }, [animationFinish]);

  useEffect(() => {
    if (isInited === false && isOpened === false) {
      const currentIsMobile = isMobile === true;

      if (triangleLeft.current !== null && triangleRight.current !== null) {
        Promise.all([
          promiseAnimeJs({
            targets: triangleLeft.current,
            left: currentIsMobile ? '-2px' : '-10px',
            top: '-10px',
            duration: 200
          }),
          promiseAnimeJs({
            targets: triangleRight.current,
            right: currentIsMobile ? '-2px' : '-10px',
            bottom: '-10px',
            duration: 200
          })
        ]).then(() => {
          _onAnimationInited();
          setIsInited(true);
        });
      } else {
        _onAnimationInited();
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setIsInited(true);
      }
    }
  }, [isInited, isOpened, isMobile]);

  async function handleAnime() {
    if (isInitedRef.current === false) {
      return;
    }
    await Promise.all([
      promiseAnimeJs({
        targets: triangleLeft.current,
        left: '-100vw',
        top: '-100vh',
        duration: 400
      }),
      promiseAnimeJs({
        targets: triangleBgLeft.current,
        left: '-100vw',
        top: '-100vh',
        duration: 400
      }),
      promiseAnimeJs({
        targets: triangleRight.current,
        right: '-100vw',
        bottom: '-100vh',
        duration: 400
      }),
      promiseAnimeJs({
        targets: triangleBgRight.current,
        right: '-100vw',
        bottom: '-100vh',
        duration: 400
      })
    ]);

    setIsOpened(true);
    animationFinishRef.current?.();
  }

  return (
    <div
      className={[className, triangleEnterStyle.animation_triangle_enter].join(
        ' '
      )}
      onClick={handleAnime}
    >
      <Triangle
        ref={triangleBgLeft}
        className={
          triangleEnterStyle[
            'animation_triangle_enter-triangle_background_left'
          ]
        }
        height="100vh"
        width="100vw"
        angleUpperLeft={true}
        color={leftBgColor}
      />
      <Triangle
        ref={triangleLeft}
        className={triangleEnterStyle['animation_triangle_enter-triangle_left']}
        height="100vh"
        width="100vw"
        angleUpperLeft={true}
        color={leftColor}
        label={memoLeftLabel}
      >
        <LabelElement Element={renderLeftLabel} label={memoLeftLabel}>
          <p>{memoLeftLabel}</p>
        </LabelElement>
      </Triangle>

      {children}

      <Triangle
        ref={triangleBgRight}
        className={
          triangleEnterStyle[
            'animation_triangle_enter-triangle_background_right'
          ]
        }
        height="100vh"
        width="100vw"
        angleLowerRight={true}
        color={rightBgColor}
      />
      <Triangle
        ref={triangleRight}
        className={
          triangleEnterStyle['animation_triangle_enter-triangle_right']
        }
        height="100vh"
        width="100vw"
        angleLowerRight={true}
        color={rightColor}
        label={memoRightLabel}
      >
        <LabelElement Element={renderRightLabel} label={memoRightLabel}>
          <p>{memoRightLabel}</p>
        </LabelElement>
      </Triangle>
    </div>
  );
}

interface LabelElemtProps {
  children?: ReactNode;
  Element?: ElementType;
  label: string;
}

function LabelElement(props: LabelElemtProps): ReactNode {
  const { Element, label, children } = props;
  if (typeof Element === 'string' || typeof Element === 'function') {
    return <Element label={label} />;
  }

  return children;
}

export default TriangleEnter;
