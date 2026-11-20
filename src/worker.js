const sitePages = [
  "/",
  "/about.html",
  "/gallery.html",
  "/contact-details.html",
  "/destinations/amritsar.html",
  "/destinations/andaman.html",
  "/destinations/arunachal-pradesh.html",
  "/destinations/char-dham-yatra.html",
  "/destinations/cherrapunji.html",
  "/destinations/darjeeling.html",
  "/destinations/gangtok.html",
  "/destinations/goa.html",
  "/destinations/golden-triangle.html",
  "/destinations/gujarat.html",
  "/destinations/hampi.html",
  "/destinations/kashmir.html",
  "/destinations/kerala.html",
  "/destinations/kodaikanal.html",
  "/destinations/lakshadweep.html",
  "/destinations/leh.html",
  "/destinations/maharashtra.html",
  "/destinations/manali.html",
  "/destinations/meghalaya.html",
  "/destinations/munnar.html",
  "/destinations/ooty.html",
  "/destinations/puri.html",
  "/destinations/rajasthan.html",
  "/destinations/rann-of-kutch.html",
  "/destinations/shimla.html",
  "/destinations/sikkim.html",
  "/destinations/uttar-pradesh.html",
  "/destinations/uttarakhand.html"
];

function plainText(value) {
  return value
    .replace(/<[^>]*>/g, "")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'");
}

function escapeAttribute(value) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function sitemapResponse(origin) {
  const entries = sitePages.map((path) => (
    `  <url><loc>${origin}${path === "/" ? "/" : path}</loc></url>`
  ));
  const body = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    ...entries,
    "</urlset>"
  ].join("\n");

  return new Response(body, {
    headers: {
      "content-type": "application/xml; charset=utf-8",
      "cache-control": "public, max-age=3600"
    }
  });
}

function robotsResponse(origin) {
  return new Response(
    `User-agent: *\nAllow: /\nSitemap: ${origin}/sitemap.xml\n`,
    {
      headers: {
        "content-type": "text/plain; charset=utf-8",
        "cache-control": "public, max-age=3600"
      }
    }
  );
}

function addSeoMetadata(html, requestUrl) {
  const titleMatch = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
  const descriptionMatch = html.match(
    /<meta\s+name=["']description["']\s+content=["']([^"']*)["'][^>]*>/i
  );
  const title = escapeAttribute(plainText(titleMatch ? titleMatch[1] : "Jagdish Tour And Travels"));
  const description = escapeAttribute(
    plainText(descriptionMatch ? descriptionMatch[1] : "Travel planning from Barmer, Rajasthan.")
  );
  const pagePath = requestUrl.pathname === "/index.html" ? "/" : requestUrl.pathname;
  const canonical = `${requestUrl.origin}${pagePath}`;
  const metadata = [
    `<link rel="canonical" href="${escapeAttribute(canonical)}">`,
    '<meta property="og:type" content="website">',
    `<meta property="og:title" content="${title}">`,
    `<meta property="og:description" content="${description}">`,
    `<meta property="og:url" content="${escapeAttribute(canonical)}">`,
    '<meta name="twitter:card" content="summary">',
    `<meta name="twitter:title" content="${title}">`,
    `<meta name="twitter:description" content="${description}">`
  ].join("\n  ");

  return html.replace(/<\/head>/i, `  ${metadata}\n</head>`);
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (url.pathname === "/robots.txt") {
      return robotsResponse(url.origin);
    }
    if (url.pathname === "/sitemap.xml") {
      return sitemapResponse(url.origin);
    }

    const response = await env.ASSETS.fetch(request);
    const contentType = response.headers.get("content-type") || "";
    if (!response.ok || request.method !== "GET" || !contentType.includes("text/html")) {
      return response;
    }

    const html = addSeoMetadata(await response.text(), url);
    const headers = new Headers(response.headers);
    headers.delete("content-length");
    headers.delete("content-encoding");
    headers.delete("etag");

    return new Response(html, {
      status: response.status,
      statusText: response.statusText,
      headers
    });
  }
};
