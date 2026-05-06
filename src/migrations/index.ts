import * as migration_20260317_053647 from './20260317_053647';
import * as migration_20260317_102754 from './20260317_102754';
import * as migration_20260504_161402_localize_blocks from './20260504_161402_localize_blocks';
import * as migration_20260506_010000_phase5b2_globals_arrays from './20260506_010000_phase5b2_globals_arrays';

export const migrations = [
  {
    up: migration_20260317_053647.up,
    down: migration_20260317_053647.down,
    name: '20260317_053647',
  },
  {
    up: migration_20260317_102754.up,
    down: migration_20260317_102754.down,
    name: '20260317_102754',
  },
  {
    up: migration_20260504_161402_localize_blocks.up,
    down: migration_20260504_161402_localize_blocks.down,
    name: '20260504_161402_localize_blocks'
  },
  {
    up: migration_20260506_010000_phase5b2_globals_arrays.up,
    down: migration_20260506_010000_phase5b2_globals_arrays.down,
    name: '20260506_010000_phase5b2_globals_arrays'
  },
];
