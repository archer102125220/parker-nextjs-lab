/* eslint-disable */
// eslint-disable @typescript-eslint/no-unused-vars
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = params;

  return NextResponse.json({
    message: `Fetching data for ID: ${id}`,
    id,
    timestamp: new Date().toISOString()
  });
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = params;
  const body = await request.json();

  return NextResponse.json({
    message: `Updating data for ID: ${id}`,
    id,
    data: body
  });
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = params;

  return NextResponse.json({
    message: `Deleting data for ID: ${id}`,
    id
  });
}
