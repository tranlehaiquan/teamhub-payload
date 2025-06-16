'use client';

import type React from 'react';
import { useCallback, useState } from 'react';
import { toast } from '@payloadcms/ui';
import { runSeed, runSeedRandomUsers, runSeedRandomJobTitles } from './seed-actions';

const SuccessMessage: React.FC = () => (
  <div>
    Database seeded! You can now{' '}
    <a target="_blank" href="/" rel="noreferrer">
      visit your website
    </a>
  </div>
);

type SeedAction = {
  label: string;
  action: () => Promise<{ success: boolean }>;
};

const seedActions: SeedAction[] = [
  { label: 'Seed your database', action: runSeed },
  { label: 'Seed random users', action: runSeedRandomUsers },
  { label: 'Seed job title', action: runSeedRandomJobTitles },
];

export const SeedButton: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [seeded, setSeeded] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const handleSeedAction = useCallback(
    async (action: () => Promise<{ success: boolean }>, e: React.MouseEvent) => {
      e.preventDefault();

      if (seeded) {
        toast.info('Database already seeded.');
        return;
      }
      if (loading) {
        toast.info('Seeding already in progress.');
        return;
      }
      if (error) {
        toast.error(`An error occurred, please refresh and try again.`);
        return;
      }

      setLoading(true);

      toast.promise(
        new Promise((resolve, reject) => {
          action()
            .then(({ success }) => {
              if (success) {
                resolve(true);
                setSeeded(true);
              } else {
                reject('An error occurred while seeding.');
              }
            })
            .catch(reject)
            .finally(() => setLoading(false));
        }),
        {
          loading: 'Seeding with data....',
          success: <SuccessMessage />,
          error: 'An error occurred while seeding.',
        },
      );
    },
    [loading, seeded, error],
  );

  return (
    <div style={{ display: 'flex', gap: '1rem' }}>
      {seedActions.map(({ label, action }) => (
        <button key={label} onClick={(e) => handleSeedAction(action, e)}>
          {label}
        </button>
      ))}
    </div>
  );
};
