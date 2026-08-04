# JVC Catering — Refined Production Website

This package is a complete, editable, static website built with HTML, CSS and JavaScript.

## Main files

```text
index.html                 Main website
css/styles.css             Mobile-first responsive design
js/main.js                 Navigation, translations, tabs and quote form
images/                    Optimized local images
privacy.html               Basic privacy notice
terms.html                 Basic website terms
404.html                   Error page
.htaccess                  Apache security/performance configuration
vercel.json                Vercel security/performance configuration
robots.txt                 Crawler instructions
sitemap.xml                Search-engine sitemap
site.webmanifest           Installable-site metadata
AUDIT_REPORT.md            Full audit and implementation record
tests/smoke_test.py        Optional Chromium smoke test
```

## Apache, InfinityFree or Contabo deployment

1. Back up the current live website.
2. Open the domain's document root, commonly `public_html`, `htdocs`, or `/var/www/<domain>/public`.
3. Upload the **contents** of this folder.
4. Ensure `.htaccess` is uploaded; hidden files are sometimes skipped by file managers.
5. Confirm that Apache modules used by `.htaccess` are available. Unsupported sections are protected with `<IfModule>` and will be skipped safely.
6. Open the home page, privacy page, terms page, and a nonexistent URL to confirm 404 handling.
7. Test the WhatsApp quote flow on a real phone.

## Vercel deployment

Upload the folder as a static project. Keep `vercel.json` in the project root.

## Important URL update

The metadata currently uses:

```text
https://jvc-catering.vercel.app/
```

When a custom domain becomes primary, replace this URL in:

- `index.html`
- `privacy.html`
- `terms.html`
- `robots.txt`
- `sitemap.xml`

## Contact-number confirmation

The old backup contained two different numbers:

```text
+255 767 602 509
+255 767 620 509
```

The refined website uses **+255 767 602 509** because that number appeared in the original quote form and primary contact section. Confirm it before going live.

## Local test

From this folder, run:

```bash
python3 -m http.server 8080
```

Then open:

```text
http://localhost:8080
```

## Optional automated smoke test

The included test requires Python Playwright and a Chromium executable:

```bash
python tests/smoke_test.py
```

The latest included validation passed at mobile, tablet, and desktop viewport sizes.

## No build step required

The website does not require Node.js, npm, React, Vite, or a compilation step. Edit the HTML, CSS, or JavaScript files directly and upload them.
