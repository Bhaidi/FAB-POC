# FAB Access Portal

A production-ready **frontend-only** corporate portal inspired by FAB-style enterprise banking UX. Built with Next.js 14 (App Router), TypeScript, Chakra UI, and stub-only pages—no backend, auth, or API integration.

## Tech stack

- **Next.js 14+** with App Router
- **TypeScript**
- **Chakra UI** (theme-first; Graphik typography, design-system colors)
- **React Icons**
- **Framer Motion** (installed for future use)
- Responsive, modular structure

## Getting started

```bash
# Install dependencies (if not already done)
npm install

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). Use **Main Portal Login** or **Developer Portal** to try the flows.

```bash
# Production build
npm run build

# Start production server
npm start
```

## Project structure

```
├── app/                    # Next.js App Router
│   ├── layout.tsx          # Root layout (fonts, Chakra provider)
│   ├── page.tsx            # Home (entry point)
│   ├── login/              # Main portal login
│   ├── mobile-setup/       # Device registration stub
│   ├── verify/             # OTP verification stub
│   ├── dashboard/          # Post-login dashboard + settings
│   └── developer/          # Developer portal
│       ├── login/
│       └── verify/
├── components/
│   ├── providers.tsx       # Chakra provider wrapper
│   └── shared/             # Reusable UI
│       ├── AppShell.tsx
│       ├── AuthLayout.tsx
│       ├── HeroPanel.tsx
│       ├── FormInput.tsx
│       ├── OTPInput.tsx
│       ├── FeatureCard.tsx
│       ├── SideNav.tsx
│       ├── TopBar.tsx
│       ├── CountrySelector.tsx
│       ├── CurrencyRatesCard.tsx
│       ├── ExploreSolutions.tsx
│       └── EmptyStateCard.tsx
├── features/               # Feature-specific modules (extend here)
├── layouts/                # Optional layout wrappers (extend here)
├── theme/
│   ├── index.ts            # Main dark corporate theme
│   └── developer.ts        # Developer portal theme variant
├── data/                   # Mock data (replace with API later)
│   ├── portal-tiles.ts
│   ├── countries.ts
│   ├── exchange-rates.ts
│   ├── user-profile.ts
│   └── developer-bullets.ts
├── types/
│   └── index.ts            # Shared TypeScript types
└── public/
    └── assets/             # Static assets (e.g. logos)
```

## Pages and flows

| Route | Description |
|-------|-------------|
| `/` | Home; links to Main Portal and Developer Portal |
| `/login` | Main portal sign-in (stub → submits to `/verify`) |
| `/mobile-setup` | Device registration stub; “Done” → `/login` |
| `/verify` | OTP verification stub; “Verify” → `/dashboard` |
| `/dashboard` | Post-login dashboard (tiles, rates card) |
| `/dashboard/settings` | Settings stub |
| `/developer/login` | Developer portal sign-in (stub → `/developer/verify`) |
| `/developer/verify` | Developer 2FA stub; “Verify” → `/dashboard` |

All navigation is client-side; no real auth or API calls.

## Stubbed for future integration

- **Auth**: Login, mobile setup, and verify pages have `// TODO` where real auth/API calls will go (e.g. `POST /api/auth/login`, OTP verification).
- **User profile**: `TopBar` and dashboard use `data/user-profile.ts`; replace with auth context or `/api/me`.
- **Exchange rates**: `CurrencyRatesCard` uses `data/exchange-rates.ts`; replace with live rates API.
- **Countries**: `CountrySelector` uses `data/countries.ts`; replace with API or static build-time data.
- **Portal tiles**: `ExploreSolutions` uses `data/portal-tiles.ts`; replace with CMS or config API.
- **Developer bullets**: Developer login page uses `data/developer-bullets.ts`; can be driven by API later.

Search the repo for `TODO` to find all integration points.

## Design system

- **Typography**: Graphik (fallback: sans-serif). Weights: 300 (light), 400 (body), 500 (buttons/labels), 600 (headings). Font size scale: `xs` 12px → `6xl` 120px. Line heights: 110% (hero), 120% (body/menu), 140% (descriptions).
- **Font loading**: `app/globals.css` declares `@font-face` for Graphik (Light, Regular, Medium, Semibold). Add `.woff2` files under `public/fonts/` or point the `src` URLs to your font provider.
- **Colors**: Brand blues (e.g. `#000245`, `#010227`, `#003087`), hero gradient, link/CTA blue `#0f62fe`, neutrals (page bg `#f2f2f3`, main text `#242e3d`), semantic (success `#14a155`). All tokens in `theme/index.ts`.
- **Layout**: Breakpoints 480 / 768 / 992 / 1280 / 1536px. Spacing scale 4px–192px. Border radius: `sm` 8px, `md` 10px, `lg` 16px, `xl` 100px (pills). Buttons min-height 44px; inputs min-height 44px, radius 10px; container padding 16px (mobile) / 48px (desktop).

## Theme

- **Main portal**: Light base (neutral page bg), brand blue header/sidebar, white cards, CTA blue `#0f62fe`.
- **Developer portal**: Dark header background with tech accent (cyan). Theme tokens in `theme/index.ts` and `theme/developer.ts`.

## Design notes

- Grey reference screens = UX wireframes; blue = UI direction. No copyrighted assets; use placeholder logo text where needed.
- Layout and components are built to be extended with real APIs and auth without changing structure.

## License

Private / internal use. Replace placeholder branding and assets as required.
