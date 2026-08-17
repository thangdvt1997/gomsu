import Link from "next/link";
import type { Metadata } from "next";
import { COMPANY } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "About Us — Keeping the Bat Trang Ceramic Craft Alive",
  description:
    "From Red River clay to ceramic vases found in thousands of homes, cafés and event spaces across Vietnam.",
  alternates: { languages: { vi: "/gioi-thieu", en: "/en/gioi-thieu" } },
};

export default function EnglishAboutPage() {
  return (
    <>
      <div className="page-hero">
        <img className="bg" src="/media/site/workshop-1.jpg" alt="" />
        <div className="container">
          <div className="breadcrumb">
            <Link href="/en">Home</Link>
            <span>/</span>
            <span>About</span>
          </div>
          <h1>Keeping the Bat Trang Ceramic Craft Alive</h1>
          <p style={{ maxWidth: "60ch", color: "rgba(255,255,255,.82)" }}>
            From Red River clay to ceramic vases found in thousands of homes, cafés and event
            spaces across Vietnam.
          </p>
        </div>
      </div>
      <section>
        <div className="container grid-2" style={{ alignItems: "center" }}>
          <div data-reveal>
            <span className="eyebrow">Our story</span>
            <h2>{COMPANY.name} — A Handcraft Ceramic Vase Workshop in Giang Cao, Bat Trang</h2>
            <p>
              Located in Giang Cao hamlet — the heart of the Bat Trang ceramic craft village, the{" "}
              {COMPANY.name} workshop produces ceramic vases in 60+ designs, from mini tabletop
              pieces to large statement designs for lobbies and hotels. Every product goes through
              hand-throwing or molding, natural air-drying, glazing and high-temperature firing to
              ensure durability and true-to-color glazes.
            </p>
            <p>
              We serve both retail ceramics lovers and wholesale partners: flower shops, café
              chains, homestays, hotels and event organizers nationwide — with a commitment to
              factory-direct pricing, careful packaging, and support for custom design development.
            </p>
          </div>
          <div>
            <img
              src="/media/site/workshop-2.jpg"
              alt="Ceramic artisan at work at Gốm Sứ Trung Mừng workshop"
              style={{ borderRadius: "var(--radius-l)", boxShadow: "var(--shadow-m)" }}
            />
          </div>
        </div>
      </section>
      <section className="bg-alt">
        <div className="container">
          <div className="section-head center" data-reveal>
            <span className="eyebrow">Process</span>
            <h2>From Raw Clay to Finished Product</h2>
          </div>
          <div className="timeline" data-reveal>
            <div className="step">
              <div className="num">01</div>
              <h3>Shaping</h3>
              <p>Hand-thrown on a pottery wheel or molded depending on the design, ensuring precise proportions in every detail.</p>
            </div>
            <div className="step">
              <div className="num">02</div>
              <h3>Drying &amp; Trimming</h3>
              <p>The clay body is air-dried naturally, then the surface is refined before the initial bisque firing.</p>
            </div>
            <div className="step">
              <div className="num">03</div>
              <h3>Glazing</h3>
              <p>Glaze is applied per the ordered color tone — cool, drip, or matte glazes each create their own distinct effect.</p>
            </div>
            <div className="step">
              <div className="num">04</div>
              <h3>Firing &amp; Inspection</h3>
              <p>Fired at high temperature, then each piece is carefully inspected before being packed for shipping.</p>
            </div>
          </div>
        </div>
      </section>
      <section>
        <div className="container">
          <div className="section-head center" data-reveal>
            <span className="eyebrow">Workshop corner</span>
            <h2>A Day at the Ceramic Workshop</h2>
          </div>
          <div className="about-gallery" data-reveal>
            {[1, 2, 3, 4, 5, 6, 7].map((n) => (
              <img
                key={n}
                className={n === 1 ? "tall" : ""}
                src={`/media/site/workshop-${n}.jpg`}
                alt={`Gốm Sứ Trung Mừng workshop in Bat Trang ${n}`}
                loading="lazy"
              />
            ))}
          </div>
        </div>
      </section>
      <section className="bg-alt">
        <div className="container">
          <div className="cta-band" data-reveal>
            <div>
              <h2>Visit our Bat Trang workshop</h2>
              <p>{COMPANY.addressEn} — partners are welcome to visit the workshop and select designs in person.</p>
            </div>
            <Link className="btn btn-ghost" href="/en/lien-he">
              Get Directions
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
