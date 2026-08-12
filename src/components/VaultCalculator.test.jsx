import React from 'react';
import { describe, expect, it } from 'vitest';
import { calculateExitReturn, calculateMonthlyRewards } from './VaultCalculator.jsx';

describe('vault calculations', () => {
  it('calculates monthly rewards from editable assumptions', () => {
    expect(calculateMonthlyRewards(10_000, 100_000, 20_000)).toBe(2_000);
    expect(calculateMonthlyRewards(10_000, 0, 20_000)).toBe(0);
  });

  it('clamps invalid exit inputs to zero', () => {
    expect(calculateExitReturn(-10, 0.9)).toBe(0);
    expect(calculateExitReturn(100, 0.8)).toBe(80);
  });
});
