// src/test-setup.ts
// Test-Setup für Svelte 5 Komponenten mit Vitest

import '@testing-library/jest-dom';
import { vi } from 'vitest';

// Mock für window.matchMedia (wird von einigen Komponenten benötigt)
Object.defineProperty(window, 'matchMedia', {
	writable: true,
	value: vi.fn().mockImplementation((query) => ({
		matches: false,
		media: query,
		onchange: null,
		addListener: vi.fn(), // deprecated
		removeListener: vi.fn(), // deprecated
		addEventListener: vi.fn(),
		removeEventListener: vi.fn(),
		dispatchEvent: vi.fn()
	}))
});

// Mock für ResizeObserver (wird von einigen UI-Komponenten verwendet)
globalThis.ResizeObserver = vi.fn().mockImplementation(() => ({
	observe: vi.fn(),
	unobserve: vi.fn(),
	disconnect: vi.fn()
}));

// Mock für IntersectionObserver
globalThis.IntersectionObserver = vi.fn().mockImplementation(() => ({
	observe: vi.fn(),
	unobserve: vi.fn(),
	disconnect: vi.fn()
}));

// ✅ Svelte 5 + jsdom Kompatibilitäts-Fixes
// Fix für DOM-Rendering-Probleme mit Svelte 5
Object.defineProperty(window, 'requestAnimationFrame', {
	writable: true,
	value: (callback: FrameRequestCallback) => {
		return setTimeout(callback, 16); // 60fps simulation
	}
});

Object.defineProperty(window, 'cancelAnimationFrame', {
	writable: true,
	value: (id: number) => {
		clearTimeout(id);
	}
});

// Fix für getComputedStyle (wird von Svelte 5 für CSS-Berechnungen benötigt)
Object.defineProperty(window, 'getComputedStyle', {
	writable: true,
	value: () => {
		return {
			getPropertyValue: () => '',
			setProperty: () => {},
			removeProperty: () => '',
			// Basis CSS-Properties für Tests
			display: 'block',
			position: 'static',
			width: '100px',
			height: '100px'
		};
	}
});

// Fix für getBoundingClientRect
Element.prototype.getBoundingClientRect = vi.fn(() => ({
	x: 0,
	y: 0,
	width: 100,
	height: 100,
	top: 0,
	right: 100,
	bottom: 100,
	left: 0,
	toJSON: () => ({})
}));

// Fix für scrollIntoView
Element.prototype.scrollIntoView = vi.fn();

// Fix für focus/blur Events
HTMLElement.prototype.focus = vi.fn();
HTMLElement.prototype.blur = vi.fn();

// Debugging: Log-Setup für Tests
console.log('🧪 Test-Setup geladen - Vitest mit Svelte 5 + jsdom-Fixes konfiguriert');
console.log('✅ DOM-Polyfills für Svelte 5-Kompatibilität aktiviert');
