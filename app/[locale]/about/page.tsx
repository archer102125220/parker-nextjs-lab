'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useLocale } from 'next-intl';
import { Skeleton, Alert } from '@mui/material';

import '@/app/[locale]/about/about.scss';

interface DescriptionItem {
  text: string;
  isDel?: boolean;
}

interface Section {
  title: string;
  description?: DescriptionItem[];
  listItemList?: string[];
}

export default function AboutPage(): React.ReactNode {
  const locale = useLocale();
  const [data, setData] = useState<Section[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAboutContent = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/about-content?locale=${locale}`);
        if (!response.ok) {
          throw new Error('Failed to fetch content');
        }
        const result = await response.json();
        setData(result);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchAboutContent();
  }, [locale]);

  return (
    <section className="about_page">
      <Image
        className="about_page-banner"
        src="/img/about/about-v.10.webp"
        alt="About Banner"
        width={1200}
        height={400}
        style={{
          width: '100%',
          height: 'auto',
          maxHeight: '400px',
          objectFit: 'cover'
        }}
        priority
      />

      {loading && (
        <div className="about_page-skeleton">
          <Skeleton variant="text" height={40} width="60%" />
          <Skeleton variant="text" height={24} width="80%" />
          <Skeleton variant="rectangular" height={100} />
          <Skeleton variant="text" height={24} width="70%" />
          <Skeleton variant="text" height={24} width="90%" />
          <Skeleton variant="rectangular" height={80} />
        </div>
      )}

      {error && (
        <Alert severity="error" className="about_page-error">
          無法載入內容：{error}
        </Alert>
      )}

      {!loading && !error && data && (
        <>
          {data.map((section, index) => (
            <section key={index} className="about_page-section">
              <h2 className="about_page-section-sub_title">{section.title}</h2>

              {section.description && (
                <div className="about_page-section-description">
                  {section.description.map((descItem, descIndex) =>
                    descItem.isDel ? (
                      <del key={descIndex}>{descItem.text}</del>
                    ) : (
                      <p key={descIndex}>{descItem.text}</p>
                    )
                  )}
                </div>
              )}

              {Array.isArray(section.listItemList) && (
                <ul className="about_page-section-list">
                  {section.listItemList.map((item, itemIndex) => (
                    <li
                      key={itemIndex}
                      className="about_page-section-list-item"
                    >
                      {item}
                    </li>
                  ))}
                </ul>
              )}
            </section>
          ))}
        </>
      )}
    </section>
  );
}
