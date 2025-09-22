import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

import qs from 'qs';

// 定義 API 路由的處理函數
export async function GET(request: NextRequest) {
  // 從 URL 獲取查詢參數
  const searchParams = request.nextUrl.searchParams;
  const query = qs.parse(searchParams.toString());

  // 返回 JSON 響應
  return NextResponse.json({
    message: 'Fake Data from API!',
    query,
    timestamp: new Date().toISOString()
  });
}

// 處理 POST 請求
export async function POST(request: NextRequest) {
  try {
    // 獲取請求體
    const body = await request.json();

    // 處理請求
    return NextResponse.json({
      message: 'Data received successfully',
      data: body
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Invalid request body', errorMessage: error },
      { status: 400 }
    );
  }
}

// 處理 PUT 請求
export async function PUT() {
  // 實現 PUT 請求的邏輯
  return NextResponse.json({ message: 'PUT request handled' });
}

// 處理 DELETE 請求
export async function DELETE() {
  // 實現 DELETE 請求的邏輯
  return NextResponse.json({ message: 'DELETE request handled' });
}
