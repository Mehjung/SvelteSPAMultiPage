<!-- src/lib/components/TabBar.svelte -->
<!-- Tab-Leiste mit horizontaler Anzeige und Drag & Drop (F1, F3, F4, F16) -->

<script lang="ts">
  import { flip } from 'svelte/animate';
  import { dndzone } from 'svelte-dnd-action';
  import { onMount, onDestroy } from 'svelte';
  import type { TabManager } from '$lib/stores';
  import type { Tab, DndZoneConfig } from '$lib/types';
  import TabComponent from './Tab.svelte';
  import { debugLog } from '$lib/utils/index.js';

  // Props
  export let tabManager: TabManager;

  // Reaktive Variablen
  let storeTabs: Tab[] = [];
  let tabs: Tab[] = [];
  let activeTabId: string | null = null;
  let isDragging = false;

  // DnD-Konfiguration (F16)
  const flipDurationMs = 200;

  let unsubscribe: (() => void) | null = null;

  // Store-Subscription beim Mount
  onMount(() => {
    if (tabManager) {
      unsubscribe = tabManager.subscribe(state => {
        storeTabs = state.tabs;
        activeTabId = state.activeTabId;
        
        // Nur aktualisieren wenn nicht gerade gedraggt wird
        if (!isDragging) {
          tabs = [...storeTabs];
        }
        
        debugLog(`🎨 TabBar aktualisiert: ${storeTabs.length} Tabs, aktiv: ${activeTabId}`);
      });
      
      // Initial tabs setzen
      const currentState = tabManager.getTabs();
      tabs = [...currentState];
      debugLog(`🚀 TabBar initial geladen mit ${tabs.length} Tabs`);
    }
  });

  // Cleanup beim Destroy
  onDestroy(() => {
    if (unsubscribe) {
      unsubscribe();
    }
  });

  /**
   * Handler für interne Tab-Neuordnung - Consider Phase (F3, F16)
   * Temporäre Vorschau während des Ziehens
   */
  function handleDndConsider(e: CustomEvent) {
    const { items } = e.detail;
    tabs = items;
    isDragging = true;
    debugLog('🔄 Tab-Drag in Bearbeitung...', items.map((t: any) => t.title));
  }

  /**
   * Handler für DnD Finalize-Phase (permanente Änderung)
   */
  function handleDndFinalize(event: CustomEvent) {
    const { items } = event.detail;
    isDragging = false;
    
    // Tab-Reihenfolge im Store aktualisieren
    const newTabOrder = items.map((item: Tab) => ({
      id: item.id,
      type: item.type,
      title: item.title
    }));
    
    debugLog('✅ Tab-Neuordnung abgeschlossen:', newTabOrder.map((t: Tab) => t.title));
    
    // TabManager mit neuer Reihenfolge aktualisieren
    tabManager.setTabOrder(newTabOrder);
  }

  /**
   * Handler für externe Drop-Zone (F4)
   * Akzeptiert Tabs von anderen Fenstern
   */
  function handleExternalDrop(event: DragEvent) {
    event.preventDefault();
    
    const transferData = event.dataTransfer?.getData('application/x-svelte-tab');
    if (!transferData) {
      console.warn('⚠️ Keine gültigen Tab-Daten im Drop-Event');
      return;
    }

    try {
      const tabData = JSON.parse(transferData);
      
      // Neuen Tab aus externen Daten erstellen
      const newTabId = tabManager.addTab(tabData.type, tabData.title);
      
      debugLog(`📥 Externer Tab empfangen: ${tabData.title} (${newTabId})`);
      debugLog(`🔗 Quelle: ${tabData.sourceWindowId || 'unbekannt'}`);
      
    } catch (error) {
      console.error('❌ Fehler beim Verarbeiten externer Tab-Daten:', error);
    }
  }

  /**
   * Handler für DragOver-Events (Drop-Zone aktivieren)
   */
  function handleDragOver(event: DragEvent) {
    event.preventDefault();
    event.dataTransfer!.dropEffect = 'move';
  }

  /**
   * Tab-Klick-Handler für Aktivierung
   */
  function handleTabClick(tabId: string) {
    tabManager.setActiveTab(tabId);
    debugLog(`👆 Tab geklickt und aktiviert: ${tabId}`);
  }

  /**
   * Handler für Tab-Schließen
   */
  function handleTabClose(tabId: string) {
    tabManager.closeTab(tabId);
    debugLog(`🗑️ Tab geschlossen: ${tabId}`);
  }

  // Debugging-Log
  debugLog('🎨 TabBar-Komponente geladen - Bereit für Tab-Anzeige und DnD');
