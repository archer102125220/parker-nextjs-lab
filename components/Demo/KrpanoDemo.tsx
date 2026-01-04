'use client';

import { useRef } from 'react';

import Button from '@mui/material/Button';

import Krpano, { KrpanoRef, HotspotConfig } from '@/components/Krpano';
import style from '@/app/[locale]/krpano-demo/page.module.scss';

interface KrpanoDemoProps {
  /** XML 配置路徑 */
  xml?: string;
  /** 初始場景 */
  startScene?: string;
  /** 熱點 A 配置 */
  hotspotA?: Partial<HotspotConfig>;
  /** 熱點 B 配置 */
  hotspotB?: Partial<HotspotConfig>;
  /** 是否啟用切換功能 */
  enableToggle?: boolean;
  /** 說明文字 - 標題 */
  instructionTitle?: string;
  /** 說明文字 - 內容 */
  instructionContent?: string;
  /** 場景列表 */
  scenes?: Array<{ name: string; label: string }>;
}

const DEFAULT_SCENES = [
  { name: 'scene_bryan_goff_iuyhxaia8ea_unsplash', label: '場景 1 (極光)' },
  {
    name: 'scene_timothy_oldfield_luufnhochru_unsplash',
    label: '場景 2 (雪景)'
  }
];

export default function KrpanoDemo({
  xml,
  startScene,
  hotspotA,
  hotspotB,
  enableToggle = true,
  instructionTitle = '操作說明',
  instructionContent = '點擊熱點 A 來切換熱點 B 的顯示/隱藏狀態',
  scenes = DEFAULT_SCENES
}: KrpanoDemoProps) {
  const krpanoRef = useRef<KrpanoRef>(null);

  const handleToggleHotspotA = () => {
    krpanoRef.current?.toggleHotspotA();
  };

  const handleToggleHotspotB = () => {
    krpanoRef.current?.toggleHotspotB();
  };

  const handleLoadScene = (sceneName: string) => {
    krpanoRef.current?.loadScene(sceneName);
  };

  return (
    <div className={style.krpano_demo}>
      <div className={style['krpano_demo-header']}>
        <h1 className={style['krpano_demo-title']}>{instructionTitle}</h1>
        <p className={style['krpano_demo-description']}>{instructionContent}</p>
      </div>

      <div className={style['krpano_demo-container']}>
        <Krpano
          ref={krpanoRef}
          xml={xml}
          startScene={startScene}
          hotspotA={hotspotA}
          hotspotB={hotspotB}
          enableToggle={enableToggle}
          className={style['krpano_demo-viewer']}
        />
      </div>

      <div className={style['krpano_demo-controls']}>
        <Button variant="contained" onClick={handleToggleHotspotA}>
          Toggle Hotspot A
        </Button>
        <Button variant="contained" onClick={handleToggleHotspotB}>
          Toggle Hotspot B
        </Button>

        {scenes.map((scene) => (
          <Button
            key={scene.name}
            variant="contained"
            onClick={() => handleLoadScene(scene.name)}
          >
            {scene.label}
          </Button>
        ))}
      </div>
    </div>
  );
}
