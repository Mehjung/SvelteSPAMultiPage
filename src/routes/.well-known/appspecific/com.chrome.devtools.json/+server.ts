// src/routes/.well-known/appspecific/com.chrome.devtools.json/+server.ts
// Chrome DevTools-Integration Route - verhindert 404-Fehler in der Konsole

import { json, type RequestHandler } from '@sveltejs/kit';

/**
 * Chrome DevTools versucht automatisch diese Datei zu laden für erweiterte Debugging-Features.
 * Wir geben eine leere aber gültige JSON-Antwort zurück um 404-Fehler zu vermeiden.
 */
export const GET: RequestHandler = async () => {
	// Leere DevTools-Konfiguration zurückgeben
	return json({
		// Optionale DevTools-Konfiguration kann hier hinzugefügt werden
		// Für jetzt reicht eine leere Antwort um den Fehler zu beheben
	});
};
