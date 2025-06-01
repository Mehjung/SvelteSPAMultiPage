<!-- src/lib/components/Tab.svelte -->
<!-- Einzelner Tab mit Titel, aktiv/inaktiv-Zustand und Close-Button (F2, F5) -->

<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import type { Tab, TabTransferData } from '$lib/types';
  import { TAB_DRAG_MIME_TYPE } from '$lib/types';
  import { debugLog } from '$lib/utils/index.js';

  // Props
  export let tab: Tab;
  export let isActive: boolean = false;

  // Event Dispatcher für Tab-Events
  const dispatch = createEventDispatcher<{
    click: void;
    close: void;
  }>();

  // Drag-Zustand für visuelles Feedback
  let isDragging = false;
  // Flag um Drag zu verhindern wenn Close-Button geklickt wird
  let preventDrag = false;

  /**
   * Handler für externes Ziehen (F5)
   * Setzt draggable="true" und DataTransfer für fensterübergreifendes Ziehen
   */
  function handleDragStart(event: DragEvent) {
    // Verhindere Drag wenn Close-Button geklickt wurde
    if (preventDrag) {
      event.preventDefault();
      preventDrag = false; // Reset flag
      debugLog(`🚫 Drag verhindert für Close-Button: ${tab.title}`);
      return;
    }

    if (!event.dataTransfer) return;

    // Tab-Daten für externe Übertragung vorbereiten (F17, F18)
    const transferData: TabTransferData = {
      id: tab.id,
      type: tab.type,
      title: tab.title,
      sourceWindowId: crypto.randomUUID() // Für Debugging
    };

    // DataTransfer mit MIME-Type setzen (F17)
    event.dataTransfer.setData(TAB_DRAG_MIME_TYPE, JSON.stringify(transferData));
    event.dataTransfer.effectAllowed = 'move';

    isDragging = true;
    
    debugLog(`🚀 Externes Ziehen gestartet: ${tab.title} (${tab.id})`);
    debugLog(`📦 Transfer-Daten:`, transferData);
  }

  /**
   * Handler für Ende des externen Ziehens (F19)
   * Erkennt erfolgreiche externe Drops via dropEffect
   */
  function handleDragEnd(event: DragEvent) {
    isDragging = false;
    
    if (event.dataTransfer?.dropEffect === 'move') {
      debugLog(`✅ Externes Drop erfolgreich: ${tab.title}`);
      // Hier könnte der Tab aus dem Quell-Fenster entfernt werden
      // Das wird in der fensterübergreifenden Implementierung behandelt
    } else {
      debugLog(`❌ Externes Drop fehlgeschlagen: ${tab.title}`);
    }
  }

  /**
   * Tab-Klick-Handler (nur für Tab-Bereich, nicht Close-Button)
   */
  function handleClick() {
    dispatch('click');
  }

  /**
   * Close-Button MouseDown-Handler
   * Verhindert Drag-Start wenn Close-Button gedrückt wird
   */
  function handleCloseMouseDown(event: MouseEvent) {
    event.stopPropagation(); // Verhindert Event-Bubbling
    preventDrag = true; // Setze Flag um Drag zu verhindern
    debugLog(`🛑 Close-Button MouseDown: Drag verhindert für ${tab.title}`);
  }

  /**
   * Close-Button-Handler (Task 4.2)
   * Verhindert Event-Bubbling zum Tab-Klick
   */
  function handleClose(event: MouseEvent) {
    event.stopPropagation(); // Verhindert Tab-Aktivierung
    preventDrag = false; // Reset flag
    dispatch('close');
    debugLog(`❌ Close-Button geklickt: ${tab.title} (${tab.id})`);
  }

  /**
   * Close-Button Drag-Handler
   * Verhindert Drag-Events vom Close-Button
   */
  function handleCloseDragStart(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    debugLog(`🚫 Drag vom Close-Button verhindert: ${tab.title}`);
  }

  /**
   * Keyboard-Handler für Close-Button
   */
  function handleCloseKeydown(event: KeyboardEvent) {
    if (event.key === 'Enter') {
      event.stopPropagation();
      dispatch('close');
      debugLog(`❌ Close-Button per Keyboard aktiviert: ${tab.title} (${tab.id})`);
    }
  }

  /**
   * Icon basierend auf Tab-Typ bestimmen
   */
  function getTabIcon(type: string): string {
    switch (type) {
      case 'text-editor':
        return '📝';
      case 'diagram-viewer':
        return '📊';
      case 'settings':
        return '⚙️';
      case 'welcome':
        return '👋';
      default:
        return '📄';
    }
  }

  // Debugging-Log
  debugLog(`🏷️ Tab-Komponente geladen: ${tab?.title || 'Unbekannt'} (${tab?.type || 'Unbekannt'})`);
</script>

