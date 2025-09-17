import type {
  MouseEvent,
  MouseEventHandler,
  ReactNode,
  ElementType,
  CSSProperties
} from 'react';
import { useState, useMemo, useCallback, useEffect } from 'react';
import { Button } from '@mui/material';

import '@/components/Dialog/dialog.scss';
import styles from '@/components/Dialog/dialog.module.scss';

// https://stackoverflow.com/questions/41385059/possible-to-extend-types-in-typescript
type handleCloseType = MouseEventHandler & ((e?: MouseEvent) => void);

interface DialogProps {
  open: boolean;
  position?: string;
  rootPosition?: string;
  width?: string | number;
  minWidth?: string | number;
  height?: string | number;
  minHeight?: string | number;
  zIndex?: string | number;
  title: string;
  content?: string;
  confirmLabel: string;
  confirmDisabled?: boolean;
  cancelLabel: string;

  Container?: ElementType;
  Title?: ElementType;
  Content?: ElementType;
  Action?: ElementType;
  Cancel?: ElementType;
  Confirm?: ElementType;
  children: ReactNode;

  change: (isOpen: boolean) => void;
  confirm: () => void;
  cancel: () => void;
}
interface dialogCssVariableType extends CSSProperties {
  '--dialog_opacity'?: string;
  '--dialog_width'?: string;
  '--dialog_height'?: string;
  '--dialog_min_width'?: string;
  '--dialog_min_height'?: string;
  '--dialog_z_index'?: string | number;
  '--dialog_position'?: string;
  '--dialog_root_position'?: string;
}

