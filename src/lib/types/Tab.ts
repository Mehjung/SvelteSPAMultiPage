// src/lib/types/Tab.ts
// TypeScript-Definitionen für das Tab-System

import type { ComponentType } from 'svelte';

/**
 * Basis-Interface für einen Tab (F7)
 * Jeder Tab hat eine eindeutige ID, einen Typ und einen Titel
 */
export interface Tab {
	/** Eindeutige Identifikation des Tabs (UUID) */
	id: string;

	/** Komponententyp des Tabs (z.B. "text-editor", "diagram-viewer") */
	type: TabType;

	/** Anzeigename des Tabs in der Tab-Leiste */
	title: string;
}

/**
 * Verfügbare Tab-Typen für verschiedene Programme
 */
export type TabType = 'text-editor' | 'diagram-viewer' | 'welcome' | 'settings';

/**
 * Registry für verfügbare Komponenten-Typen
 * Mapping von TabType zu Svelte-Komponenten
 */
export interface ComponentRegistry {
	[key: string]: ComponentType; // Svelte-Komponenten-Type
}

/**
 * Programm-Definition für das Auswahl-Menü
 */
export interface ProgramDefinition {
	/** Eindeutiger Typ-Identifier */
	type: TabType;

	/** Anzeigename im Menü */
	displayName: string;

	/** Beschreibung des Programms */
	description: string;

	/** Icon-Klasse oder Icon-Name (optional) */
	icon?: string;
}

/**
 * Tab-Manager State Interface
 * Definiert den Zustand eines Tab-Managers
 */
export interface TabManagerState {
	/** Liste aller offenen Tabs */
	tabs: Tab[];

	/** ID des aktuell aktiven Tabs */
	activeTabId: string | null;

	/** Eindeutige ID dieser Fenster-Instanz */
	windowId: string;
}

console.log('🔧 Tab-Definitionen geladen - Interface für Tab-System bereit');
