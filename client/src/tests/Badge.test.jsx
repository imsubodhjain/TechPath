import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Badge, PricingBadge, DifficultyBadge } from '../components/ui/Badge';

describe('Badge', () => {
  it('should render children text', () => {
    render(<Badge>Hello</Badge>);
    expect(screen.getByText('Hello')).toBeInTheDocument();
  });

  it('should render as a span element', () => {
    render(<Badge>Tag</Badge>);
    const el = screen.getByText('Tag');
    expect(el.tagName.toLowerCase()).toBe('span');
  });

  it('should apply default variant classes', () => {
    render(<Badge>Default</Badge>);
    const el = screen.getByText('Default');
    expect(el.className).toContain('bg-slate-100');
  });

  it('should apply primary variant classes', () => {
    render(<Badge variant="primary">Primary</Badge>);
    const el = screen.getByText('Primary');
    expect(el.className).toContain('bg-indigo-100');
  });

  it('should apply additional className', () => {
    render(<Badge className="custom-class">Custom</Badge>);
    const el = screen.getByText('Custom');
    expect(el.className).toContain('custom-class');
  });
});

describe('PricingBadge', () => {
  it('should render "Free" label for free pricing', () => {
    render(<PricingBadge pricing="free" />);
    expect(screen.getByText('Free')).toBeInTheDocument();
  });

  it('should render "Freemium" label for freemium pricing', () => {
    render(<PricingBadge pricing="freemium" />);
    expect(screen.getByText('Freemium')).toBeInTheDocument();
  });

  it('should render "Paid" label for paid pricing', () => {
    render(<PricingBadge pricing="paid" />);
    expect(screen.getByText('Paid')).toBeInTheDocument();
  });

  it('should render "Open Source" label for open-source pricing', () => {
    render(<PricingBadge pricing="open-source" />);
    expect(screen.getByText('Open Source')).toBeInTheDocument();
  });

  it('should render nothing for unknown pricing', () => {
    const { container } = render(<PricingBadge pricing="unknown" />);
    expect(container).toBeEmptyDOMElement();
  });
});

describe('DifficultyBadge', () => {
  it('should render "Beginner" for beginner difficulty', () => {
    render(<DifficultyBadge difficulty="beginner" />);
    expect(screen.getByText('Beginner')).toBeInTheDocument();
  });

  it('should render "Intermediate" for intermediate difficulty', () => {
    render(<DifficultyBadge difficulty="intermediate" />);
    expect(screen.getByText('Intermediate')).toBeInTheDocument();
  });

  it('should render "Advanced" for advanced difficulty', () => {
    render(<DifficultyBadge difficulty="advanced" />);
    expect(screen.getByText('Advanced')).toBeInTheDocument();
  });

  it('should capitalize the first letter', () => {
    render(<DifficultyBadge difficulty="beginner" />);
    const el = screen.getByText('Beginner');
    expect(el.textContent).toBe('Beginner');
  });
});
