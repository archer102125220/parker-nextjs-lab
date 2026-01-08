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

export const POST_webAuthnRegistration = unstable_cache(
  // TODO
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async function (payload: any) {
    return request.post(`${prefix}/registration`, payload);
  },
  ['POST_webAuthnRegistration'],
  {
    revalidate: 60 * 60 * 24
  }
);

export const POST_webAuthnVerify = unstable_cache(
  // TODO
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async function (payload: any) {
    return request.post(`${prefix}/verify`, payload);
  },
  ['POST_webAuthnVerify'],
  {
    revalidate: 60 * 60 * 24
  }
);
