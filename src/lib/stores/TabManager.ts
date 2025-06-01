// src/lib/stores/TabManager.ts
// Zentrale Tab-Verwaltung mit Svelte Store

import { writable, type Writable } from 'svelte/store';
import { v4 as uuidv4 } from 'uuid';
import type { Tab, TabType, TabManagerState } from '../types/Tab.js';
import { debugLog, warnLog } from '../utils/index.js';

/**
 * TabManager-Klasse für zentrale Tab-Verwaltung
 * Jede Browser-Fenster-Instanz hat ihren eigenen TabManager
 */
export class TabManager {
	private store: Writable<TabManagerState>;
	private windowId: string;

	constructor() {
		// Eindeutige Fenster-ID generieren
		this.windowId = uuidv4();

		// Store mit leerem Zustand initialisieren
		this.store = writable<TabManagerState>({
			tabs: [],
			activeTabId: null,
			windowId: this.windowId
		});

		debugLog(`📦 TabManager erstellt für Fenster: ${this.windowId}`);
	}

	/**
	 * Tab hinzufügen (F6)
	 * @param type - Tab-Typ (text-editor, diagram-viewer, etc.)
	 * @param title - Tab-Titel
	 * @returns Tab-ID
	 */
	addTab(type: TabType, title: string): string {
		const newTab: Tab = {
			id: uuidv4(),
			type,
			title
		};

		this.store.update((state) => {
			const newTabs = [...state.tabs, newTab];
			debugLog(`➕ Tab hinzugefügt: ${title} (${newTab.id}) in Fenster ${this.windowId}`);
			debugLog(`📊 Aktuelle Tab-Anzahl: ${newTabs.length}`);

			return {
				...state,
				tabs: newTabs,
				activeTabId: newTab.id // Neuer Tab wird automatisch aktiviert
			};
		});

		return newTab.id;
	}

	/**
	 * Tab entfernen (F7)
	 * @param tabId - ID des zu entfernenden Tabs
	 */
	removeTab(tabId: string): void {
		this.store.update((state) => {
			const tabIndex = state.tabs.findIndex((tab) => tab.id === tabId);

			if (tabIndex === -1) {
				warnLog(`⚠️ Tab für Entfernung nicht gefunden: ${tabId}`);
				return state;
			}

			const removedTab = state.tabs[tabIndex];
			const newTabs = state.tabs.filter((tab) => tab.id !== tabId);

			debugLog(`➖ Tab entfernt: ${removedTab.title} (${tabId})`);
			debugLog(`📊 Verbleibende Tabs: ${newTabs.length}`);

			// Aktiven Tab intelligent wechseln
			let newActiveTabId = state.activeTabId;

			if (state.activeTabId === tabId) {
				if (newTabs.length === 0) {
					newActiveTabId = null;
				} else if (tabIndex < newTabs.length) {
					// Tab rechts vom entfernten aktivieren
					newActiveTabId = newTabs[tabIndex].id;
				} else {
					// Letzten Tab aktivieren wenn entfernter Tab der letzte war
					newActiveTabId = newTabs[newTabs.length - 1].id;
				}
			}

			return {
				...state,
				tabs: newTabs,
				activeTabId: newActiveTabId
			};
		});
	}

	/**
	 * Tab-Position ändern (F8)
	 * @param tabId - ID des zu verschiebenden Tabs
	 * @param newIndex - Neue Position (0-basiert)
	 */
	moveTab(tabId: string, newIndex: number): void {
		this.store.update((state) => {
			const currentIndex = state.tabs.findIndex((tab) => tab.id === tabId);

			if (currentIndex === -1) {
				warnLog(`⚠️ Tab für Verschiebung nicht gefunden: ${tabId}`);
				return state;
			}

			if (newIndex < 0 || newIndex >= state.tabs.length) {
				warnLog(`⚠️ Ungültiger Index für Tab-Verschiebung: ${newIndex}`);
				return state;
			}

			const newTabs = [...state.tabs];
			const [movedTab] = newTabs.splice(currentIndex, 1);
			newTabs.splice(newIndex, 0, movedTab);

			debugLog(`🔄 Tab verschoben: ${movedTab.title} von Position ${currentIndex} zu ${newIndex}`);

			return {
				...state,
				tabs: newTabs
			};
		});
	}

