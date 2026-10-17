# E2E Test Infra: KitobPlus

## Test Philosophy
- **Opaque-Box & Requirement-Driven**: Tests are derived strictly from `ORIGINAL_REQUEST.md` user requirements and user-facing specifications, not internal component implementation details.
- **Methodology**: Category-Partition + Boundary Value Analysis (BVA) + Pairwise Interaction Testing + Real-World Workload Testing (Tiers 1–4).
- **Zero False-Success**: Tests must assert on actual rendered text, accessible roles (`banner`, `main`, `navigation`, `button`, `tab`), attributes, and route state.

## Feature Inventory
| # | Feature | Source (Requirement) | Tier 1 (Happy Path) | Tier 2 (Boundaries) | Tier 3 (Pairwise/State) |
|---|---|---|:---:|:---:|:---:|
| 1 | Global Header & Navigation | ORIGINAL_REQUEST § R1 | 5 | 5 | ✓ |
| 2 | Home Page & Audio Preview | ORIGINAL_REQUEST § R1, R2 | 5 | 5 | ✓ |
| 3 | Books Catalog & Filtering | ORIGINAL_REQUEST § R1 | 5 | 5 | ✓ |
| 4 | Book Detail & Audio Player | ORIGINAL_REQUEST § R1 | 5 | 5 | ✓ |
| 5 | Genres Directory & 12 Genre Cards | ORIGINAL_REQUEST § R2 | 5 | 5 | ✓ |
| 6 | Authors & Narrators Profiles | ORIGINAL_REQUEST § R1, R3 | 5 | 5 | ✓ |
| 7 | News & Editorial Articles | ORIGINAL_REQUEST § R1, R3 | 5 | 5 | ✓ |
| 8 | User Profile & Settings | ORIGINAL_REQUEST § R1 | 5 | 5 | ✓ |
| 9 | Authentication & SMS Flow | ORIGINAL_REQUEST § R1 | 5 | 5 | ✓ |
| 10 | Theming & Accessibility Modes | ORIGINAL_REQUEST § R1, R4 | 5 | 5 | ✓ |
| 11 | Language Switching (UZ/RU/US) | ORIGINAL_REQUEST § R1, R3 | 5 | 5 | ✓ |
| 12 | 404 Route & Error Recovery | ORIGINAL_REQUEST § R1, R2 | 5 | 5 | ✓ |

## Test Architecture
- **Framework**: Jest + React Testing Library + DOM simulation / Browser Runner in `web/src/__tests__/e2e/`.
- **Package Script**: `npm test` and `CI=true npx react-scripts test --watchAll=false`.
- **Pass/Fail Semantics**: All test suites must exit with code 0. Zero warnings, zero console errors.

## Real-World Application Scenarios (Tier 4)
| # | Scenario | Features Exercised | Complexity |
|---|---|---|---|
| 1 | Visually Impaired Reader Discovery | High Contrast mode, Keyboard tab navigation, skip link, Screen reader announcements, Audio sample playback | High |
| 2 | Multilingual Literature Seeker | Language switcher UZ -> RU -> US, Browse World Classics, Audio speed 1.25x, Bookmarks | High |
| 3 | Mobile Commuter Journey | 375px mobile viewport, Catalog search, Genre chip filter, Chapter playlist seek | High |
| 4 | Authenticated Member Bookshelf | SMS login, add book to personal shelf, verify sync in /profile, logout | Medium |
| 5 | Edge Network & Error Resilience | Offline audio recovery, 404 navigation return, empty search filter reset | Medium |

## Coverage Thresholds
- **Tier 1 (Feature Coverage)**: ≥5 test cases per feature (12 × 5 = 60 test points).
- **Tier 2 (Boundary & Corner Cases)**: ≥5 test cases per feature (60 test points).
- **Tier 3 (Cross-Feature Combinations)**: ≥12 pairwise integration tests.
- **Tier 4 (Real-World Scenarios)**: 5 comprehensive end-to-end user journeys.
