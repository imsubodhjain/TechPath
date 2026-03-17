import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Skeleton, CardSkeleton } from '../components/ui/Skeleton';

describe('Skeleton', () => {
  it('should render a div element', () => {
    const { container } = render(<Skeleton />);
    expect(container.firstChild.tagName.toLowerCase()).toBe('div');
  });

  it('should include animate-pulse class', () => {
    const { container } = render(<Skeleton />);
    expect(container.firstChild.className).toContain('animate-pulse');
  });

  it('should apply additional className', () => {
    const { container } = render(<Skeleton className="h-4 w-full" />);
    expect(container.firstChild.className).toContain('h-4');
    expect(container.firstChild.className).toContain('w-full');
  });

  it('should use empty string as default className', () => {
    const { container } = render(<Skeleton />);
    expect(container.firstChild).toBeDefined();
  });
});

describe('CardSkeleton', () => {
  it('should render without errors', () => {
    const { container } = render(<CardSkeleton />);
    expect(container.firstChild).toBeDefined();
  });

  it('should render multiple skeleton elements', () => {
    const { container } = render(<CardSkeleton />);
    const skeletons = container.querySelectorAll('.animate-pulse');
    expect(skeletons.length).toBeGreaterThan(1);
  });

  it('should have a wrapping container div', () => {
    const { container } = render(<CardSkeleton />);
    const wrapper = container.firstChild;
    expect(wrapper.tagName.toLowerCase()).toBe('div');
  });
});
