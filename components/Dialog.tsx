import { ReactNode } from 'react';

interface DialogProps {
  open: boolean;
  position: string;
  rootPosition: string;
  width: string | number;
  minWidth: string | number;
  height: string | number;
  minHeight: string | number;
  zIndex: string | number;
  title: string;
  content: string;
  confirmLabel: string;
  confirmDisabled: boolean;
  cancelLabel: string;
  children: ReactNode;
}

function Dialog(props: Readonly<DialogProps>) {
  const { children } = props;

  return children;
}

export default Dialog;
