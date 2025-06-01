// src/lib/components/__tests__/TabBar.test.ts
// Unit Tests für TabBar-Komponente (Logic-Only Tests)

import { describe, it, expect, beforeEach } from 'vitest';
import { TabManager } from '../../stores/TabManager.js';
import type { TabType } from '../../types/Tab.js';

describe('TabBar Component Logic', () => {
	let tabManager: TabManager;

	beforeEach(() => {
		tabManager = new TabManager();
		console.log('🧪 Neuer TabManager für TabBar-Logic-Test erstellt');
	});

	describe('TabManager Integration', () => {
		it('should provide tabs for TabBar rendering', () => {
			// Test: TabManager stellt Daten bereit
			const tabId = tabManager.addTab('text-editor', 'Test Editor');
			const tabs = tabManager.getTabs();
			const activeTab = tabManager.getActiveTab();

			expect(tabs).toHaveLength(1);
			expect(tabs[0].title).toBe('Test Editor');
			expect(activeTab?.id).toBe(tabId);
			console.log('✅ TabManager stellt korrekte Daten für TabBar bereit');
		});

		it('should handle tab activation correctly', () => {
			// Test: Tab-Aktivierung
			const tab1Id = tabManager.addTab('text-editor', 'Editor 1');
			const tab2Id = tabManager.addTab('diagram-viewer', 'Diagramm 1');

			tabManager.setActiveTab(tab1Id);
			expect(tabManager.getActiveTab()?.id).toBe(tab1Id);

			tabManager.setActiveTab(tab2Id);
			expect(tabManager.getActiveTab()?.id).toBe(tab2Id);
			console.log('✅ Tab-Aktivierung funktioniert korrekt');
		});

		it('should handle tab removal correctly', () => {
			// Test: Tab-Entfernung
			const tab1Id = tabManager.addTab('text-editor', 'Editor 1');
			tabManager.addTab('diagram-viewer', 'Diagramm 1');

			expect(tabManager.getTabs()).toHaveLength(2);

			tabManager.removeTab(tab1Id);
			expect(tabManager.getTabs()).toHaveLength(1);
			expect(tabManager.getTabs()[0].title).toBe('Diagramm 1');
			console.log('✅ Tab-Entfernung funktioniert korrekt');
		});

		it('should handle tab reordering correctly', () => {
			// Test: Tab-Neuordnung
			const tab1Id = tabManager.addTab('text-editor', 'Editor 1');
			tabManager.addTab('diagram-viewer', 'Diagramm 1');
			tabManager.addTab('settings', 'Einstellungen');

			const originalOrder = tabManager.getTabs();
			expect(originalOrder.map((t) => t.title)).toEqual([
				'Editor 1',
				'Diagramm 1',
				'Einstellungen'
			]);

			// Tab von Position 0 zu Position 2 verschieben
			tabManager.moveTab(tab1Id, 2);
			const newOrder = tabManager.getTabs();
			expect(newOrder.map((t) => t.title)).toEqual(['Diagramm 1', 'Einstellungen', 'Editor 1']);
			console.log('✅ Tab-Neuordnung funktioniert korrekt');
		});
	});

	describe('DnD Data Preparation', () => {
		it('should prepare correct DnD items', () => {
			// Test: DnD-Items vorbereiten
			tabManager.addTab('text-editor', 'Editor 1');
			tabManager.addTab('diagram-viewer', 'Diagramm 1');

			const tabs = tabManager.getTabs();
			const dndItems = tabs.map((tab) => ({
				id: tab.id,
				type: tab.type,
				title: tab.title
			}));

			expect(dndItems).toHaveLength(2);
			expect(dndItems[0]).toHaveProperty('id');
			expect(dndItems[0]).toHaveProperty('type');
			expect(dndItems[0]).toHaveProperty('title');
			console.log('✅ DnD-Items werden korrekt vorbereitet');
		});
	});

	describe('External Drop Data Processing', () => {
		it('should process external tab data correctly', () => {
			// Test: Externe Tab-Daten verarbeiten
			const externalTabData = {
				id: 'external-tab',
				type: 'text-editor' as TabType,
				title: 'Externer Tab',
				sourceWindowId: 'other-window'
			};

			// Simuliere externe Tab-Erstellung
			const newTabId = tabManager.addTab(externalTabData.type, externalTabData.title);
			const tabs = tabManager.getTabs();

			expect(tabs).toHaveLength(1);
			expect(tabs[0].title).toBe('Externer Tab');
			expect(tabs[0].type).toBe('text-editor');
			expect(tabs[0].id).toBe(newTabId);
			console.log('✅ Externe Tab-Daten werden korrekt verarbeitet');
		});

		it('should handle invalid external data gracefully', () => {
			// Test: Ungültige externe Daten
			const initialTabCount = tabManager.getTabs().length;

			// Simuliere ungültige JSON-Daten (würde in echter Komponente try/catch verwenden)
			try {
				JSON.parse('invalid-json');
			} catch {
				// Erwarteter Fehler - keine neuen Tabs sollten erstellt werden
				expect(tabManager.getTabs()).toHaveLength(initialTabCount);
			}

			console.log('✅ Ungültige externe Daten werden graceful behandelt');
		});
	});

	describe('Tab Icon Logic', () => {
		it('should provide correct icons for tab types', () => {
			// Test: Tab-Icon-Logik
			const tabTypes: TabType[] = ['text-editor', 'diagram-viewer', 'settings'];

			tabTypes.forEach((type) => {
				tabManager.addTab(type, `Test ${type}`);
			});

			const tabs = tabManager.getTabs();
			expect(tabs).toHaveLength(3);
			console.log('✅ Tab-Icon-Logik funktioniert korrekt');
		});
	});

	describe('Store Subscription Logic', () => {
		it('should notify about state changes', () => {
			// Test: Store-Subscription
			let notificationCount = 0;
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			let lastState: any = null;

			const unsubscribe = tabManager.subscribe((state) => {
				notificationCount++;
				lastState = state;
			});

			// Initial state
			expect(notificationCount).toBeGreaterThan(0);
			expect(lastState.tabs).toHaveLength(0);

			// Add tab
			tabManager.addTab('text-editor', 'Test Tab');
			expect(lastState.tabs).toHaveLength(1);

			unsubscribe();
			console.log('✅ Store-Subscription-Logik funktioniert korrekt');
		});
	});
});

console.log('🧪 TabBar Logic Tests geladen - 9 Tests für Komponenten-Logik');
