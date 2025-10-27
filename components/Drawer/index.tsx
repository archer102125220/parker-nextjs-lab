import type {
  ReactNode,
  ElementType,
  MouseEvent,
  TouchEvent,
  KeyboardEvent,
  CSSProperties
} from 'react';
import { useState, useEffect, useRef, useCallback, useMemo } from 'react';

import '@/components/Drawer/drawer.scss';
import styles from '@/components/Drawer/drawer.module.scss';

// 常量定義
const INIT_DRAG_DURATION = 50;
const IS_VERTICAL = ['top', 'bottom'];
const IS_HORIZONTAL = ['right', 'left'];

type DragEvent = MouseEvent | TouchEvent;
export type anchorType = string | 'top' | 'bottom' | 'left' | 'right';

// 類型定義
interface DrawerProps {
  nonce?: string;

  open?: boolean;
  hasAnimation?: boolean;
  dragCloseDisabled?: boolean;
  anchor?: anchorType;
  rootPosition?: string;
  wrappingPosition?: string;
  hasMask?: boolean;
  maskPosition?: string;
  position?: string;
  width?: number | string;
  minWidth?: number | string;
  maxWidth?: number | string;
  height?: number | string;
  minHeight?: number | string;
  maxHeight?: number | string;
  top?: number | string;
  right?: number | string;
  bottom?: number | string;
  left?: number | string;
  zIndex?: number | string;
  triggerPercentage?: number | string;

  children?: ReactNode;
  OpenBtn?: ElementType;
  CloseBtn?: ElementType;
  Drag?: ElementType;
  Container?: ElementType;

  onChange?: (value: boolean) => void;
  onClose?: () => void;
  onOpen?: () => void;
}
interface DrawerCssVariableType extends CSSProperties {
  '--drawer_opacity'?: string | number;
  '--drawer_drag_transform'?: string;
  '--drawer_drag_transition'?: string;
  '--drawer_root_position'?: string;
  '--drawer_wrapping_position'?: string;
  '--drawer_mask_position'?: string;
  '--drawer_position'?: string;
  '--drawer_z_index'?: string | number;
  '--drawer_width'?: string | number;
  '--drawer_height'?: string | number;
  '--drawers_wrapping_top'?: string | number;
  '--drawers_wrapping_right'?: string | number;
  '--drawers_wrapping_bottom'?: string | number;
  '--drawers_wrapping_left'?: string | number;
  '--drawers_wrapping_z_index'?: string | number;
  '--drawer_top'?: string;
  '--drawer_bottom'?: string;
  '--drawer_right'?: string;
  '--drawer_left'?: string;
  '--drawer_min_width'?: string;
  '--drawer_min_height'?: string;
  '--drawer_max_width'?: string;
  '--drawer_max_height'?: string;
  '--drawer_animation_duration'?: string;
  '--drawer_animation_count'?: string;
  '--drawer_animation_direction'?: string;
}

