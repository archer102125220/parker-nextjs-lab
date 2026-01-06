'use client';

import { useState, useCallback, useEffect, useMemo } from 'react';

import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import Box from '@mui/material/Box';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';

import Krpano, { HotspotConfig } from '@/components/Krpano';
import style from '@/app/[locale]/krpano-demo/page.module.scss';

interface KrpanoDemoProps {
  /** XML 配置路徑 */
  xml?: string;
  /** 初始場景 */
  startScene?: string;
  /** 熱點配置陣列 */
  hotspots?: HotspotConfig[];
  /** 說明文字 - 標題 */
  instructionTitle?: string;
  /** 說明文字 - 內容 */
  instructionContent?: string;
  /** 場景列表 */
  scenes?: Array<{ name: string; label: string }>;
  /** 載入中文字 */
  loadingText?: string;
  /** 熱點 A 按鈕文字 */
  toggleHotspotALabel?: string;
  /** 熱點 B 按鈕文字 */
  toggleHotspotBLabel?: string;
  /** 說明文件標籤 */
  docLabel?: string;
  /** 熱點控制標籤 */
  hotspotLabel?: string;
  /** 場景切換標籤 */
  sceneLabel?: string;
  /** 開發工具標籤 */
  devToolsLabel?: string;
  /** 顯示說明按鈕文字 */
  showInfoLabel?: string;
  /** 隱藏說明按鈕文字 */
  hideInfoLabel?: string;
  /** 除錯模式說明 */
  debugModeDesc?: string;
  /** 快捷鍵說明 */
  shortcutDesc?: string;
  /** 開啟 Log 按鈕文字 */
  openLogLabel?: string;
  /** 關閉 Log 按鈕文字 */
  closeLogLabel?: string;
  /** 收起選單按鈕文字 */
  collapseMenuLabel?: string;
  /** 展開選單按鈕文字 */
  expandMenuLabel?: string;
  /** Krpano 動態文字 */
  dynamicText?: string;
  /** 新增熱點標籤 */
  addHotspotLabel?: string;
  /** 熱點名稱標籤 */
  hotspotNameLabel?: string;
  /** 水平角度標籤 */
  hotspotAthLabel?: string;
  /** 垂直角度標籤 */
  hotspotAtvLabel?: string;
  /** 確認新增標籤 */
  confirmAddLabel?: string;
  /** 取消標籤 */
  cancelLabel?: string;
  /** 自定義熱點標籤 */
  customHotspotsLabel?: string;
  /** 預設圖示標籤 */
  presetIconLabel?: string;
  /** 自定義 URL 標籤 */
  customUrlLabel?: string;
}

const DEFAULT_SCENES = [
  { name: 'scene_bryan_goff_iuyhxaia8ea_unsplash', label: '場景 1 (極光)' },
  {
    name: 'scene_timothy_oldfield_luufnhochru_unsplash',
    label: '場景 2 (港口)'
  }
];

// 預設熱點配置
const DEFAULT_HOTSPOTS: HotspotConfig[] = [
  {
    name: 'hotspot_A',
    url: '/krpano/skin/vtourskin_hotspot.png',
    ath: 0,
    atv: 0,
    scale: 0.5,
    visible: true,
    krpanoOnClick: 'toggle_visibility(hotspot_B)'
  },
  {
    name: 'hotspot_B',
    url: '/krpano/skin/vtourskin_mapspot.png',
    ath: 30,
    atv: 0,
    scale: 0.5,
    visible: true
  }
];

// Button Styles
const commonButtonSx = {
  minWidth: 'auto',
  padding: { xs: '0.4rem 0.8rem', md: '0.6rem 1.2rem' },
  fontSize: { xs: '0.7rem', md: '0.85rem' },
  fontWeight: 600,
  color: '#fff',
  textTransform: 'none',
  background: 'rgba(0, 0, 0, 0.6)',
  border: '1px solid rgba(255, 255, 255, 0.3)',
  borderRadius: '2rem',
  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.4)',
  backdropFilter: 'blur(8px)',
  pointerEvents: 'auto',
  transition: 'all 0.2s ease',
  '&:hover': {
    color: '#fff',
    background: 'rgba(0, 0, 0, 0.85)',
    borderColor: '#fff',
    boxShadow: '0 6px 20px rgba(0, 0, 0, 0.6)',
    transform: 'translateY(-2px)',
  },
  '&:active': {
    transform: 'translateY(0)',
  },
};

