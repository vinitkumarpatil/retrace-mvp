import React from 'react';

const typeColors = {
  PDF: '#dc3545',
  PPTX: '#e67e22',
  PPT: '#e67e22',
  DOCX: '#2b579a',
  DOC: '#2b579a',
  XLSX: '#217346',
  XLS: '#217346',
  TXT: '#6c757d',
  Image: '#6f42c1',
  CSV: '#20c997',
};

function FileTypeIcon({ type }) {
  const color = typeColors[type] || '#6c757d';
  return (
    <div className="file-type-badge" style={{ backgroundColor: color }}>
      {type}
    </div>
  );
}

export default function EvidenceResults({ results, onOpenFile, query, activeFile }) {
  if (!query || query.trim() === '') return null;

  if (results.length === 0) {
    return (
      <section className="evidence-section">
        <h2 className="section-title">Real Evidence</h2>
        <div className="no-results">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#ccc" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8"/>
            <line x1="21" y1="21" x2="16.65" y2="16.65"/>
            <line x1="8" y1="11" x2="14" y2="11"/>
          </svg>
          <p>No matching files found for "<strong>{query}</strong>"</p>
        </div>
      </section>
    );
  }

  return (
    <section className="evidence-section">
      <h2 className="section-title">Real Evidence</h2>
      <p className="results-count">
        {results.length} file{results.length !== 1 ? 's' : ''} matching "{query}"
      </p>
      <div className="evidence-grid">
        {results.map((file, index) => {
          const isActive = activeFile && activeFile.name === file.name && activeFile.path === file.path;
          return (
            <div
              key={index}
              className={`evidence-card${isActive ? ' evidence-card-active' : ''}`}
            >
              <div className="evidence-card-header">
                <FileTypeIcon type={file.type} />
                <div className="evidence-card-info">
                  <h3 className="evidence-card-name">{file.name}</h3>
                  {file.snippet && (
                    <p className="evidence-card-snippet">"{file.snippet}"</p>
                  )}
                  {!file.snippet && (
                    <p className="evidence-card-path">{file.path}</p>
                  )}
                </div>
              </div>
              <button
                className={`btn-open${isActive ? ' btn-open-active' : ''}`}
                onClick={() => onOpenFile(file)}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                  <circle cx="12" cy="12" r="3"/>
                </svg>
                Preview
              </button>
            </div>
          );
        })}
      </div>
    </section>
  );
}