export function Drawer(props: DrawerProps): ReactNode {
  const {
    nonce,

    open = false,
    hasAnimation = true,
    dragCloseDisabled = false,
    anchor: propsAnchor = 'left',
    rootPosition,
    wrappingPosition = 'fixed',
    hasMask = true,
    maskPosition = 'absolute',
    position = 'absolute',
    width,
    minWidth,
    maxWidth,
    height,
    minHeight,
    maxHeight,
    top = '0px',
    right = '0px',
    bottom = '0px',
    left = '0px',
    zIndex = '1',
    triggerPercentage = 0.25,

    children,
    OpenBtn,
    CloseBtn,
    Drag,
    Container,

    onChange,
    onClose,
    onOpen
  } = props;

  // Refs
  const drawerWrappingRef = useRef<HTMLDivElement>(null);
  const drawerRef = useRef<HTMLDivElement>(null);

  // State
  const [opacityTrigger, setOpacityTrigger] = useState<boolean>(open);
  const [animationReverse, setAnimationReverse] = useState<boolean>(false);
  const [isDragStart, setIsDragStart] = useState<boolean>(false);
  const [isDraging, setIsDraging] = useState<boolean>(false);
  const [dragDuration, setDragDuration] = useState<number>(INIT_DRAG_DURATION);
  const [dragMoveDistance, setDragMoveDistance] = useState<number>(0);
  const [dragStartY, setDragStartY] = useState<number>(0);
  const [dragStartX, setDragStartX] = useState<number>(0);

  // Computed values
  const anchor = useMemo<anchorType>(() => {
    const anchorStr = typeof propsAnchor === 'string' ? propsAnchor : 'left';
    return anchorStr.toLowerCase().trim() || 'left';
  }, [propsAnchor]);

  const isVertical = useMemo<boolean>(() => {
    return IS_VERTICAL.includes(anchor);
  }, [anchor]);

  const isHorizontal = useMemo<boolean>(() => {
    return IS_HORIZONTAL.includes(anchor);
  }, [anchor]);

  // CSS Variables
  const cssVariable = useMemo<DrawerCssVariableType>(() => {
    const _cssVariable: DrawerCssVariableType = {};

    if (opacityTrigger === false) {
      _cssVariable['--drawer_opacity'] = '0';
    } else {
      _cssVariable['--drawer_opacity'] = '1';
    }

    if (isVertical === true) {
      _cssVariable['--drawer_drag_transform'] =
        `translate3d(0, ${dragMoveDistance}px, 0)`;
    } else if (isHorizontal === true) {
      _cssVariable['--drawer_drag_transform'] =
        `translate3d(${dragMoveDistance}px, 0, 0)`;
    }

    if (hasAnimation === true) {
      _cssVariable['--drawer_drag_transition'] = `transform ${dragDuration}ms`;
    }

    if (typeof rootPosition === 'string' && rootPosition !== '') {
      _cssVariable['--drawer_root_position'] = rootPosition;
    }
    if (typeof wrappingPosition === 'string' && wrappingPosition !== '') {
      _cssVariable['--drawer_wrapping_position'] = wrappingPosition;
    }

    if (
      hasMask === true &&
      typeof maskPosition === 'string' &&
      maskPosition !== ''
    ) {
      _cssVariable['--drawer_mask_position'] = maskPosition;
    }

    if (typeof position === 'string' && position !== '') {
      _cssVariable['--drawer_position'] = position;
    }

    if (
      typeof zIndex === 'number' ||
      (typeof zIndex === 'string' && zIndex !== '')
    ) {
      _cssVariable['--drawer_z_index'] = zIndex.toString();
    }

    if (typeof width === 'number') {
      _cssVariable['--drawer_width'] = `${width}px`;
    } else if (typeof width === 'string' && width !== '') {
      _cssVariable['--drawer_width'] = width;
    }

    if (typeof height === 'number') {
      _cssVariable['--drawer_height'] = `${height}px`;
    } else if (typeof height === 'string' && height !== '') {
      _cssVariable['--drawer_height'] = height;
    }

    if (typeof top === 'number') {
      _cssVariable['--drawers_wrapping_top'] = `${top}px`;
    } else if (typeof top === 'string' && top !== '') {
      _cssVariable['--drawers_wrapping_top'] = top;
    }

    if (typeof right === 'number') {
      _cssVariable['--drawers_wrapping_right'] = `${right}px`;
    } else if (typeof right === 'string' && right !== '') {
      _cssVariable['--drawers_wrapping_right'] = right;
    }

    if (typeof bottom === 'number') {
      _cssVariable['--drawers_wrapping_bottom'] = `${bottom}px`;
    } else if (typeof bottom === 'string' && bottom !== '') {
      _cssVariable['--drawers_wrapping_bottom'] = bottom;
    }

    if (typeof left === 'number') {
      _cssVariable['--drawers_wrapping_left'] = `${left}px`;
    } else if (typeof left === 'string' && left !== '') {
      _cssVariable['--drawers_wrapping_left'] = left;
    }

    if (
      typeof zIndex === 'number' ||
      (typeof zIndex === 'string' && zIndex !== '')
    ) {
      _cssVariable['--drawers_wrapping_z_index'] = zIndex.toString();
    }

    let containerMinWidth = '';
    let containerMaxWidth = '';
    let containerMinHeight = '';
    let containerMaxHeight = '';
    if (typeof minWidth === 'number') {
      containerMinWidth = `${minWidth}px`;
    } else if (typeof minWidth === 'string' && minWidth !== '') {
      containerMinWidth = minWidth;
    }
    if (typeof maxWidth === 'number') {
      containerMaxWidth = `${maxWidth}px`;
    } else if (typeof maxWidth === 'string' && maxWidth !== '') {
      containerMaxWidth = maxWidth;
    }
    if (typeof minHeight === 'number') {
      containerMinHeight = `${minHeight}px`;
    } else if (typeof minHeight === 'string' && minHeight !== '') {
      containerMinHeight = minHeight;
    }
    if (typeof maxHeight === 'number') {
      containerMaxHeight = `${maxHeight}px`;
    } else if (typeof maxHeight === 'string' && maxHeight !== '') {
      containerMaxHeight = maxHeight;
    }

    if (anchor === 'right') {
      _cssVariable['--drawer_top'] = '0px';
      _cssVariable['--drawer_bottom'] = '0px';
      _cssVariable['--drawer_right'] = '0px';
      if (containerMaxWidth === '') {
        containerMaxWidth = '90%';
      }
      if (containerMinHeight === '') {
        containerMinHeight = '100%';
      }
    } else if (anchor === 'top') {
      _cssVariable['--drawer_top'] = '0px';
      _cssVariable['--drawer_left'] = '0px';
      _cssVariable['--drawer_right'] = '0px';
      if (containerMaxHeight === '') {
        containerMaxHeight = '90%';
      }
      if (containerMinWidth === '') {
        containerMinWidth = '100%';
      }
    } else if (anchor === 'bottom') {
      _cssVariable['--drawer_bottom'] = '0px';
      _cssVariable['--drawer_left'] = '0px';
      _cssVariable['--drawer_right'] = '0px';
      if (containerMaxHeight === '') {
        containerMaxHeight = '90%';
      }
      if (containerMinWidth === '') {
        containerMinWidth = '100%';
      }
    } else {
      // anchor === 'left'
      _cssVariable['--drawer_top'] = '0px';
      _cssVariable['--drawer_bottom'] = '0px';
      _cssVariable['--drawer_left'] = '0px';
      if (containerMaxWidth === '') {
        containerMaxWidth = '90%';
      }
      if (containerMinHeight === '') {
        containerMinHeight = '100%';
      }
    }

    if (containerMinWidth !== '') {
      _cssVariable['--drawer_min_width'] = containerMinWidth;
    }
    if (containerMinHeight !== '') {
      _cssVariable['--drawer_min_height'] = containerMinHeight;
    }
    if (containerMaxWidth !== '') {
      _cssVariable['--drawer_max_width'] = containerMaxWidth;
    }
    if (containerMaxHeight !== '') {
      _cssVariable['--drawer_max_height'] = containerMaxHeight;
    }

    if (animationReverse === true) {
      _cssVariable['--drawer_animation_duration'] = '0.6s';
      _cssVariable['--drawer_animation_count'] = '2';
      _cssVariable['--drawer_animation_direction'] = 'reverse';
    } else {
      _cssVariable['--drawer_animation_duration'] = '0.3s';
      _cssVariable['--drawer_animation_count'] = '1';
      _cssVariable['--drawer_animation_direction'] = 'normal';
    }

    return _cssVariable;
  }, [
    opacityTrigger,
    isVertical,
    isHorizontal,
    dragMoveDistance,
    hasAnimation,
    dragDuration,
    rootPosition,
    wrappingPosition,
    hasMask,
    maskPosition,
    position,
    zIndex,
    width,
    height,
    top,
    right,
    bottom,
    left,
    minWidth,
    maxWidth,
    minHeight,
    maxHeight,
    anchor,
    animationReverse
  ]);

  // Event handlers

  const handleTransitionEnd = useCallback(
    function transitionEnd() {
      if (opacityTrigger === false && open === true) {
        if (typeof onChange === 'function') {
          onChange(false);
        }
        if (typeof onClose === 'function') {
          onClose();
        }

        setDragDuration(300);
        setDragMoveDistance(0);
      }
    },
    [opacityTrigger, open, onChange, onClose]
  );

  const handleOpen = useCallback(
    function _open() {
      if (typeof onOpen === 'function') {
        onOpen();
      }

      if (typeof document?.querySelector === 'function') {
        document.querySelector('html')?.classList.add('drawer_open');
      }
    },
    [onOpen]
  );

  const handleClose = useCallback(
    function _close() {
      // if (typeof onClose === 'function') {
      //   onClose();
      // }

      if (typeof document?.querySelector === 'function') {
        document.querySelector('html')?.classList.remove('drawer_open');
      }

      if (open === true) {
        setAnimationReverse(true);
        window.requestAnimationFrame(() => setOpacityTrigger(false));
      }
    },
    [open]
  );

  const handleWindowClose = useCallback(
    (e: KeyboardEvent) => {
      if (e?.keyCode === 27) {
        handleClose();
      }
    },
    [handleClose]
  );

  const handleDragBarClick = useCallback(() => {
    if (dragCloseDisabled === false) return;
    handleClose();
  }, [dragCloseDisabled, handleClose]);

  const handleDragStart = useCallback(
    (e: DragEvent) => {
      if (dragCloseDisabled === true) return;

      setIsDragStart(true);
      setDragDuration(INIT_DRAG_DURATION);
      setDragMoveDistance(0);

      // eslint-disable-next-line  @typescript-eslint/no-explicit-any
      const event = e as any; // Type assertion for touch/mouse events

      if (isVertical === true) {
        const clientY =
          event.targetTouches?.[0]?.clientY ||
          event.targetTouches?.[0]?.pageY ||
          event.targetTouches?.[0]?.offsetY ||
          event.changedTouches?.[0]?.clientY ||
          event.changedTouches?.[0]?.pageY ||
          event.changedTouches?.[0]?.offsetY ||
          event.clientY ||
          event.pageY ||
          event.offsetY;
        setDragStartY(clientY);
      } else if (isHorizontal === true) {
        const clientX =
          event.targetTouches?.[0]?.clientX ||
          event.targetTouches?.[0]?.pageX ||
          event.targetTouches?.[0]?.offsetX ||
          event.changedTouches?.[0]?.clientX ||
          event.changedTouches?.[0]?.pageX ||
          event.changedTouches?.[0]?.offsetX ||
          event.clientX ||
          event.pageX ||
          event.offsetX;
        setDragStartX(clientX);
      }
    },
    [dragCloseDisabled, isVertical, isHorizontal]
  );

  const handleDraging = useCallback(
    (e: DragEvent) => {
      if (dragCloseDisabled === true || isDragStart === false) return;

      // eslint-disable-next-line  @typescript-eslint/no-explicit-any
      const event = e as any; // Type assertion for touch/mouse events
      let move = 0;
      let dragStart = 0;

      if (isVertical === true) {
        dragStart = dragStartY;

        const currentClientY =
          event.targetTouches?.[0]?.clientY ||
          event.targetTouches?.[0]?.pageY ||
          event.targetTouches?.[0]?.offsetY ||
          event.changedTouches?.[0]?.clientY ||
          event.changedTouches?.[0]?.pageY ||
          event.changedTouches?.[0]?.offsetY ||
          event.clientY ||
          event.pageY ||
          event.offsetY;
        move = currentClientY - dragStartY;
      } else if (isHorizontal === true) {
        dragStart = dragStartX;

        const currentClientX =
          event.targetTouches?.[0]?.clientX ||
          event.targetTouches?.[0]?.pageX ||
          event.targetTouches?.[0]?.offsetX ||
          event.changedTouches?.[0]?.clientX ||
          event.changedTouches?.[0]?.pageX ||
          event.changedTouches?.[0]?.offsetX ||
          event.clientX ||
          event.pageX ||
          event.offsetX;
        move = currentClientX - dragStartX;
      }

      const drawerRect = drawerRef.current?.getBoundingClientRect();
      const drawerWrapperRect =
        drawerWrappingRef.current?.getBoundingClientRect();

      if (dragStart > 0 && drawerRect && drawerWrapperRect) {
        if (
          (anchor === 'right' &&
            drawerRect.right + move >= drawerWrapperRect.right) ||
          (anchor === 'bottom' &&
            drawerRect.bottom + move >= drawerWrapperRect.bottom) ||
          (anchor === 'left' &&
            drawerRect.left + move <= drawerWrapperRect.left) ||
          (anchor === 'top' && drawerRect.top + move <= drawerWrapperRect.top)
        ) {
          window.requestAnimationFrame(() => setDragMoveDistance(move));
        } else {
          setDragMoveDistance(0);
        }

        setIsDraging(true);
      } else {
        setIsDraging(false);
      }
    },
    [
      dragCloseDisabled,
      isDragStart,
      isVertical,
      isHorizontal,
      dragStartY,
      dragStartX,
      anchor
    ]
  );

  const handleDragEnd = useCallback(() => {
    setIsDragStart(false);
    setDragStartY(0);
    setDragStartX(0);

    let triggerNumber = 0;
    if (isVertical === true) {
      triggerNumber =
        (drawerWrappingRef.current?.offsetHeight || 0) *
        Number(triggerPercentage);
    } else if (isHorizontal === true) {
      triggerNumber =
        (drawerWrappingRef.current?.offsetWidth || 0) *
        Number(triggerPercentage);
    }

    const _dragMoveDistance = Math.abs(dragMoveDistance);
    if (_dragMoveDistance >= triggerNumber) {
      handleClose();
    } else {
      setDragDuration(300);
      setDragMoveDistance(0);
    }
  }, [
    isVertical,
    isHorizontal,
    triggerPercentage,
    dragMoveDistance,
    handleClose
  ]);

  // Effects
  useEffect(() => {
    if (typeof document?.querySelector === 'function') {
      if (open === false) {
        // TODO
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setAnimationReverse(false);
        document.querySelector('html')?.classList.remove('drawer_open');
      } else {
        document.querySelector('html')?.classList.add('drawer_open');
      }
    }

    window.requestAnimationFrame(() => setOpacityTrigger(open));
  }, [open]);

  useEffect(() => {
    // eslint-disable-next-line  @typescript-eslint/no-explicit-any
    window.addEventListener('keydown', handleWindowClose as any);

    return () => {
      // if (typeof onChange === 'function') {
      //   onChange(false);
      // }

      // handleClose();
      // eslint-disable-next-line  @typescript-eslint/no-explicit-any
      window.removeEventListener('keydown', handleWindowClose as any);
    };
  }, [handleWindowClose, onChange, handleClose]);

  return (
    <div
      className={`drawer_root ${styles.drawer_root}`}
      style={cssVariable}
      nonce={`nonce-${nonce}`}
    >
      <DrawerBtn
        Element={OpenBtn}
        anchor={anchor}
        open={open}
        onOpen={handleOpen}
      />
      <DrawerBtn
        Element={CloseBtn}
        anchor={anchor}
        open={open}
        onClose={handleClose}
      />

      {open === true && (
        <div
          ref={drawerWrappingRef}
          className={`${styles['drawer_root-wrapping']} ${
            hasAnimation === true
              ? styles['drawer_root-wrapping_animation_transition']
              : ''
          }`}
          onClick={handleClose}
          onTransitionEnd={handleTransitionEnd}
        >
          {hasMask === true && (
            <div
              className={`${styles['drawer_root-wrapping-mask']} ${
                hasAnimation === true
                  ? styles['drawer_root-wrapping-mask_animation']
                  : ''
              }`}
            />
          )}
          <div
            ref={drawerRef}
            className={styles['drawer_root-wrapping-drawer']}
            css-anchor={anchor}
            onClick={(e) => e.stopPropagation()}
          >
            <DrawerDrag
              Drag={Drag}
              anchor={anchor}
              isDraging={isDraging}
              isVertical={isVertical}
              isHorizontal={isHorizontal}
              onClick={handleDragBarClick}
              onDragStart={handleDragStart}
              onDraging={handleDraging}
              onDragEnd={handleDragEnd}
            />

            <DrawerContainer
              Container={Container}
              isDraging={isDraging}
              onClose={handleClose}
            >
              {children}
            </DrawerContainer>
          </div>
        </div>
      )}
    </div>
  );
}

