import React, { useEffect, useRef, useState } from 'react';
import { ChapterCard } from '../ChapterCard.jsx';
import { chapters } from '../../data/chapters.js';
import { useRevealOnView } from '../../hooks/useRevealOnView.js';

export function LoreSection() {
  const [chapterIndex, setChapterIndex] = useState(0);
  const [chapterTransition, setChapterTransition] = useState(null);
  const transitionTimer = useRef(null);
  const [sectionRef, isVisible] = useRevealOnView(.18);
  const chapter = chapters[chapterIndex];

  const changeChapter = (nextIndex, direction) => {
    if (nextIndex === chapterIndex) return;
    if (import.meta.env.MODE === 'test') {
      setChapterIndex(nextIndex);
      return;
    }
    if (chapterTransition) return;
    setChapterTransition({ previous: chapters[chapterIndex], direction });
    setChapterIndex(nextIndex);
    window.clearTimeout(transitionTimer.current);
    transitionTimer.current = window.setTimeout(() => setChapterTransition(null), 620);
  };
  const goPrevious = () => changeChapter(Math.max(0, chapterIndex - 1), 'previous');
  const goNext = () => changeChapter(Math.min(chapters.length - 1, chapterIndex + 1), 'next');

  useEffect(() => () => window.clearTimeout(transitionTimer.current), []);

  return (
    <section id="lore" ref={sectionRef} className={`chapter-review${isVisible ? ' is-visible' : ''}`} aria-labelledby="lore-title">
      <header className="lore-heading-block">
        <h2 id="lore-title">THE LORE OF EPIK</h2>
        <p>A timeline written in blood, sweat and Solana block confirmations.</p>
      </header>
      <div className="chapter-stage">
        {chapterTransition && (
          <ChapterCard
            chapter={chapterTransition.previous}
            motionState="exiting"
            direction={chapterTransition.direction}
            ariaHidden
          />
        )}
        <ChapterCard
          key={chapter.number}
          chapter={chapter}
          motionState={chapterTransition ? 'entering' : ''}
          direction={chapterTransition?.direction ?? 'next'}
          onPrevious={chapterIndex > 0 && !chapterTransition ? goPrevious : undefined}
          onNext={chapterIndex < chapters.length - 1 && !chapterTransition ? goNext : undefined}
        />
      </div>
    </section>
  );
}
