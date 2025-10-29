import { describe, it, expect } from 'vitest';

// Test 1: Tip Locking Logic
describe('Tip Lock Logic', () => {
  it('should be unlocked if lock_at is in the future', () => {
    const lock_at = new Date(Date.now() + 60 * 1000).toISOString(); // 1 minute from now
    const isLocked = new Date() > new Date(lock_at);
    expect(isLocked).toBe(false);
  });

  it('should be locked if lock_at is in the past', () => {
    const lock_at = new Date(Date.now() - 60 * 1000).toISOString(); // 1 minute ago
    const isLocked = new Date() > new Date(lock_at);
    expect(isLocked).toBe(true);
  });
});

// Test 2: Order of Merit Sorting
describe('Order of Merit Data', () => {
  it('should sort players by rank correctly', () => {
    const oomData = [
      { rank: 3, name: 'Player C' },
      { rank: 1, name: 'Player A' },
      { rank: 2, name: 'Player B' },
    ];

    const sortedData = oomData.sort((a, b) => a.rank - b.rank);

    expect(sortedData[0].name).toBe('Player A');
    expect(sortedData[1].name).toBe('Player B');
    expect(sortedData[2].name).toBe('Player C');
  });
});