	/**
	 * Tab aktivieren (F9)
	 * @param tabId - ID des zu aktivierenden Tabs
	 */
	setActiveTab(tabId: string): void {
		this.store.update((state) => {
			const tab = state.tabs.find((t) => t.id === tabId);

			if (!tab) {
				warnLog(`⚠️ Tab für Aktivierung nicht gefunden: ${tabId}`);
				return state;
			}

			debugLog(`🎯 Tab aktiviert: ${tab.title} (${tabId})`);

			return {
				...state,
				activeTabId: tabId
			};
		});
	}

	/**
	 * Tab schließen (Alias für removeTab)
	 * @param tabId - ID des zu schließenden Tabs
	 */
	closeTab(tabId: string): void {
		const tab = this.getTabById(tabId);
		if (tab) {
			debugLog(`🗑️ Tab wird geschlossen: ${tab.title} (${tabId})`);
		}
		this.removeTab(tabId);
	}

	/**
	 * Tab-Reihenfolge setzen (für DnD)
	 * @param newTabOrder - Neue Tab-Reihenfolge
	 */
	setTabOrder(newTabOrder: Tab[]): void {
		this.store.update((state) => {
			// Validierung: Alle Tabs müssen vorhanden sein
			if (newTabOrder.length !== state.tabs.length) {
				warnLog(`⚠️ Ungültige Tab-Reihenfolge: Anzahl stimmt nicht überein`);
				return state;
			}

			const newTabIds = new Set(newTabOrder.map((t) => t.id));
			const currentTabIds = new Set(state.tabs.map((t) => t.id));

			if (
				newTabIds.size !== currentTabIds.size ||
				![...newTabIds].every((id) => currentTabIds.has(id))
			) {
				warnLog(`⚠️ Ungültige Tab-Reihenfolge: Tab-IDs stimmen nicht überein`);
				return state;
			}

			debugLog(`🔄 Tab-Reihenfolge aktualisiert: ${newTabOrder.map((t) => t.title).join(', ')}`);

			return {
				...state,
				tabs: newTabOrder
			};
		});
	}

	/**
	 * Tab nach ID finden (F10)
	 * @param tabId - Tab-ID
	 * @returns Tab oder null
	 */
	getTabById(tabId: string): Tab | null {
		let foundTab: Tab | null = null;

		this.store.subscribe((state) => {
			foundTab = state.tabs.find((tab) => tab.id === tabId) || null;
		})();

		return foundTab;
	}

	/**
	 * Aktiven Tab abrufen (F11)
	 * @returns Aktiver Tab oder null
	 */
	getActiveTab(): Tab | null {
		let activeTab: Tab | null = null;

		this.store.subscribe((state) => {
			if (state.activeTabId) {
				activeTab = state.tabs.find((tab) => tab.id === state.activeTabId) || null;
			}
		})();

		return activeTab;
	}

	/**
	 * Alle Tabs abrufen (F12)
	 * @returns Array aller Tabs
	 */
	getTabs(): Tab[] {
		let tabs: Tab[] = [];

		this.store.subscribe((state) => {
			tabs = [...state.tabs];
		})();

		return tabs;
	}

	/**
	 * Store-Subscription für reaktive Updates (F13)
	 * @param callback - Callback-Funktion für Store-Updates
	 * @returns Unsubscribe-Funktion
	 */
	subscribe(callback: (state: TabManagerState) => void): () => void {
		return this.store.subscribe(callback);
	}

	/**
	 * Store zurücksetzen (für Tests und Cleanup)
	 */
	reset(): void {
		this.store.set({
			tabs: [],
			activeTabId: null,
			windowId: this.windowId
		});
		debugLog(`🔄 TabManager zurückgesetzt`);
	}

	/**
	 * Fenster-ID abrufen
	 * @returns Eindeutige Fenster-ID
	 */
	getWindowId(): string {
		return this.windowId;
	}
}

debugLog('📦 TabManager-Klasse geladen - Bereit für Tab-Verwaltung');
