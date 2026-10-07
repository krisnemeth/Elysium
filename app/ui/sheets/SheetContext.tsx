'use client';

import { createContext, useContext, type ReactNode } from 'react';
import type { Attribute, Sheet, Skill } from '@/app/lib/sheets/types';

// The sheet being edited, shared by every section of the form.
type SheetStore = {
  sheet: Sheet;
  update: (mutate: (draft: Sheet) => void) => void;
};

const SheetCtx = createContext<SheetStore | null>(null);

export function SheetProvider({ value, children }: { value: SheetStore; children: ReactNode }) {
  return <SheetCtx.Provider value={value}>{children}</SheetCtx.Provider>;
}

export function useSheet() {
  const ctx = useContext(SheetCtx);
  if (!ctx) throw new Error('Sheet sections must be rendered inside <SheetProvider>.');
  return ctx;
}

// Small helpers most sections need.
export function useSheetFields() {
  const { sheet, update } = useSheet();
  return {
    sheet,
    update,
    profile: (key: string) => sheet.profile[key] ?? '',
    setProfile: (key: string) => (value: string) =>
      update((d) => {
        d.profile[key] = value;
      }),
    setAttribute: (attr: Attribute, value: number) =>
      update((d) => {
        const before = d.attributes[attr];
        d.attributes[attr] = value;
        // Keep Health and Willpower in step while they still match the formula.
        if (attr === 'Stamina' && d.trackers.health === before + 3) d.trackers.health = value + 3;
        if (attr === 'Composure' && d.trackers.willpower === before + d.attributes.Resolve) d.trackers.willpower = value + d.attributes.Resolve;
        if (attr === 'Resolve' && d.trackers.willpower === d.attributes.Composure + before) d.trackers.willpower = d.attributes.Composure + value;
      }),
    setSkill: (skill: Skill, patch: { dots?: number; specialty?: string }) =>
      update((d) => {
        const next = { dots: 0, ...d.skills[skill], ...patch };
        if (!next.dots && !next.specialty) delete d.skills[skill];
        else d.skills[skill] = next;
      }),
    tracker: (key: string, fallback = 0) => sheet.trackers[key] ?? fallback,
    setTracker: (key: string) => (value: number) =>
      update((d) => {
        d.trackers[key] = value;
      }),
  };
}
