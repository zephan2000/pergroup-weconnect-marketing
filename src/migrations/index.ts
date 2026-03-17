import * as migration_20260317_053647 from './20260317_053647';
import * as migration_20260317_102754 from './20260317_102754';

export const migrations = [
  {
    up: migration_20260317_053647.up,
    down: migration_20260317_053647.down,
    name: '20260317_053647',
  },
  {
    up: migration_20260317_102754.up,
    down: migration_20260317_102754.down,
    name: '20260317_102754'
  },
];
