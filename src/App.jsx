import React, { useState, useCallback, useRef } from 'react';
import Header from './components/Header';
import FolderPicker from './components/FolderPicker';
import SearchBar from './components/SearchBar';
import EvidenceResults from './components/EvidenceResults';
import DocumentViewer from './components/DocumentViewer';
import ReconstructedContext from './components/ReconstructedContext';
import { indexFolder, searchFilesContent } from './utils/fileIndexer';
import { generateSummary, generateMultiDocSummary } from './utils/summarizer';

export default function App() {
  const [indexedFiles, setIndexedFiles] = useState([]);
  const [isIndexing, setIsIndexing] = useState(false);
  const [indexProgress, setIndexProgress] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [previewFile, setPreviewFile] = useState(null);
  const [summary, setSummary] = useState('');
  const [isReconstructing, setIsReconstructing] = useState(false);
  const searchTimerRef = useRef(null);

  // Handle folder selection — indexes files and extracts content
  const handleFolderSelected = useCallback(async (dirHandle) => {
    setIsIndexing(true);
    setIndexProgress(null);
    setSearchQuery('');
    setSearchResults([]);
    setHasSearched(false);
    setPreviewFile(null);
    setSummary('');

    try {
      const files = await indexFolder(dirHandle, (progress) => {
        setIndexProgress(progress);
      });
      setIndexedFiles(files);
    } catch (err) {
      console.error('Indexing failed:', err);
    } finally {
      setIsIndexing(false);
      setIndexProgress(null);
    }
  }, []);

  // Handle search — uses content-based search
  const handleSearch = useCallback(() => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      setHasSearched(false);
      return;
    }
    const results = searchFilesContent(indexedFiles, searchQuery);
    setSearchResults(results);
    setHasSearched(true);
    setSummary('');
  }, [indexedFiles, searchQuery]);

  // Handle query change — input updates instantly, search is deferred
  const handleQueryChange = useCallback(
    (value) => {
      setSearchQuery(value);
      setSummary('');

      // Cancel any pending search
      if (searchTimerRef.current) {
        clearTimeout(searchTimerRef.current);
      }

      // Defer the expensive content search so the input renders instantly
      searchTimerRef.current = setTimeout(() => {
        if (value.trim()) {
          const results = searchFilesContent(indexedFiles, value);
          setSearchResults(results);
          setHasSearched(true);
        } else {
          setSearchResults([]);
          setHasSearched(false);
        }
      }, 150);
    },
    [indexedFiles]
  );

  // Handle opening a file in the inline preview
  const handlePreview = useCallback((file) => {
    setPreviewFile(file);
  }, []);

  // Handle closing the inline preview
  const handleClosePreview = useCallback(() => {
    setPreviewFile(null);
  }, []);

  // Handle Reconstruct the Context — supports multiple documents
  const handleReconstruct = useCallback(async () => {
    if (searchResults.length === 0) return;

    setIsReconstructing(true);
    setSummary('');

    try {
      let generatedSummary;

      if (searchResults.length === 1) {
        // Single document reconstruction
        const targetFile = searchResults[0];
        generatedSummary = generateSummary(
          targetFile.content || '',
          targetFile.name,
          targetFile.type
        );
      } else {
        // Multi-document reconstruction
        const docs = searchResults.slice(0, 3).map((file) => ({
          name: file.name,
          type: file.type,
          content: file.content || '',
        }));
        generatedSummary = generateMultiDocSummary(docs);
      }

      // Small delay so the user sees the "analyzing" state
      await new Promise((resolve) => setTimeout(resolve, 600));

      setSummary(generatedSummary);
    } catch (err) {
      console.error('Reconstruction failed:', err);
      setSummary('Unable to extract enough text from this document to generate a reliable summary.');
    } finally {
      setIsReconstructing(false);
    }
  }, [searchResults]);

  const filesReady = indexedFiles.length > 0;

  return (
    <div className="app">
      <Header />

      <main className="main">
        {/* Hero */}
        <section className="hero">
          <h2 className="hero-title">Recover the context behind a decision.</h2>
          <p className="hero-desc">
            ReTrace connects documents and evidence to explain what happened,
            why it happened, and what the available evidence says.
          </p>
        </section>

        {/* Folder Picker */}
        <FolderPicker
          onFolderSelected={handleFolderSelected}
          fileCount={indexedFiles.length}
          isIndexing={isIndexing}
          indexProgress={indexProgress}
        />

        {/* Stacked workspace: Search → Evidence → Context */}
        {filesReady && (
          <div className="workspace">
            <SearchBar
              query={searchQuery}
              onQueryChange={handleQueryChange}
              onSearch={handleSearch}
              onReconstruct={handleReconstruct}
              hasResults={searchResults.length > 0}
              isReconstructing={isReconstructing}
              disabled={!filesReady}
            />

            {/* Search Results */}
            {hasSearched && (
              <EvidenceResults
                results={searchResults}
                onOpenFile={handlePreview}
                query={searchQuery}
                activeFile={previewFile}
              />
            )}

            {/* Reconstructed Context */}
            <ReconstructedContext
              summary={summary}
              isLoading={isReconstructing}
            />
          </div>
        )}

        {/* Browser support notice */}
        {!window.showDirectoryPicker && (
          <div className="browser-notice">
            <p>
              <strong>Note:</strong> This app requires a Chromium-based browser
              (Chrome, Edge) for the folder selection feature.
            </p>
          </div>
        )}
      </main>

      {/* Document Viewer Overlay — rendered at page level above everything */}
      {previewFile && (
        <DocumentViewer
          file={previewFile}
          onClose={handleClosePreview}
        />
      )}

      <footer className="footer">
        <p>ReTrace — Lost Context Recovery Engine</p>
      </footer>
    </div>
  );
}
