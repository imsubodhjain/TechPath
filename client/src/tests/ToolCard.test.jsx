import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import ToolCard from '../components/tools/ToolCard';

const sampleTool = {
  name: 'GitHub Copilot',
  slug: 'github-copilot',
  description: 'AI-powered code completion for your IDE.',
  category: 'coding',
  pricing: 'paid',
  tags: ['ai', 'coding', 'autocomplete', 'github', 'productivity'],
};

const renderWithRouter = (ui) => render(<MemoryRouter>{ui}</MemoryRouter>);

describe('ToolCard', () => {
  it('should render tool name', () => {
    renderWithRouter(<ToolCard tool={sampleTool} />);
    expect(screen.getByText('GitHub Copilot')).toBeInTheDocument();
  });

  it('should render tool description', () => {
    renderWithRouter(<ToolCard tool={sampleTool} />);
    expect(screen.getByText(/AI-powered code completion/)).toBeInTheDocument();
  });

  it('should render the category', () => {
    renderWithRouter(<ToolCard tool={sampleTool} />);
    // category appears as a span text and badge
    const categoryElements = screen.getAllByText('coding');
    expect(categoryElements.length).toBeGreaterThan(0);
  });

  it('should render the pricing badge', () => {
    renderWithRouter(<ToolCard tool={sampleTool} />);
    expect(screen.getByText('Paid')).toBeInTheDocument();
  });

  it('should render first 4 tags', () => {
    renderWithRouter(<ToolCard tool={sampleTool} />);
    expect(screen.getByText('ai')).toBeInTheDocument();
    // 'coding' appears multiple times (category + badge + tag), use getAllByText
    expect(screen.getAllByText('coding').length).toBeGreaterThan(0);
    expect(screen.getByText('autocomplete')).toBeInTheDocument();
    expect(screen.getByText('github')).toBeInTheDocument();
  });

  it('should show +N for extra tags beyond 4', () => {
    renderWithRouter(<ToolCard tool={sampleTool} />);
    // 5 tags, shows 4 + "+1"
    expect(screen.getByText('+1')).toBeInTheDocument();
  });

  it('should render a link to the tool', () => {
    renderWithRouter(<ToolCard tool={sampleTool} />);
    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('href', `/tools/${sampleTool.slug}`);
  });

  it('should render without tags gracefully', () => {
    const toolNoTags = { ...sampleTool, tags: [] };
    renderWithRouter(<ToolCard tool={toolNoTags} />);
    expect(screen.getByText('GitHub Copilot')).toBeInTheDocument();
  });

  it('should render free pricing badge', () => {
    const freeTool = { ...sampleTool, pricing: 'free' };
    renderWithRouter(<ToolCard tool={freeTool} />);
    expect(screen.getByText('Free')).toBeInTheDocument();
  });
});
