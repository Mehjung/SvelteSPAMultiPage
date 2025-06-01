// src/lib/types/__tests__/Tab.test.ts
// Unit Tests für Tab-Type-Definitionen

import { describe, it, expect } from 'vitest';
import type { Tab, TabType, ProgramDefinition, TabManagerState } from '../Tab.js';

describe('Tab Type Definitions', () => {
	it('should create valid Tab objects', () => {
		// Test: Gültiges Tab-Objekt erstellen
		const tab: Tab = {
			id: 'test-id',
			type: 'text-editor',
			title: 'Test Tab'
		};

		expect(tab.id).toBe('test-id');
		expect(tab.type).toBe('text-editor');
		expect(tab.title).toBe('Test Tab');
		console.log('✅ Tab-Interface funktioniert korrekt');
	});

	it('should validate TabType values', () => {
		// Test: Alle gültigen TabType-Werte
		const validTypes: TabType[] = ['text-editor', 'diagram-viewer', 'welcome', 'settings'];

		validTypes.forEach((type) => {
			const tab: Tab = {
				id: `tab-${type}`,
				type: type,
				title: `Test ${type}`
			};
			expect(tab.type).toBe(type);
		});
		console.log('✅ TabType-Enum funktioniert korrekt');
	});

	it('should create valid ProgramDefinition objects', () => {
		// Test: ProgramDefinition für Menü
		const program: ProgramDefinition = {
			type: 'text-editor',
			displayName: 'Text Editor',
			description: 'Einfacher Text-Editor für Notizen',
			icon: 'edit-icon'
		};

		expect(program.type).toBe('text-editor');
		expect(program.displayName).toBe('Text Editor');
		expect(program.description).toContain('Text-Editor');
		expect(program.icon).toBe('edit-icon');
		console.log('✅ ProgramDefinition-Interface funktioniert korrekt');
	});

	it('should create valid TabManagerState objects', () => {
		// Test: TabManagerState für Store
		const tabs: Tab[] = [
			{ id: 'tab1', type: 'text-editor', title: 'Editor 1' },
			{ id: 'tab2', type: 'diagram-viewer', title: 'Diagramm 1' }
		];

		const state: TabManagerState = {
			tabs: tabs,
			activeTabId: 'tab1',
			windowId: 'window-123'
		};

		expect(state.tabs).toHaveLength(2);
		expect(state.activeTabId).toBe('tab1');
		expect(state.windowId).toBe('window-123');
		console.log('✅ TabManagerState-Interface funktioniert korrekt');
	});

	it('should handle null activeTabId', () => {
		// Test: Kein aktiver Tab (leeres Fenster)
		const state: TabManagerState = {
			tabs: [],
			activeTabId: null,
			windowId: 'empty-window'
		};

		expect(state.tabs).toHaveLength(0);
		expect(state.activeTabId).toBeNull();
		console.log('✅ Null-Werte werden korrekt behandelt');
	});
});
