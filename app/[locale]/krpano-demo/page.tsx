import type { Metadata } from 'next';
import dynamic from 'next/dynamic';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import style from './page.module.scss';

const KrpanoDemo = dynamic(() => import('@/components/Demo/KrpanoDemo'));
const GTMScnOpen = dynamic(() => import('@/components/Google/GTMScnOpen'));

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('pages.krpanoDemo');
  return {
    title: t('title'),
    description: t('description')
  };
}

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function KrpanoDemoPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations('pages.krpanoDemo');

  return (
    <div className={style.krpano_demo_page}>
      <GTMScnOpen />
      <KrpanoDemo
        instructionTitle={t('instructionTitle')}
        instructionContent={t('instructionContent')}
        scenes={[
          {
            name: 'scene_bryan_goff_iuyhxaia8ea_unsplash',
            label: t('scenes.scene1')
          },
          {
            name: 'scene_timothy_oldfield_luufnhochru_unsplash',
            label: t('scenes.scene2')
          }
        ]}
      />
    </div>
  );
}
