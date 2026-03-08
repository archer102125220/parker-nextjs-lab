// app/robots.ts
import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const baseURL =
    process.env.NEXT_PUBLIC_DOMAIN || 'https://parker-nextjs-lab.vercel.app';

  return {
    rules: {
      userAgent: '*', // 針對所有爬蟲（Google, Bing, etc.）
      allow: '/', // 允許爬取所有頁面
      // 禁止爬取的私密路徑
      disallow: [
        '/web-rtc/server-sent-event/room',
        '/zh-tw/web-rtc/server-sent-event/room',
        '/en/web-rtc/server-sent-event/room',
        '/web-rtc/socket-io/room',
        '/zh-tw/web-rtc/socket-io/room',
        '/en/web-rtc/socket-io/room',
      ],
    },

    sitemap: `${baseURL}/sitemap.xml`,
  };
}
