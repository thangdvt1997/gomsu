import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  images: {
    remotePatterns: [],
  },
  // The old static site indexed .html URLs (Google/bookmarks/browser history
  // still point at them) -- redirect them to the new clean-URL equivalents
  // instead of 404ing real visitors following old links.
  async redirects() {
    return [
      { source: "/index.html", destination: "/", permanent: true },
      { source: "/san-pham.html", destination: "/san-pham", permanent: true },
      { source: "/bao-gia.html", destination: "/bao-gia", permanent: true },
      { source: "/gioi-thieu.html", destination: "/gioi-thieu", permanent: true },
      { source: "/lien-he.html", destination: "/lien-he", permanent: true },
      { source: "/tin-tuc.html", destination: "/tin-tuc", permanent: true },
      { source: "/san-pham/:slug.html", destination: "/san-pham/:slug", permanent: true },
      { source: "/tin-tuc/:slug.html", destination: "/tin-tuc/:slug", permanent: true },
    ];
  },
};

export default nextConfig;
