import { i18nRedirect } from '@/i18n/navigation/server';

type Props = {
  params: Promise<{ locale: string }>;
};

async function SocketIoRoomPage({ params }: Props): Promise<void> {
  const { locale } = await params;
  i18nRedirect({ href: '/web-rtc/server-sent-event', locale });
}

export default SocketIoRoomPage;
