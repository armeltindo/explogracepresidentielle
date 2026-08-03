import { describe, expect, it } from 'vitest';
import { colors, tierColor } from './tokens';

describe('tierColor', () => {
  it('picks the tier just below the boundary (upper bound exclusive)', () => {
    expect(tierColor(0)).toBe(colors.greenLight);
    expect(tierColor(11)).toBe(colors.greenLight);
    expect(tierColor(12)).toBe(colors.green);
    expect(tierColor(35)).toBe(colors.green);
    expect(tierColor(36)).toBe(colors.yellow);
    expect(tierColor(71)).toBe(colors.yellow);
    expect(tierColor(72)).toBe(colors.red);
    expect(tierColor(1000)).toBe(colors.red);
  });
});
