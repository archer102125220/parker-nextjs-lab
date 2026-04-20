import { getTranslations } from 'next-intl/server';

import { Link } from '@/i18n/navigation';

import './LinkCard.scss';

const DOMAIN = process.env.NEXT_PUBLIC_DOMAIN || '';

export interface LinkCardProps {
  link: {
    href: string;
    labelKey: string;
    descKey: string;
    icon: string;
  }
}

export async function LinkCard(props: LinkCardProps) {
  const { link } = props;

  const isExternal = typeof link.href === 'string' && link.href.startsWith('http') && link.href !== DOMAIN;

  const t = await getTranslations('pages.home');

  return isExternal === false ? (
    <Link
      href={link.href}
      className='link_card'
    >
      <span className='link_card-icon'>
        {link.icon}
      </span>
      <h3 className='link_card-title'>
        {t(link.labelKey)}
      </h3>
      <p className='link_card-description'>
        {t(link.descKey)}
      </p>
    </Link>
  ) : (
    <a
      href={link.href}
      target='_blank'
      rel='noopener noreferrer'
      css-not-link-icon='true'
      className='link_card_external'
    >
      <div className='link_card_external-wrap'>
        <span className='link_card_external-wrap-icon'>
          {link.icon}
        </span>
        <h3 className='link_card_external-wrap-title'>
          {t(link.labelKey)}
        </h3>
        <p className='link_card_external-wrap-description'>
          {t(link.descKey)}
        </p>
      </div>
      <span className='link_card_external-external_icon' />
    </a>
  )
}

export default LinkCard;