interface DrawerBtnProps {
  Element?: ElementType;

  onOpen?: () => void;
  onClose?: () => void;
  open: boolean;
  anchor: anchorType;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any; // 允許傳遞額外屬性
}
function DrawerBtn(props: DrawerBtnProps): ReactNode {
  const {
    Element,

    open,
    anchor,

    onOpen,
    onClose,

    ...otherProps
  } = props;

  if (typeof Element === 'string' || typeof Element === 'function') {
    return (
      <Element
        open={open}
        anchor={anchor}
        onOpen={onOpen}
        onClose={onClose}
        {...otherProps}
      />
    );
  }

  return '';
}

interface DrawerDragProps {
  Drag?: ElementType;

  anchor?: anchorType;
  isVertical: boolean;
  isHorizontal: boolean;
  isDraging: boolean;

  onClick: () => void;
  onDragStart: (e: DragEvent) => void;
  onDraging: (e: DragEvent) => void;
  onDragEnd: (e: DragEvent) => void;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any; // 允許傳遞額外屬性
}
function DrawerDrag(props: DrawerDragProps): ReactNode {
  const {
    Drag,

    anchor,
    isVertical,
    isHorizontal,
    isDraging,

    onClick,
    onDragStart,
    onDraging,
    onDragEnd,

    ...otherProps
  } = props;

  if (typeof Drag === 'string' || typeof Drag === 'function') {
    return (
      <Drag
        anchor={anchor}
        isVertical={isVertical}
        isHorizontal={isHorizontal}
        isDraging={isDraging}
        onClick={onClick}
        onDragStart={onDragStart}
        onDraging={onDraging}
        onDragEnd={onDragEnd}
        {...otherProps}
      />
    );
  }

  return (
    <div
      className={styles['drawer_root-wrapping-drawer-drag_bar']}
      css-anchor={anchor}
      css-is-vertical={`${isVertical}`}
      css-is-horizontal={`${isHorizontal}`}
      onClick={onClick}
      onMouseDown={onDragStart}
      onMouseMove={onDraging}
      onMouseUp={onDragEnd}
      onTouchStart={onDragStart}
      onTouchMove={onDraging}
      onTouchEnd={onDragEnd}
    />
  );
}

interface DrawerContainerProps {
  Container?: ElementType;
  children?: ReactNode;

  isDraging: boolean;

  onClose: () => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any; // 允許傳遞額外屬性
}
function DrawerContainer(props: DrawerContainerProps): ReactNode {
  const { Container, onClose, isDraging, children, ...otherProps } = props;

  if (typeof Container === 'string' || typeof Container === 'function') {
    return (
      <Container onClose={onClose} isDraging={isDraging} {...otherProps}>
        {children}
      </Container>
    );
  }

  return (
    <div className={styles['drawer_root-wrapping-drawer-container']}>
      {children || (
        <>
          <p>抽屜內容、抽屜內容、抽屜內容、抽屜內容、抽屜內容、抽屜內容</p>
          <p>抽屜內容</p>
          <p>抽屜內容</p>
          <p>抽屜內容</p>
          <p>抽屜內容</p>
          <p>抽屜內容</p>
          <p>抽屜內容</p>
          <p>抽屜內容</p>
          <p>抽屜內容</p>
          <p>抽屜內容</p>
        </>
      )}
    </div>
  );
}

export default Drawer;
