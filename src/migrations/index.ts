import * as migration_20250316_064830 from './20250316_064830';

export const migrations = [
  {
    up: migration_20250316_064830.up,
    down: migration_20250316_064830.down,
    name: '20250316_064830'
  },
];
