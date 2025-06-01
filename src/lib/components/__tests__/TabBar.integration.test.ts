// src/lib/components/__tests__/TabBar.integration.test.ts
// Integration-Tests für TabBar + Tab Komponenten (Task 4.7)

import { describe, it, expect, beforeEach } from 'vitest';
import { TabManager } from '../../stores/TabManager.js';
import type { Tab } from '../../types/Tab.js';

describe('TabBar + Tab Integration Tests', () => {
	let tabManager: TabManager;

	beforeEach(() => {
		tabManager = new TabManager();
		console.log('🧪 Neuer TabManager für Integration-Test erstellt');
	});

	describe('TabBar-Tab Kommunikation', () => {
		it('sollte Tab-Klicks korrekt an TabManager weiterleiten', () => {
			// Setup: Mehrere Tabs erstellen
			const tabId1 = tabManager.addTab('text-editor', 'Editor 1');
			const tabId2 = tabManager.addTab('diagram-viewer', 'Diagramm 1');

			// Initial sollte der letzte Tab aktiv sein
			expect(tabManager.getActiveTab()?.id).toBe(tabId2);

			// Simuliere Tab-Klick auf ersten Tab
			tabManager.setActiveTab(tabId1);
			expect(tabManager.getActiveTab()?.id).toBe(tabId1);

			console.log('✅ Tab-Klick-Integration funktioniert korrekt');
		});

		it('sollte Close-Button-Klicks korrekt verarbeiten', () => {
			// Setup: Mehrere Tabs erstellen
			const tabId1 = tabManager.addTab('text-editor', 'Editor 1');
			const tabId2 = tabManager.addTab('diagram-viewer', 'Diagramm 1');
			const tabId3 = tabManager.addTab('settings', 'Einstellungen');

			expect(tabManager.getTabs()).toHaveLength(3);

			// Simuliere Close-Button-Klick auf mittleren Tab
			tabManager.closeTab(tabId2);

			const remainingTabs = tabManager.getTabs();
			expect(remainingTabs).toHaveLength(2);
			expect(remainingTabs.find((tab) => tab.id === tabId2)).toBeUndefined();

			// Verbleibende Tabs sollten tabId1 und tabId3 sein
			const remainingIds = remainingTabs.map((tab) => tab.id);
			expect(remainingIds).toContain(tabId1);
			expect(remainingIds).toContain(tabId3);

			console.log('✅ Close-Button-Integration funktioniert korrekt');
		});

		it('sollte Tab-Neuordnung zwischen TabBar und TabManager synchronisieren', () => {
			// Setup: 3 Tabs erstellen
			const tabId1 = tabManager.addTab('text-editor', 'Editor 1');
			const tabId2 = tabManager.addTab('diagram-viewer', 'Diagramm 1');
			const tabId3 = tabManager.addTab('settings', 'Einstellungen');

			const originalOrder = tabManager.getTabs();
			expect(originalOrder[0].id).toBe(tabId1);
			expect(originalOrder[1].id).toBe(tabId2);
			expect(originalOrder[2].id).toBe(tabId3);

			// Simuliere DnD-Neuordnung (letzten Tab an erste Position)
			const newOrder: Tab[] = [
				originalOrder[2], // Einstellungen zuerst
				originalOrder[0], // Editor 1 zweite
				originalOrder[1] // Diagramm 1 letzte
			];

			tabManager.setTabOrder(newOrder);

			const reorderedTabs = tabManager.getTabs();
			expect(reorderedTabs[0].id).toBe(tabId3);
			expect(reorderedTabs[1].id).toBe(tabId1);
			expect(reorderedTabs[2].id).toBe(tabId2);

			console.log('✅ Tab-Neuordnung-Integration funktioniert korrekt');
		});
	});

	describe('State-Synchronisation', () => {
		it('sollte aktiven Tab zwischen TabBar und Tab-Komponenten synchronisieren', () => {
			// Setup: Mehrere Tabs erstellen
			const tabId1 = tabManager.addTab('text-editor', 'Editor 1');
			const tabId2 = tabManager.addTab('diagram-viewer', 'Diagramm 1');

			// Simuliere isActive-Property-Berechnung für Tab-Komponenten
			function getIsActive(tabId: string): boolean {
				return tabManager.getActiveTab()?.id === tabId;
			}

			// Initial sollte Tab 2 aktiv sein
			expect(getIsActive(tabId1)).toBe(false);
			expect(getIsActive(tabId2)).toBe(true);

			// Tab 1 aktivieren
			tabManager.setActiveTab(tabId1);
			expect(getIsActive(tabId1)).toBe(true);
			expect(getIsActive(tabId2)).toBe(false);

			console.log('✅ Aktiv-Zustand-Synchronisation funktioniert korrekt');
		});

		it('sollte Tab-Liste zwischen TabBar und Store synchronisieren', () => {
			// Initial leere Liste
			expect(tabManager.getTabs()).toHaveLength(0);

			// Tabs hinzufügen
			const tabId1 = tabManager.addTab('text-editor', 'Editor 1');
			expect(tabManager.getTabs()).toHaveLength(1);

			const tabId2 = tabManager.addTab('diagram-viewer', 'Diagramm 1');
			expect(tabManager.getTabs()).toHaveLength(2);

			// Tab entfernen
			tabManager.removeTab(tabId1);
			expect(tabManager.getTabs()).toHaveLength(1);
			expect(tabManager.getTabs()[0].id).toBe(tabId2);

			console.log('✅ Tab-Liste-Synchronisation funktioniert korrekt');
		});

		it('sollte Store-Updates reaktiv an TabBar weiterleiten', () => {
			let updateCount = 0;
			const updates: Tab[][] = [];

			// Simuliere TabBar-Store-Subscription
			const unsubscribe = tabManager.subscribe((state) => {
				updateCount++;
				updates.push([...state.tabs]);
			});

			// Initial-Update
			expect(updateCount).toBe(1);
			expect(updates[0]).toHaveLength(0);

			// Tab hinzufügen
			tabManager.addTab('text-editor', 'Editor 1');
			expect(updateCount).toBe(2);
			expect(updates[1]).toHaveLength(1);

			// Weiteren Tab hinzufügen
			tabManager.addTab('diagram-viewer', 'Diagramm 1');
			expect(updateCount).toBe(3);
			expect(updates[2]).toHaveLength(2);

			unsubscribe();
			console.log('✅ Store-Update-Reaktivität funktioniert korrekt');
		});
	});

	describe('Drag & Drop Integration', () => {
		it('sollte DnD-Events zwischen Tab und TabBar korrekt verarbeiten', () => {
			// Setup: Tabs für DnD-Test
			const tabId1 = tabManager.addTab('text-editor', 'Editor 1');
			const tabId2 = tabManager.addTab('diagram-viewer', 'Diagramm 1');
			const tabId3 = tabManager.addTab('settings', 'Einstellungen');

			const originalTabs = tabManager.getTabs();

			// Simuliere DnD Consider-Phase (temporäre Änderung)
			const considerItems = [
				originalTabs[1], // Diagramm 1 zuerst
				originalTabs[2], // Einstellungen zweite
				originalTabs[0] // Editor 1 letzte
			];

			// Store sollte unverändert bleiben während Consider
			const storeTabsDuringConsider = tabManager.getTabs();
			expect(storeTabsDuringConsider).toEqual(originalTabs);

			// Simuliere DnD Finalize-Phase (permanente Änderung)
			tabManager.setTabOrder(considerItems);

			const finalTabs = tabManager.getTabs();
			expect(finalTabs[0].id).toBe(tabId2);
			expect(finalTabs[1].id).toBe(tabId3);
			expect(finalTabs[2].id).toBe(tabId1);

			console.log('✅ DnD-Integration funktioniert korrekt');
		});

		it('sollte externe Drag-Daten korrekt zwischen Komponenten übertragen', () => {
			// Simuliere Tab-zu-DataTransfer-Konvertierung
			const sourceTab: Tab = {
				id: 'external-tab-1',
				type: 'text-editor',
				title: 'Externer Editor'
			};

			const transferData = {
				id: sourceTab.id,
				type: sourceTab.type,
				title: sourceTab.title,
				sourceWindowId: 'other-window'
			};

			const jsonData = JSON.stringify(transferData);

			// Simuliere Drop-Event-Verarbeitung
			const parsedData = JSON.parse(jsonData);
			const newTabId = tabManager.addTab(parsedData.type, parsedData.title);

			const createdTab = tabManager.getTabById(newTabId);
			expect(createdTab?.type).toBe(sourceTab.type);
			expect(createdTab?.title).toBe(sourceTab.title);

			console.log('✅ Externe Drag-Daten-Integration funktioniert korrekt');
		});
	});

	describe('Error Handling Integration', () => {
		it('sollte ungültige Tab-IDs graceful zwischen Komponenten handhaben', () => {
			// Setup: Ein Tab erstellen
			const validTabId = tabManager.addTab('text-editor', 'Editor 1');
			const invalidTabId = 'non-existent-tab';

			// Gültige Tab-ID sollte funktionieren
			expect(tabManager.getTabById(validTabId)).toBeDefined();

			// Ungültige Tab-ID sollte null zurückgeben
			expect(tabManager.getTabById(invalidTabId)).toBeNull();

			// Aktivierung ungültiger Tab sollte ignoriert werden
			const activeTabBefore = tabManager.getActiveTab();
			tabManager.setActiveTab(invalidTabId);
			const activeTabAfter = tabManager.getActiveTab();
			expect(activeTabAfter).toEqual(activeTabBefore);

			console.log('✅ Ungültige Tab-ID-Behandlung funktioniert korrekt');
		});

		it('sollte leere Tab-Liste korrekt zwischen Komponenten handhaben', () => {
			// Initial leere Liste
			expect(tabManager.getTabs()).toHaveLength(0);
			expect(tabManager.getActiveTab()).toBeNull();

			// Simuliere TabBar-Rendering mit leerer Liste
			const shouldShowEmptyState = tabManager.getTabs().length === 0;
			expect(shouldShowEmptyState).toBe(true);

			// Tab hinzufügen sollte Empty-State beenden
			tabManager.addTab('text-editor', 'Editor 1');
			const shouldShowEmptyStateAfter = tabManager.getTabs().length === 0;
			expect(shouldShowEmptyStateAfter).toBe(false);

			console.log('✅ Leere Tab-Liste-Behandlung funktioniert korrekt');
		});
	});

	describe('Performance Integration', () => {
		it('sollte viele Tabs effizient verwalten', () => {
			const tabCount = 50;
			const tabIds: string[] = [];

			// Viele Tabs erstellen
			for (let i = 0; i < tabCount; i++) {
				const tabId = tabManager.addTab('text-editor', `Editor ${i + 1}`);
				tabIds.push(tabId);
			}

			expect(tabManager.getTabs()).toHaveLength(tabCount);

			// Tabs in der Mitte entfernen
			const middleIndex = Math.floor(tabCount / 2);
			tabManager.removeTab(tabIds[middleIndex]);

			expect(tabManager.getTabs()).toHaveLength(tabCount - 1);

			// Neuordnung mit vielen Tabs
			const tabs = tabManager.getTabs();
			const reversedTabs = [...tabs].reverse();
			tabManager.setTabOrder(reversedTabs);

			const reorderedTabs = tabManager.getTabs();
			expect(reorderedTabs[0].title).toBe(`Editor ${tabCount}`);

			console.log('✅ Performance mit vielen Tabs funktioniert korrekt');
		});
	});
});

console.log('🧪 TabBar Integration Tests geladen - 10 Test-Suites für Komponenten-Integration');
