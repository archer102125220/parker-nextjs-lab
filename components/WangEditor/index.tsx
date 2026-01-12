'use client';

import { useEffect, useState, useRef, type CSSProperties } from 'react';
import { Editor, Toolbar } from '@wangeditor/editor-for-react';
import { IDomEditor, IEditorConfig, IToolbarConfig } from '@wangeditor/editor';
import '@wangeditor/editor/dist/css/style.css';
import './index.scss';

export interface WangEditorProps {
  value?: string;
  onChange?: (html: string) => void;
  placeholder?: string;
  readOnly?: boolean;
  height?: number | string;
  toolbarConfig?: Partial<IToolbarConfig>;
  editorConfig?: Partial<IEditorConfig>;
  className?: string;
}

export function WangEditor({
  value = '',
  onChange,
  placeholder = '請輸入內容...',
  readOnly = false,
  height = 400,
  toolbarConfig,
  editorConfig,
  className = ''
}: WangEditorProps) {
  const [editor, setEditor] = useState<IDomEditor | null>(null);
  const [html, setHtml] = useState(value);
  const isInternalChange = useRef(false);

  // Toolbar configuration
  const defaultToolbarConfig: Partial<IToolbarConfig> = {
    toolbarKeys: [
      'headerSelect',
      'bold',
      'italic',
      'underline',
      'through',
      '|',
      'color',
      'bgColor',
      '|',
      'fontSize',
      'fontFamily',
      'lineHeight',
      '|',
      'bulletedList',
      'numberedList',
      'todo',
      '|',
      'emotion',
      'insertLink',
      'uploadImage',
      'insertVideo',
      'insertTable',
      'codeBlock',
      '|',
      'undo',
      'redo',
      '|',
      'fullScreen'
    ] as string[],
    ...toolbarConfig
  };

  // Editor configuration
  const defaultEditorConfig: Partial<IEditorConfig> = {
    placeholder,
    readOnly,
    ...editorConfig
  };

  // Sync external value changes
  useEffect(() => {
    if (!isInternalChange.current && value !== undefined && value !== html) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setHtml(value);
    }
    isInternalChange.current = false;
  }, [value, html]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (editor) {
        editor.destroy();
      }
    };
  }, [editor]);

  const handleChange = (editor: IDomEditor) => {
    const newHtml = editor.getHtml();
    isInternalChange.current = true;
    setHtml(newHtml);
    onChange?.(newHtml);
  };

  const heightValue = typeof height === 'number' ? `${height}px` : height;

  return (
    <div className={`wang_editor ${className}`}>
      <Toolbar
        editor={editor}
        defaultConfig={defaultToolbarConfig}
        mode="default"
        className="wang_editor-toolbar"
      />
      <div
        className="wang_editor-container"
        style={{ '--editor-height': heightValue } as CSSProperties}
      >
        <Editor
          defaultConfig={defaultEditorConfig}
          value={html}
          onCreated={setEditor}
          onChange={handleChange}
          mode="default"
          className="wang_editor-container-content"
        />
      </div>
    </div>
  );
}

export default WangEditor;
