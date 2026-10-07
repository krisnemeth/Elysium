'use client';

import { createContext, useContext, type ReactNode } from 'react';
import { DEFAULT_PREFERENCES, type Preferences } from '@/app/lib/preferences';

const Ctx = createContext<Preferences>(DEFAULT_PREFERENCES);

export function PreferencesProvider({ value, children }: { value: Preferences; children: ReactNode }) {
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export const usePreferences = () => useContext(Ctx);
