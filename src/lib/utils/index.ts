// src/lib/utils/index.ts
// Debug und Logging Utilities

/**
 * Debug-Logger der nur in Development-Mode oder bei explizitem DEBUG-Flag loggt
 * Nutzt Environment-Variablen für Debug-Kontrolle
 */
export function debugLog(message: string, ...args: unknown[]): void {
	// Debug-Logs nur bei explizitem DEBUG-Flag oder in Development
	const isDebugEnabled =
		import.meta.env.VITE_DEBUG === 'true' ||
		import.meta.env.DEV === true ||
		import.meta.env.MODE === 'development';

	if (isDebugEnabled) {
		console.log(message, ...args);
	}
}

/**
 * Error-Logger der immer loggt (auch in Production)
 */
export function errorLog(message: string, error?: unknown): void {
	console.error(message, error);
}

/**
 * Warning-Logger der immer loggt (auch in Production)
 */
export function warnLog(message: string, ...args: unknown[]): void {
	console.warn(message, ...args);
}

console.log('🛠️ Utils-Modul geladen - Bereit für Drag&Drop und Window-Management');
