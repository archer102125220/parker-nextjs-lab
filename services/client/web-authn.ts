import { request } from '@/utils/request';

const prefix = '/nextjs-server/web-authn';

// TODO
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function GET_webAuthnGenerateChallenge(payload: any) {
  return request.get(`${prefix}/generate-challenge`, payload);
}

// TODO
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function POST_webAuthnRegistration(payload: any) {
  return request.post(`${prefix}/registration`, payload);
}

// TODO
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function POST_webAuthnVerify(payload: any) {
  return request.post(`${prefix}/verify`, payload);
}
