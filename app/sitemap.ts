import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_DOMAIN || 'https://parker-nextjs-lab.vercel.app';
  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 1,
    },
    {
      url: `${baseUrl}/zh-tw`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/en`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
  ]
}

// export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
//   const baseURL = process.env.NEXT_PUBLIC_DOMAIN || 'https://parker-nextjs-lab.vercel.app'

//   // 1. 手動定義的靜態路徑 (就是所謂的 staticRoutes)
//   const staticRoutes: MetadataRoute.Sitemap = [
//     {
//       url: `${baseURL}/`,
//       lastModified: new Date(),
//       changeFrequency: 'monthly',
//       priority: 1,
//     },
//     {
//       url: `${baseURL}/zh-tw`,
//       lastModified: new Date(),
//       changeFrequency: 'monthly',
//       priority: 0.8,
//     },
//     // 你可以繼續增加 /contact, /about 等等
//   ]

//   // 2. 從 API 或資料庫抓取的動態路徑 (例如你的實驗室專案文章)
//   // 假設你有一個 fetchAllPosts() 函式
//   const posts = [
//     { id: '1', updated: '2024-05-20' },
//     { id: '2', updated: '2024-05-21' }
//   ]
  
//   const dynamicRoutes: MetadataRoute.Sitemap = posts.map((post) => ({
//     url: `${baseURL}/posts/${post.id}`,
//     lastModified: new Date(post.updated),
//     changeFrequency: 'weekly',
//     priority: 0.5,
//   }))

//   // 3. 把兩者合併成一個陣列回傳
//   return [...staticRoutes, ...dynamicRoutes]
// }