# Jagdish Tour And Travels

A lightweight static travel website built with HTML, CSS, and JavaScript. It has no package installation or build step.

## Project structure

```text
.
├── index.html
├── about.html
├── contact-details.html
├── gallery.html
├── destinations/
│   └── *.html
├── css/
│   ├── about.css
│   ├── booking.css
│   ├── contact-details.css
│   ├── destinations.css
│   ├── gallery.css
│   ├── home.css
│   ├── language-switcher.css
│   └── location-map.css
├── js/
│   ├── booking-whatsapp.js
│   ├── destination-preview.js
│   ├── language-switcher.js
│   └── navigation.js
├── assets/
│   ├── vehicles/
│   └── images, logo, and contact resources
└── docs/
    └── Jagdish_Tour_and_Travels_Website_Content.md
```

## Deploy to Cloudflare Workers

This project uses Workers Static Assets. There is no build step.

1. Install Node.js LTS if it is not already installed.
2. From the project root, authenticate with Cloudflare:

   ```sh
   npx wrangler@latest login
   ```

3. Preview the site locally:

   ```sh
   npx wrangler@latest dev
   ```

4. Deploy it:

   ```sh
   npx wrangler@latest deploy
   ```

Wrangler reads `wrangler.jsonc`, uploads the site files and prints the `workers.dev` URL. The Worker generates `robots.txt` and `sitemap.xml` for the active hostname, and adds canonical and social-sharing metadata to HTML responses. `.assetsignore` keeps source/configuration files and internal docs out of the public assets.

After deployment, check the homepage, `/robots.txt`, and `/sitemap.xml` on the printed URL. Add the sitemap URL in Google Search Console and Bing Webmaster Tools. You can later attach a custom domain in the Cloudflare dashboard; canonical links and the sitemap automatically use the request hostname.

## SEO notes

Each HTML page has its own title and description. The Worker adds canonical URLs, Open Graph and Twitter metadata, and serves the sitemap and robots policy. When adding a public HTML page, add its URL to `sitePages` in `src/worker.js` so it is included in the sitemap. The homepage also provides TravelAgency structured data. Search rankings are not guaranteed; keep page copy accurate and useful, ensure destination content is original, and submit the sitemap after deployment.
