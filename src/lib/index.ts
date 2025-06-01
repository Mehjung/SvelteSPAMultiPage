// place files you want to import through the `$lib` alias in this folder.

// src/lib/index.ts
// Zentrale Exports für die gesamte Bibliothek

// Re-exports aller Module (werden aktiviert sobald Module implementiert sind)
// export * from './components/index.js';
// export * from './stores/index.js';
// export * from './types/index.js';
export * from './utils/index.js';

// Bestehende Utils beibehalten
export * from './utils.js';

console.log('🏗️ Lib-Hauptmodul geladen - Ordnerstruktur erstellt, bereit für Implementation');
