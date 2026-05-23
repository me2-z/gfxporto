import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({ 
    success: true, 
    message: 'MongoDB has been removed from this project. Seed script disabled. Credentials are now managed via .env.local',
  });
}
