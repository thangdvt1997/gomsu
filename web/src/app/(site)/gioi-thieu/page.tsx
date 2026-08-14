import Link from "next/link";
import type { Metadata } from "next";
import { COMPANY } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "Giới Thiệu — Giữ Lửa Nghề Gốm Bát Tràng",
  description:
    "Từ đất sét sông Hồng đến những chiếc lọ hoa có mặt trong hàng ngàn ngôi nhà, quán cà phê và không gian sự kiện khắp Việt Nam.",
};

export default function AboutPage() {
  return (
    <>
      <div className="page-hero">
        <img className="bg" src="/uploads/site/workshop-1-thumb.jpg" alt="" />
        <div className="container">
          <div className="breadcrumb">
            <Link href="/">Trang chủ</Link>
            <span>/</span>
            <span>Giới thiệu</span>
          </div>
          <h1>Giữ Lửa Nghề Gốm Bát Tràng</h1>
          <p style={{ maxWidth: "60ch", color: "rgba(255,255,255,.82)" }}>
            Từ đất sét sông Hồng đến những chiếc lọ hoa có mặt trong hàng ngàn ngôi nhà, quán cà
            phê và không gian sự kiện khắp Việt Nam.
          </p>
        </div>
      </div>
      <section>
        <div className="container grid-2" style={{ alignItems: "center" }}>
          <div data-reveal>
            <span className="eyebrow">Câu chuyện của chúng tôi</span>
            <h2>{COMPANY.name} — Xưởng Sản Xuất Lọ Hoa Thủ Công Tại Giang Cao, Bát Tràng</h2>
            <p>
              Toạ lạc tại thôn Giang Cao — trái tim của làng gốm Bát Tràng, xưởng {COMPANY.name}{" "}
              chuyên sản xuất lọ hoa gốm sứ với hơn 60 kiểu dáng, từ mẫu mini để bàn đến các thiết
              kế cỡ lớn cho không gian sảnh, khách sạn. Mỗi sản phẩm đều trải qua quy trình vuốt
              tay hoặc đổ khuôn, phơi khô tự nhiên, tráng men và nung ở nhiệt độ cao để đảm bảo độ
              bền và màu men chuẩn.
            </p>
            <p>
              Chúng tôi phục vụ cả khách lẻ yêu gốm lẫn đối tác sỉ: shop hoa tươi, chuỗi cà phê,
              homestay, khách sạn và các đơn vị tổ chức sự kiện trên toàn quốc — với cam kết giá
              tốt tận xưởng, đóng gói cẩn thận và hỗ trợ phát triển mẫu riêng theo yêu cầu.
            </p>
          </div>
          <div>
            <img
              src="/uploads/site/workshop-2.jpg"
              alt="Nghệ nhân làm gốm tại xưởng Gốm Sứ Trung Mừng"
              style={{ borderRadius: "var(--radius-l)", boxShadow: "var(--shadow-m)" }}
            />
          </div>
        </div>
      </section>
      <section className="bg-alt">
        <div className="container">
          <div className="section-head center" data-reveal>
            <span className="eyebrow">Quy trình</span>
            <h2>Từ Đất Sét Đến Sản Phẩm Hoàn Thiện</h2>
          </div>
          <div className="timeline" data-reveal>
            <div className="step">
              <div className="num">01</div>
              <h3>Tạo hình</h3>
              <p>Vuốt tay trên bàn xoay hoặc đổ khuôn tuỳ theo kiểu dáng, đảm bảo tỉ lệ chuẩn từng chi tiết.</p>
            </div>
            <div className="step">
              <div className="num">02</div>
              <h3>Phơi &amp; sửa nguội</h3>
              <p>Phôi gốm được phơi khô tự nhiên, chỉnh sửa bề mặt trước khi vào lò nung sơ.</p>
            </div>
            <div className="step">
              <div className="num">03</div>
              <h3>Tráng men</h3>
              <p>Phủ men theo tông màu đặt hàng — men mát, men sôi hoặc men khô tạo hiệu ứng riêng.</p>
            </div>
            <div className="step">
              <div className="num">04</div>
              <h3>Nung &amp; kiểm tra</h3>
              <p>Nung ở nhiệt độ cao, kiểm tra kỹ từng sản phẩm trước khi đóng gói xuất xưởng.</p>
            </div>
          </div>
        </div>
      </section>
      <section>
        <div className="container">
          <div className="section-head center" data-reveal>
            <span className="eyebrow">Góc xưởng</span>
            <h2>Một Ngày Tại Xưởng Gốm</h2>
          </div>
          <div className="about-gallery" data-reveal>
            {[1, 2, 3, 4, 5, 6, 7].map((n) => (
              <img
                key={n}
                className={n === 1 ? "tall" : ""}
                src={`/uploads/site/workshop-${n}.jpg`}
                alt={`Xưởng gốm Gốm Sứ Trung Mừng tại Bát Tràng ${n}`}
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
              <h2>Ghé thăm xưởng tại Bát Tràng</h2>
              <p>{COMPANY.address} — hoan nghênh đối tác đến tham quan xưởng và chọn mẫu trực tiếp.</p>
            </div>
            <Link className="btn btn-ghost" href="/lien-he">
              Xem chỉ đường
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
