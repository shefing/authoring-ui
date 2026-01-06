import * as migration_20251230_164537_test_migration from './20251230_164537_test_migration';

export const migrations = [
  {
    up: migration_20251230_164537_test_migration.up,
    down: migration_20251230_164537_test_migration.down,
    name: '20251230_164537_test_migration'
  },
];
