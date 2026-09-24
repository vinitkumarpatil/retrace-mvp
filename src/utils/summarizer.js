/**
 * Document Summarizer
 * Generates a concise extractive summary from document text.
 * Fully local — no external API calls.
 */

/**
 * Generate a short summary from extracted document text.
 * Uses extractive summarization: picks the most informative sentences.
 *
 * @param {string} text - The full extracted text
 * @param {string} fileName - The file name for context
 * @param {string} fileType - The file type (PDF, PPTX, etc.)
 * @returns {string} A concise 2-5 sentence summary
 */
export function generateSummary(text, fileName, fileType) {
  if (!text || text.trim().length < 20) {
    return 'Unable to extract enough text from this document to generate a reliable summary.';
  }

  const cleaned = cleanText(text);
  const sentences = splitSentences(cleaned);

  if (sentences.length === 0) {
    return 'Unable to extract enough text from this document to generate a reliable summary.';
  }

  // Detect document type from content
  const docCategory = detectDocumentCategory(cleaned, fileName);

  // Score sentences by importance
  const scored = sentences.map((sentence, index) => ({
    sentence,
    score: scoreSentence(sentence, index, sentences.length, docCategory),
    index,
  }));

  // Sort by score descending
  scored.sort((a, b) => b.score - a.score);

  // Pick top 3-5 sentences, then reorder by original position
  const topCount = Math.min(Math.max(2, Math.ceil(sentences.length * 0.15)), 5);
  const topSentences = scored
    .slice(0, topCount)
    .sort((a, b) => a.index - b.index)
    .map((s) => s.sentence);

  // Build the summary with opener paragraph + bullet points
  const opener = buildOpener(docCategory, fileName, fileType);

  if (topSentences.length <= 1) {
    return `${opener}\n\n• ${topSentences[0] || ''}`;
  }

  // First sentence as context paragraph, rest as bullets
  const bullets = topSentences.map((s) => `• ${s}`).join('\n');
  return `${opener}\n\n${bullets}`;
}

/**
 * Generate a combined summary from multiple documents.
 * Used when search returns multiple relevant files.
 *
 * @param {Array<{name: string, type: string, content: string}>} docs
 * @returns {string} A concise combined summary
 */
export function generateMultiDocSummary(docs) {
  if (!docs || docs.length === 0) {
    return 'Unable to extract enough text from the documents to generate a reliable summary.';
  }

  // Filter docs with actual content
  const validDocs = docs.filter((d) => d.content && d.content.trim().length > 20);

  if (validDocs.length === 0) {
    return 'Unable to extract enough text from the documents to generate a reliable summary.';
  }

  // If only one doc has content, use single-doc summary
  if (validDocs.length === 1) {
    return generateSummary(validDocs[0].content, validDocs[0].name, validDocs[0].type);
  }

  // Build combined summary from multiple documents
  const opener = `The search matched ${validDocs.length} documents with relevant content.`;
  const bullets = [];

  for (const doc of validDocs.slice(0, 3)) {
    const cleaned = cleanText(doc.content);
    const sentences = splitSentences(cleaned);
    const docCategory = detectDocumentCategory(cleaned, doc.name);

    if (sentences.length > 0) {
      // Get top sentence from each doc
      const scored = sentences.map((sentence, index) => ({
        sentence,
        score: scoreSentence(sentence, index, sentences.length, docCategory),
        index,
      }));
      scored.sort((a, b) => b.score - a.score);

      const topSentence = scored[0].sentence;
      const typeLabel = doc.type || 'document';
      bullets.push(`• ${doc.name} (${typeLabel}): ${topSentence}`);
    }
  }

  return `${opener}\n\n${bullets.join('\n')}`;
}

function cleanText(text) {
  return text
    .replace(/\s+/g, ' ')
    .replace(/[^\S\r\n]+/g, ' ')
    .trim();
}

