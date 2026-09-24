import React from 'react';

/**
 * Renders structured summary text with paragraphs and bullet points.
 * Lines starting with "•" become list items; others become paragraphs.
 */
function FormattedSummary({ text }) {
  if (!text) return null;

  const lines = text.split('\n').filter((l) => l.trim().length > 0);
  const elements = [];
  let bulletBuffer = [];

  const flushBullets = () => {
    if (bulletBuffer.length > 0) {
      elements.push(
        <ul key={`ul-${elements.length}`} className="context-bullets">
          {bulletBuffer.map((b, i) => (
            <li key={i}>{b}</li>
          ))}
        </ul>
      );
      bulletBuffer = [];
    }
  };

  for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed.startsWith('•')) {
      bulletBuffer.push(trimmed.replace(/^•\s*/, ''));
    } else {
      flushBullets();
      elements.push(
        <p key={`p-${elements.length}`} className="context-paragraph">
          {trimmed}
        </p>
      );
    }
  }
  flushBullets();

  return <>{elements}</>;
}

export default function ReconstructedContext({ summary, isLoading, isEmpty }) {
  return (
    <section className="context-section">
      <h2 className="section-title">Reconstructed Context</h2>
      {isLoading ? (
        <div className="context-loading">
          <span className="spinner" />
          <p>Extracting and analyzing document content...</p>
        </div>
      ) : summary ? (
        <div className="context-card">
          <div className="context-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#e8913a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
              <polyline points="14 2 14 8 20 8"/>
              <line x1="16" y1="13" x2="8" y2="13"/>
              <line x1="16" y1="17" x2="8" y2="17"/>
              <polyline points="10 9 9 9 8 9"/>
            </svg>
          </div>
          <div className="context-body">
            <FormattedSummary text={summary} />
          </div>
        </div>
      ) : (
        <div className="context-placeholder">
          <div className="context-placeholder-icon">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#d0d5dd" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
              <polyline points="14 2 14 8 20 8"/>
              <line x1="16" y1="13" x2="8" y2="13"/>
              <line x1="16" y1="17" x2="8" y2="17"/>
            </svg>
          </div>
          <p className="context-placeholder-text">
            Search for evidence and click<br />
            <strong>Reconstruct the Context</strong><br />
            to see the AI-generated summary here.
          </p>
        </div>
      )}
    </section>
  );
}
