// Tiny Node resolve hook for scripts that import app code: maps the "@/"
// alias to the repo root and adds the ".ts" extension to extensionless paths.
// Used by scripts/check-personas.mts (see its header).

import { existsSync } from 'node:fs';
import { fileURLToPath, pathToFileURL } from 'node:url';
import path from 'node:path';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

export async function resolve(specifier, context, next) {
  let target = specifier;
  if (specifier.startsWith('@/')) target = pathToFileURL(path.join(root, specifier.slice(2))).href;
  else if (specifier.startsWith('.') && context.parentURL) target = new URL(specifier, context.parentURL).href;
  else return next(specifier, context);
  const file = fileURLToPath(target);
  for (const candidate of [file, `${file}.ts`, `${file}.tsx`, path.join(file, 'index.ts')]) {
    if (path.extname(candidate) && existsSync(candidate) && !existsSync(candidate + '/')) return next(pathToFileURL(candidate).href, context);
  }
  return next(specifier, context);
}
