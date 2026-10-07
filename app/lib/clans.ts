import type { ComponentType, SVGProps } from 'react';
import {
  ClanBanuHaqim,
  ClanBrujah,
  ClanCaitiff,
  ClanGangrel,
  ClanHecata,
  ClanLasombra,
  ClanMalkavian,
  ClanMinistry,
  ClanNosferatu,
  ClanRavnos,
  ClanSalubri,
  ClanThinBlood,
  ClanToreador,
  ClanTremere,
  ClanTzimisce,
  ClanVentrue,
  ClanNameBanuHaqim,
  ClanNameBrujah,
  ClanNameGangrel,
  ClanNameHecata,
  ClanNameLasombra,
  ClanNameMalkavian,
  ClanNameMinistry,
  ClanNameNosferatu,
  ClanNameRavnos,
  ClanNameSalubri,
  ClanNameToreador,
  ClanNameTremere,
  ClanNameTzimisce,
  ClanNameVentrue,
} from '@/app/ui/svgs/official';

type Svg = ComponentType<SVGProps<SVGSVGElement>>;

export type Clan = {
  name: string;
  Symbol: Svg;
  // Official name logo, where one exists.
  Wordmark?: Svg;
};

export type ClanKey =
  | 'banu-haqim'
  | 'brujah'
  | 'gangrel'
  | 'hecata'
  | 'lasombra'
  | 'malkavian'
  | 'ministry'
  | 'nosferatu'
  | 'ravnos'
  | 'salubri'
  | 'toreador'
  | 'tremere'
  | 'tzimisce'
  | 'ventrue'
  | 'caitiff'
  | 'thin-blood';

export const CLANS: Record<ClanKey, Clan> = {
  'banu-haqim': { name: 'Banu Haqim', Symbol: ClanBanuHaqim, Wordmark: ClanNameBanuHaqim },
  brujah: { name: 'Brujah', Symbol: ClanBrujah, Wordmark: ClanNameBrujah },
  gangrel: { name: 'Gangrel', Symbol: ClanGangrel, Wordmark: ClanNameGangrel },
  hecata: { name: 'Hecata', Symbol: ClanHecata, Wordmark: ClanNameHecata },
  lasombra: { name: 'Lasombra', Symbol: ClanLasombra, Wordmark: ClanNameLasombra },
  malkavian: { name: 'Malkavian', Symbol: ClanMalkavian, Wordmark: ClanNameMalkavian },
  ministry: { name: 'The Ministry', Symbol: ClanMinistry, Wordmark: ClanNameMinistry },
  nosferatu: { name: 'Nosferatu', Symbol: ClanNosferatu, Wordmark: ClanNameNosferatu },
  ravnos: { name: 'Ravnos', Symbol: ClanRavnos, Wordmark: ClanNameRavnos },
  salubri: { name: 'Salubri', Symbol: ClanSalubri, Wordmark: ClanNameSalubri },
  toreador: { name: 'Toreador', Symbol: ClanToreador, Wordmark: ClanNameToreador },
  tremere: { name: 'Tremere', Symbol: ClanTremere, Wordmark: ClanNameTremere },
  tzimisce: { name: 'Tzimisce', Symbol: ClanTzimisce, Wordmark: ClanNameTzimisce },
  ventrue: { name: 'Ventrue', Symbol: ClanVentrue, Wordmark: ClanNameVentrue },
  caitiff: { name: 'Caitiff', Symbol: ClanCaitiff },
  'thin-blood': { name: 'Thin-blood', Symbol: ClanThinBlood },
};
