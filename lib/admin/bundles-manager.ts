import fs from 'fs';
import path from 'path';
import { exec } from 'child_process';
import { promisify } from 'util';
import crypto from 'crypto';
import { Bundle } from '@/types';

const execAsync = promisify(exec);
const BUNDLES_FILE_PATH = path.join(process.cwd(), 'lib/data/bundles.ts');

/**
 * Membaca data bundle langsung dari lib/data/bundles.ts
 */
export async function readBundlesFromFile(): Promise<Bundle[]> {
  try {
    if (!fs.existsSync(BUNDLES_FILE_PATH)) {
      throw new Error(`File tidak ditemukan di ${BUNDLES_FILE_PATH}`);
    }

    const content = fs.readFileSync(BUNDLES_FILE_PATH, 'utf-8');
    // Hilangkan baris import dan deklarasi export
    const sanitized = content
      .replace(/^import[^\n]*\n+/gm, '')
      .replace(/export\s+const\s+INITIAL_BUNDLES\s*:\s*Bundle\[\]\s*=\s*/, '')
      .replace(/;\s*$/, '');

    // Evaluasi objek literal secara aman di server lokal
    const parsed = new Function('return ' + sanitized)();

    if (!Array.isArray(parsed)) {
      throw new Error('Data bundles bukan berupa array');
    }

    return parsed as Bundle[];
  } catch (error) {
    console.error('Gagal membaca lib/data/bundles.ts:', error);
    throw error;
  }
}

/**
 * Menulis array bundle kembali ke lib/data/bundles.ts dengan format TypeScript rapi
 */
export async function writeBundlesToFile(rawBundles: Bundle[]): Promise<void> {
  try {
    // Normalisasi data bundle agar konsisten dan valid
    const cleanBundles: Bundle[] = rawBundles.map((b) => {
      const id = b.id && b.id.trim() !== '' ? b.id.trim() : crypto.randomUUID();
      const name = b.name ? b.name.trim() : 'Bundle Tanpa Judul';
      const slug =
        b.slug && b.slug.trim() !== ''
          ? b.slug
              .trim()
              .toLowerCase()
              .replace(/[^a-z0-9]+/g, '-')
              .replace(/^-|-$/g, '')
          : name
              .toLowerCase()
              .replace(/[^a-z0-9]+/g, '-')
              .replace(/^-|-$/g, '');

      const description = b.description ? b.description.trim() : '';
      const price = typeof b.price === 'number' ? b.price : parseInt(String(b.price) || '0', 10);
      const preview_images = Array.isArray(b.preview_images)
        ? b.preview_images.map((img) => img.trim()).filter(Boolean)
        : [];
      const features = Array.isArray(b.features)
        ? b.features.map((f) => f.trim()).filter(Boolean)
        : [];
      const file_url = b.file_url ? b.file_url.trim() : `bundles/${slug}.zip`;
      const is_active = b.is_active !== undefined ? Boolean(b.is_active) : true;

      const bundleObj: Bundle = {
        id,
        name,
        slug,
        description,
        price,
        preview_images,
        file_url,
        is_active,
        features,
      };

      if (b.category && b.category.trim() !== '') {
        bundleObj.category = b.category.trim();
      }
      if (b.badge && b.badge.trim() !== '') {
        bundleObj.badge = b.badge.trim();
      }
      if (b.created_at) {
        bundleObj.created_at = b.created_at;
      }
      if (b.updated_at) {
        bundleObj.updated_at = b.updated_at;
      }

      return bundleObj;
    });

    const jsonStr = JSON.stringify(cleanBundles, null, 2);
    const tsCode = `import { Bundle } from '@/types';\n\nexport const INITIAL_BUNDLES: Bundle[] = ${jsonStr};\n`;

    fs.writeFileSync(BUNDLES_FILE_PATH, tsCode, 'utf-8');
  } catch (error) {
    console.error('Gagal menulis ke lib/data/bundles.ts:', error);
    throw error;
  }
}

