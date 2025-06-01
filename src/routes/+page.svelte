<!-- src/routes/+page.svelte -->
<!-- Chrome-ähnliche SPA Hauptseite mit TabBar-Demo -->

<script lang="ts">
  import { onMount } from 'svelte';
  import { TabBar } from '$lib/components';
  import { TabManager } from '$lib/stores';
  import { debugLog } from '$lib/utils/index.js';

  // TabManager-Instanz für diese Fenster-Session
  let tabManager = new TabManager();

  // Demo-Tabs beim Laden hinzufügen
  onMount(() => {
    debugLog('🚀 Hauptseite geladen - TabBar-Demo wird initialisiert');
    
    // Willkommens-Tab
    tabManager.addTab('welcome', 'Willkommen');
    
    // Beispiel-Tabs für Demo
    tabManager.addTab('text-editor', 'Mein Editor');
    tabManager.addTab('diagram-viewer', 'Diagramm Viewer');
    
    debugLog('✅ Demo-Tabs hinzugefügt');
  });

  // Handler für neue Tabs (Demo-Zwecke)
  function addNewTab() {
    const tabTypes = ['text-editor', 'diagram-viewer', 'settings'] as const;
    const randomType = tabTypes[Math.floor(Math.random() * tabTypes.length)];
    const timestamp = new Date().toLocaleTimeString();
    
    tabManager.addTab(randomType, `Neuer Tab ${timestamp}`);
    debugLog(`➕ Neuer Demo-Tab hinzugefügt: ${randomType}`);
  }

  // Handler für Tab-Entfernung (Demo-Zwecke)
  function removeActiveTab() {
    const activeTab = tabManager.getActiveTab();
    if (activeTab) {
      tabManager.removeTab(activeTab.id);
      debugLog(`➖ Aktiver Tab entfernt: ${activeTab.title}`);
    }
  }

  // Debugging-Log
  debugLog('🏠 Hauptseite geladen - TabBar-Demo bereit');
</script>

<!-- Hauptlayout -->
<div class="app-container">
  <!-- Header mit Titel -->
  <header class="app-header">
    <h1 class="app-title">🌐 Chrome-ähnliche SPA</h1>
    <div class="demo-controls">
      <button class="demo-btn" on:click={addNewTab}>
        ➕ Neuer Tab
      </button>
      <button class="demo-btn" on:click={removeActiveTab}>
        ❌ Tab schließen
      </button>
    </div>
  </header>

  <!-- TabBar Integration -->
  <div class="tab-section">
    <TabBar {tabManager} />
  </div>

  <!-- Content Area (Platzhalter) -->
  <main class="content-area">
    {#if tabManager.getActiveTab()}
      <div class="tab-content">
        <h2>📄 {tabManager.getActiveTab()?.title}</h2>
        <p>Typ: <code>{tabManager.getActiveTab()?.type}</code></p>
        <p>ID: <code>{tabManager.getActiveTab()?.id}</code></p>
        
        <div class="content-placeholder">
          <p>🚧 Hier wird später der Inhalt des aktiven Tabs angezeigt.</p>
          <p>Du kannst:</p>
          <ul>
            <li>Tabs per Klick aktivieren</li>
            <li>Tabs per Drag & Drop neu ordnen</li>
            <li>Neue Tabs mit dem ➕ Button hinzufügen</li>
            <li>Tabs mit dem ❌ Button entfernen</li>
          </ul>
        </div>
      </div>
    {:else}
      <div class="empty-content">
        <h2>🏠 Keine Tabs geöffnet</h2>
        <p>Klicke auf "➕ Neuer Tab" um zu beginnen!</p>
      </div>
    {/if}
  </main>

  <!-- Footer mit Infos -->
  <footer class="app-footer">
    <p>
      🎯 <strong>TabBar Demo</strong> - 
      Tabs: {tabManager.getTabs().length} | 
      Aktiv: {tabManager.getActiveTab()?.title || 'Keiner'}
    </p>
  </footer>
</div>

<style>
  /* App-Container */
  .app-container {
    display: flex;
    flex-direction: column;
    height: 100vh;
    background: #ffffff;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  }

  /* Header */
  .app-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 16px 24px;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  }

  .app-title {
    margin: 0;
    font-size: 24px;
    font-weight: 600;
  }

  .demo-controls {
    display: flex;
    gap: 12px;
  }

  .demo-btn {
    padding: 8px 16px;
    background: rgba(255, 255, 255, 0.2);
    border: 1px solid rgba(255, 255, 255, 0.3);
    border-radius: 6px;
    color: white;
    cursor: pointer;
    font-size: 14px;
    transition: all 0.2s ease;
  }

  .demo-btn:hover {
    background: rgba(255, 255, 255, 0.3);
    transform: translateY(-1px);
  }

  /* Tab-Sektion */
  .tab-section {
    flex-shrink: 0;
  }

  /* Content Area */
  .content-area {
    flex: 1;
    padding: 24px;
    overflow-y: auto;
    background: #f8f9fa;
  }

  .tab-content {
    background: white;
    border-radius: 8px;
    padding: 24px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  }

  .tab-content h2 {
    margin: 0 0 16px 0;
    color: #2c3e50;
  }

  .tab-content p {
    margin: 8px 0;
    color: #6c757d;
  }

  .tab-content code {
    background: #e9ecef;
    padding: 2px 6px;
    border-radius: 4px;
    font-family: 'Courier New', monospace;
    font-size: 13px;
  }

  .content-placeholder {
    margin-top: 24px;
    padding: 20px;
    background: #e3f2fd;
    border-radius: 6px;
    border-left: 4px solid #2196f3;
  }

  .content-placeholder ul {
    margin: 12px 0;
    padding-left: 20px;
  }

  .content-placeholder li {
    margin: 6px 0;
    color: #1976d2;
  }

  .empty-content {
    text-align: center;
    padding: 60px 20px;
    color: #6c757d;
  }

  .empty-content h2 {
    margin: 0 0 16px 0;
    color: #495057;
  }

  /* Footer */
  .app-footer {
    flex-shrink: 0;
    padding: 12px 24px;
    background: #e9ecef;
    border-top: 1px solid #dee2e6;
    text-align: center;
    font-size: 14px;
    color: #6c757d;
  }

  .app-footer strong {
    color: #495057;
  }

  /* Responsive Design */
  @media (max-width: 768px) {
    .app-header {
      flex-direction: column;
      gap: 12px;
      padding: 16px;
    }

    .demo-controls {
      width: 100%;
      justify-content: center;
    }

    .content-area {
      padding: 16px;
    }

    .tab-content {
      padding: 16px;
    }
  }
</style>
