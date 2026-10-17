# Project: KitobPlus Premium Design, Visual Assets & UX Upgrade

## Architecture
- **Frontend (`web/src`)**: React 18 SPA built with React Router v6, Material-UI (MUI v5), custom token-based design system (`web/src/ds/tokens.js`, `web/src/ds/theme.js`).
- **Global Context**: `LibraryContext.jsx` manages active audio playback, language selection (`countryCode` in UZ, RU, US), theme mode (light, dark, contrast), and text scaling (normal, large, extra-large).
- **Asset Pipeline**: `web/src/img/` for visual assets, `web/public/` for static icons and PWA manifests, modern WebP formats for responsive scaling and bandwidth efficiency.
- **Backend API (`api/`) & Database (`db/init/`)**: Lightweight PHP JSON endpoints and MariaDB catalog tables.

## Code Layout
- `web/src/ds/`: Design system tokens (`tokens.js`), theme configuration (`theme.js`), base layout components (`PageShell.jsx`, `SiteHeader.jsx`, `SiteFooter.jsx`, `Shelf.jsx`, `BookCard.jsx`).
- `web/src/home/`: HomePage layout, Hero section, Feature highlights, Audio preview (`HomePage.jsx`, `Feed.jsx`).
- `web/src/books/`: Catalog search, filters, pagination (`Books.jsx`, `BooksSeciton.jsx`, `Filter.jsx`, `GenresSelector.jsx`).
- `web/src/book/`: Book detail, player controls, bookmarks, playlist (`Book.jsx`, `AudioPlayerSection.js`, `Playlist.jsx`, `AddCommentSection.jsx`).
- `web/src/genres/`: Genre catalog and cards (`Genres.jsx`, `GenresView.jsx`).
- `web/src/persons/` & `web/src/person/`: Authors & Narrators directories and profile views (`Persons.jsx`, `Person.jsx`, `PersonCard.jsx`, `PersonBanner.jsx`).
- `web/src/news/`: News listing and article view (`News.jsx`, `NewsSection.jsx`, `NewsView.jsx`).
- `web/src/profile/`: User profile, subscription plans, accessibility settings, bookshelf, history (`Profile.jsx`, `ProfileMenuSection.jsx`, `AccessSection.jsx`, `EditProfileSection.jsx`, `ShelfSection.jsx`, `HistorySection.jsx`).
- `web/src/login/`: Phone number & SMS OTP authentication (`Login.jsx`, `LoginForm.jsx`).
- `web/src/contacts/`: Contact info, social channels, donation links (`Contacts.jsx`).
- `web/src/NotFound.jsx`: 404 error page.
- `web/src/lib/`: Translation dictionary (`translation.json`), translator function (`translator.js`), format utilities (`format.js`).
- `db/init/`: Database initialization and seed scripts (`020-dev-seed.sql`, `030-dev-seed-catalog.sql`).
- `web/src/__tests__/`: Unit and integration test suites (`CI=true npx react-scripts test`).
- `web/e2e/`: Opaque-box requirement-driven E2E test suites (Tiers 1–4).

