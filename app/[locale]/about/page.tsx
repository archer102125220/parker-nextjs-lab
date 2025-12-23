import type { ReactNode } from 'react';
import type { Metadata } from 'next';
import { headers } from 'next/headers';
import Image from 'next/image';

import { DefaultLayout } from '@/layout/default';
import styles from './page.module.scss';
import { ABOUT_CONTENT_DATA_ZH, ABOUT_CONTENT_DATA_EN, type Section } from './data';

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: '關於本站',
    description: 'Parker Next.js Lab - 關於本站'
  };
}

interface AboutPageProps {
  params: Promise<{ locale: string }>;
}

export default async function AboutPage(props: AboutPageProps): Promise<ReactNode> {
  const { locale } = await props.params;
  const nonce = (await headers()).get('x-nonce') || '';
  
  // Get content based on locale
  const data: Section[] = locale === 'en' ? ABOUT_CONTENT_DATA_EN : ABOUT_CONTENT_DATA_ZH;

  return (
    <DefaultLayout nonce={nonce}>
      <section className={styles.about_page}>
        <Image
          className={styles['about_page-banner']}
          src="/img/icon/Next.jsLab.v.01.webp"
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

        {data.length === 0 ? (
          <div className={styles['about_page-error']}>
            <p>無法載入內容，請稍後再試。</p>
          </div>
        ) : (
          <>
            {data.map((section, index) => (
              <section key={index} className={styles['about_page-section']}>
                <h2 className={styles['about_page-section-sub_title']}>{section.title}</h2>

                {section.description && (
                  <div className={styles['about_page-section-description']}>
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
                  <ul className={styles['about_page-section-list']}>
                    {section.listItemList.map((item, itemIndex) => (
                      <li
                        key={itemIndex}
                        className={styles['about_page-section-list-item']}
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
    </DefaultLayout>
  );
}
