# Cartage Australia website upgrade

Implemented:
- Unique titles and meta descriptions for every page
- Canonical URLs, Open Graph and Twitter metadata
- Organization, Breadcrumb, Person and VideoObject structured data
- sitemap.xml, robots.txt, site.webmanifest, 404 page and redirect rules
- Skip links, improved focus styles, reduced-motion handling and video controls
- Scroll reveals, staggered cards, count-up statistics and scrolled header state
- Sticky on-page navigation for long subpages
- Structured quote enquiry modal and mobile call/quote action bar
- Lazy loading and intrinsic dimensions for local images
- Video pause/play based on visibility
- Internal page transitions with progressive fallback

Deployment steps:
1. Upload the complete folder to the web host.
2. Configure the live domain as https://www.cartageaustralia.com.
3. Ensure .htaccess is enabled on Apache, or use _redirects on Netlify-compatible hosting.
4. Submit /sitemap.xml in Google Search Console.
5. Test schema in Google Rich Results Test.
6. Add Google Analytics 4 and Search Console verification IDs once available.
7. Configure the quote form with a server-side form endpoint when desired; the current version prepares a prefilled email and stores no data.
8. Validate Core Web Vitals after deployment and convert the largest JPG files to AVIF/WebP through the production CDN.
