import { describe, expect, it } from 'vitest';
import { getLangFromSearchParam, t } from '../lib/i18n';

describe('i18n helpers', () => {
  it('returns english by default', () => {
    expect(getLangFromSearchParam(undefined)).toBe('en');
  });

  it('returns arabic when requested', () => {
    expect(getLangFromSearchParam('ar')).toBe('ar');
  });

  it('translates based on language', () => {
    expect(t('en', 'Hello', 'مرحبا')).toBe('Hello');
    expect(t('ar', 'Hello', 'مرحبا')).toBe('مرحبا');
  });
});
