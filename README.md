<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/7057a355-fa0d-4f23-ad54-473bcbbfd74c

## Run Locally

**Prerequisites:** Node.js

1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`

## Content Management Rule

All new user-facing elements must be wired to the dashboard so they can be edited later.

When adding a new text, link, media source, CTA label, or animation parameter:

1. Add it to `src/config/siteConfig.ts` with a default value.
2. Add fallback parsing in `hydrateSiteConfig`.
3. Add an editor control in `src/pages/Dashboard.tsx`.
4. Read it from `useSiteConfig()` in the related component.
# portfolio-cinematic
