import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import RoadmapCard from '../components/roadmap/RoadmapCard';

const sampleRoadmap = {
  title: 'Frontend Development',
  slug: 'frontend-development',
  description: 'Learn modern frontend development with React and Tailwind CSS.',
  icon: 'monitor',
  category: 'frontend',
  difficulty: 'beginner',
  estimatedHours: 120,
  tags: ['html', 'css', 'javascript', 'react', 'typescript'],
};

const renderWithRouter = (ui) => render(<MemoryRouter>{ui}</MemoryRouter>);

describe('RoadmapCard', () => {
  it('should render roadmap title', () => {
    renderWithRouter(<RoadmapCard roadmap={sampleRoadmap} />);
    expect(screen.getByText('Frontend Development')).toBeInTheDocument();
  });

  it('should render roadmap description', () => {
    renderWithRouter(<RoadmapCard roadmap={sampleRoadmap} />);
    expect(screen.getByText(/Learn modern frontend/)).toBeInTheDocument();
  });

  it('should render the category', () => {
    renderWithRouter(<RoadmapCard roadmap={sampleRoadmap} />);
    expect(screen.getByText('frontend')).toBeInTheDocument();
  });

  it('should render the difficulty badge', () => {
    renderWithRouter(<RoadmapCard roadmap={sampleRoadmap} />);
    expect(screen.getByText('Beginner')).toBeInTheDocument();
  });

  it('should render estimated hours', () => {
    renderWithRouter(<RoadmapCard roadmap={sampleRoadmap} />);
    expect(screen.getByText('120h')).toBeInTheDocument();
  });

  it('should render first 3 tags', () => {
    renderWithRouter(<RoadmapCard roadmap={sampleRoadmap} />);
    expect(screen.getByText('html')).toBeInTheDocument();
    expect(screen.getByText('css')).toBeInTheDocument();
    expect(screen.getByText('javascript')).toBeInTheDocument();
  });

  it('should show +N for extra tags beyond 3', () => {
    renderWithRouter(<RoadmapCard roadmap={sampleRoadmap} />);
    // 5 tags total, show 3 + "+2"
    expect(screen.getByText('+2')).toBeInTheDocument();
  });

  it('should render a link to the roadmap', () => {
    renderWithRouter(<RoadmapCard roadmap={sampleRoadmap} />);
    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('href', `/roadmaps/${sampleRoadmap.slug}`);
  });

  it('should render "Start learning" call-to-action text', () => {
    renderWithRouter(<RoadmapCard roadmap={sampleRoadmap} />);
    expect(screen.getByText('Start learning')).toBeInTheDocument();
  });

  it('should render without tags gracefully', () => {
    const roadmapNoTags = { ...sampleRoadmap, tags: [] };
    renderWithRouter(<RoadmapCard roadmap={roadmapNoTags} />);
    expect(screen.getByText('Frontend Development')).toBeInTheDocument();
  });
});
