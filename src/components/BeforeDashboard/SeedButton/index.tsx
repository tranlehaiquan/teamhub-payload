'use client';

import React, { Fragment, useCallback, useState } from 'react';
import { toast } from '@payloadcms/ui';
import { runSeed, runSeedRandomUsers } from './seed-actions';

const SuccessMessage: React.FC = () => (
  <div>
    Database seeded! You can now{' '}
    <a target="_blank" href="/">
      visit your website
    </a>
  </div>
);

export const SeedButton: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [seeded, setSeeded] = useState(false);
  const [error, setError] = useState(null);

  const handleClick = useCallback(
    async (e) => {
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

      try {
        toast.promise(
          new Promise((resolve, reject) => {
            try {
              runSeed()
                .then(({ success }) => {
                  if (success) {
                    resolve(true);
                    setSeeded(true);
                  } else {
                    reject('An error occurred while seeding.');
                  }
                })
                .catch((error) => {
                  reject(error);
                });
            } catch (error) {
              reject(error);
            }
          }),
          {
            loading: 'Seeding with data....',
            success: <SuccessMessage />,
            error: 'An error occurred while seeding.',
          },
        );
      } catch (err) {
        setError(err);
      }
    },
    [loading, seeded, error],
  );

  const handleSeedRandomUsers = useCallback(
    async (e) => {
      e.preventDefault();
      toast.promise(
        new Promise((resolve, reject) => {
          try {
            runSeedRandomUsers()
              .then(({ success }) => {
                if (success) {
                  resolve(true);
                  setSeeded(true);
                } else {
                  reject('An error occurred while seeding.');
                }
              })
              .catch((error) => {
                reject(error);
              });
          } catch (error) {
            reject(error);
          }
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

  let message = '';
  if (loading) message = ' (seeding...)';
  if (seeded) message = ' (done!)';
  if (error) message = ` (error: ${error})`;

  return (
    <div>
      <button onClick={handleClick} style={{ marginRight: '1rem' }}>
        Seed your database
      </button>
      <button onClick={handleSeedRandomUsers}>Seed random users</button>
    </div>
  );
};
