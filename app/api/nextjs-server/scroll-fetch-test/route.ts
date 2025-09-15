import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

export function GET(request: NextRequest) {
  console.log('api:scroll-fetch-test.get');

  const searchParams = request.nextUrl.searchParams;
  const query = searchParams.get('query');

  return NextResponse.json(query);
}

export async function POST(request: NextRequest) {
  console.log('api:scroll-fetch-test.post');
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