</script>

<!-- Tab-Leiste Container (F1) -->
<div 
  class="tab-bar"
  class:dragging={isDragging}
  on:drop={handleExternalDrop}
  on:dragover={handleDragOver}
  role="tablist"
  aria-label="Tab-Leiste"
  tabindex="0"
>
  <!-- DnD-Zone für interne Tab-Neuordnung (F3, F16) -->
  <div
    class="tab-container"
    use:dndzone={{
      items: tabs,
      flipDurationMs: flipDurationMs,
      type: 'tab'
    }}
    on:consider={handleDndConsider}
    on:finalize={handleDndFinalize}
  >
    {#each tabs as tab (tab.id)}
      <div class="tab-wrapper" animate:flip="{{duration: flipDurationMs}}">
        <TabComponent
          {tab}
          isActive={tab.id === activeTabId}
          on:click={() => handleTabClick(tab.id)}
          on:close={() => handleTabClose(tab.id)}
        />
      </div>
    {/each}
  </div>

  <!-- Leere Zustand wenn keine Tabs -->
  {#if tabs.length === 0}
    <div class="empty-state">
      <span class="empty-text">Keine Tabs geöffnet</span>
      <span class="empty-hint">Ziehe Tabs hierher oder erstelle neue</span>
    </div>
  {/if}
</div>

<style>
  /* Tab-Leiste Basis-Styling */
  .tab-bar {
    display: flex;
    align-items: center;
    background: #f8f9fa;
    border-bottom: 1px solid #e9ecef;
    min-height: 40px;
    padding: 0 8px;
    overflow-x: auto;
    overflow-y: hidden;
    position: relative;
  }

  /* Drag-Zustand Styling */
  .tab-bar.dragging {
    background: #e3f2fd;
    border-bottom-color: #2196f3;
  }

  /* Tab-Container für DnD */
  .tab-container {
    display: flex;
    align-items: center;
    gap: 2px;
    flex: 1;
    min-height: 36px;
  }

  /* Tab-Wrapper für DnD-Items */
  .tab-wrapper {
    display: flex;
    flex-shrink: 0;
  }

  /* Leerer Zustand */
  .empty-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    flex: 1;
    padding: 16px;
    color: #6c757d;
    text-align: center;
  }

  .empty-text {
    font-size: 14px;
    font-weight: 500;
    margin-bottom: 4px;
  }

  .empty-hint {
    font-size: 12px;
    opacity: 0.7;
  }

  /* Responsive Design */
  @media (max-width: 768px) {
    .tab-bar {
      padding: 0 4px;
      min-height: 36px;
    }
    
    .empty-state {
      padding: 12px;
    }
    
    .empty-text {
      font-size: 13px;
    }
    
    .empty-hint {
      font-size: 11px;
    }
  }

  /* Scrollbar-Styling für bessere UX */
  .tab-bar::-webkit-scrollbar {
    height: 4px;
  }

  .tab-bar::-webkit-scrollbar-track {
    background: #f1f1f1;
  }

  .tab-bar::-webkit-scrollbar-thumb {
    background: #c1c1c1;
    border-radius: 2px;
  }

  .tab-bar::-webkit-scrollbar-thumb:hover {
    background: #a8a8a8;
  }
</style> 