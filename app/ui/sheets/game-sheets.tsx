import type { ReactNode } from 'react';
import type { Game } from '@/app/lib/games';
import { AUSPICES, CREEDS, DRIVES, TRIBES } from '@/app/lib/factions';
import { SHEET_SECTIONS } from './sections';
import Attributes from './Attributes';
import Skills from './Skills';
import { Biography, NamedList, Profile, RatingGroups, TextAreas, Trackers } from './generic';

export type SheetSection = { id: string; label: string; body: ReactNode };

const WEREWOLF: SheetSection[] = [
  {
    id: 'profile',
    label: 'Profile',
    body: (
      <Profile
        fields={[
          { key: 'name', label: 'Name' },
          { key: 'concept', label: 'Concept' },
          { key: 'pack', label: 'Pack' },
          { key: 'player', label: 'Player' },
          { key: 'chronicle', label: 'Chronicle' },
          { key: 'patron', label: 'Patron spirit' },
          { key: 'tribe', label: 'Tribe', options: TRIBES, glyph: true },
          { key: 'auspice', label: 'Auspice', options: AUSPICES, glyph: true },
          { key: 'ambition', label: 'Ambition' },
        ]}
      />
    ),
  },
  { id: 'attributes', label: 'Attributes', body: <Attributes /> },
  { id: 'skills', label: 'Skills', body: <Skills /> },
  {
    id: 'trackers',
    label: 'Trackers',
    body: (
      <Trackers
        tracks={[
          { key: 'health', label: 'Health', max: 10, shape: 'box' },
          { key: 'willpower', label: 'Willpower', max: 10, shape: 'box' },
          { key: 'rage', label: 'Rage', max: 5, shape: 'box', initial: 1 },
          { key: 'harano', label: 'Harano', max: 5, note: 'Despair at the dying world' },
          { key: 'hauglosk', label: 'Hauglosk', max: 5, note: 'Fanatic, unbending fury' },
        ]}
      />
    ),
  },
  { id: 'renown', label: 'Renown', body: <RatingGroups groups={[{ name: 'Renown', items: ['Glory', 'Honor', 'Wisdom'] }]} /> },
  {
    id: 'gifts',
    label: 'Gifts & rites',
    body: (
      <div className='grid gap-8 lg:grid-cols-2'>
        <NamedList title='Gifts' rows={8} placeholder='Gift' rated={false} />
        <NamedList title='Rites' rows={8} placeholder='Rite' rated={false} />
      </div>
    ),
  },
  {
    id: 'spirit',
    label: 'Spirit',
    body: (
      <TextAreas
        fields={[
          { key: 'favor', label: 'Favor' },
          { key: 'ban', label: 'Ban' },
          { key: 'touchstones', label: 'Touchstones' },
        ]}
      />
    ),
  },
  {
    id: 'advantages',
    label: 'Advantages',
    body: (
      <div className='grid gap-8 lg:grid-cols-2'>
        <NamedList title='Advantages & flaws' rows={8} placeholder='Name' />
        <TextAreas fields={[{ key: 'notes', label: 'Notes' }]} rows={12} />
      </div>
    ),
  },
  { id: 'biography', label: 'Biography', body: <Biography milestone='First Change' /> },
];

const HUNTER: SheetSection[] = [
  {
    id: 'profile',
    label: 'Profile',
    body: (
      <Profile
        fields={[
          { key: 'name', label: 'Name' },
          { key: 'concept', label: 'Concept' },
          { key: 'cell', label: 'Cell' },
          { key: 'player', label: 'Player' },
          { key: 'chronicle', label: 'Chronicle' },
          { key: 'ambition', label: 'Ambition' },
          { key: 'creed', label: 'Creed', options: CREEDS },
          { key: 'drive', label: 'Drive', options: DRIVES },
          { key: 'desire', label: 'Desire' },
        ]}
      />
    ),
  },
  { id: 'attributes', label: 'Attributes', body: <Attributes /> },
  { id: 'skills', label: 'Skills', body: <Skills /> },
  {
    id: 'trackers',
    label: 'Trackers',
    body: (
      <Trackers
        tracks={[
          { key: 'health', label: 'Health', max: 10, shape: 'box' },
          { key: 'willpower', label: 'Willpower', max: 10, shape: 'box' },
          { key: 'desperation', label: 'Desperation', max: 5, note: "The cell's, shared" },
          { key: 'danger', label: 'Danger', max: 5, note: 'How close the quarry is' },
        ]}
      />
    ),
  },
  {
    id: 'edges',
    label: 'Edges & perks',
    body: (
      <div className='grid gap-8 lg:grid-cols-2'>
        <NamedList title='Edges' rows={6} placeholder='Edge' rated={false} />
        <NamedList title='Perks' rows={6} placeholder='Perk' rated={false} />
      </div>
    ),
  },
  {
    id: 'convictions',
    label: 'Convictions',
    body: (
      <TextAreas
        fields={[
          { key: 'touchstones', label: 'Touchstones & convictions' },
          { key: 'drive', label: 'Drive: what pushes you' },
          { key: 'redemption', label: 'Redemption' },
        ]}
      />
    ),
  },
  {
    id: 'advantages',
    label: 'Advantages',
    body: (
      <div className='grid gap-8 lg:grid-cols-2'>
        <NamedList title='Advantages & flaws' rows={8} placeholder='Name' />
        <TextAreas fields={[{ key: 'notes', label: 'Case notes' }]} rows={12} />
      </div>
    ),
  },
  { id: 'biography', label: 'Biography', body: <Biography milestone='the Reckoning' /> },
];

export const GAME_SHEETS: Record<Game, SheetSection[]> = {
  vampire: SHEET_SECTIONS,
  werewolf: WEREWOLF,
  hunter: HUNTER,
};
