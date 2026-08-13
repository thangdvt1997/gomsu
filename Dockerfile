# Static site (generated HTML/CSS/JS, no build step) served by nginx.
FROM nginx:1.27-alpine

COPY nginx.conf /etc/nginx/conf.d/default.conf

# Only ship the generated static output — not the Python generator/tools.
COPY site/index.html site/san-pham.html site/bao-gia.html site/gioi-thieu.html \
     site/lien-he.html site/tin-tuc.html site/404.html site/robots.txt site/sitemap.xml \
     /usr/share/nginx/html/
COPY site/san-pham/ /usr/share/nginx/html/san-pham/
COPY site/tin-tuc/ /usr/share/nginx/html/tin-tuc/
COPY site/assets/ /usr/share/nginx/html/assets/

EXPOSE 80
HEALTHCHECK --interval=30s --timeout=3s --retries=3 \
  CMD wget -qO- http://localhost/ >/dev/null || exit 1
