import { NextResponse } from 'next/server';
import { protectApiRoute } from '@/lib/auth';
import { createPortfolioItem, getPortfolioItems } from '@/lib/content-store';
import type { PortfolioItem } from '@/lib/content-types';

export async function GET() {
  try {
    const items = await getPortfolioItems();
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
    const newItem = await createPortfolioItem({
      ...body,
      createdAt: new Date().toISOString(),
    } as Omit<PortfolioItem, '_id'>);

    return NextResponse.json({ success: true, data: newItem }, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Failed to create item' }, { status: 500 });
  }
}
