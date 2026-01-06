import type { KrpanoInstance, HotspotConfig } from './types';

// 熱點點擊 callback 存儲 (使用 Map 來存儲每個熱點的 callback)
export const hotspotCallbacks = new Map<string, (krpano: KrpanoInstance) => void>();

// 添加單個熱點的輔助函數
export function addHotspot(krpano: KrpanoInstance, config: HotspotConfig, panoId: string) {
  krpano.call(`addhotspot(${config.name})`);
  krpano.set(`hotspot[${config.name}].keep`, true);
  updateHotspot(krpano, config, panoId);
}

// 移除熱點的輔助函數
export function removeHotspot(krpano: KrpanoInstance, name: string, panoId: string) {
  krpano.call(`removehotspot(${name})`);
  // 清除對應的所有事件 callbacks
  const eventTypes = ['onclick', 'onover', 'onout', 'ondown', 'onup'];
  eventTypes.forEach((eventName) => {
    const callbackKey = `${panoId}_${name}_${eventName}`;
    hotspotCallbacks.delete(callbackKey);
  });
}

// 更新熱點屬性的輔助函數
export function updateHotspot(krpano: KrpanoInstance, config: HotspotConfig, panoId: string) {
  krpano.set(`hotspot[${config.name}].url`, config.url);
  krpano.set(`hotspot[${config.name}].ath`, config.ath);
  krpano.set(`hotspot[${config.name}].atv`, config.atv);
  krpano.set(`hotspot[${config.name}].scale`, config.scale ?? 0.5);
  krpano.set(`hotspot[${config.name}].visible`, config.visible ?? true);
  
  // 設定各種事件
  setHotspotEvent(krpano, config, panoId, 'onclick', config.krpanoOnClick, config.onClick);
  setHotspotEvent(krpano, config, panoId, 'onover', config.krpanoOnOver, config.onHover);
  setHotspotEvent(krpano, config, panoId, 'onout', config.krpanoOnOut, config.onLeave);
  setHotspotEvent(krpano, config, panoId, 'ondown', config.krpanoOnDown, config.onMouseDown);
  setHotspotEvent(krpano, config, panoId, 'onup', config.krpanoOnUp, config.onMouseUp);
}

// 設定單一事件的輔助函數
export function setHotspotEvent(
  krpano: KrpanoInstance,
  config: HotspotConfig,
  panoId: string,
  eventName: string,
  krpanoAction?: string,
  callback?: (hotspot: HotspotConfig, krpano: KrpanoInstance) => void
) {
  const callbackKey = `${panoId}_${config.name}_${eventName}`;
  
  if (callback) {
    // 儲存 callback
    hotspotCallbacks.set(callbackKey, () => callback(config, krpano));
    
    // 使用 jscall 呼叫全域函數
    const jsCallAction = `jscall(window.__krpanoHotspotClick('${callbackKey}'))`;
    
    // 如果有 krpanoAction，則串接兩者
    if (krpanoAction) {
      krpano.set(`hotspot[${config.name}].${eventName}`, `${krpanoAction}; ${jsCallAction}`);
    } else {
      krpano.set(`hotspot[${config.name}].${eventName}`, jsCallAction);
    }
  } else if (krpanoAction) {
    // 只有 Krpano action
    krpano.set(`hotspot[${config.name}].${eventName}`, krpanoAction);
    // 清除可能存在的舊 callback
    hotspotCallbacks.delete(callbackKey);
  } else {
    // 清除事件
    krpano.set(`hotspot[${config.name}].${eventName}`, '');
    hotspotCallbacks.delete(callbackKey);
  }
}

// 初始化或更新文字圖層的輔助函數
const TEXT_LAYER_NAME = 'i18n_text_layer';
export function initOrUpdateTextLayer(krpano: KrpanoInstance, content?: string) {
  if (content) {
    // 檢查圖層是否存在，如果不存在則創建
    const existingLayer = krpano.get(`layer[${TEXT_LAYER_NAME}]`);
    if (!existingLayer) {
      krpano.call(`addlayer(${TEXT_LAYER_NAME})`);
      krpano.set(`layer[${TEXT_LAYER_NAME}].type`, 'text');
      krpano.set(`layer[${TEXT_LAYER_NAME}].align`, 'bottom');
      krpano.set(`layer[${TEXT_LAYER_NAME}].x`, '0');
      krpano.set(`layer[${TEXT_LAYER_NAME}].y`, '10%');
      krpano.set(`layer[${TEXT_LAYER_NAME}].css`, 'font-size:24px; color:white; text-shadow: 2px 2px 4px rgba(0,0,0,0.8); font-weight: bold;');
      krpano.set(`layer[${TEXT_LAYER_NAME}].bg`, false);
    }
    // 更新文字內容
    krpano.set(`layer[${TEXT_LAYER_NAME}].html`, content);
    krpano.set(`layer[${TEXT_LAYER_NAME}].visible`, true);
  } else {
    // 如果沒有內容，隱藏圖層
    krpano.set(`layer[${TEXT_LAYER_NAME}].visible`, false);
  }
}
