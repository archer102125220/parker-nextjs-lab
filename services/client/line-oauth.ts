import { unstable_cache } from 'next/cache';
import { request } from '@/utils/request';

export const POST_lineOauthVerify = unstable_cache(
  // TODO
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async function (payload: any) {
    return request.post('/line-oauth-verify', payload);
  },
  ['POST_lineOauthVerify'],
  {
    revalidate: 60 * 60 * 24
  }
);
