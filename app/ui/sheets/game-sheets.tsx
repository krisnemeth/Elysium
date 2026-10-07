import type { ReactNode } from 'react';
import type { Game } from '@/app/lib/games';
import { AUSPICES, CREEDS, DRIVES, TRIBES } from '@/app/lib/factions';
import { Advantages, Attributes, Biography, Convictions, Profile, Skills, TextBlocks, Trackers } from './sections/common';
import { Blood, Disciplines, VampireProfile, VampireTrackers } from './sections/vampire';
import { Edges, GiftsAndRites, Renown } from './sections/werewolf-hunter';
import { Experience } from './sections/experience';

export type SheetSection = { id: string; label: string; body: ReactNode };

// Each game's character sheet, section by section. All sections read and
// write the shared sheet (SheetContext), so they work in the editor and the
// prototypes alike.

const VAMPIRE: SheetSection[] = [
  { id: 'profile', label: 'Profile', body: <VampireProfile /> },
  { id: 'attributes', label: 'Attributes', body: <Attributes /> },
  { id: 'skills', label: 'Skills', body: <Skills /> },
  { id: 'trackers', label: 'Trackers', body: <VampireTrackers /> },
  { id: 'disciplines', label: 'Disciplines', body: <Disciplines /> },
  { id: 'blood', label: 'Blood', body: <Blood /> },
  {
    id: 'convictions',
    label: 'Convictions',
    body: (
      <div className='flex flex-col gap-8'>
        <Convictions />
        <TextBlocks fields={[{ key: 'tenets', label: 'Chronicle tenets' }, { key: 'bane', label: 'Clan bane' }]} />
      </div>
    ),
  },
  {
    id: 'merits',
    label: 'Merits & notes',
    body: (
      <div className='grid gap-8 lg:grid-cols-2'>
        <Advantages />
        <TextBlocks fields={[{ key: 'notes', label: 'Notes' }]} rows={14} />
      </div>
    ),
  },
  { id: 'experience', label: 'Experience', body: <Experience game='vampire' /> },
  { id: 'biography', label: 'Biography', body: <Biography milestone='Embrace' apparent='Apparent age' /> },
];

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
          { key: 'breed', label: 'Breed', options: ['Homid', 'Lupus'] },
          { key: 'ambition', label: 'Ambition' },
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
          { key: 'rage', label: 'Rage', max: 5, shape: 'box' },
          { key: 'harano', label: 'Harano', max: 5, note: 'Despair at the dying world' },
          { key: 'hauglosk', label: 'Hauglosk', max: 5, note: 'Fanatic, unbending fury' },
        ]}
      />
    ),
  },
  { id: 'renown', label: 'Renown', body: <Renown /> },
  { id: 'gifts', label: 'Gifts & rites', body: <GiftsAndRites /> },
  {
    id: 'spirit',
    label: 'Spirit',
    body: (
      <div className='flex flex-col gap-8'>
        <TextBlocks fields={[{ key: 'favor', label: 'Favor' }, { key: 'ban', label: 'Ban' }]} rows={4} />
        <Convictions label='Touchstones & convictions' />
      </div>
    ),
  },
  {
    id: 'advantages',
    label: 'Advantages',
    body: (
      <div className='grid gap-8 lg:grid-cols-2'>
        <Advantages />
        <TextBlocks fields={[{ key: 'notes', label: 'Notes' }]} rows={12} />
      </div>
    ),
  },
  { id: 'experience', label: 'Experience', body: <Experience game='werewolf' /> },
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
  { id: 'edges', label: 'Edges & perks', body: <Edges /> },
  {
    id: 'convictions',
    label: 'Convictions',
    body: (
      <div className='flex flex-col gap-8'>
        <Convictions label='Touchstones & convictions' />
        <TextBlocks fields={[{ key: 'profile.driveNotes', label: 'Drive: what pushes you' }, { key: 'profile.redemption', label: 'Redemption' }]} rows={4} />
      </div>
    ),
  },
  {
    id: 'advantages',
    label: 'Advantages',
    body: (
      <div className='grid gap-8 lg:grid-cols-2'>
        <Advantages />
        <TextBlocks fields={[{ key: 'notes', label: 'Case notes' }]} rows={12} />
      </div>
    ),
  },
  { id: 'experience', label: 'Experience', body: <Experience game='hunter' /> },
  { id: 'biography', label: 'Biography', body: <Biography milestone='the Reckoning' /> },
];

export const GAME_SHEETS: Record<Game, SheetSection[]> = {
  vampire: VAMPIRE,
  werewolf: WEREWOLF,
  hunter: HUNTER,
};
