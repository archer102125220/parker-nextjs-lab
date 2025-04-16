import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// 須至 @/middleware.ts 中註冊 middleware處理事件
export async function middleware(request: NextRequest) {
  console.log('____one____');

  return NextResponse.next();
}

export async function exactMiddleware(request: NextRequest) {
  console.log('__exact____one____');

  return NextResponse.next();
}
