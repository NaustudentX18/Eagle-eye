import { describe, it, expect } from 'vitest';
import config from '../../src/backend/config/config.js';

describe('config', () => {
  it('has a numeric port', () => {
    expect(typeof config.port).toBe('number');
  });

  it('has a numeric wsPort', () => {
    expect(typeof config.wsPort).toBe('number');
  });

  it('has a nodeEnv string', () => {
    expect(typeof config.nodeEnv).toBe('string');
    expect(config.nodeEnv.length).toBeGreaterThan(0);
  });

  it('has a features object with boolean flags', () => {
    const { features } = config;
    expect(typeof features.cctv).toBe('boolean');
    expect(typeof features.jamming).toBe('boolean');
    expect(typeof features.blackouts).toBe('boolean');
    expect(typeof features.replay).toBe('boolean');
  });

  it('has a databaseUrl string', () => {
    expect(typeof config.databaseUrl).toBe('string');
    expect(config.databaseUrl.length).toBeGreaterThan(0);
  });
});
