import { describe, it, expect } from 'vitest';
import {
  ROADMAP_CATEGORIES,
  TOOL_CATEGORIES,
  PRICING_OPTIONS,
  DIFFICULTY_COLORS,
} from '../utils/constants';

describe('ROADMAP_CATEGORIES', () => {
  it('should be a non-empty array', () => {
    expect(Array.isArray(ROADMAP_CATEGORIES)).toBe(true);
    expect(ROADMAP_CATEGORIES.length).toBeGreaterThan(0);
  });

  it('should contain expected categories', () => {
    const values = ROADMAP_CATEGORIES.map((c) => c.value);
    expect(values).toContain('frontend');
    expect(values).toContain('backend');
    expect(values).toContain('fullstack');
    expect(values).toContain('devops');
    expect(values).toContain('data-science');
    expect(values).toContain('ai-ml');
    expect(values).toContain('mobile');
    expect(values).toContain('cybersecurity');
    expect(values).toContain('cloud');
  });

  it('each category should have value and label', () => {
    ROADMAP_CATEGORIES.forEach((cat) => {
      expect(cat).toHaveProperty('value');
      expect(cat).toHaveProperty('label');
      expect(typeof cat.value).toBe('string');
      expect(typeof cat.label).toBe('string');
    });
  });
});

describe('TOOL_CATEGORIES', () => {
  it('should be a non-empty array', () => {
    expect(Array.isArray(TOOL_CATEGORIES)).toBe(true);
    expect(TOOL_CATEGORIES.length).toBeGreaterThan(0);
  });

  it('should contain expected categories', () => {
    const values = TOOL_CATEGORIES.map((c) => c.value);
    expect(values).toContain('coding');
    expect(values).toContain('design');
    expect(values).toContain('writing');
    expect(values).toContain('productivity');
    expect(values).toContain('chatbot');
  });

  it('each category should have value and label', () => {
    TOOL_CATEGORIES.forEach((cat) => {
      expect(cat).toHaveProperty('value');
      expect(cat).toHaveProperty('label');
    });
  });
});

describe('PRICING_OPTIONS', () => {
  it('should be a non-empty array', () => {
    expect(Array.isArray(PRICING_OPTIONS)).toBe(true);
    expect(PRICING_OPTIONS.length).toBeGreaterThan(0);
  });

  it('should contain free, freemium, paid, and open-source options', () => {
    const values = PRICING_OPTIONS.map((p) => p.value);
    expect(values).toContain('free');
    expect(values).toContain('freemium');
    expect(values).toContain('paid');
    expect(values).toContain('open-source');
  });

  it('each option should have value, label, and color', () => {
    PRICING_OPTIONS.forEach((option) => {
      expect(option).toHaveProperty('value');
      expect(option).toHaveProperty('label');
      expect(option).toHaveProperty('color');
      expect(typeof option.color).toBe('string');
    });
  });
});

describe('DIFFICULTY_COLORS', () => {
  it('should be an object', () => {
    expect(typeof DIFFICULTY_COLORS).toBe('object');
  });

  it('should have beginner, intermediate, and advanced keys', () => {
    expect(DIFFICULTY_COLORS).toHaveProperty('beginner');
    expect(DIFFICULTY_COLORS).toHaveProperty('intermediate');
    expect(DIFFICULTY_COLORS).toHaveProperty('advanced');
  });

  it('each difficulty should be a non-empty string', () => {
    ['beginner', 'intermediate', 'advanced'].forEach((level) => {
      expect(typeof DIFFICULTY_COLORS[level]).toBe('string');
      expect(DIFFICULTY_COLORS[level].length).toBeGreaterThan(0);
    });
  });
});
