// src/lib/types/index.ts
// Zentrale Exports für alle TypeScript-Definitionen

// Tab-System Types
export type { Tab, TabType, ComponentRegistry, ProgramDefinition, TabManagerState } from './Tab.js';

// Drag & Drop Types
export type {
	TabTransferData,
	DragDropHandlers,
	DragState,
	DndZoneConfig,
	DropEffect
} from './DragDrop.js';

// Konstanten
export { TAB_DRAG_MIME_TYPE } from './DragDrop.js';

console.log('🔧 Types-Modul geladen - Tab und Drag&Drop-Definitionen verfügbar');
