import React, { useState, useEffect } from 'react';
import { readFileAsBlobUrl, readFileAsArrayBuffer, isImageExtension } from '../utils/fileIndexer';
import { extractPptxText } from '../utils/pptExtractor';

export default function DocumentViewer({ file, onClose }) {
  const [blobUrl, setBlobUrl] = useState(null);
  const [pptSlides, setPptSlides] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!file) return;

    let cancelled = false;
    // Reset state when file changes
    setBlobUrl(null);
    setPptSlides(null);
    setError(null);

    async function loadDocument() {
      setLoading(true);

      try {
        const isPpt = file.extension === 'ppt' || file.extension === 'pptx';

        if (isPpt) {
          // For PPT/PPTX, extract slide text
          const arrayBuffer = await readFileAsArrayBuffer(file.handle);
          if (cancelled) return;

          const result = await extractPptxText(arrayBuffer);
          if (cancelled) return;

          if (result.success) {
            setPptSlides(result.slides);
          } else {
            setError('Could not extract slide content from this presentation.');
          }
        } else {
          // For PDFs, images, and other files — create a blob URL
          const url = await readFileAsBlobUrl(file.handle);
          if (cancelled) return;
          setBlobUrl(url);
        }
      } catch (err) {
        if (!cancelled) {
          setError('Failed to load document: ' + err.message);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    loadDocument();

    return () => {
      cancelled = true;
      if (blobUrl) URL.revokeObjectURL(blobUrl);
    };
  }, [file]);

  if (!file) return null;

  const isPdf = file.extension === 'pdf';
  const isPpt = file.extension === 'ppt' || file.extension === 'pptx';
  const isImage = isImageExtension(file.extension);

  return (
    <div className="viewer-overlay" onClick={onClose}>
      <div className="viewer-modal" onClick={(e) => e.stopPropagation()}>
        <div className="viewer-header">
          <div className="viewer-title-group">
            <h2 className="viewer-title">{file.name}</h2>
            <span className="viewer-type-badge">{file.type}</span>
          </div>
          <button className="btn-close" onClick={onClose} title="Close preview">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"/>
              <line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>

        <div className="viewer-body">
          {loading && (
            <div className="viewer-loading">
              <span className="spinner spinner-large" />
              <p>Loading document...</p>
            </div>
          )}

          {error && (
            <div className="viewer-error">
              <p>{error}</p>
            </div>
          )}

          {/* PDF Viewer */}
          {!loading && !error && isPdf && blobUrl && (
            <iframe
              className="pdf-iframe"
              src={blobUrl}
              title={file.name}
            />
          )}

          {/* Image Viewer — displayed directly, no download required */}
          {!loading && !error && isImage && blobUrl && (
            <div className="image-viewer">
              <img
                src={blobUrl}
                alt={file.name}
                className="image-preview"
              />
            </div>
          )}

          {/* PPT/PPTX Viewer */}
          {!loading && !error && isPpt && pptSlides && (
            <div className="ppt-viewer">
              {pptSlides.map((slide) => (
                <div key={slide.slideNumber} className="ppt-slide-card">
                  <div className="ppt-slide-number">Slide {slide.slideNumber}</div>
                  <div className="ppt-slide-text">
                    {slide.text || <em className="text-muted">No text content on this slide</em>}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Fallback for unsupported types */}
          {!loading && !error && !isPdf && !isPpt && !isImage && blobUrl && (
            <div className="viewer-fallback">
              <p>Preview is not available for this file type.</p>
              <a href={blobUrl} download={file.name} className="btn-primary">
                Download File
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
