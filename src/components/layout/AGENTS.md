<agents-mem-context>
# Recent Activity

<!-- Directory: src/components/layout/ -->

### Feb 22, 2026

| ID | Time | T | Title | Read |
|----|------|---|-------|------|
| #1 | 1:45 PM | ✅ | Extracted Header and Footer from page.tsx | ~300 |
| #2 | 1:52 PM | 🔴 | Fixed Tailwind v4 gradient classes (bg-gradient → bg-linear) | ~80 |

</agents-mem-context>

## Module Info

- **Path**: src/components/layout/
- **Purpose**: Layout components used across all pages
- **Related**: src/app/[locale]/layout.tsx, src/components/home/

## Components

| File | Purpose | Lines |
|------|---------|-------|
| Header.tsx | Navigation, logo, language selector, auth buttons | ~45 |
| Footer.tsx | Site footer with links and city list | ~18 |
| LanguageSelector.tsx | i18n locale switcher dropdown | ~30 |

## Dependencies

- framer-motion: Animation
- lucide-react: Icons (Flame, LogIn, Menu, User, X)
- @/components/ui/button: Button component
- next-intl: Locale routing