const infoButtonSx = {
  ...commonButtonSx,
  color: '#ffd700',
  borderColor: 'rgba(255, 215, 0, 0.4)',
  '&:hover': {
    ...commonButtonSx['&:hover'],
    background: 'rgba(255, 215, 0, 0.15)',
    borderColor: '#ffd700',
  },
};

const sceneButtonSx = {
  ...commonButtonSx,
  background:
    'linear-gradient(135deg, rgba(102, 126, 234, 0.5) 0%, rgba(118, 75, 162, 0.5) 100%)',
  borderColor: 'rgba(102, 126, 234, 0.4)',
  '&:hover': {
    ...commonButtonSx['&:hover'],
    background:
      'linear-gradient(135deg, rgba(102, 126, 234, 0.8) 0%, rgba(118, 75, 162, 0.8) 100%)',
    borderColor: '#fff',
  },
};

const toggleButtonSx = {
  position: 'absolute',
  top: '1rem',
  left: -28,
  zIndex: 35,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: 28,
  height: 48,
  minWidth: 0,
  padding: 0,
  fontSize: '0.8rem',
  color: 'rgba(255, 255, 255, 0.8)',
  background: 'rgba(0, 0, 0, 0.2)',
  border: '1px solid rgba(255, 255, 255, 0.1)',
  borderRight: 'none',
  borderRadius: '8px 0 0 8px',
  backdropFilter: 'blur(4px)',
  pointerEvents: 'auto',
  transition: 'all 0.2s ease',
  '&:hover': {
    color: '#fff',
    background: 'rgba(0, 0, 0, 0.4)',
    boxShadow: '-2px 0 8px rgba(0, 0, 0, 0.2)',
  },
};

const addButtonSx = {
  ...commonButtonSx,
  background:
    'linear-gradient(135deg, rgba(76, 175, 80, 0.5) 0%, rgba(56, 142, 60, 0.5) 100%)',
  borderColor: 'rgba(76, 175, 80, 0.4)',
  '&:hover': {
    ...commonButtonSx['&:hover'],
    background:
      'linear-gradient(135deg, rgba(76, 175, 80, 0.8) 0%, rgba(56, 142, 60, 0.8) 100%)',
    borderColor: '#fff',
  },
};

const textFieldSx = {
  '& .MuiInputBase-root': {
    color: '#fff',
    fontSize: '0.85rem',
  },
  '& .MuiInputLabel-root': {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: '0.8rem',
  },
  '& .MuiOutlinedInput-notchedOutline': {
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  '& .MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline': {
    borderColor: 'rgba(255, 255, 255, 0.5)',
  },
  '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': {
    borderColor: '#4caf50',
  },
  '& .MuiInputLabel-root.Mui-focused': {
    color: '#4caf50',
  },
};

const hotspotItemSx = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: '0.5rem',
  padding: '0.4rem 0.6rem',
  background: 'rgba(255, 255, 255, 0.05)',
  borderRadius: '0.5rem',
  border: '1px solid rgba(255, 255, 255, 0.1)',
  fontSize: '0.75rem',
  color: 'rgba(255, 255, 255, 0.9)',
};

// 熱點圖片選項
const HOTSPOT_ICONS = [
  { label: 'Hotspot', url: '/krpano/skin/vtourskin_hotspot.png' },
  { label: 'Map', url: '/krpano/skin/vtourskin_mapspot.png' },
];

