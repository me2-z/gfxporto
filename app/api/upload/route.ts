import { NextResponse } from 'next/server';
import { protectApiRoute } from '@/lib/auth';
import cloudinary from '@/lib/cloudinary';
import fs from 'fs/promises';
import path from 'path';

export const runtime = 'nodejs';

type UploadResult = {
  secure_url: string;
  public_id: string;
};

function isCloudinaryConfigured() {
  return Boolean(
    process.env.CLOUDINARY_CLOUD_NAME &&
      process.env.CLOUDINARY_API_KEY &&
      process.env.CLOUDINARY_API_SECRET &&
      process.env.CLOUDINARY_CLOUD_NAME !== 'your_cloud_name' &&
      process.env.CLOUDINARY_API_KEY !== 'your_api_key' &&
      process.env.CLOUDINARY_API_SECRET !== 'your_api_secret'
  );
}

function isVercelEnvironment() {
  return Boolean(process.env.VERCEL);
}

function sanitizeName(fileName: string) {
  return fileName.replace(/[^a-zA-Z0-9._-]/g, '-');
}

export async function POST(req: Request) {
  const guard = await protectApiRoute();
  if (guard) return guard;

  try {
    const formData = await req.formData();
    const file = formData.get('file');
    const folder = (formData.get('folder') as string) || 'portfolio';

    if (!(file instanceof File)) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    if (isCloudinaryConfigured()) {
      const result = await new Promise<UploadResult>((resolve, reject) => {
        cloudinary.uploader
          .upload_stream({ folder, resource_type: 'image' }, (error, result) => {
            if (error) reject(error);
            else if (result?.secure_url && result.public_id) resolve(result as UploadResult);
            else reject(new Error('Cloudinary upload did not return a usable file URL.'));
          })
          .end(buffer);
      });

      return NextResponse.json({
        url: result.secure_url,
        public_id: result.public_id,
      });
    }

    if (isVercelEnvironment()) {
      return NextResponse.json(
        { error: 'Cloudinary is required for production uploads. Add Cloudinary env vars on Vercel.' },
        { status: 503 }
      );
    }

    const safeFolder = folder.replace(/[^a-zA-Z0-9/_-]/g, '');
    const fileExt = path.extname(file.name) || '.png';
    const baseName = path.basename(file.name, fileExt) || 'upload';
    const fileName = `${Date.now()}-${sanitizeName(baseName)}${fileExt}`;
    const relativeDir = path.posix.join('uploads', safeFolder);
    const absoluteDir = path.join(process.cwd(), 'public', ...relativeDir.split('/'));
    const absolutePath = path.join(absoluteDir, fileName);

    await fs.mkdir(absoluteDir, { recursive: true });
    await fs.writeFile(absolutePath, buffer);

    return NextResponse.json({
      url: `/${relativeDir}/${fileName}`,
      public_id: fileName,
    });
  } catch (error) {
    console.error('Upload error:', error);
    const message = error instanceof Error ? error.message : 'Upload failed';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
