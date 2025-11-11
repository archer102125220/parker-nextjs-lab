'use client';
import type { ReactNode } from 'react';

export function Head(): ReactNode {
  return (
    // eslint-disable-next-line @next/next/no-head-element
    <head>
      <meta charSet="utf-8" />
      <meta
        name="viewport"
        content="minimum-scale=1, initial-scale=1, width=device-width, shrink-to-fit=no, user-scalable=no, viewport-fit=cover"
      />

      {/*
          https://www.photoroom.com/zh-tw/tools/background-remover
          https://remove-white-background.imageonline.co/cn/
          https://www.freeconvert.com/image-converter
          https://realfavicongenerator.net/
      */}
      <link rel="apple-touch-icon" href="/img/ico/apple-touch-icon.png" />
      <link rel="icon" href="/img/ico/favicon.ico" type="image/x-icon" />
      <link
        rel="shortcut icon"
        href="/img/ico/favicon.ico"
        type="image/x-icon"
      />

      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link
        rel="preconnect"
        href="https://fonts.gstatic.com"
        crossOrigin="anonymous"
      />
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/icon?family=Material+Icons"
      />
    </head>
  );
}
export default Head;
