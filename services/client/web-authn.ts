import { unstable_cache } from 'next/cache';
import { request } from '@/utils/request';

const prefix = '/nextjs-server/web-authn';

export const GET_webAuthnGenerateChallenge = unstable_cache(
  // TODO
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async function (payload: any) {
    return request.get(`${prefix}/generate-challenge`, payload);
  },
  ['GET_webAuthnGenerateChallenge'],
  {
    revalidate: 60 * 60 * 24
  }
);

// TODO
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function POST_webAuthnRegistration(payload: any) {
  return request.post(`${prefix}/registration`, payload);
}

// TODO
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function POST_webAuthnVerify(payload: any) {
  return request.post(`${prefix}/verify`, payload);
}
