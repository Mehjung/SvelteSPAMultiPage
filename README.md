# Chrome-ähnliche SPA mit Svelte 5 🚀

Eine moderne Single Page Application mit Chrome-ähnlichem Tab-System, entwickelt mit Svelte 5 und SvelteKit.

## 🎯 Projektübersicht

Dieses Projekt implementiert eine Chrome-ähnliche Benutzeroberfläche mit:

- **Tab-System** mit Drag & Drop-Funktionalität
- **Modulare Architektur** mit TypeScript
- **Umfassende Tests** (102 Tests, 100% Erfolgsrate)
- **Saubere Code-Struktur** mit Debug-Logging

## ✨ Features

### ✅ Implementiert (Tasks 1-4)

- **Task 1.3**: Vitest Testing-Framework (3 Tests)
- **Task 1.4**: Modulare Ordnerstruktur
- **Task 2.0**: Tab-Datenstrukturen und TypeScript-Definitionen (13 Tests)
- **Task 3.0**: TabManager Store für zentrale Tab-Verwaltung (17 Tests)
- **Task 4.0**: Tab-Leiste mit Drag & Drop-Funktionalität (118 Tests)

### 🔧 Code-Bereinigung

- Environment-Variable-basiertes Debug-Logging
- Separate Vite/Vitest-Konfigurationen
- Chrome DevTools-Integration (404-Fehler behoben)
- Redundante Dateien entfernt
- Test-Import-Pfade korrigiert

## 🛠️ Tech Stack

- **Frontend**: Svelte 5, SvelteKit
- **Sprache**: TypeScript
- **Testing**: Vitest, jsdom
- **Drag & Drop**: svelte-dnd-action
- **Styling**: TailwindCSS
- **Build**: Vite
- **Package Manager**: npm

## 📁 Projektstruktur

```
src/
├── lib/
│   ├── components/          # Svelte-Komponenten
│   │   ├── Tab.svelte      # Einzelne Tab-Komponente
│   │   ├── TabBar.svelte   # Tab-Leiste mit DnD
│   │   └── __tests__/      # Komponenten-Tests
│   ├── stores/             # Svelte Stores
│   │   ├── TabManager.ts   # Zentrale Tab-Verwaltung
│   │   └── __tests__/      # Store-Tests
│   ├── types/              # TypeScript-Definitionen
│   │   ├── Tab.ts          # Tab-Interfaces
│   │   ├── DragDrop.ts     # DnD-Interfaces
│   │   └── __tests__/      # Type-Tests
│   └── utils/              # Utility-Funktionen
│       └── index.ts        # Debug-Logging
├── routes/                 # SvelteKit-Routen
│   ├── +page.svelte       # Hauptseite
│   └── .well-known/       # Chrome DevTools-Integration
└── app.html               # HTML-Template
```

## 🚀 Installation & Setup

```bash
# Repository klonen
git clone https://github.com/Mehjung/SvelteSPAMultiPage.git
cd SvelteSPAMultiPage

# Dependencies installieren
npm install

# Development-Server starten
npm run dev

# Tests ausführen
npm test

# Build für Production
npm run build
```

## 🧪 Testing

Das Projekt hat eine umfassende Test-Suite mit **102 Tests** und **100% Erfolgsrate**:

```bash
# Alle Tests ausführen
npm test

# Tests im Watch-Mode
npm run test:watch

# Test-Coverage anzeigen
npm run test:coverage
```

### Test-Kategorien:

- **Tab-Komponenten-Tests**: 35 Tests
- **TabManager Store-Tests**: 27 Tests
- **Drag & Drop-Tests**: 15 Tests
- **Integration-Tests**: 11 Tests
- **Type-Definition-Tests**: 14 Tests

## 🐛 Debug-Logging

Das Projekt verwendet ein modulares Debug-System:

```bash
# Debug-Logs aktivieren
VITE_DEBUG=true npm run dev

# Nur in Development-Mode
npm run dev  # Debug-Logs automatisch aktiv
```

## 🎮 Verwendung

### Tab-Verwaltung:

- **F6**: Neuen Tab hinzufügen
- **F7**: Tab schließen
- **F8**: Tab-Position ändern
- **F9**: Tab aktivieren

### Drag & Drop:

- Tabs zwischen Positionen ziehen
- Externe Tabs von anderen Fenstern akzeptieren
- Close-Button verhindert versehentliches Ziehen

## 🔧 Konfiguration

### Vite-Konfiguration:

- `vite.config.ts`: SvelteKit + TailwindCSS
- `vitest.config.ts`: Separate Test-Konfiguration

### Environment-Variablen:

- `VITE_DEBUG`: Debug-Logs aktivieren
- `DEV`: Development-Mode erkennung
- `MODE`: Build-Mode (development/production)

## 📈 Nächste Schritte

- [ ] Task 5: Window-Management-System
- [ ] Task 6: Content-Area-Implementation
- [ ] Task 7: Keyboard-Shortcuts
- [ ] Task 8: Theme-System
- [ ] Task 9: Persistierung
- [ ] Task 10: Performance-Optimierung

## 🤝 Beitragen

1. Fork das Repository
2. Erstelle einen Feature-Branch (`git checkout -b feature/amazing-feature`)
3. Committe deine Änderungen (`git commit -m 'Add amazing feature'`)
4. Push zum Branch (`git push origin feature/amazing-feature`)
5. Öffne einen Pull Request

## 📝 Lizenz

Dieses Projekt steht unter der MIT-Lizenz. Siehe `LICENSE`-Datei für Details.

## 🙏 Danksagungen

- Svelte-Team für das fantastische Framework
- SvelteKit für die moderne Entwicklungsumgebung
- svelte-dnd-action für die Drag & Drop-Funktionalität
- Vitest für das schnelle Testing-Framework

---

**Status**: ✅ Code bereinigt, 102/102 Tests bestehen, bereit für weitere Entwicklung
