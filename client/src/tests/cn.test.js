import { describe, it, expect } from 'vitest';
import { cn } from '../utils/cn';

describe('cn (class name utility)', () => {
  it('should return a single class name unchanged', () => {
    expect(cn('text-red-500')).toBe('text-red-500');
  });

  it('should merge multiple class names', () => {
    expect(cn('text-sm', 'font-bold')).toBe('text-sm font-bold');
  });

  it('should handle conditional class names (truthy)', () => {
    expect(cn('base', true && 'active')).toBe('base active');
  });

  it('should handle conditional class names (falsy)', () => {
    expect(cn('base', false && 'active')).toBe('base');
  });

  it('should handle undefined and null gracefully', () => {
    expect(cn('base', undefined, null)).toBe('base');
  });

  it('should resolve Tailwind conflicts (last class wins)', () => {
    // tailwind-merge should resolve conflicting classes
    const result = cn('text-red-500', 'text-blue-500');
    expect(result).toBe('text-blue-500');
  });

  it('should handle object syntax from clsx', () => {
    expect(cn({ 'font-bold': true, 'text-sm': false })).toBe('font-bold');
  });

  it('should handle array syntax from clsx', () => {
    expect(cn(['text-sm', 'font-bold'])).toBe('text-sm font-bold');
  });

  it('should handle empty input', () => {
    expect(cn()).toBe('');
  });

  it('should deduplicate tailwind size classes', () => {
    const result = cn('p-2', 'p-4');
    expect(result).toBe('p-4');
  });
});