function Dialog(props: Readonly<DialogProps>): ReactNode {
  const {
    open = false,
    width,
    height,
    minWidth = '200px',
    minHeight,
    zIndex,
    position = 'fixed',
    rootPosition,
    change,
    cancel,
    cancelLabel = '取消',
    confirm,
    confirmLabel = '確定',
    confirmDisabled = false,
    children,

    Container,
    Title,
    Content,
    Action,
    Cancel,
    Confirm
  } = props;
  const [opacityTrigger, setOpacityTrigger] = useState<boolean>(false);

  const cssVariable = useMemo<dialogCssVariableType>(() => {
    const _cssVariable: dialogCssVariableType = {};

    if (opacityTrigger === false) {
      _cssVariable['--dialog_opacity'] = '0';
    } else {
      _cssVariable['--dialog_opacity'] = '1';
    }

    if (typeof width === 'number') {
      _cssVariable['--dialog_width'] = `${width}px`;
    } else if (typeof width === 'string' && width !== '') {
      _cssVariable['--dialog_width'] = width;
    }

    if (typeof height === 'number') {
      _cssVariable['--dialog_height'] = `${height}px`;
    } else if (typeof height === 'string' && height !== '') {
      _cssVariable['--dialog_height'] = height;
    }

    if (typeof minWidth === 'number') {
      _cssVariable['--dialog_min_width'] = `${minWidth}px`;
    } else if (typeof minWidth === 'string' && minWidth !== '') {
      _cssVariable['--dialog_min_width'] = minWidth;
    }

    if (typeof minHeight === 'number') {
      _cssVariable['--dialog_min_height'] = `${minHeight}px`;
    } else if (typeof minHeight === 'string' && minHeight !== '') {
      _cssVariable['--dialog_min_height'] = minHeight;
    }

    if (
      typeof zIndex === 'number' ||
      (typeof zIndex === 'string' && zIndex !== '')
    ) {
      _cssVariable['--dialog_z_index'] = zIndex;
    }

    if (typeof position === 'string' && position !== '') {
      _cssVariable['--dialog_position'] = position;
    }

    if (typeof rootPosition === 'string' && rootPosition !== '') {
      _cssVariable['--dialog_root_position'] = rootPosition;
    } else if (position === 'absolute') {
      _cssVariable['--dialog_root_position'] = 'relative';
    }

    return _cssVariable;
  }, [
    opacityTrigger,
    width,
    height,
    minWidth,
    minHeight,
    zIndex,
    position,
    rootPosition
  ]);

  const handleClose = useCallback<handleCloseType>(
    (e?: MouseEvent) => {
      if (e?.target !== e?.currentTarget) {
        return;
      }
      if (typeof cancel === 'function') {
        cancel();
      }
      setOpacityTrigger(false);
    },
    [cancel]
  );

  useEffect(() => {
    if (typeof open === 'boolean' && open !== opacityTrigger) {
      setOpacityTrigger(open);
    }

    if (typeof document?.querySelector === 'function') {
      const htmlElement = document.querySelector('html');
      if (htmlElement !== null) {
        if (open === false) {
          htmlElement.classList.remove('dialog_open');
        } else {
          htmlElement.classList.add('dialog_open');
        }
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);
  useEffect(() => {
    return () => {
      if (typeof change === 'function') {
        change(false);
      }
      handleClose();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleConfirm: handleCloseType = (e?: MouseEvent) => {
    if (e?.target !== e?.currentTarget) {
      return;
    }
    if (typeof confirm === 'function') {
      confirm();
    }
    setOpacityTrigger(false);
  };

  function handleTransitionEnd() {
    if (
      opacityTrigger === false &&
      open === true &&
      typeof change === 'function'
    ) {
      change(false);
    }
  }

  return (
    <div className={styles.dialog_root} style={cssVariable}>
      {open === true ? (
        <div
          className={styles['dialog_root-dialog']}
          onClick={handleClose}
          onTransitionEnd={handleTransitionEnd}
        >
          <div className={styles['dialog_root-dialog-center']}>
            <DialogContainer
              Container={Container}
              isShow={open}
              title={props.title}
              confirm={handleConfirm}
              cancel={handleClose}
              cancelLabel={cancelLabel}
              confirmLabel={confirmLabel}
              confirmDisabled={confirmDisabled}
            >
              <DialogTitle Title={Title} title={props.title}>
                {props.title}
              </DialogTitle>

              <DialogContent Content={Content}>{children}</DialogContent>

              <DialogAction
                Action={Action}
                confirm={handleConfirm}
                cancel={handleClose}
                cancelLabel={cancelLabel}
                confirmLabel={confirmLabel}
                confirmDisabled={confirmDisabled}
              >
                <DialogActionCancel
                  Cancel={Cancel}
                  cancel={handleClose}
                  cancelLabel={cancelLabel}
                >
                  <Button
                    className={
                      styles['dialog_root-dialog-center-container-action-btn']
                    }
                    variant="contained"
                    color="error"
                    onClick={handleClose}
                  >
                    {cancelLabel}
                  </Button>
                </DialogActionCancel>

                <DialogActionConfirm
                  Confirm={Confirm}
                  confirm={handleConfirm}
                  confirmLabel={confirmLabel}
                  confirmDisabled={confirmDisabled}
                >
                  <Button
                    className={
                      styles['dialog_root-dialog-center-container-action-btn']
                    }
                    variant="contained"
                    color="primary"
                    onClick={handleConfirm}
                  >
                    {confirmLabel}
                  </Button>
                </DialogActionConfirm>
              </DialogAction>
            </DialogContainer>
          </div>
        </div>
      ) : (
        <></>
      )}
    </div>
  );
}

interface DialogContainerProps {
  Container?: ElementType;
  children: ReactNode;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any; // 允許傳遞額外屬性
}
function DialogContainer(props: Readonly<DialogContainerProps>): ReactNode {
  const { Container, children, ...otherProps } = props;

  if (typeof Container === 'string' || typeof Container === 'function') {
    return <Container {...otherProps}>{children}</Container>;
  }

  return (
    <div className={styles['dialog_root-dialog-center-container']}>
      {children}
    </div>
  );
}

interface DialogTitleProps {
  Title?: ElementType;
  title: string;
  children: ReactNode;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
}
function DialogTitle(props: Readonly<DialogTitleProps>): ReactNode {
  const { Title, children, ...otherProps } = props;

  if (typeof Title === 'string' || typeof Title === 'function') {
    return <Title {...otherProps}>{children}</Title>;
  }

  return (
    <p className={styles['dialog_root-dialog-center-container-title']}>
      {children}
    </p>
  );
}

interface DialogContentProps {
  Content?: ElementType;
  children: ReactNode;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
}
function DialogContent(props: Readonly<DialogContentProps>): ReactNode {
  const { Content, children, ...otherProps } = props;

  if (typeof Content === 'string' || typeof Content === 'function') {
    return <Content {...otherProps}>{children}</Content>;
  }

  return (
    <div className={styles['dialog_root-dialog-center-container-content']}>
      {children}
    </div>
  );
}

interface DialogActionProps {
  Action?: ElementType;
  confirm: () => void;
  confirmLabel: string;
  confirmDisabled: boolean;
  cancel: () => void;
  cancelLabel: string;
  children: ReactNode;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
}
function DialogAction(props: Readonly<DialogActionProps>): ReactNode {
  const { Action, children, ...otherProps } = props;

  if (typeof Action === 'string' || typeof Action === 'function') {
    return <Action {...otherProps}>{children}</Action>;
  }

  return (
    <div className={styles['dialog_root-dialog-center-container-action']}>
      {children}
    </div>
  );
}

interface DialogActionCancelProps {
  Cancel?: ElementType;
  children: ReactNode;
  cancel: () => void;
  cancelLabel: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
}
function DialogActionCancel(
  props: Readonly<DialogActionCancelProps>
): ReactNode {
  const { Cancel, children, ...otherProps } = props;

  if (typeof Cancel === 'string' || typeof Cancel === 'function') {
    return <Cancel {...otherProps}>{children}</Cancel>;
  }

  return (
    <div className={styles['dialog_root-dialog-center-container-action-btn']}>
      {children}
    </div>
  );
}

interface DialogActionConfirmProps {
  Confirm?: ElementType;
  children: ReactNode;
  confirm: () => void;
  confirmLabel: string;
  confirmDisabled: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
}
function DialogActionConfirm(
  props: Readonly<DialogActionConfirmProps>
): ReactNode {
  const { Confirm, children, ...otherProps } = props;

  if (typeof Confirm === 'string' || typeof Confirm === 'function') {
    return <Confirm {...otherProps}>{children}</Confirm>;
  }

  return (
    <div className={styles['dialog_root-dialog-center-container-action-btn']}>
      {children}
    </div>
  );
}

export default Dialog;
