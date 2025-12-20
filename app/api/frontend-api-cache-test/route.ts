import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const data = searchParams.get('data') || '';

  // Simulate API response
  return NextResponse.json({
    query: { data },
    timestamp: new Date().toISOString(),
    method: 'GET'
  });
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { searchParams } = new URL(request.url);

  return NextResponse.json({
    query: Object.fromEntries(searchParams),
    payload: body,
    timestamp: new Date().toISOString(),
    method: 'POST'
  });
}