export default function KrpanoDemo({
  xml,
  startScene,
  hotspots = DEFAULT_HOTSPOTS,
  instructionTitle = '操作說明',
  instructionContent = '點擊熱點 A 來切換熱點 B 的顯示/隱藏狀態',
  scenes = DEFAULT_SCENES,
  loadingText = '載入全景中...',
  toggleHotspotALabel = 'Toggle Hotspot A',
  toggleHotspotBLabel = 'Toggle Hotspot B',
  docLabel = '說明文件',
  hotspotLabel = '熱點控制',
  sceneLabel = '場景切換',
  devToolsLabel = '開發工具',
  showInfoLabel = '顯示說明',
  hideInfoLabel = '收起說明',
  debugModeDesc = '除錯模式：開啟後可查看執行紀錄。',
  shortcutDesc = '快捷鍵：按下 ~ 鍵可開關 Log。',
  openLogLabel = '開啟 Log',
  closeLogLabel = '關閉 Log',
  collapseMenuLabel = '收起選單',
  expandMenuLabel = '展開選單',
  dynamicText,
  addHotspotLabel = '新增熱點',
  hotspotNameLabel = '熱點名稱',
  hotspotAthLabel = '水平角度 (ATH)',
  hotspotAtvLabel = '垂直角度 (ATV)',
  confirmAddLabel = '新增',
  cancelLabel = '取消',
  customHotspotsLabel = '自定義熱點',
  presetIconLabel = '預設圖示',
  customUrlLabel = '自定義 URL'
}: KrpanoDemoProps) {
  // 載入狀態
  const [isLoaded, setIsLoaded] = useState(false);

  // 使用 State 管理狀態，而非透過 Ref 命令式操作
  const [currentScene, setCurrentScene] = useState(startScene);

  // 熱點可見性狀態 (使用 Map 來追蹤每個熱點的可見性)
  const [hotspotVisibility, setHotspotVisibility] = useState<Record<string, boolean>>(() => {
    const initial: Record<string, boolean> = {};
    hotspots.forEach((h) => {
      initial[h.name] = h.visible ?? true;
    });
    return initial;
  });

  const [isDebug, setIsDebug] = useState(false);
  const [isInfoOpen, setIsInfoOpen] = useState(false);

  const handleReady = useCallback(() => {
    setIsLoaded(true);
  }, []);

  // 通用的切換熱點可見性函數
  const handleToggleHotspot = useCallback((name: string) => {
    setHotspotVisibility((prev) => ({
      ...prev,
      [name]: !prev[name]
    }));
  }, []);

  const handleLoadScene = (sceneName: string) => {
    setCurrentScene(sceneName);
  };

  const toggleDebug = () => setIsDebug((prev) => !prev);
  const toggleInfo = () => setIsInfoOpen((prev) => !prev);

  const [isControlsOpen, setIsControlsOpen] = useState(true);
  const toggleControls = () => setIsControlsOpen((prev) => !prev);

  // 自定義熱點狀態
  const [customHotspots, setCustomHotspots] = useState<HotspotConfig[]>([]);
  const [isAddFormOpen, setIsAddFormOpen] = useState(false);
  const [newHotspotName, setNewHotspotName] = useState('');
  const [newHotspotAth, setNewHotspotAth] = useState('0');
  const [newHotspotAtv, setNewHotspotAtv] = useState('0');
  const [selectedIconIndex, setSelectedIconIndex] = useState(0);
  const [customUrl, setCustomUrl] = useState('');
  const [iconTabIndex, setIconTabIndex] = useState(0); // 0: 預設, 1: 自定義 URL

  // 取得最終使用的圖片 URL
  const getHotspotUrl = useCallback(() => {
    if (iconTabIndex === 1 && customUrl.trim()) {
      return customUrl.trim();
    }
    return HOTSPOT_ICONS[selectedIconIndex].url;
  }, [iconTabIndex, customUrl, selectedIconIndex]);

  // 檢查表單是否有效
  const isFormValid = useMemo(() => {
    if (!newHotspotName.trim()) return false;
    if (iconTabIndex === 1 && !customUrl.trim()) return false;
    // 簡單的 URL 格式驗證
    if (iconTabIndex === 1) {
      const urlPattern = /^(https?:\/\/|\/).+/i;
      if (!urlPattern.test(customUrl.trim())) return false;
    }
    return true;
  }, [newHotspotName, iconTabIndex, customUrl]);

  // 新增熱點
  const handleAddHotspot = useCallback(() => {
    if (!newHotspotName.trim()) return;

    const newHotspot: HotspotConfig & { displayName?: string } = {
      name: `custom_${Date.now()}`,
      url: getHotspotUrl(),
      ath: parseFloat(newHotspotAth) || 0,
      atv: parseFloat(newHotspotAtv) || 0,
      scale: 0.5,
      visible: true,
      onClick: (hotspot) => {
        console.log('Clicked custom hotspot:', hotspot.name);
      }
    };

    // 儲存顯示名稱到 closure 中
    const displayName = newHotspotName.trim();
    (newHotspot as HotspotConfig & { displayName: string }).displayName = displayName;

    setCustomHotspots((prev) => [...prev, newHotspot]);
    setHotspotVisibility((prev) => ({
      ...prev,
      [newHotspot.name]: true
    }));

    // 重置表單
    setNewHotspotName('');
    setNewHotspotAth('0');
    setNewHotspotAtv('0');
    setCustomUrl('');
    setIconTabIndex(0);
    setIsAddFormOpen(false);
  }, [newHotspotName, newHotspotAth, newHotspotAtv, getHotspotUrl]);

  // 刪除自定義熱點
  const handleRemoveHotspot = useCallback((name: string) => {
    setCustomHotspots((prev) => prev.filter((h) => h.name !== name));
    setHotspotVisibility((prev) => {
      const updated = { ...prev };
      delete updated[name];
      return updated;
    });
  }, []);

  // Auto-collapse controls after initial load
  useEffect(() => {
    if (isLoaded) {
      const timer = setTimeout(() => {
        setIsControlsOpen(false);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [isLoaded]);

  // 使用 useMemo 合併熱點配置與可見性狀態
  const mergedHotspots = useMemo(() => {
    const allHotspots = [...hotspots, ...customHotspots];
    return allHotspots.map((hotspot) => ({
      ...hotspot,
      visible: hotspotVisibility[hotspot.name] ?? hotspot.visible ?? true
    }));
  }, [hotspots, customHotspots, hotspotVisibility]);

  return (
    <div className={style.krpano_demo}>
      {/* Loading Overlay */}
      <div
        className={style['krpano_demo-loading']}
        css-is-loaded={isLoaded ? 'true' : 'false'}
      >
        <div className={style['krpano_demo-loading-spinner']} />
        <p className={style['krpano_demo-loading-text']}>{loadingText}</p>
      </div>

      {/* Header */}
      <div className={style['krpano_demo-header']}>
        <h1 className={style['krpano_demo-header-title']}>
          {instructionTitle}
        </h1>
      </div>

      {/* VR Viewer */}
      <div className={style['krpano_demo-container']}>
        <Krpano
          xml={xml}
          startScene={startScene}
          currentScene={currentScene}
          hotspots={mergedHotspots}
          className={style['krpano_demo-container-viewer']}
          onReady={handleReady}
          debug={isDebug}
          textLayerContent={dynamicText}
        />
      </div>

      {/* Controls */}
      <div
        className={style['krpano_demo-controls']}
        css-open={`${isControlsOpen}`}
        css-is-debug={`${isDebug}`}
      >
        {/* Toggle Button */}
        <Button
          sx={{
            ...toggleButtonSx,
            ...(!isControlsOpen && {
              background: 'rgba(0, 0, 0, 0.5)',
              '&:hover': {
                background: 'rgba(0, 0, 0, 0.8)',
              },
            }),
          }}
          onClick={toggleControls}
          aria-label={isControlsOpen ? collapseMenuLabel : expandMenuLabel}
        >
          {isControlsOpen ? '▶' : '◀'}
        </Button>

        <div className={style['krpano_demo-controls-scroll_area']}>
          {/* Info Group */}
          <div className={style['krpano_demo-controls-scroll_area-group']}>
            <div
              className={style['krpano_demo-controls-scroll_area-group-label']}
            >
              {docLabel}
            </div>
            <Button
              variant="text"
              onClick={toggleInfo}
              sx={infoButtonSx}
            >
              {isInfoOpen ? hideInfoLabel : showInfoLabel}
            </Button>

            <div
              className={style['krpano_demo-controls-scroll_area-group-drawer']}
              css-expanded={`${isInfoOpen}`}
            >
              <div
                className={
                  style[
                    'krpano_demo-controls-scroll_area-group-drawer-content'
                  ]
                }
              >
                <p
                  className={
                    style[
                      'krpano_demo-controls-scroll_area-group-drawer-content-description'
                    ]
                  }
                >
                  {instructionContent}
                </p>
                <div
                  className={
                    style[
                      'krpano_demo-controls-scroll_area-group-drawer-content-debug_info'
                    ]
                  }
                >
                  <p>{debugModeDesc}</p>
                  <p>{shortcutDesc}</p>
                </div>
              </div>
            </div>
          </div>

          <div className={style['krpano_demo-controls-scroll_area-group']}>
            <div
              className={style['krpano_demo-controls-scroll_area-group-label']}
            >
              {hotspotLabel}
            </div>
            <div
              className={
                style['krpano_demo-controls-scroll_area-group-hotspot']
              }
            >
              {hotspots.map((hotspot, index) => (
                <Button
                  key={hotspot.name}
                  variant="contained"
                  sx={commonButtonSx}
                  onClick={() => handleToggleHotspot(hotspot.name)}
                >
                  {index === 0 ? toggleHotspotALabel : toggleHotspotBLabel}
                </Button>
              ))}
            </div>
          </div>

          <div className={style['krpano_demo-controls-scroll_area-group']}>
            <div
              className={style['krpano_demo-controls-scroll_area-group-label']}
            >
              {sceneLabel}
            </div>
            <div
              className={style['krpano_demo-controls-scroll_area-group-scene']}
            >
              {scenes.map((scene) => (
                <Button
                  key={scene.name}
                  variant="contained"
                  sx={sceneButtonSx}
                  onClick={() => handleLoadScene(scene.name)}
                >
                  {scene.label}
                </Button>
              ))}
            </div>
          </div>

          <div className={style['krpano_demo-controls-scroll_area-group']}>
            <div
              className={style['krpano_demo-controls-scroll_area-group-label']}
            >
              {devToolsLabel}
            </div>
            <Button
              variant="outlined"
              color={isDebug ? 'warning' : 'primary'}
              sx={commonButtonSx}
              onClick={toggleDebug}
            >
              {isDebug ? closeLogLabel : openLogLabel}
            </Button>
          </div>

          {/* Add Hotspot Section */}
          <div className={style['krpano_demo-controls-scroll_area-group']}>
            <div
              className={style['krpano_demo-controls-scroll_area-group-label']}
            >
              {customHotspotsLabel}
            </div>

            {/* Add Form Toggle */}
            {!isAddFormOpen ? (
              <Button
                variant="contained"
                sx={addButtonSx}
                onClick={() => setIsAddFormOpen(true)}
              >
                + {addHotspotLabel}
              </Button>
            ) : (
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.5rem',
                  padding: '0.75rem',
                  background: 'rgba(0, 0, 0, 0.3)',
                  borderRadius: '0.75rem',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                }}
              >
                <TextField
                  label={hotspotNameLabel}
                  value={newHotspotName}
                  onChange={(e) => setNewHotspotName(e.target.value)}
                  size="small"
                  fullWidth
                  sx={textFieldSx}
                />
                <Box sx={{ display: 'flex', gap: '0.5rem' }}>
                  <TextField
                    label={hotspotAthLabel}
                    value={newHotspotAth}
                    onChange={(e) => setNewHotspotAth(e.target.value)}
                    size="small"
                    type="number"
                    sx={{ ...textFieldSx, flex: 1 }}
                  />
                  <TextField
                    label={hotspotAtvLabel}
                    value={newHotspotAtv}
                    onChange={(e) => setNewHotspotAtv(e.target.value)}
                    size="small"
                    type="number"
                    sx={{ ...textFieldSx, flex: 1 }}
                  />
                </Box>
                {/* Icon Selection with Tabs */}
                <Box
                  sx={{
                    background: 'rgba(0, 0, 0, 0.2)',
                    borderRadius: '0.5rem',
                    overflow: 'hidden',
                  }}
                >
                  <Tabs
                    value={iconTabIndex}
                    onChange={(_, newValue) => setIconTabIndex(newValue)}
                    variant="fullWidth"
                    sx={{
                      minHeight: 36,
                      '& .MuiTab-root': {
                        minHeight: 36,
                        fontSize: '0.75rem',
                        color: 'rgba(255, 255, 255, 0.7)',
                        textTransform: 'none',
                      },
                      '& .Mui-selected': {
                        color: '#4caf50 !important',
                      },
                      '& .MuiTabs-indicator': {
                        backgroundColor: '#4caf50',
                      },
                    }}
                  >
                    <Tab label={presetIconLabel} />
                    <Tab label={customUrlLabel} />
                  </Tabs>

                  {/* Tab Content */}
                  <Box sx={{ padding: '0.5rem', minHeight: 56 }}>
                    {iconTabIndex === 0 ? (
                      // 預設圖示選擇
                      <Box sx={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                        {HOTSPOT_ICONS.map((icon, index) => (
                          <Button
                            key={icon.url}
                            variant={selectedIconIndex === index ? 'contained' : 'outlined'}
                            size="small"
                            onClick={() => setSelectedIconIndex(index)}
                            sx={{
                              ...commonButtonSx,
                              padding: '0.3rem 0.6rem',
                              fontSize: '0.7rem',
                              ...(selectedIconIndex === index && {
                                background: 'rgba(76, 175, 80, 0.6)',
                                borderColor: '#4caf50',
                              }),
                            }}
                          >
                            {icon.label}
                          </Button>
                        ))}
                      </Box>
                    ) : (
                      // 自定義 URL 輸入
                      <TextField
                        value={customUrl}
                        onChange={(e) => setCustomUrl(e.target.value)}
                        size="small"
                        fullWidth
                        placeholder="https://example.com/hotspot.png"
                        error={customUrl.trim() !== '' && !/^(https?:\/\/|\/).+/i.test(customUrl.trim())}
                        helperText={
                          customUrl.trim() !== '' && !/^(https?:\/\/|\/).+/i.test(customUrl.trim())
                            ? 'URL 必須以 http://, https:// 或 / 開頭'
                            : ''
                        }
                        sx={{
                          ...textFieldSx,
                          '& .MuiFormHelperText-root': {
                            color: '#ff5252',
                            fontSize: '0.7rem',
                            marginTop: '0.25rem',
                          },
                        }}
                      />
                    )}
                  </Box>
                </Box>
                <Box sx={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                  <Button
                    variant="text"
                    size="small"
                    onClick={() => setIsAddFormOpen(false)}
                    sx={{ ...commonButtonSx, padding: '0.3rem 0.8rem' }}
                  >
                    {cancelLabel}
                  </Button>
                  <Button
                    variant="contained"
                    size="small"
                    onClick={handleAddHotspot}
                    disabled={!isFormValid}
                    sx={{ ...addButtonSx, padding: '0.3rem 0.8rem' }}
                  >
                    {confirmAddLabel}
                  </Button>
                </Box>
              </Box>
            )}

            {/* Custom Hotspots List */}
            {customHotspots.length > 0 && (
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.4rem',
                  marginTop: '0.5rem',
                }}
              >
                {customHotspots.map((hotspot) => (
                  <Box key={hotspot.name} sx={hotspotItemSx}>
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        flex: 1,
                        overflow: 'hidden',
                      }}
                    >
                      <span style={{ fontWeight: 600 }}>
                        {(hotspot as HotspotConfig & { displayName?: string }).displayName || hotspot.name.replace('custom_', '#')}
                      </span>
                      <span style={{ opacity: 0.6, fontSize: '0.7rem' }}>
                        ({hotspot.ath.toFixed(1)}, {hotspot.atv.toFixed(1)})
                      </span>
                    </Box>
                    <Box sx={{ display: 'flex', gap: '0.25rem' }}>
                      <IconButton
                        size="small"
                        onClick={() => handleToggleHotspot(hotspot.name)}
                        sx={{
                          color: hotspotVisibility[hotspot.name] ? '#4caf50' : 'rgba(255,255,255,0.4)',
                          padding: '0.2rem',
                        }}
                      >
                        {hotspotVisibility[hotspot.name] ? '●' : '○'}
                      </IconButton>
                      <IconButton
                        size="small"
                        onClick={() => handleRemoveHotspot(hotspot.name)}
                        sx={{
                          color: 'rgba(255, 100, 100, 0.8)',
                          padding: '0.2rem',
                          '&:hover': { color: '#ff5252' },
                        }}
                      >
                        ×
                      </IconButton>
                    </Box>
                  </Box>
                ))}
              </Box>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
