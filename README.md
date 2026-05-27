# QR Code Generator

A single-page QR code generator built with Vue 3. Supports URL, plain text, vCard contact, email, phone, SMS, and WiFi credential types. QR codes render as inline SVG and can be downloaded as PNG or SVG.

Live site: https://beausmith.github.io/qr-code/

## Local Development

```bash
npm install
npx serve
```

Open http://localhost:3000.

## Running Tests

End-to-end tests use Playwright.

```bash
npm install
npx playwright install chromium
npm test
```

View the HTML report after a run:

```bash
npm run test:report
```

## Production

No build step — the app is a static `index.html` with vendored dependencies (`vendor/`). Deploy the repo root to any static hosting.

To update `gh-pages`:

```bash
git push origin main:gh-pages
```
