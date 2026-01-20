import type { ReactNode } from 'react';
import type { Metadata } from 'next';
import { headers } from 'next/headers';
import Image from 'next/image';
import { getTranslations, setRequestLocale } from 'next-intl/server';

import { DefaultLayout } from '@/layout/default';
import styles from './page.module.scss';
import {
  ABOUT_CONTENT_DATA_ZH,
  ABOUT_CONTENT_DATA_EN,
  type Section
} from './data';

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('pages.about');
  return {
    title: t('heroTitle'),
    description: t('heroSubtitle')
  };
}

interface AboutPageProps {
  params: Promise<{ locale: string }>;
}

export default async function AboutPage(
  props: AboutPageProps
): Promise<ReactNode> {
  const { locale } = await props.params;
  setRequestLocale(locale);

  const nonce = (await headers()).get('x-nonce') || '';
  const t = await getTranslations('pages.about');

  // Get content based on locale
  const data: Section[] =
    locale === 'en' ? ABOUT_CONTENT_DATA_EN : ABOUT_CONTENT_DATA_ZH;

  return (
    <DefaultLayout nonce={nonce}>
      <section className={styles.about_page}>
        <Image
          className={styles['about_page-banner']}
          src="/img/icon/Next.jsLab.v.03.webp"
          alt="About Banner"
          width={1200}
          height={400}
          priority
        />

        {data.length === 0 ? (
          <div className={styles['about_page-error']}>
            <p>{t('loadError')}</p>
          </div>
        ) : (
          <>
            {data.map((section, index) => (
              <section key={index} className={styles['about_page-section']}>
                <h2 className={styles['about_page-section-sub_title']}>
                  {section.title}
                </h2>

                {section.description && (
                  <div className={styles['about_page-section-description']}>
                    {section.description.map((descItem, descIndex) => {
                      if (descItem.isDel) {
                        return <del key={descIndex}>{descItem.text}</del>;
                      }
                      if (
                        descItem.isLink &&
                        descItem.href &&
                        descItem.linkText
                      ) {
                        return (
                          <p key={descIndex}>
                            {descItem.text}{' '}
                            <a
                              href={descItem.href}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              {descItem.linkText}
                            </a>
                          </p>
                        );
                      }
                      return <p key={descIndex}>{descItem.text}</p>;
                    })}
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
