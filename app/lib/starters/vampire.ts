import type { Starter } from '../sheets/types';

// V5 character creation: attributes 4/3/3/3/2/2/2/2/1; a skill distribution;
// a free specialty plus required ones (Academics, Craft, Performance, Science)
// and the predator type's; two clan Disciplines at 2 and 1 plus the predator
// type's dot; 7 dots of advantages and 2 of flaws plus the predator type's;
// Health = Stamina + 3, Willpower = Composure + Resolve, Humanity 7 (adjusted
// by predator type), Hunger 1, Blood Potency 1 for a 12th-generation neonate.

// What Blood Potency 1 gives a 12th-generation neonate.
const BLOOD_POTENCY_1 = {
  bloodSurge: 'Add 2 dice',
  mendAmount: '1 point of Superficial damage',
  powerBonus: 'None',
  rouseReroll: 'Level 1 Disciplines',
  baneSeverity: '2',
  feedingPenalty: 'None',
};

const GLASGOW_TENETS =
  'Elysium is neutral ground: no violence, no feeding, no Disciplines on the unwilling inside it.\nThe Masquerade comes before every grudge.\nNo one is Embraced without the Prince’s leave, Anarch or not.';

export const VAMPIRES: Starter[] = [
  {
    key: 'vtm-trixx-laveau',
    game: 'vampire',
    sort: 1,
    name: 'Trixx Laveau',
    faction: 'brujah',
    portrait: '/Female1.jpg',
    summary:
      "Anarch enforcer and true believer of The Cause. Right hand to the Anarch leader. If you don't want trouble, stay out of her way.",
    sheet: {
      profile: {
        name: 'Trixx Laveau',
        concept: 'Punk singer turned Anarch enforcer',
        chronicle: 'Glasgow by Night',
        ambition: 'Break the Camarilla’s hold on the East End.',
        desire: 'Play one more gig at the Barrowland, just once.',
        predator: 'Alleycat',
        sire: 'Rab “the Boot” MacRae',
        clan: 'Brujah',
        generation: '12th',
        sect: 'Anarch',
        ...BLOOD_POTENCY_1,
      },
      attributes: { Strength: 4, Dexterity: 3, Stamina: 3, Charisma: 2, Manipulation: 2, Composure: 1, Intelligence: 2, Wits: 3, Resolve: 2 },
      skills: {
        Brawl: { dots: 3, specialty: 'Bar fights' },
        Intimidation: { dots: 3, specialty: 'Stickups' },
        Streetwise: { dots: 3 },
        Athletics: { dots: 2 },
        Melee: { dots: 2 },
        Drive: { dots: 2 },
        Leadership: { dots: 2 },
        Awareness: { dots: 2 },
        Firearms: { dots: 1 },
        Larceny: { dots: 1 },
        Stealth: { dots: 1 },
        Insight: { dots: 1 },
        Subterfuge: { dots: 1 },
        Politics: { dots: 1 },
        Performance: { dots: 1, specialty: 'Punk vocals' },
      },
      disciplines: [
        { name: 'Potence', dots: 2, powers: ['Lethal Body', 'Prowess'] },
        { name: 'Presence', dots: 1, powers: ['Daunt'] },
        { name: 'Celerity', dots: 1, powers: ['Rapid Reflexes'] },
      ],
      trackers: { health: 6, willpower: 3, humanity: 6, hunger: 1 },
      bloodPotency: 1,
      bane:
        'Violence: when she rolls to resist a fury frenzy, she subtracts dice equal to her Bane Severity (2).',
      tenets: GLASGOW_TENETS,
      advantages: [
        { name: 'Contacts', dots: 3, kind: 'background', note: 'Criminal underworld: fences, bouncers, a getaway driver', source: 'Predator type' },
        { name: 'Allies', dots: 3, kind: 'background', note: 'The Rack, her Anarch crew' },
        { name: 'Haven', dots: 1, kind: 'background', note: 'Flat above a tattoo parlour in Calton' },
        { name: 'Resources', dots: 1, kind: 'background', note: 'Bar shifts and cash jobs' },
        { name: 'Mask', dots: 1, kind: 'background', note: 'Tricia Lavelle, bartender' },
        { name: 'Status', dots: 1, kind: 'background', note: 'Anarchs of Glasgow' },
        { name: 'Enemy', dots: 1, kind: 'flaw', note: 'The Sheriff’s ghoul, whose nose she broke' },
        { name: 'Suspect', dots: 1, kind: 'flaw', note: 'The Camarilla watches her' },
      ],
      convictions: [
        { conviction: 'Never sell out the Movement.', touchstone: 'Mackie Doyle, her old bandmate, who still plays the Barrowland' },
        { conviction: 'Nobody hurts kids on my watch.', touchstone: 'Iona, her twelve-year-old niece' },
      ],
      biography: {
        born: '1987-03-14',
        turned: '2009-11-02',
        appearance: 'Twin buns, black bangs, red eyeshadow, a spiked choker and a throat covered in tattoos. Leather jacket, always.',
        features: 'Her eyes still flash red when she loses her temper.',
        history:
          'Tricia Lavelle fronted a Glasgow punk band and broke more bottles than records. Rab MacRae, a Brujah firebrand, Embraced her after a riot outside a gig she started on purpose. When Rab met the sun, she took his place in the Rack. Now she collects debts for the Anarch Baron, keeps the East End off the Camarilla’s books, and has never once backed down.',
      },
    },
  },
  {
    key: 'vtm-blake-janssen',
    game: 'vampire',
    sort: 2,
    name: 'Blake Janssen',
    faction: 'nosferatu',
    portrait: '/Nosferatu.jpeg',
    summary:
      'Nosferatu spymaster, he knows everything about everyone. He is the keeper of secrets and the master of the shadows.',
    sheet: {
      profile: {
        name: 'Blake Janssen',
        concept: 'Spymaster under the city',
        chronicle: 'Glasgow by Night',
        ambition: 'Become the one Kindred the Prince cannot afford to lose.',
        desire: 'Find out who leaked his last file.',
        predator: 'Sandman',
        sire: 'Old Morag of the Subway',
        clan: 'Nosferatu',
        generation: '12th',
        sect: 'Camarilla',
        ...BLOOD_POTENCY_1,
      },
      attributes: { Strength: 2, Dexterity: 3, Stamina: 2, Charisma: 1, Manipulation: 2, Composure: 2, Intelligence: 4, Wits: 3, Resolve: 3 },
      skills: {
        Investigation: { dots: 4, specialty: 'Surveillance' },
        Stealth: { dots: 3, specialty: 'Break-in' },
        Technology: { dots: 3 },
        Streetwise: { dots: 3 },
        Larceny: { dots: 2 },
        Awareness: { dots: 2 },
        Subterfuge: { dots: 2 },
        Academics: { dots: 1, specialty: 'City records' },
        Insight: { dots: 1 },
        Firearms: { dots: 1 },
      },
      disciplines: [
        { name: 'Obfuscate', dots: 3, powers: ['Cloak of Shadows', 'Unseen Passage', 'Ghost in the Machine'] },
        { name: 'Animalism', dots: 1, powers: ['Bond Famulus'] },
      ],
      trackers: { health: 5, willpower: 5, humanity: 7, hunger: 1 },
      bloodPotency: 1,
      bane:
        'Repulsiveness: he can never pass for human. Rolls to disguise himself as human fail, and his Charisma-based social rolls with mortals suffer a penalty equal to his Bane Severity (2).',
      tenets: GLASGOW_TENETS,
      advantages: [
        { name: 'Resources', dots: 1, kind: 'background', note: 'Selling information', source: 'Predator type' },
        { name: 'Haven', dots: 2, kind: 'background', note: 'A sealed-off stretch of the old Subway tunnels' },
        { name: 'Contacts', dots: 3, kind: 'background', note: 'A council clerk, a police dispatcher and a teenage hacker' },
        { name: 'Retainer', dots: 1, kind: 'background', note: 'Wee Malky, a ghouled courier' },
        { name: 'Mask', dots: 1, kind: 'background', note: 'Paperwork for “Brian Jansen”, who never shows up in person' },
        { name: 'Enemy', dots: 1, kind: 'flaw', note: 'A Tremere he is blackmailing' },
        { name: 'Dark Secret', dots: 1, kind: 'flaw', note: 'He holds proof the Prince once broke the Masquerade' },
      ],
      convictions: [
        { conviction: 'Information is never destroyed, only kept.', touchstone: 'Elspeth Gray, an archivist at the Mitchell Library' },
        { conviction: 'Never let a mortal see his face.', touchstone: 'His sister Karen, who thinks he died in 1998' },
      ],
      biography: {
        born: '1957-06-30',
        turned: '1998-02-11',
        appearance: 'A ruined, scarred face, thin hair slicked back, and a carefully pressed old suit.',
        features: 'He smells of damp stone and printer toner.',
        history:
          'Blake was a private investigator who followed the wrong man into the Subway tunnels. Old Morag decided his talents were wasted on the living. Twenty-five years on, his archive under the city holds a file on nearly every Kindred in Glasgow. He sells what he must, keeps what matters, and has never sold the same secret twice.',
      },
    },
  },
  {
    key: 'vtm-claire-voyant',
    game: 'vampire',
    sort: 3,
    name: 'Claire Voyant',
    faction: 'malkavian',
    portrait: '/Malkavian.jpg',
    summary:
      'Bearer of headaches, a Malkavian seer, she is the local oracle. She is cryptic, but her predictions are always accurate.',
    sheet: {
      profile: {
        name: 'Claire Voyant',
        concept: 'Tarot reader and the city’s oracle',
        chronicle: 'Glasgow by Night',
        ambition: 'Stop the vision of the burning cathedral from coming true.',
        desire: 'One night without the headaches.',
        predator: 'Consensualist',
        sire: 'Mr. Pemberton (no one has seen him since)',
        clan: 'Malkavian',
        generation: '12th',
        sect: 'Camarilla',
        ...BLOOD_POTENCY_1,
      },
      attributes: { Strength: 1, Dexterity: 2, Stamina: 2, Charisma: 3, Manipulation: 2, Composure: 2, Intelligence: 3, Wits: 4, Resolve: 3 },
      skills: {
        Occult: { dots: 3, specialty: 'Prophecy' },
        Awareness: { dots: 2 },
        Insight: { dots: 2 },
        Persuasion: { dots: 2 },
        Medicine: { dots: 2, specialty: 'Phlebotomy' },
        Academics: { dots: 2, specialty: 'Psychology' },
        Etiquette: { dots: 2 },
        Investigation: { dots: 2 },
        Subterfuge: { dots: 2 },
        Athletics: { dots: 1 },
        Stealth: { dots: 1 },
        Drive: { dots: 1 },
        Science: { dots: 1, specialty: 'Astronomy' },
        Politics: { dots: 1 },
        Streetwise: { dots: 1 },
        Performance: { dots: 1, specialty: 'Tarot readings' },
        Leadership: { dots: 1 },
        'Animal Ken': { dots: 1 },
        Technology: { dots: 1 },
      },
      disciplines: [
        { name: 'Auspex', dots: 3, powers: ['Heightened Senses', 'Premonition', 'Scry the Soul'] },
        { name: 'Dominate', dots: 1, powers: ['Cloud Memory'] },
      ],
      trackers: { health: 5, willpower: 5, humanity: 8, hunger: 1 },
      bloodPotency: 1,
      bane:
        'Fractured Perspective: when she suffers a Bestial Failure or a Compulsion, her derangement takes hold, and she takes a penalty equal to her Bane Severity (2) to one category of dice pools for the scene.',
      tenets: GLASGOW_TENETS,
      advantages: [
        { name: 'Herd', dots: 2, kind: 'background', note: 'Regular clients who come back for readings, and give' },
        { name: 'Resources', dots: 2, kind: 'background', note: 'The tarot parlour on Byres Road' },
        { name: 'Haven', dots: 1, kind: 'background', note: 'The back room of the parlour, blacked out' },
        { name: 'Contacts', dots: 1, kind: 'background', note: 'A nurse at the Western Infirmary' },
        { name: 'Fame', dots: 1, kind: 'background', note: 'Known as the West End’s best reader' },
        { name: 'Dark Secret', dots: 1, kind: 'flaw', note: 'Masquerade breacher: a client saw her feed', source: 'Predator type' },
        { name: 'Prey Exclusion', dots: 1, kind: 'flaw', note: 'Never feeds on the unwilling', source: 'Predator type' },
        { name: 'Stalkers', dots: 1, kind: 'flaw', note: 'A client who believes she is a saint' },
        { name: 'Enemy', dots: 1, kind: 'flaw', note: 'A Second Inquisition informant who watched the parlour' },
      ],
      convictions: [
        { conviction: 'Always tell them the truth, even when it hurts.', touchstone: 'Dr Harriet Sim, her old psychiatrist' },
        { conviction: 'Never take blood from anyone who didn’t say yes.', touchstone: 'Tam, the busker outside the parlour' },
      ],
      biography: {
        born: '1979-10-31',
        turned: '2004-01-06',
        appearance: 'Pale, hair pinned up loosely, long dark coat with fur cuffs. She presses her temples when the visions come.',
        features: 'Never sits with her back to a mirror.',
        history:
          'Claire heard voices long before her Embrace, and her psychiatrist believed she was getting better. Then Mr. Pemberton came for a reading, told her the cards were wrong, and made sure the voices never stopped. Now she reads tarot on Byres Road for mortals by day’s end and for Kindred after midnight. Her predictions are cryptic, uncomfortable and, so far, always right.',
      },
    },
  },
];
