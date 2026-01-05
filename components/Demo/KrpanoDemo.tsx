'use client';

import { useState } from 'react';

import Button from '@mui/material/Button';

import Krpano, { HotspotConfig } from '@/components/Krpano';
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
    label: '場景 2 (港口)'
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
  // 使用 State 管理狀態，而非透過 Ref 命令式操作
  const [currentScene, setCurrentScene] = useState(startScene);
  const [isHotspotAVisible, setIsHotspotAVisible] = useState(
    hotspotA?.visible ?? true
  );
  const [isHotspotBVisible, setIsHotspotBVisible] = useState(
    hotspotB?.visible ?? true
  );

  const handleToggleHotspotA = () => {
    setIsHotspotAVisible((prev) => !prev);
  };

  const handleToggleHotspotB = () => {
    setIsHotspotBVisible((prev) => !prev);
  };

  const handleLoadScene = (sceneName: string) => {
    setCurrentScene(sceneName);
  };

  // 整合 Props 與 State
  const mergedHotspotA = { ...hotspotA, visible: isHotspotAVisible };
  const mergedHotspotB = { ...hotspotB, visible: isHotspotBVisible };

  return (
    <div className={style.krpano_demo}>
      <div className={style['krpano_demo-header']}>
        <h1 className={style['krpano_demo-title']}>{instructionTitle}</h1>
        <p className={style['krpano_demo-description']}>{instructionContent}</p>
      </div>

      <div className={style['krpano_demo-container']}>
        <Krpano
          xml={xml}
          startScene={startScene}
          currentScene={currentScene}
          hotspotA={mergedHotspotA}
          hotspotB={mergedHotspotB}
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
