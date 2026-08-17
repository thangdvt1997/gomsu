import Link from "next/link";
import type { Metadata } from "next";
import { COMPANY } from "@/lib/site-config";
import { ContactForm } from "@/components/site/ContactForm";

export const metadata: Metadata = {
  title: "Contact & Order",
  description: "Leave your details or contact us directly — we reply with a quote within 30 business minutes.",
  alternates: { languages: { vi: "/lien-he", en: "/en/lien-he" } },
};

export default function EnglishContactPage() {
  return (
    <>
      <div className="page-hero">
        <img className="bg" src="/media/site/lifestyle-2.jpg" alt="" />
        <div className="container">
          <div className="breadcrumb">
            <Link href="/en">Home</Link>
            <span>/</span>
            <span>Contact</span>
          </div>
          <h1>Contact &amp; Order</h1>
          <p style={{ maxWidth: "60ch", color: "rgba(255,255,255,.82)" }}>
            Leave your details or contact us directly — we reply with a quote within 30 business
            minutes.
          </p>
        </div>
      </div>
      <section>
        <div className="container contact-layout">
          <div data-reveal>
            <h2 style={{ fontSize: "1.5rem" }}>Workshop Info</h2>
            <div className="info-card">
              <div className="ic">📍</div>
              <div>
                <h4>Workshop Address</h4>
                <p>{COMPANY.addressEn}</p>
              </div>
            </div>
            <div className="info-card">
              <div className="ic">📞</div>
              <div>
                <h4>Wholesale Hotline</h4>
                <p>
                  <a href={`tel:${COMPANY.phone1Tel}`}>{COMPANY.phone1}</a> —{" "}
                  <a href={`tel:${COMPANY.phone2Tel}`}>{COMPANY.phone2}</a>
                </p>
              </div>
            </div>
            <div className="info-card">
              <div className="ic">💬</div>
              <div>
                <h4>Zalo / Messenger</h4>
                <p>Message us with photos of designs you like for the fastest quote.</p>
              </div>
            </div>
            <div className="info-card">
              <div className="ic">✉</div>
              <div>
                <h4>Email</h4>
                <p>
                  <a href={`mailto:${COMPANY.email}`}>{COMPANY.email}</a>
                </p>
              </div>
            </div>
            <div className="info-card">
              <div className="ic">🕐</div>
              <div>
                <h4>Working Hours</h4>
                <p>7:30 AM – 6:00 PM, every day of the week including weekends</p>
              </div>
            </div>
            <div className="map-frame">
              <iframe
                src="https://www.google.com/maps?q=Giang+Cao,+Bát+Tràng,+Gia+Lâm,+Hà+Nội&output=embed"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Map to Gốm Sứ Trung Mừng workshop"
              />
            </div>
          </div>
          <div data-reveal>
            <h2 style={{ fontSize: "1.5rem" }}>Send a Quote Request</h2>
            <p style={{ color: "var(--ink-soft)" }}>
              Fill in the details below and we&apos;ll call you back at the number you provide.
            </p>
            <ContactForm locale="en" />
          </div>
        </div>
      </section>
    </>
  );
}
