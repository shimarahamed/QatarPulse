import { describe, expect, it } from 'vitest';
import { pickLocalizedValue } from './localize';

describe('pickLocalizedValue', () => {
  it('returns the English value when the language is English', () => {
    expect(pickLocalizedValue('en', 'Coffee Shop', 'مقهى')).toBe('Coffee Shop');
  });

  it('returns the Arabic value when the language is Arabic and it exists', () => {
    expect(pickLocalizedValue('ar', 'Coffee Shop', 'مقهى')).toBe('مقهى');
  });

  it('falls back to English when Arabic is selected but no Arabic value exists', () => {
    expect(pickLocalizedValue('ar', 'Coffee Shop', undefined)).toBe('Coffee Shop');
    expect(pickLocalizedValue('ar', 'Coffee Shop', '')).toBe('Coffee Shop');
  });
});
