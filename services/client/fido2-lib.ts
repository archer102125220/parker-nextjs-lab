import { unstable_cache } from 'next/cache';
import { request } from '@/utils/request';

const prefix = '/nextjs-server/fido2-lib';

export const GET_fido2LibGenerateOption = unstable_cache(
  // TODO
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async function (payload: any) {
    return request.get(`${prefix}/generate-option`, payload);
  },
  ['GET_fido2LibGenerateOption'],
  {
    revalidate: 60 * 60 * 24
  }
);

// TODO
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function POST_fido2LibRegistration(payload: any) {
  return request.post(`${prefix}/registration`, payload);
}

// TODO
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function POST_fido2LibVerify(payload: any) {
  return request.post(`${prefix}/verify`, payload);
}
