# Parkinson's Metabolic Atlas — Frontend

A React web application for exploring Parkinson's Disease (PD) metabolomics literature through a conversational search interface and an interactive 3D neuroanatomical atlas. The frontend communicates with the RAG pipeline backend over a REST API and renders evidence-grounded, citation-backed responses alongside a standardized brain model.

This repository contains the client application only. The retrieval-augmented generation (RAG) backend is maintained in a separate repository (see [Related Repositories](#related-repositories)).

## Overview

The interface provides three independent services over the same knowledge base:

- **Conversational search** — A natural language query interface that returns generated responses with inline DOI citations and the supporting source documents.
- **Neurometabolic atlas** — An interactive 3D brain model built on the FreeSurfer `fsaverage` template with Desikan-Killiany cortical parcellation. Selecting a metabolite highlights the associated cortical and subcortical regions and streams a description generated from the knowledge base.
- **Keyword search** — A direct full-text search across the knowledge base that returns matching literature chunks without invoking the language generation layer.

## Getting Started

Clone the repository and install dependencies:

```bash
git clone <repository-url>
cd <repository-directory>
npm install
```

Start the development server:

```bash
npm run dev
```

The application will be available at `http://localhost:5173`

## Configuration

The frontend requires the base URL of the RAG backend. This is provided through an environment variable at the project root:

```
VITE_API_BASE_URL=http://localhost:8000
```

## Available Scripts

- `npm run dev` — start the local development server.

## Backend Integration

The client consumes the following backend endpoints. The chat and atlas endpoints return streamed responses, which the interface appends to the active view in real time as tokens arrive.

| Method | Route | Purpose |
| ------ | ----- | ------- |
| POST | `/api/chat` | Streams RAG-generated responses to research queries. |
| POST | `/api/atlas-describe` | Streams neuroanatomical metabolite descriptions for the atlas. |
| POST | `/api/auth/login` | Validates administrative credentials. |
| GET | `/api/dashboard/stats` | Statistics on number of papers, chunks, and full text count. |
| GET | `/api/dashboard/keywords` | Most frequent keywords found in knowledge base. |
| GET | `/api/search` | Top-10 papers which contain a given keyword via Full-Text Search. |

## Project Structure

```
src/
  components/       Reusable UI components
  pages/            Conversational search, atlas, and keyword search views
  data/             Metabolite mapping in JSON format
  assets/           Static assets, including the brain model (.glb)
  App.jsx
  main.jsx
public/
```

## Deployment

Run the application:

```bash
npm run dev
```

## Related Repositories

- **Backend (RAG pipeline)** — https://github.com/pilarbourg/tfg-backend.git

## Acknowledgements

Developed as part of the Trabajo Fin de Grado (TFG) at CEU San Pablo University.