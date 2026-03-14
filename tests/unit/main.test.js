import { describe, it, expect } from 'vitest';
import { init } from '../../src/frontend/main.js';

describe('init()', () => {
  it('renders the OmniRecon shell into the provided root element', () => {
    const root = { innerHTML: '' };
    init(root);
    expect(root.innerHTML).toContain('OmniRecon');
  });
});
