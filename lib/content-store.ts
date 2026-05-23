import connectDB from '@/lib/db';
import { generateId, getDb, saveDb } from '@/lib/json-db';
import type { PortfolioItem, TransformationItem } from '@/lib/content-types';
import PortfolioModel from '@/models/Portfolio';
import TransformationModel from '@/models/Transformation';

function shouldUseMongo() {
  return Boolean(process.env.MONGODB_URI);
}

function normalizePortfolioItem(item: Record<string, unknown>): PortfolioItem {
  return {
    _id: String(item._id),
    title: String(item.title ?? ''),
    image: String(item.image ?? ''),
    category: String(item.category ?? ''),
    description: String(item.description ?? ''),
    createdAt: typeof item.createdAt === 'string' ? item.createdAt : undefined,
    order: typeof item.order === 'number' ? item.order : undefined,
  };
}

function normalizeTransformationItem(item: Record<string, unknown>): TransformationItem {
  return {
    _id: String(item._id),
    title: String(item.title ?? ''),
    description: String(item.description ?? ''),
    beforeImage: String(item.beforeImage ?? ''),
    afterImage: String(item.afterImage ?? ''),
    createdAt: typeof item.createdAt === 'string' ? item.createdAt : undefined,
    order: typeof item.order === 'number' ? item.order : undefined,
  };
}

export async function getPortfolioItems() {
  if (shouldUseMongo()) {
    await connectDB();
    const items = await PortfolioModel.find().sort({ order: -1, createdAt: -1 }).lean();
    return items.map((item) => normalizePortfolioItem(item as unknown as Record<string, unknown>));
  }

  const db = getDb();
  return [...db.portfolios].sort((a, b) => (b.order ?? 0) - (a.order ?? 0));
}

export async function createPortfolioItem(item: Omit<PortfolioItem, '_id'>) {
  if (shouldUseMongo()) {
    await connectDB();
    const createdItem = await PortfolioModel.create(item);
    return normalizePortfolioItem(createdItem.toObject() as Record<string, unknown>);
  }

  const db = getDb();
  const newItem: PortfolioItem = {
    _id: generateId(),
    ...item,
  };
  db.portfolios.push(newItem);
  saveDb(db);
  return newItem;
}

export async function updatePortfolioItem(id: string, updates: Partial<PortfolioItem>) {
  if (shouldUseMongo()) {
    await connectDB();
    const updatedItem = await PortfolioModel.findByIdAndUpdate(id, updates, { new: true }).lean();
    return updatedItem
      ? normalizePortfolioItem(updatedItem as unknown as Record<string, unknown>)
      : null;
  }

  const db = getDb();
  const index = db.portfolios.findIndex((portfolioItem) => portfolioItem._id === id);

  if (index === -1) {
    return null;
  }

  db.portfolios[index] = { ...db.portfolios[index], ...updates };
  saveDb(db);
  return db.portfolios[index];
}

export async function deletePortfolioItem(id: string) {
  if (shouldUseMongo()) {
    await connectDB();
    const deletedItem = await PortfolioModel.findByIdAndDelete(id).lean();
    return deletedItem ? {} : null;
  }

  const db = getDb();
  const index = db.portfolios.findIndex((portfolioItem) => portfolioItem._id === id);

  if (index === -1) {
    return null;
  }

  db.portfolios.splice(index, 1);
  saveDb(db);
  return {};
}

export async function getTransformationItems() {
  if (shouldUseMongo()) {
    await connectDB();
    const items = await TransformationModel.find().sort({ order: -1, createdAt: -1 }).lean();
    return items.map((item) =>
      normalizeTransformationItem(item as unknown as Record<string, unknown>)
    );
  }

  const db = getDb();
  return [...db.transformations].sort((a, b) => (b.order ?? 0) - (a.order ?? 0));
}

export async function createTransformationItem(item: Omit<TransformationItem, '_id'>) {
  if (shouldUseMongo()) {
    await connectDB();
    const createdItem = await TransformationModel.create(item);
    return normalizeTransformationItem(createdItem.toObject() as Record<string, unknown>);
  }

  const db = getDb();
  const newItem: TransformationItem = {
    _id: generateId(),
    ...item,
  };
  db.transformations.push(newItem);
  saveDb(db);
  return newItem;
}

export async function updateTransformationItem(id: string, updates: Partial<TransformationItem>) {
  if (shouldUseMongo()) {
    await connectDB();
    const updatedItem = await TransformationModel.findByIdAndUpdate(id, updates, {
      new: true,
    }).lean();
    return updatedItem
      ? normalizeTransformationItem(updatedItem as unknown as Record<string, unknown>)
      : null;
  }

  const db = getDb();
  const index = db.transformations.findIndex((transformationItem) => transformationItem._id === id);

  if (index === -1) {
    return null;
  }

  db.transformations[index] = { ...db.transformations[index], ...updates };
  saveDb(db);
  return db.transformations[index];
}

export async function deleteTransformationItem(id: string) {
  if (shouldUseMongo()) {
    await connectDB();
    const deletedItem = await TransformationModel.findByIdAndDelete(id).lean();
    return deletedItem ? {} : null;
  }

  const db = getDb();
  const index = db.transformations.findIndex((transformationItem) => transformationItem._id === id);

  if (index === -1) {
    return null;
  }

  db.transformations.splice(index, 1);
  saveDb(db);
  return {};
}
