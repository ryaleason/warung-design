import { NextResponse } from 'next/server';
import {
  readBundlesFromFile,
  writeBundlesToFile,
  getGitInfo,
  commitAndPushBundles,
} from '@/lib/admin/bundles-manager';
import { Bundle } from '@/types';

export const dynamic = 'force-dynamic';

function isProductionBlocked(): boolean {
  return process.env.NODE_ENV === 'production' && process.env.ENABLE_ADMIN_PAGE !== 'true';
}

export async function GET() {
  if (isProductionBlocked()) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  try {
    const bundles = await readBundlesFromFile();
    const gitInfo = await getGitInfo();

    return NextResponse.json({
      success: true,
      bundles,
      gitInfo,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Gagal memuat bundles';
    return NextResponse.json(
      {
        success: false,
        error: message,
      },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  if (isProductionBlocked()) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }
  try {
    const body = await request.json();
    const { bundles, commitMessage, pushToGithub } = body as {
      bundles: Bundle[];
      commitMessage?: string;
      pushToGithub?: boolean;
    };

    if (!Array.isArray(bundles)) {
      return NextResponse.json(
        {
          success: false,
          error: 'Format data tidak valid: bundles harus berupa array.',
        },
        { status: 400 }
      );
    }

    // Tulis ke lib/data/bundles.ts
    await writeBundlesToFile(bundles);

    // Lakukan git commit dan git push jika diminta
    const gitResult = await commitAndPushBundles({
      commitMessage,
      pushToGithub: pushToGithub ?? true,
    });

    const updatedBundles = await readBundlesFromFile();

    return NextResponse.json({
      success: true,
      message: gitResult.pushed
        ? 'Perubahan berhasil disimpan ke lib/data/bundles.ts dan di-push ke GitHub!'
        : gitResult.committed
          ? 'Perubahan berhasil dicommit ke Git lokal (belum di-push atau push dinonaktifkan).'
          : 'Data berhasil disimpan.',
      git: gitResult,
      bundles: updatedBundles,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Terjadi kesalahan sistem';
    console.error('Error di POST /api/admin/bundles:', error);
    return NextResponse.json(
      {
        success: false,
        error: message,
      },
      { status: 500 }
    );
  }
}
