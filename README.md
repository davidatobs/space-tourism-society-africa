# Space Tourism Society Africa — Official Website

Clean, dependency-free static website built with semantic **HTML5**, **CSS3**, and vanilla **JavaScript** for **Space Tourism Society Africa (STSA)** — headquartered in Ibadan, Oyo State, Nigeria, affiliated with **Space Tourism Society** (Los Angeles, USA), and supervised in partnership with **NASRDA's Centre for Atmospheric Research (CAR)**.

## Project Structure

```text
.
├── index.html          # Overview: Mandate, Leadership, Interactive Programmes, 2003–2027 Milestones, Secretariat
├── programmes.html     # Complete 12-point charter register & 2026–2027 international delegations
├── membership.html     # Chapter pathways, standing directorates & official membership application
├── css/
│   └── styles.css      # Custom properties, responsive grid, accessible typography & print styles
├── js/
│   └── main.js         # Mobile menu, WAI-ARIA tabs, milestone filter & static mailto/receipt builder
├── assets/
│   ├── fonts/          # Self-hosted Space Grotesk & Inter (.woff2) — zero external CDN dependency
│   └── images/         # Official STSA wordmark/emblem, founder archival photos & public-domain NASA imagery
└── .nojekyll           # Ensures clean asset serving on GitHub Pages
```

## Run Locally

Open `index.html` directly in any modern browser, or start a local static server:

```bash
python3 -m http.server 8000
```

Then visit `http://localhost:8000`.

## Deploy to GitHub Pages

1. Create a new repository on GitHub (for example `space-tourism-society-africa`).
2. Push this directory directly to `main`:

```bash
git init
git add .
git commit -m "Initial commit: Space Tourism Society Africa website"
git branch -M main
git remote add origin https://github.com/<your-username>/space-tourism-society-africa.git
git push -u origin main
```

3. In GitHub, open **Settings → Pages**, set **Source** to **Deploy from a branch** (`main` / `/ (root)`), and save.
