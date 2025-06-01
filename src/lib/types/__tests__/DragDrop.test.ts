// src/lib/types/__tests__/DragDrop.test.ts
// Unit Tests für Drag & Drop-Type-Definitionen

import { describe, it, expect } from 'vitest';
import {
	TAB_DRAG_MIME_TYPE,
	type TabTransferData,
	type DragState,
	type DndZoneConfig
} from '../DragDrop.js';

describe('Drag & Drop Type Definitions', () => {
	it('should have correct MIME type constant', () => {
		// Test: MIME-Type für Tab-Übertragung (F17)
		expect(TAB_DRAG_MIME_TYPE).toBe('application/x-svelte-tab');
		console.log('✅ TAB_DRAG_MIME_TYPE korrekt definiert');
	});

	it('should create valid TabTransferData objects', () => {
		// Test: Tab-Daten für DataTransfer (F18)
		const transferData: TabTransferData = {
			id: 'tab-123',
			type: 'text-editor',
			title: 'Mein Editor',
			sourceWindowId: 'window-456'
		};

		expect(transferData.id).toBe('tab-123');
		expect(transferData.type).toBe('text-editor');
		expect(transferData.title).toBe('Mein Editor');
		expect(transferData.sourceWindowId).toBe('window-456');
		console.log('✅ TabTransferData-Interface funktioniert korrekt');
	});

	it('should handle optional sourceWindowId', () => {
		// Test: Optionale sourceWindowId
		const transferData: TabTransferData = {
			id: 'tab-789',
			type: 'diagram-viewer',
			title: 'Diagramm'
			// sourceWindowId ist optional
		};

		expect(transferData.sourceWindowId).toBeUndefined();
		console.log('✅ Optionale Properties funktionieren korrekt');
	});

	it('should create valid DragState objects', () => {
		// Test: Drag-Zustand für visuelles Feedback
		const dragState: DragState = {
			isDragging: true,
			draggedTabId: 'tab-active',
			isValidDropZone: false
		};

		expect(dragState.isDragging).toBe(true);
		expect(dragState.draggedTabId).toBe('tab-active');
		expect(dragState.isValidDropZone).toBe(false);
		console.log('✅ DragState-Interface funktioniert korrekt');
	});

	it('should handle null draggedTabId', () => {
		// Test: Kein aktiver Drag-Vorgang
		const dragState: DragState = {
			isDragging: false,
			draggedTabId: null,
			isValidDropZone: false
		};

		expect(dragState.isDragging).toBe(false);
		expect(dragState.draggedTabId).toBeNull();
		console.log('✅ Null-Werte in DragState funktionieren korrekt');
	});

	it('should create valid DndZoneConfig objects', () => {
		// Test: Konfiguration für svelte-dnd-action (F16)
		const config: DndZoneConfig = {
			id: 'tab-zone-1',
			type: 'tab',
			dragHandle: true,
			flipDurationMs: 300
		};

		expect(config.id).toBe('tab-zone-1');
		expect(config.type).toBe('tab');
		expect(config.dragHandle).toBe(true);
		expect(config.flipDurationMs).toBe(300);
		console.log('✅ DndZoneConfig-Interface funktioniert korrekt');
	});

	it('should handle optional DndZoneConfig properties', () => {
		// Test: Minimale DndZoneConfig
		const config: DndZoneConfig = {
			id: 'minimal-zone',
			type: 'tab'
			// dragHandle und flipDurationMs sind optional
		};

		expect(config.dragHandle).toBeUndefined();
		expect(config.flipDurationMs).toBeUndefined();
		console.log('✅ Optionale DndZoneConfig-Properties funktionieren korrekt');
	});

	it('should serialize TabTransferData to JSON', () => {
		// Test: JSON-Serialisierung für DataTransfer
		const transferData: TabTransferData = {
			id: 'json-test',
			type: 'settings',
			title: 'Einstellungen'
		};

		const json = JSON.stringify(transferData);
		const parsed = JSON.parse(json) as TabTransferData;

		expect(parsed.id).toBe(transferData.id);
		expect(parsed.type).toBe(transferData.type);
		expect(parsed.title).toBe(transferData.title);
		console.log('✅ JSON-Serialisierung funktioniert korrekt');
	});
});
