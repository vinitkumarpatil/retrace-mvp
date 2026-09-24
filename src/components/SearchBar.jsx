import React from 'react';

export default function SearchBar({
  query,
  onQueryChange,
  onSearch,
  onReconstruct,
  hasResults,
  isReconstructing,
  disabled,
}) {
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      onSearch();
    }
  };

  return (
    <section className="search-section">
      <h2 className="section-title">Search Your Evidence</h2>
      <div className="search-row">
        <div className="search-input-wrapper">
          <svg className="search-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8"/>
            <line x1="21" y1="21" x2="16.65" y2="16.65"/>
          </svg>
          <input
            className="search-input"
            type="text"
            placeholder="Search what you remember about the document..."
            value={query}
            onChange={(e) => onQueryChange(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={disabled}
          />
        </div>
        <button
          className="btn-reconstruct"
          onClick={onReconstruct}
          disabled={!hasResults || isReconstructing || disabled}
          title={!hasResults ? 'Search for a document first' : 'Reconstruct context from matching documents'}
        >
          {isReconstructing ? (
            <>
              <span className="spinner spinner-light" /> Reconstructing...
            </>
          ) : (
            <>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                <polyline points="14 2 14 8 20 8"/>
                <line x1="16" y1="13" x2="8" y2="13"/>
                <line x1="16" y1="17" x2="8" y2="17"/>
              </svg>
              Reconstruct the Context
            </>
          )}
        </button>
      </div>
    </section>
  );
}
