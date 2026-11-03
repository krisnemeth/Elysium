'use client';

import { useEffect } from 'react';

// Sets the scene for a capture without touching the saved theme, and hides
// the save status (nothing here is signed in).
export default function CaptureMode({ mode }: { mode: 'dark' | 'light' }) {
  useEffect(() => {
    document.documentElement.dataset.theme = mode;
  }, [mode]);
  return <style>{`[data-capture] [role='status'] { display: none !important; } nextjs-portal { display: none !important; }`}</style>;
}
