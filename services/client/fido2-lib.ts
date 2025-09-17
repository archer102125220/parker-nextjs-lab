import { request } from '@/utils/request';

const prefix = '/nextjs-server/fido2-lib';

// TODO
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function GET_fido2LibGenerateOption(payload: any) {
  return request.get(`${prefix}/generate-option`, payload);
}

// TODO
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function POST_fido2LibRegistration(payload: any) {
  return request.post(`${prefix}/registration`, payload);
}

// TODO
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function POST_fido2LibVerify(payload: any) {
  return request.post(`${prefix}/verify`, payload);
}
