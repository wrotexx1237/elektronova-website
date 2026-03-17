'use server';

import fs from 'fs';
import path from 'path';

export type ActionResult = { ok: true; file: string } | { ok: false; error: string };

/**
 * Saves the Google HTML verification file to /public/
 * e.g. token = "abc123" → writes /public/googleabc123.html
 */
export async function saveVerificationFile(token: string): Promise<ActionResult> {
  try {
    const clean = token
      .replace(/^google-site-verification[=:\s]*/i, '')
      .trim();

    if (!clean || clean.length < 10) {
      return { ok: false, error: 'Token i pavlefshëm. Fut kodin e plotë nga Google.' };
    }

    const fileName = `google${clean}.html`;
    const content = `google-site-verification: ${clean}`;
    const filePath = path.join(process.cwd(), 'public', fileName);

    fs.writeFileSync(filePath, content, 'utf8');

    return { ok: true, file: `/${fileName}` };
  } catch (err: any) {
    return { ok: false, error: `Gabim serveri: ${err?.message ?? 'E panjohur'}` };
  }
}

/**
 * Lists all existing google*.html files in /public/
 */
export async function listVerificationFiles(): Promise<string[]> {
  try {
    const publicDir = path.join(process.cwd(), 'public');
    const files = fs.readdirSync(publicDir);
    return files.filter(f => /^google[a-zA-Z0-9_-]+\.html$/.test(f));
  } catch {
    return [];
  }
}

/**
 * Deletes a verification file
 */
export async function deleteVerificationFile(fileName: string): Promise<ActionResult> {
  try {
    const safe = path.basename(fileName);
    if (!/^google[a-zA-Z0-9_-]+\.html$/.test(safe)) {
      return { ok: false, error: 'Emër skedari i pavlefshëm.' };
    }
    const filePath = path.join(process.cwd(), 'public', safe);
    fs.unlinkSync(filePath);
    return { ok: true, file: safe };
  } catch (err: any) {
    return { ok: false, error: err?.message ?? 'E panjohur' };
  }
}
