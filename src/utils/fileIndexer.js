/**
 * File Indexer — scans a local folder selected via the File System Access API,
 * extracts document content, and builds a searchable index.
 */
import { extractPdfText } from './pdfExtractor';
import { extractPptxText } from './pptExtractor';

const IMAGE_EXTENSIONS = ['jpg', 'jpeg', 'png', 'webp', 'gif', 'bmp', 'tiff', 'tif', 'svg'];

/**
 * Recursively reads all files from a directory handle,
 * then extracts text content from supported file types.
 * Returns an array of { name, path, type, handle, extension, content }
 */
export async function indexFolder(directoryHandle, onProgress) {
  const files = [];
  await scanDirectory(directoryHandle, '', files);

  // Extract content from each file
  const total = files.length;
  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    if (onProgress) {
      onProgress({ current: i + 1, total, fileName: file.name, phase: 'extracting' });
    }

    try {
      const arrayBuffer = await readFileAsArrayBuffer(file.handle);

      if (file.extension === 'pdf') {
        const result = await extractPdfText(arrayBuffer);
        file.content = result.text || '';
      } else if (file.extension === 'pptx' || file.extension === 'ppt') {
        const result = await extractPptxText(arrayBuffer);
        file.content = result.fullText || '';
      } else if (IMAGE_EXTENSIONS.includes(file.extension)) {
        // Try OCR for images using Tesseract.js
        file.content = await ocrImageSafe(arrayBuffer);
      } else {
        // Try to read as plain text
        try {
          const decoder = new TextDecoder('utf-8');
          const text = decoder.decode(arrayBuffer);
          // Only keep if it looks like real text (not binary garbage)
          if (text && /^[\x20-\x7E\r\n\t]{20,}/m.test(text.substring(0, 500))) {
            file.content = text;
          } else {
            file.content = '';
          }
        } catch {
          file.content = '';
        }
      }
    } catch (err) {
      console.warn(`Content extraction failed for ${file.name}:`, err);
      file.content = '';
    }
  }

  return files;
}

/**
 * Attempt OCR on an image using Tesseract.js with a timeout.
 * Returns extracted text or empty string on failure.
 */
async function ocrImageSafe(arrayBuffer) {
  try {
    const blob = new Blob([arrayBuffer]);
    const url = URL.createObjectURL(blob);

    const ocrPromise = (async () => {
      const Tesseract = await import('tesseract.js');
      const { data } = await Tesseract.default.recognize(url, 'eng');
      return data.text || '';
    })();

    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(() => reject(new Error('OCR timeout')), 20000)
    );

    const result = await Promise.race([ocrPromise, timeoutPromise]);
    URL.revokeObjectURL(url);
    return result;
  } catch {
    return '';
  }
}

async function scanDirectory(dirHandle, currentPath, files) {
  for await (const entry of dirHandle.values()) {
    const entryPath = currentPath ? `${currentPath}/${entry.name}` : entry.name;

    if (entry.kind === 'file') {
      const extension = getExtension(entry.name);
      const fileType = classifyFile(extension);

      files.push({
        name: entry.name,
        path: entryPath,
        extension,
        type: fileType,
        handle: entry,
        content: '', // will be filled during content extraction
      });
    } else if (entry.kind === 'directory') {
      await scanDirectory(entry, entryPath, files);
    }
  }
}

function getExtension(filename) {
  const parts = filename.split('.');
  if (parts.length < 2) return '';
  return parts.pop().toLowerCase();
}

function classifyFile(extension) {
  const types = {
    pdf: 'PDF',
    ppt: 'PPT',
    pptx: 'PPTX',
    doc: 'DOC',
    docx: 'DOCX',
    xls: 'XLS',
    xlsx: 'XLSX',
    txt: 'TXT',
    jpg: 'Image',
    jpeg: 'Image',
    png: 'Image',
    webp: 'Image',
    gif: 'Image',
    bmp: 'Image',
    tiff: 'Image',
    tif: 'Image',
    svg: 'Image',
    csv: 'CSV',
  };
  return types[extension] || extension.toUpperCase() || 'Unknown';
}

/**
 * Content-based search — searches file name, path, AND extracted content.
 * Returns results ranked by relevance, each with a snippet.
 */
export function searchFilesContent(files, query) {
  if (!query || !query.trim()) return [];

  const q = query.trim().toLowerCase();
  const terms = q.split(/\s+/).filter((t) => t.length > 0);

  const scored = files.map((file) => {
    const nameTarget = `${file.name} ${file.path}`.toLowerCase();
    const contentTarget = (file.content || '').toLowerCase();

    let score = 0;
    let snippet = '';

    // Full query match in filename — strongest signal
    if (nameTarget.includes(q)) score += 20;

    // Full query match in content — strong signal
    if (contentTarget.includes(q)) {
      score += 15;
      snippet = extractSnippet(file.content, q);
    }

    // Individual term matches
    for (const term of terms) {
      if (nameTarget.includes(term)) score += 5;
      if (contentTarget.includes(term)) {
        score += 3;
        if (!snippet) {
          snippet = extractSnippet(file.content, term);
        }
      }
    }

    return { ...file, score, snippet };
  });

  return scored
    .filter((f) => f.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 6);
}

/**
 * Extract a short text snippet around the first occurrence of a match.
 */
function extractSnippet(content, term) {
  if (!content) return '';
  const lower = content.toLowerCase();
  const idx = lower.indexOf(term.toLowerCase());
  if (idx === -1) return '';

  const start = Math.max(0, idx - 80);
  const end = Math.min(content.length, idx + term.length + 80);
  let snippet = content.substring(start, end).trim().replace(/\s+/g, ' ');

  if (start > 0) snippet = '...' + snippet;
  if (end < content.length) snippet = snippet + '...';

  return snippet;
}

/**
 * Legacy filename-only search (kept for backward compatibility).
 */
export function searchFiles(files, query) {
  if (!query || !query.trim()) return [];

  const q = query.trim().toLowerCase();
  const terms = q.split(/\s+/);

  return files.filter((file) => {
    const searchTarget = `${file.name} ${file.path}`.toLowerCase();
    return terms.every((term) => searchTarget.includes(term));
  });
}

/**
 * Read a file's contents as an ArrayBuffer.
 */
export async function readFileAsArrayBuffer(fileHandle) {
  const file = await fileHandle.getFile();
  return await file.arrayBuffer();
}

/**
 * Read a file's contents as a Blob URL (for viewers).
 */
export async function readFileAsBlobUrl(fileHandle) {
  const file = await fileHandle.getFile();
  return URL.createObjectURL(file);
}

/**
 * Check if a file extension is a browser-viewable image.
 */
export function isImageExtension(extension) {
  return IMAGE_EXTENSIONS.includes(extension);
}
