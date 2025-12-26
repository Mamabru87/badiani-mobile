# Badiani Training Orbit – AI guide

## Stack and layout
- Static multi-page site (no bundler/build); open HTML directly or via a simple static server. Core assets: `styles/site.css`, `scripts/site.js`.
- Vanilla JS with IIFEs; no modules. DOM is driven by data attributes (e.g., `data-carousel`, `data-menu-*`, `data-toggle-card`). Preserve these hooks when editing.
- Design tokens and typography live in `:root` of `styles/site.css` (brand blues/rose/gold, `--radius-*`, `--anim-*`, fonts SuperGrotesk). Keep new styles aligned to these variables.

## Pages and components
- `index.html` is the hub (Orbit cockpit) showing performance, profile, history, and nav tokens injected by JS. Other modules: `caffe.html`, `sweet-treats.html`, `pastries.html`, `slitti-yoyo.html`, `gelato-lab.html`, `festive.html`, `story-orbit.html`.
- Content pages use carousels: wrapper `section.carousel[data-carousel="…"]` with `data-carousel-track` and `article.guide-card[data-carousel-item]`. Cards include `.tag-row`, title, media, summary copy, optional `.stat-list`, a `data-toggle-card` button, and a `.details` block (steps/tips) that JS reveals.
- Story Orbit uses `.story-experience` with `data-story-target/panel` buttons and fullscreen modal (`data-story-modal`). Match existing ARIA labels and classes when extending.


## State, profiles, and gamification (scripts/site.js)
- Profile gate blocks the app until a user is created/logged in; data lives in localStorage keys `badianiUser.profile.v1` and `badianiUser.profiles`. Changing nickname/gelato is done via overlay modals.
- Gamification state is per profile under `badianiGamification.v3:<profileId>` (fallback `badianiGamification.v3`). `defaultState` defines stars, quiz tokens, progress, cooldowns, history, etc. Daily rollover resets stars/progress and snapshots to history.
- Flow: opening cards increments stars; every 3 stars => quiz token; perfect quiz adds gelato; cooldown prevents back-to-back gelati (24h with reductions). Challenges trigger every 3 stars; wrong answers subtract stars/tokens. Audio cues (web audio) play on rewards.
- UI updates via `updateUI`: nav tokens, cooldown hints, card checkmarks, summary stats (performance, wrong list, daily history). Avoid breaking selectors used there (`[data-*]` hooks listed above).

## Navigation, search, overlays
- Nav shell includes burger menu (drawer `[data-menu-drawer]`) and inline menu panel (`[data-menu-panel]`). JS manages aria-expanded/hidden and body scroll lock; keep markup consistent.
- Search suggestions in the drawer come from `allProducts` in `site.js` (built from hardcoded arrays). Add new products there to make them searchable.
- Popovers (nav tokens) use `data-popover-toggle/panel`; overlays use `openOverlay/closeOverlay` helpers and lock body scroll. Respect `data-lock-close` usage for quizzes/challenges.

## Content authoring patterns
- When adding guide cards, follow existing structure and tone (Italian training copy, concise steps, upselling tips). Include `data-page-stars` updates at the top hero to reflect card count.
- Keep media as `<picture>` with webp + jpg fallbacks under `assets/`; follow existing naming (`assets/<section>-<item>.webp/jpg`).
- Use inline HR separators and bolded labels in details as seen in current cards; avoid changing class names the JS relies on (`guide-card`, `details`, `btn-ghost`, etc.).

## Styling and UX conventions
- Homepage has special compact cockpit CSS (see `COCKPIT_COMPACT` block) and `.page-home` overrides; avoid removing those selectors if tweaking hero/cockpit.
- Carousels rely on horizontal scrolling and snap; keep widths `min(420px, calc(100% - 20px))` when cloning cards to maintain scroll feel.
- Accessibility: maintain aria labels on dialogs, menu buttons, story modal, and popovers; Escape closes drawers/overlays; focus is restored by JS.

## Development workflow
- No build/test commands; edit HTML/CSS/JS directly. Use cache-busting query params on hub (`?v=...`) when shipping static updates.
- To validate behavior, open pages in a browser with localStorage enabled; clear relevant keys to test fresh profile (`badianiUser.*`, `badianiGamification.v3*`).

## Quick references
- Core logic: `scripts/site.js` (nav/drawer, search, profile gate, gamification, carousels, overlays).

- Styling system and tokens: `styles/site.css` (fonts, brand palette, layout for hero, carousels, cockpit).
