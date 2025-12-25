'use client';

import WebRTCRoomEntryCard from '@/components/WebRTCRoomEntryCard';
import style from '@/app/[locale]/web-rtc/server-sent-event/page.module.scss';

export default function WebRTCSSEEntry(): React.ReactNode {
  return (
    <WebRTCRoomEntryCard
      title="WebRTC - Server-Sent Events 實作"
      description="配合 Server-Sent Events 及 @upstash/redis 實作"
      alertMessage="注意：WebRTC 需要 HTTPS 環境才能存取相機/麥克風。本地開發時請使用 localhost 或設定 HTTPS。"
      alertSeverity="warning"
      roomBasePath="/web-rtc/server-sent-event/room"
      pageClassName={style.web_rtc_sse_entry_page}
    />
  );
}