/**
 * Mengambil informasi status git saat ini
 */
export async function getGitInfo() {
  try {
    const cwd = process.cwd();
    const { stdout: branch } = await execAsync('git rev-parse --abbrev-ref HEAD', { cwd });
    const { stdout: remoteUrl } = await execAsync('git remote get-url origin', { cwd });
    const { stdout: status } = await execAsync('git status --porcelain lib/data/bundles.ts', {
      cwd,
    });
    const { stdout: lastCommit } = await execAsync('git log -1 --pretty=format:"%h - %s (%cr)"', {
      cwd,
    });

    return {
      branch: branch.trim(),
      remoteUrl: remoteUrl.trim(),
      hasFileChanges: status.trim().length > 0,
      lastCommit: lastCommit.trim(),
    };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    return {
      branch: 'unknown',
      remoteUrl: 'unknown',
      hasFileChanges: false,
      lastCommit: 'unknown',
      error: message,
    };
  }
}

export interface CommitAndPushResult {
  committed: boolean;
  pushed: boolean;
  branch: string;
  commitHash?: string;
  commitMessage: string;
  output: string;
  error?: string;
}

/**
 * Commit perubahan lib/data/bundles.ts dan push ke remote repository
 */
export async function commitAndPushBundles(options: {
  commitMessage?: string;
  pushToGithub?: boolean;
}): Promise<CommitAndPushResult> {
  const cwd = process.cwd();
  const { stdout: branchOut } = await execAsync('git rev-parse --abbrev-ref HEAD', { cwd });
  const branch = branchOut.trim() || 'main';

  // 1. Cek perubahan di lib/data/bundles.ts
  const { stdout: fileStatus } = await execAsync(
    'git status --porcelain lib/data/bundles.ts',
    { cwd }
  );

  let outputLog = '';

  // 2. Stage lib/data/bundles.ts
  await execAsync('git add lib/data/bundles.ts', { cwd });
  outputLog += 'Staged lib/data/bundles.ts\n';

  // 3. Cek apakah ada perubahan staged
  const { stdout: stagedDiff } = await execAsync(
    'git diff --staged --name-only lib/data/bundles.ts',
    { cwd }
  );

  if (!stagedDiff.trim() && !fileStatus.trim()) {
    return {
      committed: false,
      pushed: false,
      branch,
      commitMessage: 'Tidak ada perubahan pada lib/data/bundles.ts',
      output: 'File lib/data/bundles.ts identik dengan commit sebelumnya, tidak ada perubahan yang perlu dicommit.',
    };
  }

  const message =
    options.commitMessage && options.commitMessage.trim() !== ''
      ? options.commitMessage.trim()
      : `Update katalog paket bundles (${new Date().toLocaleString('id-ID')})`;

  // 4. Commit
  // Escape kutip ganda untuk shell command
  const safeMessage = message.replace(/"/g, '\\"');
  const { stdout: commitOut } = await execAsync(`git commit -m "${safeMessage}"`, { cwd });
  outputLog += commitOut + '\n';

  const { stdout: hashOut } = await execAsync('git rev-parse --short HEAD', { cwd });
  const commitHash = hashOut.trim();

  let pushed = false;
  let pushError: string | undefined;

  // 5. Push ke GitHub jika diminta
  if (options.pushToGithub !== false) {
    try {
      // Timeout 30 detik untuk git push
      const { stdout: pushOut, stderr: pushErr } = await execAsync(
        `git push origin ${branch}`,
        { cwd, timeout: 30000 }
      );
      outputLog += (pushOut || '') + '\n' + (pushErr || '') + '\n';
      pushed = true;
    } catch (err: unknown) {
      const errMsg = err instanceof Error ? err.message : String(err);
      pushError = errMsg;
      outputLog += `Git push gagal: ${errMsg}\n`;
    }
  }

  return {
    committed: true,
    pushed,
    branch,
    commitHash,
    commitMessage: message,
    output: outputLog.trim(),
    error: pushError,
  };
}
