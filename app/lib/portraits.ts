// Uploaded portraits live in the private `portraits` bucket at
// <user id>/<character id>/<file> and are served by app/media/portraits.
export const PORTRAIT_BUCKET = 'portraits';
export const PORTRAIT_ROUTE = '/media/portraits/';
export const PORTRAIT_TYPES = ['image/webp', 'image/jpeg', 'image/png'];
export const PORTRAIT_MAX_BYTES = 2 * 1024 * 1024;
// Uploads are cropped to 3:4 and scaled to this size in the browser.
export const PORTRAIT_SIZE = { width: 900, height: 1200 };

export function isUploadedPortrait(src: string | null | undefined): src is string {
  return Boolean(src?.startsWith(PORTRAIT_ROUTE));
}

export function portraitPath(src: string) {
  return src.slice(PORTRAIT_ROUTE.length);
}
