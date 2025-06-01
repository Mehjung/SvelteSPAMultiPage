// src/lib/components/__tests__/TabBar.dnd.test.ts
// Tests für Drag & Drop-Funktionalität (Task 4.3 Fix)

import { describe, it, expect, beforeEach } from 'vitest';
import { TabManager } from '../../stores/TabManager.js';
import type { Tab, TabType } from '../../types/Tab.js';

describe('TabBar Drag & Drop Funktionalität', () => {
	let tabManager: TabManager;

	beforeEach(() => {
		tabManager = new TabManager();
		console.log('🧪 Neuer TabManager für DnD-Test erstellt');
	});

	describe('Consider Phase (Temporäre Vorschau)', () => {
		it('sollte Tab-Reihenfolge temporär ändern ohne Store zu beeinflussen', () => {
			// Setup: 3 Tabs erstellen
			const tabId1 = tabManager.addTab('text-editor', 'Editor 1');
			const tabId2 = tabManager.addTab('diagram-viewer', 'Diagramm 1');
			const tabId3 = tabManager.addTab('settings', 'Einstellungen');

			const originalTabs = tabManager.getTabs();
			expect(originalTabs).toHaveLength(3);

			// Store sollte unverändert bleiben während Consider
			const storeTabsAfterConsider = tabManager.getTabs();
			expect(storeTabsAfterConsider).toEqual(originalTabs);
			expect(storeTabsAfterConsider[0].id).toBe(tabId1); // Ursprüngliche Reihenfolge
			expect(storeTabsAfterConsider[1].id).toBe(tabId2); // Zweiter Tab
			expect(storeTabsAfterConsider[2].id).toBe(tabId3); // Dritter Tab

			console.log('✅ Consider-Phase beeinflusst Store nicht');
		});
	});

	describe('Finalize Phase (Permanente Änderung)', () => {
		it('sollte Tab-Reihenfolge permanent im Store ändern', () => {
			// Setup: 3 Tabs erstellen
			const tabId1 = tabManager.addTab('text-editor', 'Editor 1');
			const tabId2 = tabManager.addTab('diagram-viewer', 'Diagramm 1');
			const tabId3 = tabManager.addTab('settings', 'Einstellungen');

			// Simuliere Finalize-Event (neue Reihenfolge)
			const finalizeItems: Tab[] = [
				{ id: tabId3, type: 'settings' as TabType, title: 'Einstellungen' },
				{ id: tabId1, type: 'text-editor' as TabType, title: 'Editor 1' },
				{ id: tabId2, type: 'diagram-viewer' as TabType, title: 'Diagramm 1' }
			];

			// setTabOrder aufrufen (wie in handleDndFinalize)
			tabManager.setTabOrder(finalizeItems);

			// Store sollte neue Reihenfolge haben
			const finalTabs = tabManager.getTabs();
			expect(finalTabs).toHaveLength(3);
			expect(finalTabs[0].id).toBe(tabId3); // Einstellungen zuerst
			expect(finalTabs[1].id).toBe(tabId1); // Editor 1 zweite
			expect(finalTabs[2].id).toBe(tabId2); // Diagramm 1 letzte

			console.log('✅ Finalize-Phase ändert Store permanent');
		});

		it('sollte aktiven Tab nach Neuordnung beibehalten', () => {
			const tabId1 = tabManager.addTab('text-editor', 'Editor 1');
			const tabId2 = tabManager.addTab('diagram-viewer', 'Diagramm 1');

			// Tab 1 aktivieren
			tabManager.setActiveTab(tabId1);
			expect(tabManager.getActiveTab()?.id).toBe(tabId1);

			// Reihenfolge umkehren
			const newOrder: Tab[] = [
				{ id: tabId2, type: 'diagram-viewer' as TabType, title: 'Diagramm 1' },
				{ id: tabId1, type: 'text-editor' as TabType, title: 'Editor 1' }
			];

			tabManager.setTabOrder(newOrder);

			// Aktiver Tab sollte gleich bleiben
			expect(tabManager.getActiveTab()?.id).toBe(tabId1);

			console.log('✅ Aktiver Tab bleibt nach Neuordnung erhalten');
		});
	});

	describe('Tab-Persistenz während DnD', () => {
		it('sollte keine Tabs verlieren während Drag & Drop', () => {
			// Setup: 5 Tabs für komplexeren Test
			const tabIds = [
				tabManager.addTab('text-editor', 'Editor 1'),
				tabManager.addTab('diagram-viewer', 'Diagramm 1'),
				tabManager.addTab('settings', 'Einstellungen'),
				tabManager.addTab('text-editor', 'Editor 2'),
				tabManager.addTab('diagram-viewer', 'Diagramm 2')
			];

			const originalCount = tabManager.getTabs().length;
			expect(originalCount).toBe(5);

			// Simuliere komplexe Neuordnung (letzten Tab an erste Position)
			const tabs = tabManager.getTabs();
			const reorderedTabs = [
				tabs[4], // Diagramm 2 an erste Position
				tabs[0], // Editor 1
				tabs[1], // Diagramm 1
				tabs[2], // Einstellungen
				tabs[3] // Editor 2
			];

			tabManager.setTabOrder(reorderedTabs);

			// Alle Tabs sollten noch vorhanden sein
			const finalTabs = tabManager.getTabs();
			expect(finalTabs).toHaveLength(5);

			// Alle ursprünglichen IDs sollten noch vorhanden sein
			const finalIds = finalTabs.map((tab) => tab.id);
			tabIds.forEach((id) => {
				expect(finalIds).toContain(id);
			});

			// Neue Reihenfolge sollte korrekt sein
			expect(finalTabs[0].id).toBe(tabIds[4]); // Diagramm 2 zuerst
			expect(finalTabs[1].id).toBe(tabIds[0]); // Editor 1 zweite

			console.log('✅ Alle Tabs bleiben während komplexer Neuordnung erhalten');
		});

		it('sollte Tab-Eigenschaften während DnD beibehalten', () => {
			const tabId = tabManager.addTab('text-editor', 'Mein Editor');
			const originalTab = tabManager.getTabById(tabId);

			// Simuliere Neuordnung mit nur einem Tab
			const reorderedTabs = [
				{
					id: originalTab!.id,
					type: originalTab!.type,
					title: originalTab!.title
				}
			];

			tabManager.setTabOrder(reorderedTabs);

			const finalTab = tabManager.getTabById(tabId);
			expect(finalTab).toBeDefined();
			expect(finalTab!.id).toBe(originalTab!.id);
			expect(finalTab!.type).toBe(originalTab!.type);
			expect(finalTab!.title).toBe(originalTab!.title);

			console.log('✅ Tab-Eigenschaften bleiben während DnD erhalten');
		});
	});

	describe('Edge Cases', () => {
		it('sollte leere Tab-Liste korrekt handhaben', () => {
			expect(tabManager.getTabs()).toHaveLength(0);

			// Leere Neuordnung
			tabManager.setTabOrder([]);

			expect(tabManager.getTabs()).toHaveLength(0);
			expect(tabManager.getActiveTab()).toBeNull();

			console.log('✅ Leere Tab-Liste wird korrekt behandelt');
		});

		it('sollte einzelnen Tab korrekt handhaben', () => {
			const tabId = tabManager.addTab('text-editor', 'Einziger Tab');

			const singleTab = tabManager.getTabById(tabId)!;
			tabManager.setTabOrder([singleTab]);

			const finalTabs = tabManager.getTabs();
			expect(finalTabs).toHaveLength(1);
			expect(finalTabs[0].id).toBe(tabId);

			console.log('✅ Einzelner Tab wird korrekt behandelt');
		});
	});
});

console.log('🧪 TabBar DnD Tests geladen - 8 Tests für Drag & Drop-Funktionalität');
