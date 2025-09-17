import qs from 'qs';

import { request } from '@/utils/request';

const prefix = '/nextjs-server';

// TODO
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function GET_cookie(payload: any) {
  return request.get(`${prefix}/cookie`, payload);
}

// TODO
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function POST_cookie(payload: any) {
  return request.post(`${prefix}/cookie`, payload);
}

// TODO
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function POST_frontendApiCachTest(payload: any = {}, extendOption: any) {
  const { query, payload: _payload } = payload;

  return request.post(
    `${prefix}/frontend-api-cach-test?${qs.stringify(query)}`,
    _payload,
    extendOption
  );
}

// TODO
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function GET_frontendApiCachTest(payload: any = {}, extendOption: any) {
  const { query, payload: _payload } = payload;

  return request.get(
    `${prefix}/frontend-api-cach-test?${qs.stringify(query)}`,
    _payload,
    extendOption
  );
}

// TODO
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function GET_aboutContent(extendOption: any) {
  return request.get(`${prefix}/about-content`, null, extendOption);
}

// TODO
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function GET_scrollFetchTest(payload: any = {}, extendOption: any) {
  return request.get(`${prefix}/scroll-fetch-test`, payload, extendOption);
}

// TODO
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function POST_scrollFetchTest(payload: any = {}, extendOption: any) {
  return request.post(`${prefix}/scroll-fetch-test`, payload, extendOption);
}
