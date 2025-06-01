// src/lib/stores/__tests__/TabManager.test.ts
// Tests für TabManager Store-Funktionalität (F6, F7, F8)

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { TabManager } from '../TabManager.js';
import type { TabManagerState } from '../../types/Tab.js';

describe('TabManager Store', () => {
	let tabManager: TabManager;

	beforeEach(() => {
		tabManager = new TabManager();
	});

	describe('Initialisierung', () => {
		it('sollte mit leerem Zustand starten', () => {
			const tabs = tabManager.getTabs();
			const activeTab = tabManager.getActiveTab();

			expect(tabs).toEqual([]);
			expect(activeTab).toBeNull();
		});

		it('sollte eindeutige Fenster-ID haben', () => {
			const windowId = tabManager.getWindowId();
			expect(windowId).toBeTruthy();
			expect(typeof windowId).toBe('string');
		});

		it('sollte verschiedene Fenster-IDs für verschiedene Instanzen haben', () => {
			const tabManager2 = new TabManager();

			expect(tabManager.getWindowId()).not.toBe(tabManager2.getWindowId());
		});
	});

	describe('addTab', () => {
		it('sollte neuen Tab hinzufügen', () => {
			const tabId = tabManager.addTab('text-editor', 'Mein Editor');
			const tabs = tabManager.getTabs();

			expect(tabs).toHaveLength(1);
			expect(tabs[0].id).toBe(tabId);
			expect(tabs[0].type).toBe('text-editor');
			expect(tabs[0].title).toBe('Mein Editor');
		});

		it('sollte neuen Tab automatisch aktivieren', () => {
			const tabId = tabManager.addTab('text-editor', 'Mein Editor');
			const activeTab = tabManager.getActiveTab();

			expect(activeTab?.id).toBe(tabId);
		});

		it('sollte mehrere Tabs hinzufügen können', () => {
			tabManager.addTab('text-editor', 'Editor 1');
			tabManager.addTab('diagram-viewer', 'Diagramm 1');
			tabManager.addTab('settings', 'Einstellungen');

			const tabs = tabManager.getTabs();
			expect(tabs).toHaveLength(3);
		});

		it('sollte eindeutige IDs für jeden Tab generieren', () => {
			const id1 = tabManager.addTab('text-editor', 'Editor 1');
			const id2 = tabManager.addTab('text-editor', 'Editor 2');

			expect(id1).not.toBe(id2);
		});
	});

	describe('removeTab', () => {
		it('sollte Tab erfolgreich entfernen', () => {
			const tabId1 = tabManager.addTab('text-editor', 'Editor 1');
			const tabId2 = tabManager.addTab('diagram-viewer', 'Diagramm 1');

			tabManager.removeTab(tabId1);

			const tabs = tabManager.getTabs();
			expect(tabs).toHaveLength(1);
			expect(tabs[0].id).toBe(tabId2);
		});

		it('sollte aktiven Tab korrekt wechseln beim Entfernen', () => {
			const tabId1 = tabManager.addTab('text-editor', 'Editor 1');
			const tabId2 = tabManager.addTab('diagram-viewer', 'Diagramm 1');

			// Tab 1 ist aktiv, entferne ihn
			tabManager.setActiveTab(tabId1);
			tabManager.removeTab(tabId1);

			// Tab 2 sollte jetzt aktiv sein
			expect(tabManager.getActiveTab()?.id).toBe(tabId2);
		});

		it('sollte activeTabId auf null setzen wenn letzter Tab entfernt wird', () => {
			const tabId = tabManager.addTab('text-editor', 'Editor 1');
			tabManager.removeTab(tabId);

			expect(tabManager.getActiveTab()).toBeNull();
		});

		it('sollte Warnung loggen bei nicht existierendem Tab', () => {
			const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

			tabManager.removeTab('non-existent-id');

			expect(consoleSpy).toHaveBeenCalledWith(
				'⚠️ Tab für Entfernung nicht gefunden: non-existent-id'
			);
			consoleSpy.mockRestore();
		});
	});

	describe('closeTab', () => {
		it('sollte Tab schließen (Alias für removeTab)', () => {
			const tabId1 = tabManager.addTab('text-editor', 'Editor 1');
			const tabId2 = tabManager.addTab('diagram-viewer', 'Diagramm 1');

			tabManager.closeTab(tabId1);

			const tabs = tabManager.getTabs();
			expect(tabs).toHaveLength(1);
			expect(tabs[0].id).toBe(tabId2);
		});

		it('sollte Debug-Log ausgeben beim Schließen', () => {
			const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {});

			const tabId = tabManager.addTab('text-editor', 'Test Editor');
			tabManager.closeTab(tabId);

			expect(consoleSpy).toHaveBeenCalledWith(
				expect.stringContaining('🗑️ Tab wird geschlossen: Test Editor')
			);

			consoleSpy.mockRestore();
		});
	});

	describe('moveTab', () => {
		it('sollte Tab-Position erfolgreich ändern', () => {
			const tabId1 = tabManager.addTab('text-editor', 'Editor 1');
			const tabId2 = tabManager.addTab('diagram-viewer', 'Diagramm 1');
			const tabId3 = tabManager.addTab('settings', 'Einstellungen');

			// Verschiebe Tab 3 an Position 0
			tabManager.moveTab(tabId3, 0);

			const tabs = tabManager.getTabs();
			expect(tabs[0].id).toBe(tabId3);
			expect(tabs[1].id).toBe(tabId1);
			expect(tabs[2].id).toBe(tabId2);
		});

		it('sollte Warnung bei ungültigem Tab loggen', () => {
			const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

			tabManager.moveTab('non-existent-id', 0);

			expect(consoleSpy).toHaveBeenCalledWith(
				'⚠️ Tab für Verschiebung nicht gefunden: non-existent-id'
			);
			consoleSpy.mockRestore();
		});

		it('sollte Warnung bei ungültigem Index loggen', () => {
			const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
			const tabId = tabManager.addTab('text-editor', 'Editor 1');

			tabManager.moveTab(tabId, 5);

			expect(consoleSpy).toHaveBeenCalledWith('⚠️ Ungültiger Index für Tab-Verschiebung: 5');
			consoleSpy.mockRestore();
		});
	});

	describe('setActiveTab', () => {
		it('sollte Tab erfolgreich aktivieren', () => {
			const tabId1 = tabManager.addTab('text-editor', 'Editor 1');
			tabManager.addTab('diagram-viewer', 'Diagramm 1');

			tabManager.setActiveTab(tabId1);

			expect(tabManager.getActiveTab()?.id).toBe(tabId1);
		});

		it('sollte Warnung bei nicht existierendem Tab loggen', () => {
			const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

			tabManager.setActiveTab('non-existent-id');

			expect(consoleSpy).toHaveBeenCalledWith(
				'⚠️ Tab für Aktivierung nicht gefunden: non-existent-id'
			);
			consoleSpy.mockRestore();
		});
	});

	describe('Getter-Methoden', () => {
		it('sollte Tab nach ID finden', () => {
			const tabId = tabManager.addTab('text-editor', 'Mein Editor');
			const tab = tabManager.getTabById(tabId);

			expect(tab?.id).toBe(tabId);
			expect(tab?.title).toBe('Mein Editor');
		});

		it('sollte null zurückgeben für nicht existierende Tab-ID', () => {
			const tab = tabManager.getTabById('non-existent-id');
			expect(tab).toBeNull();
		});

		it('sollte alle Tabs zurückgeben', () => {
			tabManager.addTab('text-editor', 'Editor 1');
			tabManager.addTab('diagram-viewer', 'Diagramm 1');

			const tabs = tabManager.getTabs();
			expect(tabs).toHaveLength(2);
		});
	});

	describe('Store-Reaktivität', () => {
		it('sollte Store-Updates bei Tab-Änderungen senden', () => {
			const updates: TabManagerState[] = [];

			tabManager.subscribe((state) => {
				updates.push(state);
			});

			// Erste Update beim Subscribe
			expect(updates).toHaveLength(1);

			// Tab hinzufügen sollte Update auslösen
			tabManager.addTab('text-editor', 'Editor 1');
			expect(updates).toHaveLength(2);
		});
	});

	describe('Reset-Funktionalität', () => {
		it('sollte Store komplett zurücksetzen', () => {
			tabManager.addTab('text-editor', 'Editor 1');
			tabManager.addTab('diagram-viewer', 'Diagramm 1');

			tabManager.reset();

			expect(tabManager.getTabs()).toHaveLength(0);
			expect(tabManager.getActiveTab()).toBeNull();
		});
	});

	describe('setTabOrder', () => {
		it('sollte Tab-Reihenfolge korrekt setzen', () => {
			const tabId1 = tabManager.addTab('text-editor', 'Editor 1');
			const tabId2 = tabManager.addTab('diagram-viewer', 'Diagramm 1');
			const tabId3 = tabManager.addTab('settings', 'Einstellungen');

			// Neue Reihenfolge: 3, 1, 2
			const newOrder = [
				{ id: tabId3, type: 'settings' as const, title: 'Einstellungen' },
				{ id: tabId1, type: 'text-editor' as const, title: 'Editor 1' },
				{ id: tabId2, type: 'diagram-viewer' as const, title: 'Diagramm 1' }
			];

			tabManager.setTabOrder(newOrder);

			const tabs = tabManager.getTabs();
			expect(tabs).toHaveLength(3);
			expect(tabs[0].id).toBe(tabId3);
			expect(tabs[1].id).toBe(tabId1);
			expect(tabs[2].id).toBe(tabId2);
		});

		it('sollte ungültige Tab-Reihenfolge ablehnen', () => {
			const tabId1 = tabManager.addTab('text-editor', 'Editor 1');
			const tabId2 = tabManager.addTab('diagram-viewer', 'Diagramm 1');

			const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

			// Ungültige Reihenfolge mit fehlendem Tab
			const invalidOrder = [
				{ id: tabId1, type: 'text-editor' as const, title: 'Editor 1' },
				{ id: 'invalid-id', type: 'settings' as const, title: 'Ungültig' }
			];

			tabManager.setTabOrder(invalidOrder);

			// Ursprüngliche Reihenfolge sollte erhalten bleiben
			const tabs = tabManager.getTabs();
			expect(tabs).toHaveLength(2);
			expect(tabs[0].id).toBe(tabId1);
			expect(tabs[1].id).toBe(tabId2);

			expect(consoleSpy).toHaveBeenCalledWith(
				'⚠️ Ungültige Tab-Reihenfolge: Tab-IDs stimmen nicht überein'
			);

			consoleSpy.mockRestore();
		});

		it('sollte aktiven Tab beibehalten nach Neuordnung', () => {
			const tabId1 = tabManager.addTab('text-editor', 'Editor 1');
			const tabId2 = tabManager.addTab('diagram-viewer', 'Diagramm 1');

			tabManager.setActiveTab(tabId1);

			// Reihenfolge umkehren
			const newOrder = [
				{ id: tabId2, type: 'diagram-viewer' as const, title: 'Diagramm 1' },
				{ id: tabId1, type: 'text-editor' as const, title: 'Editor 1' }
			];

			tabManager.setTabOrder(newOrder);

			// Aktiver Tab sollte gleich bleiben
			expect(tabManager.getActiveTab()?.id).toBe(tabId1);
		});

		it('sollte Debug-Log für Neuordnung ausgeben', () => {
			const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {});

			const tabId1 = tabManager.addTab('text-editor', 'Editor 1');
			const tabId2 = tabManager.addTab('diagram-viewer', 'Diagramm 1');

			const newOrder = [
				{ id: tabId2, type: 'diagram-viewer' as const, title: 'Diagramm 1' },
				{ id: tabId1, type: 'text-editor' as const, title: 'Editor 1' }
			];

			tabManager.setTabOrder(newOrder);

			expect(consoleSpy).toHaveBeenCalledWith(
				'🔄 Tab-Reihenfolge aktualisiert: Diagramm 1, Editor 1'
			);

			consoleSpy.mockRestore();
		});
	});
});

console.log('🧪 TabManager Tests geladen - 22 Tests mit umfassender Abdeckung');
