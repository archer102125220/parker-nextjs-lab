'use client';

import { useState } from 'react';
import { SwiperCustom, SwiperCustomSlide } from '../SwiperCustom';
import './index.scss';

export interface BannerItem {
  id: string | number;
  image?: string;
  title?: string;
  description?: string;
  link?: string;
  [key: string]: any;
}

export interface BannerProps {
  items: BannerItem[];
  autoplay?: boolean | { delay: number };
  effect?: 'slide' | 'fade' | 'coverflow';
  onSlideChange?: (index: number) => void;
  className?: string;
}

export function Banner({
  items = [],
  autoplay = true,
  effect = 'coverflow',
  onSlideChange,
  className = ''
}: BannerProps) {
  const [activeIndex, setActiveIndex] = useState(0);

  const slides: SwiperCustomSlide[] = items.map((item) => ({
    id: item.id,
    content: (
      <div className="banner-slide">
        {item.image && (
          <img
            src={item.image}
            alt={item.title || 'Banner'}
            className="banner-slide-image"
          />
        )}
        {(item.title || item.description) && (
          <div className="banner-slide-content">
            {item.title && <h2 className="banner-slide-title">{item.title}</h2>}
            {item.description && (
              <p className="banner-slide-description">{item.description}</p>
            )}
          </div>
        )}
      </div>
    )
  }));

  const handleSlideChange = (index: number) => {
    setActiveIndex(index);
    onSlideChange?.(index);
  };

  return (
    <div className={`banner ${className}`}>
      <SwiperCustom
        slides={slides}
        autoplay={autoplay}
        effect={effect}
        navigation={true}
        pagination={true}
        loop={items.length > 1}
        onSlideChange={handleSlideChange}
      />
    </div>
  );
}

export default Banner;
