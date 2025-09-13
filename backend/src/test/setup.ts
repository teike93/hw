import { beforeAll, afterAll } from 'vitest';

beforeAll(async () => {
  // Test setup - could include database setup for integration tests
  console.log('Setting up tests...');
});

afterAll(async () => {
  // Test teardown
  console.log('Tearing down tests...');
});