'use client';

import WebRTCRoomEntryCard from '@/components/WebRTCRoomEntryCard';
import style from '@/app/[locale]/web-rtc/socket-io/page.module.scss';

export default function WebRTCSocketIOEntry(): React.ReactNode {
  return (
    <WebRTCRoomEntryCard
      title="WebRTC - Socket.IO 實作"
      description="配合 Socket.IO 做為 Signaling Server 實作"
      alertMessage="注意：Socket.IO 在 serverless 環境（如 Vercel）可能無法正常運作。建議在本地開發環境測試。"
      alertSeverity="warning"
      roomBasePath="/web-rtc/socket-io/room"
      pageClassName={style.web_rtc_socket_io_entry_page}
    />
  );
}
