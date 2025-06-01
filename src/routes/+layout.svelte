<!-- src/routes/+layout.svelte -->
<!-- Globales Layout mit selektiver Touch-Event-Optimierung -->

<script lang="ts">
	import { onMount } from 'svelte';
	
	// App-weite CSS-Imports
	import '../app.css';

	let { children } = $props();

	// Selektive Touch-Event-Optimierung - nur für Touch, nicht für Mouse-DnD
	onMount(() => {
		// Originale addEventListener-Funktion sichern
		const originalAddEventListener = EventTarget.prototype.addEventListener;
		
		// Überschreiben mit selektiver Passive-Logik
		EventTarget.prototype.addEventListener = function(type, listener, options) {
			// Nur Touch-Events passive machen, Mouse-Events für DnD intakt lassen
			const touchEvents = ['touchstart', 'touchmove', 'touchend', 'touchcancel'];
			
			if (touchEvents.includes(type)) {
				// Touch-Events als passive markieren
				const passiveOptions = typeof options === 'object' 
					? { ...options, passive: true }
					: { passive: true, capture: !!options };
				
				return originalAddEventListener.call(this, type, listener, passiveOptions);
			}
			
			// Alle anderen Events (Mouse, etc.) unverändert lassen
			return originalAddEventListener.call(this, type, listener, options);
		};
		
		console.log('🎯 Selektive Touch-Event-Optimierung aktiviert - DnD bleibt funktional');
	});
</script>

<!-- Render der Child-Komponenten (Svelte 5 Syntax) -->
{@render children()}
