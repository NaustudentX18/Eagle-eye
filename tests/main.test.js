import { describe, it, expect } from 'vitest';
import { formatCoordinate, clamp } from '../src/utils.js';

describe('formatCoordinate', () => {
  it('formats a positive latitude as North', () => {
    expect(formatCoordinate(51.5074, 'lat')).toBe('51.5074° N');
  });

  it('formats a negative latitude as South', () => {
    expect(formatCoordinate(-33.8688, 'lat')).toBe('33.8688° S');
  });

  it('formats a positive longitude as East', () => {
    expect(formatCoordinate(139.6917, 'lon')).toBe('139.6917° E');
  });

  it('formats a negative longitude as West', () => {
    expect(formatCoordinate(-73.9857, 'lon')).toBe('73.9857° W');
  });
});

describe('clamp', () => {
  it('returns the value when within range', () => {
    expect(clamp(5, 0, 10)).toBe(5);
  });

  it('returns min when value is below range', () => {
    expect(clamp(-5, 0, 10)).toBe(0);
  });

  it('returns max when value is above range', () => {
    expect(clamp(15, 0, 10)).toBe(10);
  });
});
