import { request } from '@/utils/request';

// TODO
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function POST_lineOauthVerify(payload: any) {
  return request.post('/line-oauth-verify', payload);
}
