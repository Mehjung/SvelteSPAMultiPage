// src/lib/types/DragDrop.ts
// TypeScript-Definitionen für Drag & Drop-Funktionalität

/**
 * MIME-Type für Tab-Übertragung zwischen Fenstern (F17)
 */
export const TAB_DRAG_MIME_TYPE = 'application/x-svelte-tab';

/**
 * Tab-Daten für DataTransfer (F18)
 * Diese Struktur wird als JSON übertragen
 */
export interface TabTransferData {
	/** Tab-ID für Identifikation */
	id: string;

	/** Komponententyp des Tabs */
	type: string;

	/** Titel des Tabs */
	title: string;

	/** Quell-Fenster-ID (für Debugging) */
	sourceWindowId?: string;
}

/**
 * Drag & Drop Event-Handler-Types
 */
export interface DragDropHandlers {
	/** Handler für dragstart-Event */
	onDragStart?: (event: DragEvent, tabId: string) => void;

	/** Handler für dragend-Event (F19) */
	onDragEnd?: (event: DragEvent, tabId: string) => void;

	/** Handler für dragover-Event */
	onDragOver?: (event: DragEvent) => void;

	/** Handler für drop-Event (F20) */
	onDrop?: (event: DragEvent) => void;
}

/**
 * Drag-Zustand für visuelles Feedback
 */
export interface DragState {
	/** Wird gerade ein Tab gezogen? */
	isDragging: boolean;

	/** ID des gezogenen Tabs */
	draggedTabId: string | null;

	/** Ist die aktuelle Zone eine gültige Drop-Zone? */
	isValidDropZone: boolean;
}

/**
 * Konfiguration für svelte-dnd-action (F16)
 */
export interface DndZoneConfig {
	/** Eindeutige ID für die DnD-Zone */
	id: string;

	/** Typ der Items in dieser Zone */
	type: string;

	/** Soll Drag-Handle verwendet werden? */
	dragHandle?: boolean;

	/** Animationsdauer in ms */
	flipDurationMs?: number;
}

/**
 * Drop-Effekt-Types für externe Drops (F19)
 */
export type DropEffect = 'none' | 'copy' | 'link' | 'move';

console.log('🎯 Drag&Drop-Definitionen geladen - DataTransfer und Event-Types bereit');
