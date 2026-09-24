/**
 * PDF Text Extractor using pdf.js
 * Extracts text content from PDF files entirely in the browser.
 */
import * as pdfjsLib from 'pdfjs-dist';

// Set up the worker
pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.js',
  import.meta.url
).toString();

/**
 * Extract all text from a PDF ArrayBuffer.
 * Returns { text, pageCount, success }
 */
export async function extractPdfText(arrayBuffer) {
  try {
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
    const pageCount = pdf.numPages;
    let fullText = '';

    for (let i = 1; i <= pageCount; i++) {
      const page = await pdf.getPage(i);
      const textContent = await page.getTextContent();
      const pageText = textContent.items.map((item) => item.str).join(' ');
      fullText += pageText + '\n\n';
    }

    const trimmedText = fullText.trim();

    return {
      text: trimmedText,
      pageCount,
      success: trimmedText.length > 20,
    };
  } catch (error) {
    console.error('PDF extraction failed:', error);
    return {
      text: '',
      pageCount: 0,
      success: false,
      error: error.message,
    };
  }
}
