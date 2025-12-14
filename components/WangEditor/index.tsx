'use client';

import { useEffect, useState } from 'react';
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
    ],
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
    if (value !== html && value !== undefined) {
      setHtml(value);
    }
  }, [value]); // Removed html from dependencies to avoid infinite loop

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
    setHtml(newHtml);
    onChange?.(newHtml);
  };

  const heightValue = typeof height === 'number' ? `${height}px` : height;

  return (
    <div className={`wang-editor ${className}`}>
      <Toolbar
        editor={editor}
        defaultConfig={defaultToolbarConfig}
        mode="default"
        className="wang-editor-toolbar"
      />
      <Editor
        defaultConfig={defaultEditorConfig}
        value={html}
        onCreated={setEditor}
        onChange={handleChange}
        mode="default"
        className="wang-editor-content"
        style={{ height: heightValue, overflowY: 'auto' }}
      />
    </div>
  );
}

export default WangEditor;
