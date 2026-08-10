import React from 'react';
import { describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import { ChapterCard } from './ChapterCard.jsx';

const chapter = {
  number: 1,
  total: 7,
  image: '/chapter-01.png',
  imageAlt: 'Teh Epik Duck chapter one artwork',
  title: 'A JOKE IS BORN',
  paragraphs: [
    'In the chaotic spring of 2024, when Solana was young and memes ruled the chain, a trader known as Mando sat before a livestream. With a handful of SOL and a determined spirit, he launched what was meant to be nothing more than a joke.',
    '"Teh Epik Duck is coming."',
    'No roadmap. No promises. Just a meme released into the internet.',
    'No one expected what happened next....',
  ],
};

describe('ChapterCard', () => {
  it('renders the supplied chapter content and progress', () => {
    render(<ChapterCard chapter={chapter} />);

    expect(screen.getByText('CHAPTER 1')).toBeTruthy();
    expect(screen.getByText('01/07')).toBeTruthy();
    expect(screen.getByRole('heading', { name: 'A JOKE IS BORN' })).toBeTruthy();
    expect(screen.getByAltText(chapter.imageAlt)).toBeTruthy();
    chapter.paragraphs.forEach((paragraph) => {
      expect(screen.getByText(paragraph)).toBeTruthy();
    });
  });

  it('exposes enabled navigation callbacks only when provided', () => {
    const onNext = vi.fn();
    const { rerender } = render(<ChapterCard chapter={chapter} onNext={onNext} />);

    expect(screen.queryByRole('button', { name: /previous chapter/i })).toBeNull();
    fireEvent.click(screen.getByRole('button', { name: /next chapter/i }));
    expect(onNext).toHaveBeenCalledOnce();

    rerender(<ChapterCard chapter={chapter} />);
    expect(screen.queryByRole('button', { name: /next chapter/i })).toBeNull();
  });
});
