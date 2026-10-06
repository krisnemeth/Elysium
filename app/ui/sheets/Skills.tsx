'use client';
import { useState } from 'react';
import { RatingRow } from './fields';

const GROUPS = [
  {
    name: 'Physical',
    skills: ['Athletics', 'Brawl', 'Craft', 'Drive', 'Firearms', 'Melee', 'Larceny', 'Stealth', 'Survival'],
  },
  {
    name: 'Social',
    skills: ['Animal Ken', 'Etiquette', 'Insight', 'Intimidation', 'Leadership', 'Performance', 'Persuasion', 'Streetwise', 'Subterfuge'],
  },
  {
    name: 'Mental',
    skills: ['Academics', 'Awareness', 'Finance', 'Investigation', 'Medicine', 'Occult', 'Politics', 'Science', 'Technology'],
  },
];

export default function Skills() {
  const [ratings, setRatings] = useState<Record<string, number>>({});
  const [specialties, setSpecialties] = useState<Record<string, string>>({});

  return (
    <div className='grid gap-8 lg:grid-cols-3'>
      {GROUPS.map((group) => (
        <div key={group.name}>
          <h3 className='mb-2 text-xs tracking-[0.25em] text-accent uppercase'>{group.name}</h3>
          {group.skills.map((skill) => (
            <RatingRow
              key={skill}
              label={skill}
              value={ratings[skill] ?? 0}
              onChange={(v) => setRatings((s) => ({ ...s, [skill]: v }))}
            >
              <input
                aria-label={`${skill} specialty`}
                placeholder='Specialty'
                value={specialties[skill] ?? ''}
                onChange={(e) => setSpecialties((s) => ({ ...s, [skill]: e.target.value }))}
                className='w-full bg-transparent text-sm text-bone/80 italic placeholder:text-bone/20 focus:outline-none'
              />
            </RatingRow>
          ))}
        </div>
      ))}
    </div>
  );
}
