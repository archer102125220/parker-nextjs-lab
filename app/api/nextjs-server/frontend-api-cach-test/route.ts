import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

import qs from 'qs';

export function GET(request: NextRequest) {
  console.log('api:frontend-api-cach-test.get');

  const searchParams = request.nextUrl.searchParams;
  const query = qs.parse(searchParams.toString());

  return NextResponse.json(query);
}

export async function POST(request: NextRequest) {
  console.log('api:frontend-api-cach-test.post');
  try {
    const body = await request.json();

    return NextResponse.json(body);
  } catch (error) {
    return NextResponse.json(
      { error: 'Invalid request body', errorMessage: error },
      { status: 400 }
    );
  }
}
