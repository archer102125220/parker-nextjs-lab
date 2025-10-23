import { NextResponse } from 'next/server';

// 須至 @/middleware.ts 中註冊 middleware處理事件
export async function proxy() {
  console.log('____one____');

  return NextResponse.next();
}

export async function exactProxy() {
  console.log('__exact____one____');

  return NextResponse.next();
}
