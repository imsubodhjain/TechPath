import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useDebounce } from '../hooks/useDebounce';

describe('useDebounce', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should return the initial value immediately', () => {
    const { result } = renderHook(() => useDebounce('initial', 300));
    expect(result.current).toBe('initial');
  });

  it('should not update immediately after value changes', () => {
    const { result, rerender } = renderHook(({ value }) => useDebounce(value, 300), {
      initialProps: { value: 'initial' },
    });

    rerender({ value: 'updated' });

    expect(result.current).toBe('initial');
  });

  it('should update after the delay has passed', () => {
    const { result, rerender } = renderHook(({ value }) => useDebounce(value, 300), {
      initialProps: { value: 'initial' },
    });

    rerender({ value: 'updated' });

    act(() => {
      vi.advanceTimersByTime(300);
    });

    expect(result.current).toBe('updated');
  });

  it('should use default delay of 300ms', () => {
    const { result, rerender } = renderHook(({ value }) => useDebounce(value), {
      initialProps: { value: 'start' },
    });

    rerender({ value: 'end' });

    act(() => {
      vi.advanceTimersByTime(299);
    });
    expect(result.current).toBe('start');

    act(() => {
      vi.advanceTimersByTime(1);
    });
    expect(result.current).toBe('end');
  });

  it('should only apply the last value when updated multiple times within delay', () => {
    const { result, rerender } = renderHook(({ value }) => useDebounce(value, 300), {
      initialProps: { value: 'one' },
    });

    rerender({ value: 'two' });
    act(() => { vi.advanceTimersByTime(100); });

    rerender({ value: 'three' });
    act(() => { vi.advanceTimersByTime(100); });

    rerender({ value: 'four' });
    act(() => { vi.advanceTimersByTime(300); });

    expect(result.current).toBe('four');
  });

  it('should handle numeric values', () => {
    const { result, rerender } = renderHook(({ value }) => useDebounce(value, 200), {
      initialProps: { value: 0 },
    });

    rerender({ value: 42 });

    act(() => {
      vi.advanceTimersByTime(200);
    });

    expect(result.current).toBe(42);
  });

  it('should handle empty string', () => {
    const { result, rerender } = renderHook(({ value }) => useDebounce(value, 300), {
      initialProps: { value: 'search term' },
    });

    rerender({ value: '' });

    act(() => {
      vi.advanceTimersByTime(300);
    });

    expect(result.current).toBe('');
  });

  it('should clean up the timer on unmount', () => {
    const clearTimeoutSpy = vi.spyOn(globalThis, 'clearTimeout');

    const { unmount, rerender } = renderHook(({ value }) => useDebounce(value, 300), {
      initialProps: { value: 'initial' },
    });

    rerender({ value: 'updated' });
    unmount();

    expect(clearTimeoutSpy).toHaveBeenCalled();
    clearTimeoutSpy.mockRestore();
  });
});
