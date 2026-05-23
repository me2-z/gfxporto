import { NextResponse } from 'next/server';
import { protectApiRoute } from '@/lib/auth';
import { createTransformationItem, getTransformationItems } from '@/lib/content-store';
import type { TransformationItem } from '@/lib/content-types';

export async function GET() {
  try {
    const items = await getTransformationItems();
    return NextResponse.json({ success: true, data: items });
  } catch {
    return NextResponse.json({ error: 'Failed to fetch items' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const guard = await protectApiRoute();
    if (guard) return guard;

    const body = await req.json();
    const newItem = await createTransformationItem({
      ...body,
      createdAt: new Date().toISOString(),
    } as Omit<TransformationItem, '_id'>);

    return NextResponse.json({ success: true, data: newItem }, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Failed to create item' }, { status: 500 });
  }
}
