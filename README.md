<div align="center">

# 🔍 ReTrace — Lost Context Recovery Engine

**Recover the context behind a decision.**

*ReTrace connects documents and evidence to explain what happened, why it happened, and what the available evidence says.*

[![React](https://img.shields.io/badge/React-18.2-61dafb?logo=react&logoColor=white)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-5.0-646cff?logo=vite&logoColor=white)](https://vitejs.dev/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)
[![100% Client-Side](https://img.shields.io/badge/Processing-100%25_Local-orange)](.)

</div>

---

## 🎯 Problem Statement

In any organization or personal document collection, **context gets lost over time**.

You have folders full of certificates, syllabi, invoices, project reports, identity documents — but when you need to recall *why* a particular document exists or *what decision it relates to*, you're stuck manually opening files one by one.

**ReTrace solves this.**

> *"I remember something about a hackathon certificate..."*
> ReTrace instantly finds the file, shows you the actual document, and reconstructs the context around it.

---

## 💡 What is ReTrace?

ReTrace is a **Lost Context Recovery Engine** that:

1. **Indexes** your local folder of documents (PDFs, PPTs, images, text files)
2. **Extracts text** from every file using PDF.js, JSZip, and Tesseract.js OCR
3. **Searches inside document content** — not just filenames
4. **Shows real evidence** — actual matching files with relevant content snippets
5. **Reconstructs context** — generates an AI-powered summary explaining what the documents contain
6. **Previews documents** — view PDFs, images, and PPT slides directly in the browser

### ⚡ Key Differentiator

> **100% client-side processing. Zero data leaves your browser.**

No cloud uploads. No external APIs. No API keys needed. Your sensitive documents (Aadhaar, PAN, financial records) are never sent anywhere.

---

## 🛠️ Tech Stack

| Technology | Purpose |
|:-----------|:--------|
| **React 18** | UI framework |
| **Vite 5** | Build tool & dev server |
| **PDF.js** (`pdfjs-dist`) | Extract text from PDF files locally |
| **JSZip** | Parse PPTX files (which are ZIP archives) and extract slide text |
| **Tesseract.js** | OCR — extract text from images (JPG, PNG, WEBP, etc.) |
| **File System Access API** | Access local folders directly from the browser (Chrome/Edge) |
| **Custom Extractive Summarizer** | Generate context summaries from extracted text — fully local, no LLM API |

---

## 🚀 Quick Start

### Prerequisites

- **Node.js** (v16 or higher) — [Download here](https://nodejs.org/)
- **Chromium-based browser** — Google Chrome or Microsoft Edge (required for folder access)

### Installation & Run

```bash
# 1. Clone the repository
git clone https://github.com/vinitkumarpatil/retrace-mvp.git

# 2. Navigate to the project
cd retrace-mvp

# 3. Install dependencies
npm install

# 4. Start the development server
npm run dev
```

The app will automatically open at **http://localhost:3000** in your default browser.

> ⚠️ **Important:** You MUST use **Google Chrome** or **Microsoft Edge**. Firefox and Safari do not support the File System Access API.

### Production Build

```bash
npm run build
npm run preview
```

---

## 📖 How to Use

### Step 1 — Add Evidence Folder
Click **"Select Folder"** and choose any local folder containing your documents (PDFs, PPTs, images, text files).

ReTrace will index all files and **extract text content** from each one.

### Step 2 — Search Your Evidence
Type anything you remember about a document in the search bar. Examples:

- `"hackathon certificate"`
- `"invoice payment"`
- `"semester syllabus"`
- `"Vinitkumar Patil"`

ReTrace searches **inside the document content**, not just filenames.

### Step 3 — View Real Evidence
Search results show:
- File name and type
- **Content snippet** — the actual matching text from inside the document

Click **"Preview"** to open the document in a large overlay viewer:
- **PDF** → full PDF viewer
- **Images** → direct image display (no download needed)
- **PPT/PPTX** → extracted slide content

### Step 4 — Reconstruct the Context
Click **"Reconstruct the Context"** to generate an AI-powered summary.

ReTrace analyzes the extracted text and produces a clean bullet-point summary like:

> **Reconstructed Context**
>
> This document is a certificate.
>
> • Certificate of Participation — This is to certify that Vinitkumar Jinesh Patil from JSS Science and Technology University has participated in Round 1.
> • Idea Submission of BuildForge Hackathon organised by Invoqe.

---

## 📁 Project Structure

```
retrace-mvp/
├── index.html                          # HTML entry point
├── package.json                        # Dependencies & scripts
├── vite.config.js                      # Vite configuration
├── src/
│   ├── main.jsx                        # React entry point
│   ├── App.jsx                         # Main app — layout, state, logic
│   ├── App.css                         # All styling
│   ├── components/
│   │   ├── Header.jsx                  # ReTrace logo & tagline
│   │   ├── FolderPicker.jsx            # Folder selection with progress
│   │   ├── SearchBar.jsx               # Search input + Reconstruct button
│   │   ├── EvidenceResults.jsx         # Search result cards with snippets
│   │   ├── DocumentViewer.jsx          # Overlay viewer (PDF/Image/PPT)
│   │   └── ReconstructedContext.jsx    # AI summary with bullet points
│   └── utils/
│       ├── fileIndexer.js              # Folder scanning, content extraction, search
│       ├── pdfExtractor.js             # PDF text extraction (pdf.js)
│       ├── pptExtractor.js             # PPTX text extraction (jszip)
│       └── summarizer.js              # Extractive summarizer (local AI)
```

---

## 🔑 Features

| Feature | Description |
|:--------|:-----------|
| 📂 **Local Folder Access** | Select any folder from your computer |
| 🔍 **Content-Based Search** | Search inside document text, not just filenames |
| 📄 **PDF Text Extraction** | Extracts text from all PDF pages using pdf.js |
| 📊 **PPT/PPTX Parsing** | Extracts slide text from PowerPoint files using JSZip |
| 🖼️ **Image OCR** | Reads text from images using Tesseract.js |
| 📝 **Content Snippets** | Shows relevant excerpts from matching documents |
| 👁️ **Document Preview** | View PDFs, images, PPT slides in an overlay viewer |
| 🤖 **AI Context Reconstruction** | Generates bullet-point summaries from extracted content |
| 🔒 **100% Privacy** | All processing happens locally — nothing is uploaded |
| 📱 **Responsive Design** | Works on desktop, tablet, and mobile |

---

## 🏗️ Architecture

```
User selects folder
        │
        ▼
┌─────────────────────────┐
│   File System Access API │  ← Chrome/Edge only
│   (reads local files)    │
└─────────────────────────┘
        │
        ▼
┌─────────────────────────┐
│   Content Extraction     │
│   ├── PDF → pdf.js       │
│   ├── PPTX → JSZip       │
│   ├── Images → Tesseract │
│   └── Text → TextDecoder │
└─────────────────────────┘
        │
        ▼
┌─────────────────────────┐
│   In-Memory Search Index │  ← file name + extracted text
│   (ranked by relevance)  │
└─────────────────────────┘
        │
        ▼
┌─────────────────────────┐
│   Results + Snippets     │  ← real matching files
│   + Document Preview     │  ← PDF/Image/PPT viewer
│   + Context Summary      │  ← extractive AI summary
└─────────────────────────┘
```

**No backend. No database. No cloud. Everything runs in the browser.**

---

## 🔧 Supported File Types

| File Type | Extraction Method | Preview |
|:----------|:-----------------|:--------|
| PDF | pdf.js (text layer) | ✅ Full PDF viewer |
| PPTX | JSZip + XML parsing | ✅ Slide-by-slide text |
| PPT | JSZip (if OOXML) | ✅ Slide text |
| JPG/JPEG | Tesseract.js OCR | ✅ Direct image display |
| PNG | Tesseract.js OCR | ✅ Direct image display |
| WEBP | Tesseract.js OCR | ✅ Direct image display |
| GIF/BMP/TIFF | Tesseract.js OCR | ✅ Direct image display |
| TXT/CSV/JSON/XML | TextDecoder (UTF-8) | Download |
| DOC/DOCX/XLS/XLSX | Filename search only | Download |

---

## 🧪 Testing Checklist

- [x] Select a local folder → files are indexed with progress indicator
- [x] Search by filename → matching files appear
- [x] Search by content (e.g., person's name inside a PDF) → matching files appear
- [x] Content snippets shown in search results
- [x] Click Preview on PDF → opens in overlay viewer
- [x] Click Preview on image → displays directly (no download)
- [x] Click Preview on PPTX → shows slide content
- [x] Close overlay viewer with ✕ or backdrop click
- [x] Click "Reconstruct the Context" → generates bullet-point summary
- [x] Multiple file results → combined multi-document summary
- [x] Production build passes with zero errors
- [x] Works on Chrome and Edge
- [x] Responsive layout on mobile screens

---

## 👥 Team

| Name | Role |
|:-----|:-----|
| **Vinitkumar Patil** | Developer |
| **Jinesh Patil** | Team Member |

---

## 🏆 Hackathon Context

This project was built for a hackathon to demonstrate the concept of **Lost Context Recovery** — the ability to recover the meaning and purpose behind documents that have been stored but whose context has been forgotten.

### Why it matters:
- Organizations lose institutional knowledge when people leave
- Students accumulate documents but forget what each one relates to
- Professionals need to quickly trace back decisions to their evidence

### What makes ReTrace different:
- **No cloud dependency** — works offline after first load
- **Privacy-first** — sensitive documents never leave your device
- **Real content search** — searches inside PDFs and images, not just filenames
- **Context reconstruction** — doesn't just find files, explains what they contain

---

## ⚠️ Browser Compatibility

| Browser | Supported | Why |
|:--------|:---------:|:----|
| Google Chrome | ✅ | Full File System Access API support |
| Microsoft Edge | ✅ | Chromium-based, full support |
| Firefox | ❌ | Does not support File System Access API |
| Safari | ❌ | Does not support File System Access API |

---

## 📜 License

This project is open source under the [MIT License](LICENSE).

---

<div align="center">

**Built with ❤️ for hackathon judges who want to see real innovation.**

*ReTrace — Because context should never be lost.*

</div>
