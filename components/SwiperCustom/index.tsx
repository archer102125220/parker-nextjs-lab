'use client';

import { useRef, useEffect, ReactNode } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay, EffectFade, EffectCoverflow } from 'swiper/modules';
import type { Swiper as SwiperType } from 'swiper';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/effect-fade';
import 'swiper/css/effect-coverflow';
import './index.scss';

export interface SwiperCustomSlide {
  id: string | number;
  content?: ReactNode;
  [key: string]: unknown;
}

export interface SwiperCustomProps {
  slides: SwiperCustomSlide[];
  onSlideChange?: (index: number) => void;
  autoplay?: boolean | { delay: number };
  navigation?: boolean;
  pagination?: boolean;
  loop?: boolean;
  effect?: 'slide' | 'fade' | 'coverflow';
  slidesPerView?: number;
  spaceBetween?: number;
  className?: string;
  children?: (slide: SwiperCustomSlide, index: number) => ReactNode;
}

export function SwiperCustom({
  slides = [],
  onSlideChange,
  autoplay = false,
  navigation = true,
  pagination = true,
  loop = false,
  effect = 'slide',
  slidesPerView = 1,
  spaceBetween = 0,
  className = '',
  children
}: SwiperCustomProps) {
  const swiperRef = useRef<SwiperType | null>(null);

  const handleSlideChange = (swiper: SwiperType) => {
    onSlideChange?.(swiper.realIndex);
  };

  const modules = [Navigation, Pagination];
  if (autoplay) modules.push(Autoplay);
  if (effect === 'fade') modules.push(EffectFade);
  if (effect === 'coverflow') modules.push(EffectCoverflow);

  const autoplayConfig = typeof autoplay === 'object' 
    ? autoplay 
    : autoplay 
    ? { delay: 3000, disableOnInteraction: false } 
    : false;

  return (
    <div className={`swiper-custom ${className}`}>
      <Swiper
        modules={modules}
        onSwiper={(swiper) => (swiperRef.current = swiper)}
        onSlideChange={handleSlideChange}
        navigation={navigation}
        pagination={pagination ? { clickable: true } : false}
        autoplay={autoplayConfig}
        loop={loop}
        effect={effect}
        slidesPerView={slidesPerView}
        spaceBetween={spaceBetween}
        coverflowEffect={
          effect === 'coverflow'
            ? {
                rotate: 50,
                stretch: 0,
                depth: 100,
                modifier: 1,
                slideShadows: true
              }
            : undefined
        }
      >
        {slides.map((slide, index) => (
          <SwiperSlide key={slide.id}>
            {children ? children(slide, index) : slide.content}
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}

export default SwiperCustom;
