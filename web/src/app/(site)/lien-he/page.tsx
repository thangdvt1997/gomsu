import Link from "next/link";
import type { Metadata } from "next";
import { COMPANY } from "@/lib/site-config";
import { ContactForm } from "@/components/site/ContactForm";

export const metadata: Metadata = {
  title: "Liên Hệ Đặt Hàng",
  description: "Để lại thông tin hoặc liên hệ trực tiếp — xưởng phản hồi báo giá trong vòng 30 phút làm việc.",
};

export default function ContactPage() {
  return (
    <>
      <div className="page-hero">
        <img className="bg" src="/media/site/lifestyle-2.jpg" alt="" />
        <div className="container">
          <div className="breadcrumb">
            <Link href="/">Trang chủ</Link>
            <span>/</span>
            <span>Liên hệ</span>
          </div>
          <h1>Liên Hệ Đặt Hàng</h1>
          <p style={{ maxWidth: "60ch", color: "rgba(255,255,255,.82)" }}>
            Để lại thông tin hoặc liên hệ trực tiếp — xưởng phản hồi báo giá trong vòng 30 phút làm
            việc.
          </p>
        </div>
      </div>
      <section>
        <div className="container contact-layout">
          <div data-reveal>
            <h2 style={{ fontSize: "1.5rem" }}>Thông tin xưởng</h2>
            <div className="info-card">
              <div className="ic">📍</div>
              <div>
                <h4>Địa chỉ xưởng</h4>
                <p>{COMPANY.address}</p>
              </div>
            </div>
            <div className="info-card">
              <div className="ic">📞</div>
              <div>
                <h4>Hotline đặt sỉ</h4>
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
                <p>Nhắn tin để gửi ảnh mẫu &amp; nhận báo giá nhanh nhất.</p>
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
                <h4>Giờ làm việc</h4>
                <p>7:30 – 18:00 tất cả các ngày trong tuần, kể cả cuối tuần</p>
              </div>
            </div>
            <div className="map-frame">
              <iframe
                src="https://www.google.com/maps?q=Giang+Cao,+Bát+Tràng,+Gia+Lâm,+Hà+Nội&output=embed"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Bản đồ xưởng gốm Gốm Sứ Trung Mừng"
              />
            </div>
          </div>
          <div data-reveal>
            <h2 style={{ fontSize: "1.5rem" }}>Gửi yêu cầu báo giá</h2>
            <p style={{ color: "var(--ink-soft)" }}>
              Điền thông tin bên dưới, chúng tôi sẽ liên hệ lại qua số điện thoại bạn để lại.
            </p>
            <ContactForm />
          </div>
        </div>
      </section>
    </>
  );
}