function splitSentences(text) {
  // Split on sentence boundaries
  const raw = text.split(/(?<=[.!?])\s+/);
  return raw
    .map((s) => s.trim())
    .filter((s) => s.length > 15 && s.length < 500)
    .filter((s) => {
      // Filter out noise: page numbers, headers, footers
      if (/^(page\s*\d+|©|\d+\s*$)/i.test(s)) return false;
      if (s.split(' ').length < 4) return false;
      return true;
    });
}

function detectDocumentCategory(text, fileName) {
  const lowerText = text.toLowerCase();
  const lowerName = fileName.toLowerCase();

  if (lowerName.includes('certificate') || lowerText.includes('certificate') || lowerText.includes('certify') || lowerText.includes('awarded to')) {
    return 'certificate';
  }
  if (lowerName.includes('syllabus') || lowerText.includes('syllabus') || lowerText.includes('curriculum') || lowerText.includes('course structure')) {
    return 'syllabus';
  }
  if (lowerText.includes('sih') || lowerText.includes('smart india hackathon') || lowerName.includes('sih')) {
    return 'project';
  }
  if (lowerName.includes('bill') || lowerName.includes('payment') || lowerName.includes('invoice') || lowerText.includes('invoice') || lowerText.includes('payment') || lowerText.includes('amount due') || lowerText.includes('total amount') || lowerText.includes('bill')) {
    return 'payment';
  }
  if (lowerName.includes('aadhaar') || lowerText.includes('aadhaar') || lowerText.includes('uidai')) {
    return 'identity';
  }
  if (lowerName.includes('pan') || lowerText.includes('permanent account number') || lowerText.includes('income tax')) {
    return 'identity';
  }
  if (lowerName.includes('.ppt') || lowerName.includes('.pptx')) {
    return 'presentation';
  }
  return 'document';
}

function scoreSentence(sentence, index, totalSentences, docCategory) {
  let score = 0;
  const lower = sentence.toLowerCase();

  // Position bonus — first and second sentences are often important
  if (index === 0) score += 3;
  if (index === 1) score += 2;
  if (index < totalSentences * 0.2) score += 1;

  // Length bonus — medium-length sentences are usually most informative
  const words = sentence.split(' ').length;
  if (words >= 8 && words <= 30) score += 2;
  if (words > 30) score += 1;

  // Keyword bonuses based on document category
  const importantTerms = {
    certificate: ['certificate', 'participation', 'awarded', 'certify', 'hackathon', 'competition', 'event', 'submission'],
    syllabus: ['syllabus', 'course', 'semester', 'subject', 'credit', 'curriculum', 'module', 'learning'],
    project: ['problem', 'solution', 'project', 'implementation', 'feature', 'technology', 'objective', 'approach'],
    payment: ['amount', 'payment', 'bill', 'total', 'date', 'invoice', 'receipt', 'transaction'],
    identity: ['name', 'number', 'government', 'issued', 'identity'],
    presentation: ['overview', 'objective', 'approach', 'solution', 'implementation'],
    document: ['important', 'document', 'information', 'details'],
  };

  const terms = importantTerms[docCategory] || importantTerms.document;
  for (const term of terms) {
    if (lower.includes(term)) score += 1.5;
  }

  // Named entity bonus (capitalized words that aren't sentence starters)
  if (index > 0) {
    const capitals = sentence.match(/[A-Z][a-z]+/g);
    if (capitals && capitals.length >= 2) score += 1;
  }

  // Number bonus — sentences with numbers often contain key facts
  if (/\d{4,}/.test(sentence)) score += 1;

  return score;
}

function buildOpener(category, fileName, fileType) {
  const typeLabel = fileType || 'document';
  switch (category) {
    case 'certificate':
      return 'This document is a certificate.';
    case 'syllabus':
      return 'This document contains an academic syllabus/curriculum.';
    case 'project':
      return 'This document describes a project proposal/presentation.';
    case 'payment':
      return 'This document contains payment or billing information.';
    case 'identity':
      return 'This is an identity/government-issued document.';
    case 'presentation':
      return 'This is a presentation document.';
    default:
      return `This ${typeLabel} contains the following information.`;
  }
}
