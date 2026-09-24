import React from 'react';

export default function FolderPicker({ onFolderSelected, fileCount, isIndexing, indexProgress }) {
  const handleSelectFolder = async () => {
    try {
      // Use the File System Access API
      const dirHandle = await window.showDirectoryPicker({ mode: 'read' });
      onFolderSelected(dirHandle);
    } catch (err) {
      // User cancelled the picker
      if (err.name !== 'AbortError') {
        console.error('Folder selection error:', err);
      }
    }
  };

  return (
    <section className="folder-picker-section">
      <h2 className="section-title">Add Evidence Folder</h2>
      <p className="section-desc">
        Select a folder containing your documents to begin analysis.
      </p>
      <div className="folder-picker-row">
        <button
          className="btn-primary"
          onClick={handleSelectFolder}
          disabled={isIndexing}
        >
          {isIndexing ? (
            <>
              <span className="spinner" /> Indexing...
            </>
          ) : (
            <>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/>
              </svg>
              Select Folder
            </>
          )}
        </button>
        {isIndexing && indexProgress && (
          <span className="indexing-progress">
            Extracting {indexProgress.current}/{indexProgress.total}: {indexProgress.fileName}
          </span>
        )}
        {!isIndexing && fileCount > 0 && (
          <span className="file-count-badge">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12"/>
            </svg>
            {fileCount} evidence file{fileCount !== 1 ? 's' : ''} indexed
          </span>
        )}
      </div>
    </section>
  );
}
