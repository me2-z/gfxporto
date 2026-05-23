import { NextResponse } from 'next/server';
import { protectApiRoute } from '@/lib/auth';
import { deleteTransformationItem, updateTransformationItem } from '@/lib/content-store';

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const guard = await protectApiRoute();
    if (guard) return guard;

    const { id } = await params;
    const body = await req.json();
    const updatedItem = await updateTransformationItem(id, body);

    if (!updatedItem) {
      return NextResponse.json({ error: 'Item not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: updatedItem });
  } catch {
    return NextResponse.json({ error: 'Failed to update item' }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const guard = await protectApiRoute();
    if (guard) return guard;

    const { id } = await params;
    const deletedItem = await deleteTransformationItem(id);

    if (!deletedItem) {
      return NextResponse.json({ error: 'Item not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: {} });
  } catch {
    return NextResponse.json({ error: 'Failed to delete item' }, { status: 500 });
  }
}
