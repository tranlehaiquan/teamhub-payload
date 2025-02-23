import * as migration_20250121_174846 from './20250121_174846';
import * as migration_20250223_101048 from './20250223_101048';

export const migrations = [
  {
    up: migration_20250121_174846.up,
    down: migration_20250121_174846.down,
    name: '20250121_174846',
  },
  {
    up: migration_20250223_101048.up,
    down: migration_20250223_101048.down,
    name: '20250223_101048'
  },
];
