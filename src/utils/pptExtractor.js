/**
 * PPT/PPTX Text Extractor
 * PPTX files are ZIP archives containing XML slide data.
 * This extracts text from each slide.
 */
import JSZip from 'jszip';

/**
 * Extract text from all slides in a PPTX file.
 * Returns { slides: [{ slideNumber, text }], fullText, success }
 */
export async function extractPptxText(arrayBuffer) {
  try {
    const zip = await JSZip.loadAsync(arrayBuffer);
    const slides = [];

    // Find all slide XML files (ppt/slides/slide1.xml, slide2.xml, etc.)
    const slideFiles = Object.keys(zip.files)
      .filter((name) => /^ppt\/slides\/slide\d+\.xml$/i.test(name))
      .sort((a, b) => {
        const numA = parseInt(a.match(/slide(\d+)/)[1]);
        const numB = parseInt(b.match(/slide(\d+)/)[1]);
        return numA - numB;
      });

    for (const slidePath of slideFiles) {
      const xml = await zip.files[slidePath].async('text');
      const text = extractTextFromXml(xml);
      const slideNum = parseInt(slidePath.match(/slide(\d+)/)[1]);

      slides.push({
        slideNumber: slideNum,
        text: text.trim(),
      });
    }

    const fullText = slides.map((s) => `Slide ${s.slideNumber}:\n${s.text}`).join('\n\n');

    return {
      slides,
      fullText,
      slideCount: slides.length,
      success: fullText.trim().length > 10,
    };
  } catch (error) {
    console.error('PPTX extraction failed:', error);
    return {
      slides: [],
      fullText: '',
      slideCount: 0,
      success: false,
      error: error.message,
    };
  }
}

/**
 * Extract readable text from OOXML (PowerPoint XML).
 * Strips XML tags and extracts text runs.
 */
function extractTextFromXml(xml) {
  const texts = [];

  // Match <a:t>...</a:t> tags which contain the actual text content in OOXML
  const regex = /<a:t[^>]*>([\s\S]*?)<\/a:t>/g;
  let match;

  while ((match = regex.exec(xml)) !== null) {
    const decoded = decodeXmlEntities(match[1]);
    if (decoded.trim()) {
      texts.push(decoded);
    }
  }

  // Also try <a:fld> fields and other text containers
  const fldRegex = /<a:fld[^>]*>[\s\S]*?<a:t[^>]*>([\s\S]*?)<\/a:t>[\s\S]*?<\/a:fld>/g;
  while ((match = fldRegex.exec(xml)) !== null) {
    const decoded = decodeXmlEntities(match[1]);
    if (decoded.trim()) {
      texts.push(decoded);
    }
  }

  return texts.join(' ');
}

function decodeXmlEntities(text) {
  return text
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'");
}
