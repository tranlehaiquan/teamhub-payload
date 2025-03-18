import * as migration_20250316_064830 from './20250316_064830';
import * as migration_20250318_130803 from './20250318_130803';
import * as migration_20250318_131909 from './20250318_131909';

export const migrations = [
  {
    up: migration_20250316_064830.up,
    down: migration_20250316_064830.down,
    name: '20250316_064830',
  },
  {
    up: migration_20250318_130803.up,
    down: migration_20250318_130803.down,
    name: '20250318_130803',
  },
  {
    up: migration_20250318_131909.up,
    down: migration_20250318_131909.down,
    name: '20250318_131909'
  },
];
