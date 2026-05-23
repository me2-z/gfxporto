import fs from 'fs';
import path from 'path';
import type { JsonDbShape } from '@/lib/content-types';

const DB_PATH = path.join(process.cwd(), 'data.json');

const defaultData: JsonDbShape = {
  portfolios: [],
  transformations: [],
  settings: {},
};

export function getDb(): JsonDbShape {
  try {
    if (!fs.existsSync(DB_PATH)) {
      fs.writeFileSync(DB_PATH, JSON.stringify(defaultData, null, 2));
      return defaultData;
    }
    const data = fs.readFileSync(DB_PATH, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading DB:', error);
    return defaultData;
  }
}

export function saveDb(data: JsonDbShape) {
  try {
    fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2));
  } catch (error) {
    console.error('Error saving DB:', error);
  }
}

export function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).substring(2);
}
