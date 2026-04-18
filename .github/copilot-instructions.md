# Project Rules for Copilot

## Dashboard-First Editing Policy

- Any new user-facing element must be editable from the dashboard.
- For every new text, link, media source, button label, or animation setting:
  - Add its schema and default value in `src/config/siteConfig.ts`.
  - Add safe parsing/fallback in `hydrateSiteConfig`.
  - Add editing controls in `src/pages/Dashboard.tsx`.
  - Read the value in UI components through `useSiteConfig()` instead of hardcoded literals.

## Definition of Done for UI Additions

- No new hardcoded user-facing content in components.
- Dashboard updates persist through localStorage via `SiteConfigContext`.
- Reset defaults still works for the new fields.
