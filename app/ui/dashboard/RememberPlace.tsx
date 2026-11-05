'use client';

import { usePathname } from 'next/navigation';
import { useEffect } from 'react';
import { LAST_PLACE_COOKIE, parsePlace } from '@/app/lib/last-place';

// Notes the character or chronicle you're in, for the overview's Continue (app/lib/continue.ts).
export default function RememberPlace() {
  const path = usePathname();
  useEffect(() => {
    if (parsePlace(path)) document.cookie = `${LAST_PLACE_COOKIE}=${path}; path=/; max-age=31536000; samesite=lax`;
  }, [path]);
  return null;
}
