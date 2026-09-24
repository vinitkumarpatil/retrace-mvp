# 🔍 ReTrace — Lost Context Recovery Engine

> *"Recover the context behind a decision."*

[![Vercel Deployment](https://img.shields.io/badge/Live%20Demo-retrace--mvp.vercel.app-2ea44f?style=for-the-badge&logo=vercel)](https://retrace-mvp.vercel.app)
[![React](https://img.shields.io/badge/React-18-blue?style=for-the-badge&logo=react)](https://react.dev)
[![Vite](https://img.shields.io/badge/Vite-5-646CFF?style=for-the-badge&logo=vite)](https://vitejs.dev)
[![Privacy First](https://img.shields.io/badge/Privacy-100%25%20Client--Side-orange?style=for-the-badge)](https://retrace-mvp.vercel.app)

---

## 🌐 Live Application

Experience ReTrace directly in your browser:

### 🔗 **[https://retrace-mvp.vercel.app](https://retrace-mvp.vercel.app)**

*(Note: Please open using a Chromium-based browser like Google Chrome, Microsoft Edge, or Brave to utilize the native File System Access API).*

---

## 💡 What is ReTrace?

When projects evolve, teams change, or time passes, the **context behind past decisions** gets buried across scattered files — PDFs, slide decks, invoices, certificates, and screenshots. People remember pieces of what happened, but finding the exact document and understanding the narrative is painful.

**ReTrace** solves this as a **Lost Context Recovery Engine**:
1. You select any local folder on your machine.
2. ReTrace indexes and extracts content across your documents directly inside your browser.
3. You search for what you remember (e.g. project codes, event names, topics).
4. ReTrace locates the **real evidence**, provides contextual snippets, opens original documents in a built-in overlay viewer, and **reconstructs the lost context** into clean, structured insights.

---

## ✨ Key Features

- **📂 Zero-Upload Folder Indexing**:
  Connects directly to your local file system using the browser's native `File System Access API`. Your files never leave your device.

- **🔎 Deep Content-Based Search**:
  Searches not only file names, but also the **extracted textual content** inside documents, ranking results by relevance.

- **📑 Multi-Format Deep Extraction**:
  - **PDFs**: Full-text extraction across pages using `pdfjs-dist`.
  - **PPT / PPTX**: Unzips slide archives via `jszip` and reads slide XML nodes directly.
  - **Images (JPG, PNG, WEBP)**: On-device OCR using `tesseract.js`.
  - **Plain Text / Code / CSV**: Native decoding and indexing.

- **🧠 AI-Style Context Reconstruction**:
  Analyzes matching documents locally using intelligent extractive summarization. Generates concise, clean, ChatGPT-style bullet points summarizing the real evidence without hallucinating or making external API calls.

- **👁️ Full-Screen Document Overlay Viewer**:
  Inspect real evidence immediately without downloading or leaving the page:
  - Interactive PDF viewing
  - Slide-by-slide presentation deck inspection
  - Direct native image viewer
  
- **🛡️ 100% Privacy & Local Processing**:
  Built specifically for sensitive documents (invoices, academic records, identity proofs). **No cloud uploads, no tracking, no backend database, no external AI calls.**

---

## 🏗️ Architecture & Pipeline

```text
 ┌────────────────────────────────────────────────────────┐
 │                   Local User Device                    │
 │                                                        │
 │   [ Local Documents Folder ]                           │
 │     ├── PDFs, PPTX, Images, Text                       │
 │               │                                        │
 │               ▼  (File System Access API)              │
 │   [ In-Browser Extractor Engine ]                      │
 │     ├── pdfjs-dist   -> Extract PDF Pages              │
 │     ├── jszip        -> Extract PPTX Slide Content     │
 │     └── tesseract.js -> Image OCR Recognition          │
 │               │                                        │
 │               ▼                                        │
 │   [ Local In-Memory Search Index ]                     │
 │     ├── Text scoring & snippet extraction              │
 │               │                                        │
 │         Query │                                        │
 │               ▼                                        │
 │   [ Context Reconstruction Engine ]                    │
 │     ├── Extractive scoring & entity detection          │
 │     └── Structured ChatGPT-style bullet breakdown      │
 │               │                                        │
 │               ▼                                        │
 │   [ Clean UI & Overlay Evidence Viewer ]               │
 └────────────────────────────────────────────────────────┘
```

---

## 🛠️ Tech Stack

- **Framework**: React 18
- **Build Tool**: Vite 5
- **Document Processing**:
  - `pdfjs-dist` (PDF parsing & rendering)
  - `jszip` (PowerPoint PPTX unpacking & XML slide reading)
  - `tesseract.js` (Client-side WebAssembly Optical Character Recognition)
- **Styling**: Modern, responsive, custom CSS design system
- **Deployment**: Vercel

---

## 🚀 Getting Started Locally

### Prerequisites

- [Node.js](https://nodejs.org/) (version 18 or newer recommended)
- A **Chromium-based browser** (Google Chrome, Microsoft Edge, Brave, Opera) supporting the File System Access API (`showDirectoryPicker`).

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/vinitkumarpatil/retrace-mvp.git
   cd retrace-mvp
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```

4. **Open in your browser:**
   Navigate to the URL displayed in your terminal (typically `http://localhost:5173` or `http://localhost:3000`).

### Production Build

To create an optimized production build:
```bash
npm run build
npm run preview
```

---

## 📖 How to Use

1. Click **Select Folder** and choose a local folder containing documents (PDFs, PPTs, images).
2. Wait a moment as ReTrace reads and indexes the content of your files locally.
3. Type any keyword or phrase you remember into the **"Search what you remember about the document..."** box.
4. Review matching files under **Real Evidence** with highlighted text snippets.
5. Click **Preview** on any result to inspect the document in the full-screen overlay.
6. Click **Reconstruct the Context** to view an AI-generated structured summary breaking down the narrative across the matched evidence.

---

## 🔒 Security & Privacy

ReTrace was designed with a privacy-by-design philosophy:
- **No data leaves your computer.**
- All parsing, OCR, indexing, and summarization run entirely inside your browser's JavaScript sandbox.
- Ideal for offline use, confidential business agreements, and personal identification documents.

---

## 👤 Author

Developed by **[Vinitkumar Patil](https://github.com/vinitkumarpatil)**.