## Feature Inventory
| # | Feature | Description | Milestone | Source |
|---|---|---|---|---|
| 1 | Global Header & Guest Fix | Fix desktop header displaying guest as logged-in user "M", contrast-accessible search pill and active link tokens, live search trigger | M1 | Survey 1 § R1 |
| 2 | Theming & Contrast Harmonization | Eliminate hardcoded light-mode colors (`#FFFFFF`, `#F7F5EE`, `#0B192C`) across Hero, Shelves, Genres, and Profile; ensure WCAG AA compliance in dark/contrast modes | M1 | Survey 1 § R1, R2, R5, R8 |
| 3 | Mobile (375px) Layout Polish | Redesign `AudioPlayerSection.js` transport controls to avoid clumsy multi-line wrapping; fix `EditProfileSection.jsx` forced flex rows causing horizontal overflow | M1 | Survey 1 § R4, R8 |
| 4 | Translation Engine Fix | Fix `translator.js:25` bypass logic so `translation[verb].RU` is respected for all keys; add missing homepage keys; fix corrupted `"Русский"` entry | M1 | Survey 1 § R0, Survey 3 § 1.1 |
| 5 | Broken Route & Runtime Error Fixes | Fix broken `/ellipse-15.png` in profile, `/pics/book.png` in MediaSession, `/pics/genres.flat/:id.png` in genre banner; fix DateField handler and dead buttons | M1 | Survey 1 § R8, Survey 2 § 1.5 |
| 6 | Bespoke 3D Genre Illustrations | Generate and integrate 12 cohesive, warm 3D editorial illustrations for all genres with transparent bounds and high retina resolution | M2 | Survey 2 § 4.2, ORIGINAL_REQUEST R2 |
| 7 | Feature Highlight & Empty State Visuals | Replace defective `feat_keys.png` and `feat_headphones.png` (chopped text fragments); create empty states for search, bookshelf, history, comments | M2 | Survey 2 § 1.3, 4.3 |
| 8 | 404 & Secondary Visual Assets | Create cohesive 3D editorial 404 illustration, vector soundwave `access_wave.svg`, news fallback, and default avatars (author, narrator, user, book cover) | M2 | Survey 2 § 4.3 |
| 9 | Asset Optimization & Dead Asset Pruning | Convert heavy PNG backgrounds (`hero-bg`, `genres_banner_bg`, etc.) to WebP (93% bandwidth savings); remove 21 dead prototype slices | M2 | Survey 2 § 1.1, 1.7 |
| 10 | Authentic Uzbek Content & Metadata Enrichment | Enrich all 12 genres, 19 authors, narrators, and books in seed catalog with rich literary annotations; fix `Zumrad va Qimmat` attribution; normalize apostrophes | M3 | Survey 3 § 1.1, 4.1 |
| 11 | Backend Date Locale Fix | Replace hardcoded Russian dates (`сегодня`, `вчера`) in `api/news/list.php` with locale-aware client-side formatting | M3 | Survey 3 § 1.1.6, 4.1 |
| 12 | Test Runner & Package Config | Add missing `"test": "react-scripts test"` script to `web/package.json`; address React Router v7 future flag deprecation warnings | M4 | Survey 3 § 1.2, 4.2 |
| 13 | E2E Test Suite Implementation (Tiers 1-4) | Build comprehensive opaque-box E2E test suite covering Feature Coverage, Boundary Cases, State Persistence, and Assistive Tech / Mobile viewports | M4 | Survey 3 § 4.2, ORIGINAL_REQUEST R4 |
| 14 | Full Browser QA & Acceptance | Live browser verification across Desktop (1280px), Tablet (768px), Mobile (375px); zero console errors; screenshot proof of work | M5 | ORIGINAL_REQUEST R4 |

## Milestones
| # | Name | Scope | Dependencies | Status |
|---|---|---|---|---|
| M1 | Core Design System & UX Defect Remediation | Global header guest fix, theming/dark mode token harmonization, mobile 375px layout fixes, translation engine fix, broken links/runtime bug fixes | none | DONE |
| M2 | Bespoke 3D Editorial Visuals Integration | 12 genre 3D illustrations, feature icons, empty states, 404 asset, default avatars, asset optimization & pruning | none | PLANNED |
| M3 | Premium Uzbek Content & Metadata Enrichment | Rich literary catalog annotations, author/narrator bios, genre descriptions, date localization, translation dictionary enrichment | M1 | PLANNED |
| M4 | E2E Testing Suite (Dual Track) | Opaque-box E2E test harness, test runner setup in package.json, Tier 1-4 test suites derived from requirements, publish TEST_READY.md | none | PLANNED |
| M5 | Final Verification & Quality Assurance | 100% E2E test pass, unit tests passing, production build (0 errors/warnings), browser visual QA across 1280px/768px/375px, visual proof artifacts | M1, M2, M3, M4 | PLANNED |

## Interface Contracts
### Design System (`web/src/ds/`) ↔ Views (`home/`, `books/`, `genres/`, `profile/`, etc.)
- All UI surfaces MUST consume tokens from `ds/tokens.js` via `kp.p.*` instead of hardcoding raw hex values like `#FFFFFF`, `#F7F5EE`, `#0B192C`.
- Genre cards render image from `web/src/img/genre_*.png` (or `.webp`) using aspect ratio `250 / 100` with transparent corner bounds.
- Profile avatar fallback MUST resolve without 404 errors (use imported default avatar asset or initials avatar).

### Translation Engine (`web/src/lib/translator.js`) ↔ App Components
- `T(key, countryCode)` MUST check `translation[key][countryCode]` first for all language codes (including `RU` and `UZ`).
- Fallback returns `verb` only when key does not exist in dictionary.
- All keys called in components must be defined in `web/src/lib/translation.json`.

### E2E Test Suite (`web/e2e/` or `web/src/__tests__/e2e/`) ↔ Platform
- Opaque-box requirement-driven testing: interacts with DOM elements via accessible roles, labels, text content, and navigation routes.
- Zero reliance on internal component mock state.
