import React from 'react';

const formatProgress = (value) => String(value).padStart(2, '0');

export function ChapterCard({ chapter, onPrevious, onNext, motionState = '', direction = 'next', ariaHidden = false }) {
  return (
    <article
      className={`chapter-card${motionState ? ` chapter-card--${motionState}` : ''}`}
      aria-labelledby={ariaHidden ? undefined : `chapter-${chapter.number}-title`}
      aria-hidden={ariaHidden || undefined}
      data-direction={direction}
    >
      <header className="chapter-card__meta">
        <span>CHAPTER {chapter.number}</span>
        <span className="chapter-card__divider" aria-hidden="true" />
        <span>{formatProgress(chapter.number)}/{formatProgress(chapter.total)}</span>
      </header>

      <div className="chapter-card__image-wrap">
        <img
          className="chapter-card__image"
          src={chapter.image}
          alt={chapter.imageAlt}
          width="1440"
          height="1440"
          loading="lazy"
          decoding="async"
          style={{ objectPosition: chapter.imagePosition ?? 'center' }}
        />
      </div>

      <div className="chapter-card__story">
        <h2 id={ariaHidden ? undefined : `chapter-${chapter.number}-title`} className="chapter-card__title">
          {chapter.title}
        </h2>
        <div className="chapter-card__copy">
          {chapter.paragraphs.map((paragraph, index) => (
            <p key={`${chapter.number}-${index}`}>{paragraph}</p>
          ))}
        </div>
      </div>

      {(onPrevious || onNext) && (
        <nav className="chapter-card__navigation" aria-label="Chapter navigation">
          {onPrevious ? (
            <button type="button" onClick={onPrevious} aria-label="Previous chapter">
              <span aria-hidden="true">←</span> PREVIOUS
            </button>
          ) : <span />}
          {onNext && (
            <button type="button" onClick={onNext} aria-label="Next chapter">
              NEXT CHAPTER <span aria-hidden="true">→</span>
            </button>
          )}
        </nav>
      )}
    </article>
  );
}
