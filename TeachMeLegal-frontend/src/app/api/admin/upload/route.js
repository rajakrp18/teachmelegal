import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function POST(request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file');
    const folder = formData.get('folder') || 'uploads';

    if (!file || typeof file === 'string') {
      return NextResponse.json({ success: false, error: 'No valid file provided' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Sanitize filename
    const originalName = file.name || 'file';
    const ext = path.extname(originalName).toLowerCase() || '.bin';
    const baseName = path.basename(originalName, ext)
      .toLowerCase()
      .replace(/[^a-z0-9_-]/g, '-')
      .replace(/-+/g, '-');
    const uniqueFilename = `${baseName}-${Date.now()}${ext}`;

    // Target upload directories (both frontend and admin public dirs)
    const targets = [
      path.join(process.cwd(), 'public', folder),
      path.resolve(process.cwd(), '..', 'TeachMeLegal-frontend', 'public', folder),
      path.resolve(process.cwd(), '..', 'TeachMeLegal-admin-panel', 'public', folder),
      path.join('c:/teachmelegal/TeachMeLegal-frontend/public', folder),
      path.join('c:/teachmelegal/TeachMeLegal-admin-panel/public', folder)
    ];

    const uniqueTargets = [...new Set(targets.map(p => path.resolve(p)))];

    for (const targetDir of uniqueTargets) {
      try {
        const parentDir = path.dirname(targetDir);
        if (fs.existsSync(parentDir)) {
          if (!fs.existsSync(targetDir)) {
            fs.mkdirSync(targetDir, { recursive: true });
          }
          const filePath = path.join(targetDir, uniqueFilename);
          fs.writeFileSync(filePath, buffer);
        }
      } catch (err) {
        // ignore errors for directories that don't exist
      }
    }

    const publicUrl = `/${folder}/${uniqueFilename}`;

    return NextResponse.json({
      success: true,
      url: publicUrl,
      fileName: uniqueFilename,
      originalName,
      size: file.size,
      mimeType: file.type
    });
  } catch (error) {
    console.error('Upload handler error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