<!-- Tab-Element (F2) -->
<div
  class="tab"
  class:active={isActive}
  class:dragging={isDragging}
  draggable="true"
  role="tab"
  aria-selected={isActive}
  aria-label={`Tab: ${tab.title}`}
  tabindex={isActive ? 0 : -1}
  on:click={handleClick}
  on:dragstart={handleDragStart}
  on:dragend={handleDragEnd}
  on:keydown={(e) => e.key === 'Enter' && handleClick()}
>
  <!-- Tab-Icon -->
  <span class="tab-icon" aria-hidden="true">
    {getTabIcon(tab.type)}
  </span>

  <!-- Tab-Titel -->
  <span class="tab-title">
    {tab.title}
  </span>

  <!-- Close-Button (Task 4.2) -->
  <button
    class="close-button"
    type="button"
    draggable="false"
    aria-label={`Tab schließen: ${tab.title}`}
    title="Tab schließen"
    on:mousedown={handleCloseMouseDown}
    on:click={handleClose}
    on:dragstart={handleCloseDragStart}
    on:keydown={handleCloseKeydown}
  >
    ✕
  </button>

  <!-- Drag-Indikator -->
  {#if isDragging}
    <span class="drag-indicator" aria-hidden="true">
      ↗️
    </span>
  {/if}
</div>

<style>
  /* Tab Basis-Styling */
  .tab {
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 8px 12px;
    background: #ffffff;
    border: 1px solid #dee2e6;
    border-radius: 6px 6px 0 0;
    cursor: pointer;
    user-select: none;
    transition: all 0.2s ease;
    min-width: 120px;
    max-width: 200px;
    position: relative;
    font-size: 13px;
    line-height: 1.2;
  }

  /* Hover-Zustand */
  .tab:hover {
    background: #f8f9fa;
    border-color: #adb5bd;
    transform: translateY(-1px);
  }

  /* Aktiver Tab (F2) */
  .tab.active {
    background: #e3f2fd;
    border-color: #2196f3;
    border-bottom-color: #e3f2fd;
    font-weight: 500;
    z-index: 1;
  }

  .tab.active:hover {
    background: #e3f2fd;
  }

  /* Drag-Zustand */
  .tab.dragging {
    opacity: 0.7;
    transform: rotate(2deg) scale(0.98);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    z-index: 1000;
  }

  /* Tab-Icon */
  .tab-icon {
    font-size: 14px;
    flex-shrink: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 16px;
    height: 16px;
  }

  /* Tab-Titel */
  .tab-title {
    flex: 1;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    color: #495057;
  }

  .tab.active .tab-title {
    color: #1976d2;
  }

  /* Close-Button (Task 4.2) */
  .close-button {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 18px;
    height: 18px;
    border: none;
    background: transparent;
    border-radius: 3px;
    cursor: pointer;
    font-size: 12px;
    color: #6c757d;
    transition: all 0.2s ease;
    flex-shrink: 0;
    margin-left: 4px;
  }

  .close-button:hover {
    background: #dc3545;
    color: white;
    transform: scale(1.1);
  }

  .close-button:active {
    transform: scale(0.95);
  }

  .close-button:focus {
    outline: 2px solid #dc3545;
    outline-offset: 1px;
  }

  /* Close-Button im aktiven Tab */
  .tab.active .close-button {
    color: #1976d2;
  }

  .tab.active .close-button:hover {
    background: #dc3545;
    color: white;
  }

  /* Drag-Indikator */
  .drag-indicator {
    position: absolute;
    top: -2px;
    right: -2px;
    font-size: 10px;
    background: #ff9800;
    border-radius: 50%;
    width: 16px;
    height: 16px;
    display: flex;
    align-items: center;
    justify-content: center;
    animation: pulse 1s infinite;
    z-index: 10;
  }

  @keyframes pulse {
    0%, 100% { transform: scale(1); }
    50% { transform: scale(1.1); }
  }

  /* Focus-Zustand für Accessibility */
  .tab:focus {
    outline: 2px solid #2196f3;
    outline-offset: 2px;
  }

  /* Responsive Design */
  @media (max-width: 768px) {
    .tab {
      min-width: 100px;
      max-width: 150px;
      padding: 6px 10px;
      font-size: 12px;
    }

    .tab-icon {
      font-size: 12px;
      width: 14px;
      height: 14px;
    }

    .close-button {
      width: 16px;
      height: 16px;
      font-size: 11px;
    }
  }

  /* Disabled-Zustand (für zukünftige Erweiterungen) */
  .tab:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    pointer-events: none;
  }

  /* High-Contrast-Modus Support */
  @media (prefers-contrast: high) {
    .tab {
      border-width: 2px;
    }
    
    .tab.active {
      border-width: 3px;
    }

    .close-button {
      border: 1px solid currentColor;
    }
  }

  /* Reduced Motion Support */
  @media (prefers-reduced-motion: reduce) {
    .tab {
      transition: none;
    }
    
    .tab.dragging {
      transform: none;
    }
    
    .drag-indicator {
      animation: none;
    }

    .close-button {
      transition: none;
    }
  }
</style> 