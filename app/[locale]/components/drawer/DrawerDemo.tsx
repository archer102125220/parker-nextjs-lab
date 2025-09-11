'use client';
import type { ReactNode } from 'react';
import { useState } from 'react';
import Button from '@mui/material/Button';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';

import Drawer from '@/components/Drawer';
import type { anchorType } from '@/components/Drawer';

import style from '@/app/[locale]/components/drawer/page.module.scss';

function DrawerDemo(): ReactNode {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [anchor, setAnchor] = useState<anchorType>('left');

  const handleOpen = () => {
    setIsOpen(true);
    console.log('Drawer opened');
  };

  const handleClose = () => {
    // setIsOpen(false);
    console.log('Drawer closed');
  };

  const handleChange = (value: boolean) => {
    setIsOpen(value);
  };

  return (
    <div className={style['drawer_page-container']}>
      <div className={style['drawer_page-container-input_field']}>
        <Select
          label="錨點位置:"
          value={anchor}
          onChange={(e) => setAnchor(e.target.value as anchorType)}
          className={style['drawer_page-container-input_field-selector']}
        >
          <MenuItem value="left">左側</MenuItem>
          <MenuItem value="right">右側</MenuItem>
          <MenuItem value="top">頂部</MenuItem>
          <MenuItem value="bottom">底部</MenuItem>
        </Select>
      </div>

      <div className={style['drawer_page-container-trigger']}>
        <Button variant="contained" onClick={() => setIsOpen(true)}>
          打開抽屜
        </Button>
      </div>

      <Drawer
        open={isOpen}
        anchor={anchor}
        hasAnimation={true}
        hasMask={true}
        dragCloseDisabled={false}
        width={anchor === 'left' || anchor === 'right' ? 300 : undefined}
        height={anchor === 'top' || anchor === 'bottom' ? 200 : undefined}
        triggerPercentage={0.25}
        OpenBtn={({ onOpen }) => (
          <Button variant="contained" color="success" onClick={onOpen}>
            自定義打開按鈕
          </Button>
        )}
        onChange={handleChange}
        onOpen={handleOpen}
        onClose={handleClose}
      >
        <div className={style['drawer_page-container-drawer_container']}>
          <h3>抽屜內容</h3>
          <p>這是一個從 {anchor} 方向滑出的抽屜組件。</p>
          <p>支持拖拽關閉功能。</p>
          <p>可以自定義內容和樣式。</p>

          <div
            className={style['drawer_page-container-drawer_container-close']}
          >
            <Button variant="contained" onClick={() => setIsOpen(false)}>
              關閉抽屜
            </Button>
          </div>
        </div>
      </Drawer>
    </div>
  );
}

export default DrawerDemo;
