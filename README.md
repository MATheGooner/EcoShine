# EcoShine

EcoShine is a fictional Dublin cleaning-company website built as a portfolio demonstration. It shows how a focused service-business website can present services, establish trust, explain indicative pricing, and collect better-qualified quote requests without unnecessary full-stack infrastructure.

## Stack

- React and JavaScript
- Vite
- React Router
- Plain CSS
- Node's built-in test runner

There is no database, authentication, payment system, account area, or custom backend.

## Features

- Responsive conversion-focused homepage
- Data-driven service pages and Dublin service areas
- Accessible navigation and FAQ accordion
- Five-step quote request with `useReducer`, validation, residential/commercial branching, service-specific frequencies and add-ons
- Dublin routing-key demonstration validation
- Safe demo confirmation flow with no personal-data persistence
- Route metadata, canonical URLs, Open Graph/Twitter tags and Schema.org structured data
- Sitemap, robots file and static-host SPA fallbacks
- Optional Formspree delivery configured through an environment variable

## Project structure

```text
src/
  components/  # layout, home, quote and shared UI
  data/        # business, services and FAQs
  hooks/       # quote-form reducer
  pages/       # routed page components
  services/    # optional form delivery
  styles/      # tokens, global, components, forms, responsive
  utils/       # reusable quote validation
```

## Local setup

```bash
npm install
npm run dev
```

Production checks:

```bash
npm test
npm run build
npm run preview
npm audit
```

## Routes

- `/`
- `/services/regular-home-cleaning`
- `/services/deep-cleaning`
- `/services/end-of-tenancy-cleaning`
- `/services/small-office-cleaning`
- `/quote`
- `/thank-you`
- catch-all 404 experience

## Optional form delivery

The quote form stays in demo mode when no endpoint is configured. To enable Formspree, copy `.env.example` to `.env.local` and set:

```text
VITE_FORMSPREE_ENDPOINT=https://formspree.io/f/yourFormId
```

Only HTTPS Formspree form endpoints are accepted. Vite environment variables are public build-time configuration, so never place secrets in them.

## Deployment

Run `npm run build` and deploy `dist/`. `public/_redirects` provides a Netlify/Cloudflare Pages SPA fallback; `vercel.json` provides the equivalent Vercel rewrite.

Before deploying under a real domain:

1. Set `VITE_SITE_URL` to the production origin.
2. Replace `https://ecoshine.ie` in `public/robots.txt` and `public/sitemap.xml` if the deployment uses another domain.
3. Verify that direct requests to every routed URL return `index.html`.

## Limitations

- EcoShine, its contact details, claims and prices are fictional portfolio content.
- The local service-area check is illustrative and does not use the live Eircode database.
- Preferred dates do not represent live cleaner availability.
- Without a configured Formspree endpoint, no quote information leaves the browser or persists after navigation.
