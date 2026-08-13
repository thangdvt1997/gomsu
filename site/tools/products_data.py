# -*- coding: utf-8 -*-
"""
Master product catalog for Gom Su Trung Mung, built from the workshop's
2026 wholesale price list (BAO GIA LO HOA NAM 2026) plus a visual review
of the photos in ceramic/product_image/. 25 of the 60 named designs have
real matched studio photography (featured=True); the remaining 35 are
still published as full SEO landing pages (name, sizes, prices, glaze
options, care info) using a styled placeholder in place of a photo, with
a clear call-to-action to see real photos via Zalo/hotline.
"""

COMPANY = {
    "name": "Gốm Sứ Trung Mừng",
    "name_en": "Gom Su Trung Mung",
    "tagline": "Xưởng sản xuất lọ hoa gốm sứ Bát Tràng",
    "address": "Số 20, Ngõ 263, Thôn 3, Giang Cao, Bát Tràng, Gia Lâm, Hà Nội",
    "phone1": "034.286.9889",
    "phone2": "096.632.3698",
    "phone1_tel": "0342869889",
    "phone2_tel": "0966323698",
    "zalo": "0342869889",
    "email": "lienhe@gomsutrungmung.vn",
    "map_query": "Giang Cao, Bát Tràng, Gia Lâm, Hà Nội",
    "founded": "hơn 20 năm",
    "domain": "https://gomsutrungmung.vn",
}

# color key -> (Vietnamese label, hex swatch)
GLAZE = {
    "trang": ("Trắng mát", "#F5F1E6"),
    "tieu": ("Men tiêu lấm tấm", "#CFC7B0"),
    "hong": ("Hồng phấn", "#E7B8AC"),
    "xanh-la": ("Xanh lá cây", "#7C9068"),
    "xanh-co-vit": ("Xanh cổ vịt", "#2E6660"),
    "soi-trang": ("Sôi trắng", "#EDE7D8"),
    "soi-xanh": ("Sôi xanh rêu", "#66705A"),
    "soi-nau": ("Sôi nâu", "#7C5A3C"),
    "xi-mang": ("Xi măng", "#A6A099"),
    "kho-hong": ("Khô hồng đất", "#C48A7C"),
    "kho-xanh-la": ("Khô xanh lá", "#71805E"),
    "kho-xanh-bien": ("Khô xanh biển", "#4C7488"),
    "kho-den": ("Khô đen", "#2A2624"),
}

CATEGORIES = [
    ("mini-de-ban", "Mini & Để Bàn"),
    ("co-dien-men-loang", "Cổ Điển & Men Loang"),
    ("dang-doc-la", "Dáng Độc Lạ"),
    ("vua-va-lon", "Vừa & Lớn"),
    ("bo-suu-tap", "Bộ Sưu Tập Theo Bộ"),
    ("cao-cap-trang-tri", "Cao Cấp & Trang Trí"),
]
CAT_LABEL = dict(CATEGORIES)


def S(label, h, m, price):
    return {"label": label, "h": h, "m": m, "price": price}


# Each product: slug, code, name, cat, sizes, colors, tag, desc, featured
PRODUCTS = [
    dict(slug="lo-mini", code="TM-001", name="Lọ Mini", cat="mini-de-ban",
         sizes=[S(None, "10–15", None, 12000)],
         colors=["trang", "hong", "xanh-la", "tieu"],
         tag="Set lọ tí hon xinh xắn, cắm một cành hoa cũng đủ đẹp",
         desc="Lọ Mini là mẫu bán chạy nhất của xưởng — dáng bầu nhỏ nhắn cao 10–15cm, "
              "vừa một tay cầm, hợp để cắm một vài cành hoa cúc, hoa baby hay hoa khô. "
              "Vì kích thước nhỏ và giá thành rất mềm, đây là lựa chọn quen thuộc của các shop hoa, "
              "quán cà phê muốn trang trí bàn với số lượng lớn mà vẫn đồng bộ về màu men. "
              "Có thể đặt theo set nhiều màu để bày theo cụm trên kệ, cửa sổ hoặc bàn tiệc.",
         featured=True),
    dict(slug="ong-ganh", code="TM-002", name="Ống Gánh", cat="mini-de-ban",
         sizes=[S(None, 13, 7, 25000)],
         colors=["hong", "xanh-co-vit", "trang", "tieu"],
         tag="Dáng ống thon nhẹ, cổ loe nhỏ, men loang mềm mại",
         desc="Ống Gánh mang dáng thon dài đặc trưng, thân hơi phình giữa rồi thu lại ở cổ, "
              "phối cùng lớp men loang chuyển sắc rất được lòng dân chơi hoa khô và hoa đồng nội. "
              "Kích thước cao 13cm, miệng 7cm là size 'chân ái' để bàn làm việc, kệ sách hoặc góc "
              "trang trí nhỏ trong nhà. Bát Tràng làm thủ công từng chiếc nên mỗi lọ có sắc loang men "
              "hơi khác nhau — đó chính là nét duyên của gốm nung tay.",
         featured=True),
    dict(slug="lo-soc-be", code="TM-003", name="Lọ Sọc Bé", cat="mini-de-ban",
         sizes=[S(None, 16, 6.3, 25000)],
         colors=["trang", "hong", "xanh-co-vit", "soi-nau", "kho-xanh-bien"],
         tag="Thân sọc dọc mảnh, cổ loe nhẹ — chuẩn phong cách Bắc Âu tối giản",
         desc="Lọ Sọc Bé được tạo hình với các đường sọc dọc chạy đều quanh thân, tạo hiệu ứng ánh sáng "
              "rất đẹp khi đặt gần cửa sổ. Cao 16cm, miệng 6,3cm, vừa vặn để cắm một bó hoa đồng tiền, "
              "hoa baby hoặc cành lá xanh đơn giản. Đây là mẫu được nhiều studio chụp ảnh sản phẩm và "
              "quán cafe phong cách minimalist lựa chọn nhờ dáng thanh mảnh, dễ phối với mọi tông nội thất.",
         featured=True),
    dict(slug="van-go", code="TM-004", name="Vân Gỗ", cat="co-dien-men-loang",
         sizes=[S("S1", 24, 6.5, 55000), S("S2", 17, 5, 25000)],
         colors=["soi-nau", "kho-hong", "trang"],
         tag="Vân men giả gỗ mộc mạc, ấm áp như tách trà buổi sáng",
         desc="Điểm đặc biệt của Vân Gỗ nằm ở lớp men được xử lý tạo vân giống gỗ tự nhiên, mang lại cảm "
              "giác ấm áp, gần gũi cho không gian sống. Có 2 kích thước: bản lớn cao 24cm làm điểm nhấn "
              "phòng khách, bản nhỏ cao 17cm hợp đặt kệ sách hoặc bàn trà. Rất được ưa chuộng trong "
              "concept nội thất mộc, wabi-sabi hoặc Nhật tối giản.",
         featured=True),
    dict(slug="lo-phieu-tron", code="TM-005", name="Lọ Phễu Trơn", cat="mini-de-ban",
         sizes=[S(None, 17, 6, 30000)],
         colors=["trang", "xanh-la", "soi-nau", "tieu"],
         tag="Dáng phễu trơn thanh lịch, không hoa văn, để hoa tự lên tiếng",
         desc="Lọ Phễu Trơn theo trường phái tối giản: không họa tiết, không đường vân, chỉ có một lớp "
              "men mịn phủ đều toàn thân giúp tôn dáng hoa cắm bên trong. Cao 17cm, miệng 6cm, dễ dàng "
              "kết hợp cùng bất kỳ phong cách trang trí nào từ vintage đến hiện đại. Là lựa chọn 'an toàn' "
              "mà các nhà thiết kế nội thất hay gợi ý cho khách vì độ linh hoạt cao.",
         featured=True),
    dict(slug="lu-bia", code="TM-006", name="Lu Bia", cat="co-dien-men-loang",
         sizes=[S("S1", 15, 8, 42000), S("S2", 12, 7, 21000)],
         colors=["trang", "soi-xanh", "kho-hong", "soi-nau", "xi-mang"],
         tag="Dáng lu tròn mộc mạc, bề mặt sần vân ngang đầy chất liệu",
         desc="Lu Bia mô phỏng dáng vại sành truyền thống, thân tròn đầy đặn với các đường vân ngang nổi "
              "nhẹ tạo cảm giác chắc tay, mộc mạc. Hai size 15cm và 12cm phù hợp cắm hoa cành to như hướng "
              "dương, cẩm tú cầu hoặc bày khô không cần hoa vẫn đẹp như một món decor độc lập. Bề mặt có "
              "thể làm men bóng hoặc sần tùy đơn hàng.",
         featured=True),
    dict(slug="vuong-thang", code="TM-007", name="Vuông Thẳng", cat="co-dien-men-loang",
         sizes=[S("S1", 25, 7.5, 60000), S("S2", 21, 7, 45000), S("S3", 19, 6.6, 35000)],
         colors=["trang", "soi-xanh", "kho-den", "tieu"],
         tag="Ống thẳng cạnh vuông nhẹ, ba kích cỡ xếp bộ rất đẹp mắt",
         desc="Vuông Thẳng có form trụ đứng, cạnh được xử lý vuông nhẹ tạo điểm nhấn hiện đại hơn so với "
              "dáng tròn truyền thống. Ba kích thước S1–S3 thường được khách đặt theo bộ để bày thành cụm "
              "cao thấp so le trên kệ tivi, quầy lễ tân hoặc showroom. Men loang từ nhạt tới đậm theo chiều "
              "cao thân lọ là điểm nhận diện của mẫu này.",
         featured=False),
    dict(slug="vai-tron", code="TM-008", name="Vai Tròn", cat="mini-de-ban",
         sizes=[S(None, 14, 9.5, 35000)],
         colors=["trang", "xanh-co-vit", "kho-xanh-bien", "soi-nau", "tieu"],
         tag="Miệng loe rộng, vai tròn đầy — cắm được cả bó hoa to",
         desc="Khác với các mẫu miệng nhỏ, Vai Tròn có phần miệng loe rộng tới 9,5cm giúp cắm thoải mái "
              "những bó hoa nhiều cành mà không lo chật. Chân đế có gân dọc nhỏ tạo điểm nhấn tinh tế dưới "
              "lớp men trơn. Cao 14cm nên rất hợp bày bàn ăn, bàn họp hoặc làm quà tặng khai trương vì dáng "
              "vừa vặn, không quá cồng kềnh.",
         featured=True),
    dict(slug="chuong-mini", code="TM-009", name="Chuông Mini", cat="mini-de-ban",
         sizes=[S(None, 15, 6, 28000)],
         colors=["trang", "hong", "xanh-la", "xanh-co-vit"],
         tag="Dáng chuông thắt eo nhẹ nhàng, nhỏ gọn, dễ thương",
         desc="Chuông Mini có phần eo thắt nhẹ giữa thân tạo dáng như một chiếc chuông nhỏ, rất bắt mắt khi "
              "bày theo cụm nhiều màu. Cao 15cm, miệng 6cm — kích thước lý tưởng cho hoa baby, hoa cúc tần, "
              "hoặc set quà tặng nhỏ đi kèm thiệp. Đây cũng là mẫu được nhiều bạn trẻ chọn để trang trí góc "
              "học tập, bàn làm việc.",
         featured=True),
    dict(slug="canh-buom", code="TM-010", name="Cánh Buồm", cat="dang-doc-la",
         sizes=[S(None, None, None, 35000)],
         colors=["trang", "hong", "kho-xanh-la"],
         tag="Miệng xoè nhẹ như cánh buồm no gió, dáng lạ mà tinh tế",
         desc="Cánh Buồm là mẫu có phần miệng xoè nhẹ bất đối xứng, gợi hình ảnh một cánh buồm căng gió — "
              "chi tiết nhỏ này khiến lọ trông sống động hơn hẳn so với các dáng miệng tròn thông thường. "
              "Phù hợp cắm 1–2 cành hoa có dáng đứng như lay ơn, hoa sen giấy để tôn trọn hình khối của lọ.",
         featured=False),
    dict(slug="bau-tron", code="TM-011", name="Bầu Tròn", cat="co-dien-men-loang",
         sizes=[S(None, 14, 10, 35000)],
         colors=["trang", "hong", "xanh-co-vit", "soi-xanh", "tieu"],
         tag="Thân bầu căng tròn đầy đặn, cổ thu nhỏ duyên dáng",
         desc="Bầu Tròn sở hữu phần thân phình căng tròn rồi thu nhỏ đột ngột về phía cổ, tạo tỉ lệ rất "
              "'nịnh mắt' khi cắm hoa tán tròn như cẩm chướng, hoa hồng hoặc lay ơn cong. Đây là một trong "
              "những dáng có nhiều lựa chọn màu men nhất của xưởng, từ men loang ombre tới men sần mờ, "
              "thích hợp làm quà tặng tân gia, khai trương.",
         featured=True),
    dict(slug="lo-mui-loe-day", code="TM-012", name="Lọ Múi Loe Đáy", cat="dang-doc-la",
         sizes=[S(None, 17, 8, 35000)],
         colors=["trang", "hong", "xanh-la"],
         tag="Các múi dọc xoè nhẹ về đáy, tạo bóng đổ rất đẹp",
         desc="Lọ Múi Loe Đáy có thân được chia thành nhiều múi dọc, loe rộng dần về phía đáy tạo cảm giác "
              "vững chãi mà vẫn mềm mại. Khi có ánh sáng chiếu xiên, các múi tạo bóng đổ rất đẹp trên mặt "
              "bàn — chi tiết nhỏ khiến mẫu này được các bạn décor chụp ảnh sản phẩm rất ưa thích.",
         featured=False),
    dict(slug="lo-ho-lo", code="TM-013", name="Lọ Hồ Lô", cat="dang-doc-la",
         sizes=[S(None, 13, 7, 38000)],
         colors=["trang", "xanh-co-vit", "kho-xanh-bien", "soi-nau"],
         tag="Dáng hồ lô hai tầng cổ điển, mang ý nghĩa phong thủy may mắn",
         desc="Lấy cảm hứng từ hình dáng quả hồ lô quen thuộc trong văn hóa Á Đông, mẫu lọ này có hai tầng "
              "eo rõ rệt tượng trưng cho sự sung túc, may mắn. Bề mặt thường được phủ men mờ lấm tấm mô "
              "phỏng chất đất nung, rất hợp bày trong phòng thờ, phòng khách theo phong cách Á Đông hoặc "
              "làm quà biếu Tết.",
         featured=True),
    dict(slug="tru-ganh", code="TM-014", name="Trụ Gánh", cat="co-dien-men-loang",
         sizes=[S("S1", 24, 15, 85000), S("S2", 15, 10, 40000)],
         colors=["kho-hong", "trang", "soi-nau", "tieu"],
         tag="Trụ tròn miệng lệch độc đáo, bề mặt gợn sóng mềm mại",
         desc="Trụ Gánh có phần miệng hơi lệch một bên tạo dáng phóng khoáng, tự nhiên như được nặn tay "
              "hoàn toàn thủ công. Bề mặt gợn sóng nhẹ bắt sáng rất đẹp, thường được hoàn thiện với tông "
              "men đất nung ấm áp. Size lớn 24cm làm điểm nhấn góc phòng khách, size nhỏ 15cm hợp bàn "
              "console hoặc kệ trang trí.",
         featured=True),
    dict(slug="lo-tulip", code="TM-015", name="Lọ Tulip", cat="dang-doc-la",
         sizes=[S(None, 15.5, 14, 50000)],
         colors=["trang", "hong", "tieu"],
         tag="Miệng loe rộng như cánh hoa tulip nở, sang trọng và nữ tính",
         desc="Đúng như tên gọi, Lọ Tulip có phần miệng xoè rộng gợn sóng như cánh hoa tulip đang nở, "
              "chân đế thu nhỏ tạo dáng ly cao thanh thoát. Miệng rộng tới 14cm cho phép cắm cả bó hoa lớn "
              "xoè đều rất đẹp, thường xuất hiện trong ảnh cưới, decor tiệc và không gian sang trọng.",
         featured=True),
    dict(slug="ong-buong", code="TM-016", name="Ống Bương", cat="co-dien-men-loang",
         sizes=[S(None, 23, 7, 47000)],
         colors=["trang", "hong", "xanh-co-vit", "kho-xanh-bien"],
         tag="Dáng ống cao thon lấy cảm hứng từ thân tre, bương",
         desc="Ống Bương mô phỏng dáng lóng tre/bương với thân trụ thẳng cao 23cm, các đường sọc dọc mảnh "
              "chạy hết chiều cao thân lọ. Đây là size 'trung bình' lý tưởng để cắm cành hoa dáng đứng như "
              "hoa lay ơn, thạch thảo mà không cần đế quá lớn.",
         featured=True),
    dict(slug="hat-mua", code="TM-017", name="Hạt Mưa", cat="dang-doc-la",
         sizes=[S(None, 23, 7.8, 47000)],
         colors=["trang", "tieu", "kho-den"],
         tag="Bề mặt sần lấm tấm như những hạt mưa đọng trên gốm",
         desc="Điểm nhấn của Hạt Mưa nằm ở kỹ thuật phủ men tạo bề mặt sần lấm tấm mô phỏng những giọt mưa "
              "đọng lại, cho cảm giác chất liệu rất 'thật' khi chạm tay vào. Cao 23cm, dáng thanh, phù hợp "
              "phong cách rustic, industrial hoặc làm điểm nhấn tương phản trong không gian tối giản.",
         featured=True),
    dict(slug="bom-van-ngang", code="TM-018", name="Bom Vân Ngang", cat="co-dien-men-loang",
         sizes=[S("S1", 28, 10, 95000), S("S2", 22, 7, 47000)],
         colors=["trang", "hong", "kho-den", "xanh-co-vit", "tieu"],
         tag="Dáng bầu bom cổ điển, vân ngang rõ nét, men loang tầng lớp",
         desc="Bom Vân Ngang là mẫu 'quốc dân' của các set trang trí ombre nhiều màu — thân bầu tròn nổi "
              "rõ những đường vân ngang, phối cùng lớp men chuyển sắc từ trắng ở miệng xuống đậm dần ở đáy. "
              "Hai kích thước lớn/nhỏ thường được đặt theo set để bày thành dải màu gradient rất ấn tượng "
              "trên kệ hoặc bậc thềm.",
         featured=True),
    dict(slug="phieu-cao", code="TM-019", name="Phễu Cao", cat="dang-doc-la",
         sizes=[S(None, 24, 5.5, 54000)],
         colors=["trang", "hong", "soi-xanh", "tieu"],
         tag="Dáng phễu vươn cao thanh mảnh, bề mặt sần tinh tế",
         desc="Phễu Cao thon dài từ đáy lên miệng theo dáng phễu ngược, tạo cảm giác vươn cao rất đẹp khi "
              "đặt cạnh cửa sổ hay góc phòng cần điểm nhấn theo chiều dọc. Bề mặt thường được xử lý sần nhẹ "
              "giúp lớp men bám đều, giữ được sắc màu bền lâu theo thời gian.",
         featured=True),
    dict(slug="giot-le", code="TM-020", name="Giọt Lệ", cat="dang-doc-la",
         sizes=[S(None, 24, 6, 54000)],
         colors=["kho-xanh-bien", "trang", "soi-nau", "kho-den"],
         tag="Dáng thon dài mềm mại như một giọt nước đang rơi",
         desc="Giọt Lệ có đường cong thân lọ thon đều, mềm mại từ trên xuống dưới gợi liên tưởng đến một "
              "giọt nước đang rơi — dáng đơn giản nhưng rất 'nịnh' mọi loại men, đặc biệt đẹp với các tông "
              "men loang tối màu tạo chiều sâu. Cao 24cm, hợp bày đơn lẻ làm điểm nhấn tinh tế.",
         featured=True),
    dict(slug="duoi-ca", code="TM-021", name="Đuôi Cá", cat="dang-doc-la",
         sizes=[S(None, 18.5, 11, 50000)],
         colors=["trang", "hong", "kho-xanh-bien"],
         tag="Đáy xoè nhẹ như đuôi cá, dáng độc đáo ít nơi có",
         desc="Đuôi Cá gây ấn tượng với phần đáy xoè nhẹ bất đối xứng mô phỏng dáng vây đuôi cá, kết hợp "
              "cùng men loang tạo chuyển sắc mềm mại. Đây là mẫu 'hiếm' được nhiều khách yêu gốm nghệ thuật "
              "tìm mua để sưu tầm hoặc làm quà tặng độc đáo.",
         featured=False),
    dict(slug="cu-toi", code="TM-022", name="Củ Tỏi", cat="dang-doc-la",
         sizes=[S(None, 17, 5, 50000)],
         colors=["trang", "kho-hong", "soi-nau"],
         tag="Thân bầu tròn, cổ nhỏ nhọn như một củ tỏi",
         desc="Củ Tỏi có thân tròn đầy phía dưới thu nhỏ dần lên cổ nhọn, gợi hình ảnh một củ tỏi quen "
              "thuộc — dáng lọ được ưa chuộng trong các set decor mang phong cách dân dã, gần gũi. Rất hợp "
              "cắm 1 cành hoa đơn để tôn hình khối lọ.",
         featured=False),
    dict(slug="tru-tum", code="TM-023", name="Trụ Túm", cat="dang-doc-la",
         sizes=[S(None, 17, 5, 50000)],
         colors=["trang", "xanh-la", "tieu"],
         tag="Thân trụ thẳng, cổ túm nhẹ tạo điểm nhấn duyên dáng",
         desc="Trụ Túm có thân hình trụ thẳng đứng, phần cổ được túm nhỏ lại tạo điểm nhấn duyên dáng giữa "
              "phần thân và miệng lọ. Cao 17cm, cân đối, dễ phối cùng các set hoa nhỏ nhiều màu để bày theo "
              "cụm trên kệ trang trí.",
         featured=False),
    dict(slug="cup", code="TM-024", name="Cúp", cat="dang-doc-la",
         sizes=[S(None, 24, 12, 50000)],
         colors=["trang", "soi-xanh", "kho-den"],
         tag="Dáng cúp thể thao cách điệu, sọc gân dọc khoẻ khoắn",
         desc="Cúp lấy cảm hứng từ hình dáng chiếc cúp lưu niệm, thân có gân sọc dọc chạy đều tạo cảm giác "
              "chắc khoẻ, hiện đại. Miệng rộng 12cm thoải mái cho các bó hoa cành to, thường được chọn làm "
              "quà tặng chúc mừng, khai trương mang ý nghĩa 'chiến thắng, thành công'.",
         featured=False),
    dict(slug="co-gai", code="TM-025", name="Cô Gái", cat="dang-doc-la",
         sizes=[S(None, 19, 5.5, 65000)],
         colors=["trang", "kho-den"],
         tag="Dáng cách điệu mềm mại như bóng dáng thiếu nữ",
         desc="Cô Gái là mẫu lọ cách điệu với đường cong thân eo rõ rệt, gợi liên tưởng tới bóng dáng mềm "
              "mại của một thiếu nữ — một trong những thiết kế nghệ thuật được yêu thích nhất của xưởng. "
              "Thường hoàn thiện với men đơn sắc để tôn trọn đường nét tạo hình.",
         featured=False),
    dict(slug="bo-ma", code="TM-026", name="Bó Mạ", cat="co-dien-men-loang",
         sizes=[S(None, 25, 7, 65000)],
         colors=["trang", "xanh-la", "kho-xanh-la"],
         tag="Thon dài thanh mảnh như bó mạ non ngày mùa",
         desc="Bó Mạ có dáng thon dài, đều đặn từ trên xuống dưới, gợi hình ảnh bó mạ non được bó gọn — "
              "một cái tên rất 'đồng quê Bắc Bộ'. Cao 25cm, đứng vững, hợp cắm cành hoa dáng đứng cao như "
              "lay ơn, thạch thảo để tạo tổng thể thanh thoát.",
         featured=False),
    dict(slug="vo-lun", code="TM-027", name="Vò Lùn", cat="co-dien-men-loang",
         sizes=[S(None, 17, 12, 68000)],
         colors=["trang", "hong", "kho-hong", "xanh-co-vit", "tieu"],
         tag="Dáng vò lùn đầy đặn, bề mặt vân xoáy tự nhiên",
         desc="Vò Lùn có thân tròn lùn, miệng loe rộng 12cm, bề mặt được tạo vân xoáy tự nhiên như dấu tay "
              "người thợ để lại trên bàn xoay — mỗi chiếc mang một vân riêng, không chiếc nào giống hệt "
              "chiếc nào. Rất hợp cắm hoa cành to, xoè rộng như hoa mẫu đơn, hoa baby.",
         featured=True),
    dict(slug="chai-thang", code="TM-028", name="Chai Thẳng", cat="co-dien-men-loang",
         sizes=[S(None, 25, 8, 65000)],
         colors=["trang", "xanh-co-vit", "kho-den", "soi-nau"],
         tag="Dáng chai đứng thẳng cổ điển, men loang tầng lớp",
         desc="Chai Thẳng có form trụ đứng cổ điển tựa như dáng chai thủy tinh truyền thống, cao 25cm, "
              "đường nét gọn gàng dễ kết hợp mọi phong cách nội thất. Là lựa chọn 'dễ mặc' cho cả không gian "
              "hiện đại lẫn hoài cổ.",
         featured=False),
    dict(slug="ly-thon", code="TM-029", name="Ly Thon", cat="co-dien-men-loang",
         sizes=[S(None, 19, 12, 70000)],
         colors=["trang", "kho-hong", "soi-nau", "tieu"],
         tag="Dáng ly miệng rộng, chân thon — cắm hoa xoè rất đẹp",
         desc="Ly Thon có phần miệng loe rộng như một chiếc ly lớn, thân thon dần về đáy tạo sự cân đối. "
              "Miệng rộng 12cm phù hợp cắm bó hoa xoè tự nhiên kiểu 'hoa bó tặng' mà không cần chỉnh dáng "
              "quá nhiều, rất được các shop hoa tươi ưa chuộng.",
         featured=True),
    dict(slug="qua-hong", code="TM-030", name="Quả Hồng", cat="dang-doc-la",
         sizes=[S(None, 20, 10, 75000)],
         colors=["kho-hong", "trang", "kho-xanh-la"],
         tag="Thân tròn múi nhẹ như trái hồng chín mọng",
         desc="Quả Hồng có thân tròn đầy với các múi dọc nhẹ mô phỏng hình trái hồng — biểu tượng của sự "
              "sung túc, ngọt ngào trong văn hóa Việt. Cao 20cm, miệng rộng 10cm, là lựa chọn ý nghĩa cho "
              "quà tặng dịp lễ Tết, tân gia.",
         featured=True),
    dict(slug="ly-luon", code="TM-031", name="Ly Lượn", cat="co-dien-men-loang",
         sizes=[S("S1", 19, 11.5, 70000), S("S2", None, None, 50000)],
         colors=["trang", "soi-xanh", "kho-den"],
         tag="Miệng lượn sóng mềm mại, dáng ly phá cách",
         desc="Ly Lượn có phần miệng được tạo hình lượn sóng nhẹ thay vì tròn đều, mang lại cảm giác phá "
              "cách, hiện đại hơn cho không gian trưng bày. Hai lựa chọn kích thước phù hợp cả bàn ăn gia "
              "đình lẫn không gian quán cafe, nhà hàng.",
         featured=True),
    dict(slug="bong-mat-na", code="TM-032", name="Bóng Mắt Na", cat="dang-doc-la",
         sizes=[S("S1", 20, 5, 65000), S("S2", 14, 4.5, 25000)],
         colors=["trang", "xanh-la", "kho-xanh-la"],
         tag="Vỏ sần gai mô phỏng trái na, độc lạ và bắt mắt",
         desc="Bóng Mắt Na tái hiện bề mặt sần gai đặc trưng của trái mãng cầu/na trên gốm — chi tiết thủ "
              "công đòi hỏi tay nghề cao để tạo được độ sần đều và tự nhiên. Có 2 size lớn nhỏ, thường được "
              "chọn làm quà biếu mang ý nghĩa 'sinh sôi, nảy nở'.",
         featured=False),
    dict(slug="chum-nho", code="TM-033", name="Chum Nhỡ", cat="vua-va-lon",
         sizes=[S(None, 19, 12, 75000)],
         colors=["trang", "hong", "kho-hong", "tieu"],
         tag="Dáng chum cỡ vừa, đầy đặn, để dáng hay cắm hoa đều đẹp",
         desc="Chum Nhỡ có kích thước vừa phải, thân tròn đầy đặn gợi hình ảnh chiếc chum sành truyền thống "
              "thu nhỏ. Đặt được ở nhiều vị trí từ bậu cửa sổ, kệ tủ đến sảnh lớn mà không chiếm quá nhiều "
              "diện tích, rất linh hoạt trong trang trí.",
         featured=True),
    dict(slug="bom-mieng-rong", code="TM-034", name="Bom Miệng Rộng", cat="vua-va-lon",
         sizes=[S(None, 29, 12, 85000)],
         colors=["trang", "soi-nau", "kho-den", "tieu"],
         tag="Dáng bom cỡ lớn, miệng rộng thoải mái cho bó hoa to",
         desc="Bom Miệng Rộng là phiên bản cỡ lớn của dòng bom cổ điển, cao 29cm với miệng rộng 12cm đủ "
              "sức chứa những bó hoa lớn nhiều tầng. Thường được chọn làm điểm nhấn sảnh, phòng khách rộng "
              "hoặc không gian sự kiện.",
         featured=False),
    dict(slug="ong-xoan", code="TM-035", name="Ống Xoắn", cat="dang-doc-la",
         sizes=[S(None, 24, 11, 80000)],
         colors=["trang", "xanh-co-vit", "kho-xanh-bien"],
         tag="Vân xoắn ốc chạy dọc thân, hiệu ứng thị giác cuốn hút",
         desc="Ống Xoắn có các đường vân xoắn ốc chạy dọc từ đáy lên miệng, tạo hiệu ứng chuyển động rất "
              "cuốn hút dưới ánh đèn. Cao 24cm, phù hợp làm điểm nhấn nghệ thuật trong không gian phòng "
              "khách hoặc quầy lễ tân hiện đại.",
         featured=False),
    dict(slug="ly-cao", code="TM-036", name="Ly Cao", cat="vua-va-lon",
         sizes=[S(None, 26, 13, 85000)],
         colors=["trang", "soi-xanh", "hong", "tieu"],
         tag="Dáng ly cỡ lớn, đứng cao sang trọng cho không gian rộng",
         desc="Ly Cao là phiên bản phóng to của dáng ly quen thuộc, cao 26cm với miệng rộng 13cm tạo cảm "
              "giác bề thế, sang trọng. Rất hợp bày sảnh khách sạn, nhà hàng hoặc làm quà tặng khai trương "
              "cỡ lớn.",
         featured=False),
    dict(slug="mat-ho", code="TM-037", name="Mặt Hồ", cat="dang-doc-la",
         sizes=[S("S1", 22, 15, 100000), S("S3", 16, 18, 80000)],
         colors=["soi-nau", "xi-mang"],
         tag="Dáng như mặt trống đồng hồ cát ngược, chất đất nung mộc",
         desc="Mặt Hồ có tạo hình độc đáo giống chiếc đồng hồ cát bị lật ngược, thường giữ nguyên chất đất "
              "nung mộc mạc không tráng men bóng để tôn vẻ đẹp nguyên bản của đất sét Bát Tràng. Là lựa chọn "
              "yêu thích của giới decor theo phong cách wabi-sabi, Nhật tối giản.",
         featured=False),
    dict(slug="long-chim", code="TM-038", name="Lồng Chim", cat="vua-va-lon",
         sizes=[S(None, 27, 7, 90000)],
         colors=["trang", "xanh-co-vit", "kho-xanh-bien"],
         tag="Gân dọc mảnh bao quanh thân như những nan lồng chim",
         desc="Lồng Chim có các đường gân dọc mảnh chạy đều quanh thân, gợi liên tưởng tới hình ảnh chiếc "
              "lồng chim truyền thống. Cao 27cm, dáng thanh mảnh vươn cao, là điểm nhấn đẹp cho góc phòng "
              "khách hoặc hành lang.",
         featured=False),
    dict(slug="ly-lun", code="TM-039", name="Ly Lùn", cat="dang-doc-la",
         sizes=[S(None, 15, 17, 85000)],
         colors=["trang", "tieu"],
         tag="Miệng rất rộng, hoa văn ren tinh tế bao quanh thân",
         desc="Ly Lùn có tỉ lệ đặc biệt: thân thấp nhưng miệng rất rộng tới 17cm, bao quanh là hoa văn "
              "dạng ren/lưới chạm nổi tinh xảo. Thích hợp cắm những bó hoa xoè rộng, tạo hiệu ứng như một "
              "'chiếc bát hoa' đầy nghệ thuật.",
         featured=False),
    dict(slug="chum-tron", code="TM-040", name="Chum Tròn", cat="vua-va-lon",
         sizes=[S(None, 24, 11, 100000)],
         colors=["trang", "hong", "kho-hong", "tieu"],
         tag="Dáng chum tròn đầy đặn cỡ lớn, bề thế và ấm áp",
         desc="Chum Tròn có thân tròn đầy đặn cỡ lớn, cao 24cm, gợi hình ảnh chiếc chum sành cổ truyền của "
              "làng gốm Bát Tràng. Thường được các gia đình chọn làm điểm nhấn phòng khách hoặc bày theo "
              "cặp hai bên lối vào.",
         featured=True),
    dict(slug="cu-lac", code="TM-041", name="Củ Lạc", cat="dang-doc-la",
         sizes=[S(None, 23, 7.5, 100000)],
         colors=["trang", "kho-hong", "soi-nau"],
         tag="Eo thắt giữa thân tạo dáng như một củ lạc phóng to",
         desc="Củ Lạc có phần eo thắt rõ rệt ở giữa thân, tạo hai bầu tròn nối tiếp nhau độc đáo như hình "
              "củ lạc. Cao 23cm, là mẫu dáng nghệ thuật được nhiều nhà sưu tầm gốm tìm mua vì sự khác biệt "
              "so với các dáng lọ truyền thống.",
         featured=False),
    dict(slug="bo-gio-cua", code="TM-042", name="Bộ Giỏ Cua", cat="bo-suu-tap",
         sizes=[S("Số 1", 25, 10, 90000), S("Số 2", 20, 10, 70000), S("Số 3", 15, 10, 50000)],
         colors=["trang", "kho-hong", "soi-nau"],
         tag="Bộ 3 kích cỡ mô phỏng giỏ đan truyền thống, xếp lớp rất đẹp",
         desc="Bộ Giỏ Cua mô phỏng hình dáng chiếc giỏ đan lát dùng đựng cua đồng ngày xưa, bề mặt được xử "
              "lý vân đan tự nhiên. Bán theo bộ 3 kích cỡ để khách bày xếp lớp cao thấp, tạo tổng thể hài "
              "hòa và rất được lòng khách mua trang trí theo set.",
         featured=False),
    dict(slug="bo-mui-bo-3", code="TM-043", name="Bộ Múi Bộ 3", cat="bo-suu-tap",
         sizes=[S("Số 1", 30, 16, 100000), S("Số 2", 25, 17, 90000), S("Số 3", 25, 13, 75000)],
         colors=["trang", "hong", "xanh-la"],
         tag="Ba dáng múi cỡ khác nhau, bày theo bộ tạo điểm nhấn ấn tượng",
         desc="Bộ Múi Bộ 3 gồm ba kích thước với tỉ lệ múi dọc khác nhau, được thiết kế để bày cùng nhau "
              "tạo một cụm trang trí có chiều sâu và nhịp điệu. Đây là lựa chọn phổ biến cho các không gian "
              "cần điểm nhấn lớn như sảnh khách sạn, quầy lễ tân.",
         featured=False),
    dict(slug="bo-du-du", code="TM-044", name="Bộ Đu Đủ", cat="bo-suu-tap",
         sizes=[S("S1", 30, 9, 110000), S("S2", 26, 7, 80000), S("S3", 19, 8, 55000)],
         colors=["trang", "kho-xanh-la", "kho-hong"],
         tag="Dáng quả đu đủ cách điệu, bộ 3 size sung túc đủ đầy",
         desc="Bộ Đu Đủ lấy cảm hứng từ hình dáng trái đu đủ với thân thon dài đặc trưng, bán theo bộ 3 "
              "kích cỡ mang ý nghĩa sung túc, đủ đầy. Rất phù hợp làm quà tặng tân gia hoặc bày mâm ngũ quả "
              "gốm trang trí dịp lễ Tết.",
         featured=False),
    dict(slug="lo-chum", code="TM-045", name="Lọ Chum", cat="cao-cap-trang-tri",
         sizes=[S(None, 22, 12.5, 100000)],
         colors=["trang", "xanh-la", "kho-hong"],
         tag="Dáng chum cổ điển cỡ lớn, món đồ trang trí có chiều sâu",
         desc="Lọ Chum giữ nguyên tinh thần của chiếc chum sành truyền thống nhưng được làm tinh xảo hơn "
              "với lớp men đồng đều, sang trọng. Cao 22cm, miệng rộng 12,5cm, là lựa chọn cao cấp cho phòng "
              "khách hoặc làm quà biếu ý nghĩa.",
         featured=False),
    dict(slug="lo-chum-chop", code="TM-046", name="Lọ Chum Chóp", cat="cao-cap-trang-tri",
         sizes=[S(None, 22, 6, 100000)],
         colors=["trang", "kho-xanh-bien", "soi-nau"],
         tag="Dáng chum với phần vai thu chóp nhọn, form dáng lạ mắt",
         desc="Lọ Chum Chóp có phần vai thu nhỏ dần lên miệng tạo hình chóp nhọn đặc trưng, khác biệt so "
              "với dáng chum miệng rộng thông thường. Cao 22cm, phù hợp làm điểm nhấn nghệ thuật độc lập, "
              "không cần cắm hoa vẫn đẹp.",
         featured=False),
    dict(slug="ruot-phich", code="TM-047", name="Ruột Phích", cat="cao-cap-trang-tri",
         sizes=[S("S1", 22, 8.5, 95000), S("S2", 22, 8, 65000)],
         colors=["trang", "hong", "kho-den", "tieu"],
         tag="Sọc ngang đều tăm tắp gợi nhớ ruột phích nước ngày xưa",
         desc="Ruột Phích có các đường sọc ngang đều đặn chạy quanh thân, gợi nhớ hình ảnh chiếc ruột phích "
              "giữ nhiệt quen thuộc của gia đình Việt xưa — một chi tiết hoài niệm rất được lòng khách yêu "
              "đồ vintage. Hai kích thước linh hoạt cho nhiều không gian.",
         featured=False),
    dict(slug="chuong-23", code="TM-048", name="Chuông 23", cat="cao-cap-trang-tri",
         sizes=[S(None, 23, 7.5, 115000)],
         colors=["trang", "xanh-co-vit", "kho-den"],
         tag="Dáng chuông cỡ vừa, đường nét thanh thoát, sang trọng",
         desc="Chuông 23 là phiên bản cỡ vừa của dòng dáng chuông đặc trưng của xưởng, đường cong thân lọ "
              "được tính toán tỉ mỉ để tạo cảm giác thanh thoát dù kích thước không nhỏ. Thích hợp làm quà "
              "tặng cao cấp hoặc điểm nhấn phòng khách.",
         featured=False),
    dict(slug="lo-bom", code="TM-049", name="Lọ Bom", cat="cao-cap-trang-tri",
         sizes=[S(None, 30, 4.5, 110000)],
         colors=["xanh-co-vit", "trang", "soi-xanh"],
         tag="Thân bom cao lớn, cổ rất nhỏ tạo tương phản ấn tượng",
         desc="Lọ Bom gây ấn tượng mạnh với thân cao lớn 30cm nhưng cổ lọ lại rất nhỏ chỉ 4,5cm, tạo sự "
              "tương phản độc đáo về tỉ lệ. Là mẫu đẹp để trưng bày độc lập như một tác phẩm điêu khắc gốm "
              "hơn là một lọ cắm hoa thông thường.",
         featured=False),
    dict(slug="binh-quai", code="TM-050", name="Bình Quai", cat="cao-cap-trang-tri",
         sizes=[S(None, 28, 5, 125000)],
         colors=["trang", "kho-den", "kho-hong"],
         tag="Có quai xách tối giản, tinh tế như bình gốm châu Âu",
         desc="Bình Quai nổi bật với chi tiết quai xách nhỏ gắn ở cổ, phá cách so với các dáng lọ truyền "
              "thống và mang hơi hướng gốm trang trí châu Âu hiện đại. Thường hoàn thiện đơn sắc để tôn "
              "trọn hình khối tối giản, sang trọng. Rất hợp không gian minimalist, Nhật hoặc Scandinavian.",
         featured=True),
    dict(slug="lo-mui-khia", code="TM-051", name="Lọ Múi Khía", cat="cao-cap-trang-tri",
         sizes=[S(None, 18, 8.5, 125000)],
         colors=["trang", "hong", "tieu"],
         tag="Múi khía sâu rõ nét, cổ thắt tạo điểm nhấn tinh xảo",
         desc="Lọ Múi Khía có các múi dọc được khía sâu và rõ nét hơn hẳn so với các mẫu múi thông thường, "
              "đòi hỏi tay nghề vuốt gốm điêu luyện để giữ được form đều. Phần cổ thắt nhẹ tạo điểm nhấn "
              "duyên dáng, thường được chọn làm quà tặng cao cấp.",
         featured=False),
    dict(slug="lo-doc-loe", code="TM-052", name="Lọ Dọc Loe", cat="cao-cap-trang-tri",
         sizes=[S(None, 29, 10.5, 120000)],
         colors=["trang", "kho-xanh-bien", "soi-nau"],
         tag="Sọc dọc mảnh chạy suốt thân, miệng loe rộng cỡ lớn",
         desc="Lọ Dọc Loe cao 29cm với các đường sọc mảnh chạy suốt từ đáy lên miệng loe rộng 10,5cm, tạo "
              "cảm giác vươn cao thanh thoát dù kích thước không nhỏ. Là lựa chọn đẹp cho không gian sảnh, "
              "phòng khách rộng cần điểm nhấn theo chiều dọc.",
         featured=False),
    dict(slug="chuong-35", code="TM-053", name="Chuông 35", cat="cao-cap-trang-tri",
         sizes=[S(None, 35, 8.5, 150000)],
         colors=["kho-xanh-la", "xi-mang", "trang"],
         tag="Dáng chuông cỡ lớn 35cm, điểm nhấn ấn tượng cho sảnh lớn",
         desc="Chuông 35 là phiên bản cỡ lớn của dáng chuông, cao 35cm với thân thẳng thon đều rất bề thế. "
              "Đây là một trong những mẫu 'trưng bày' được ưa chuộng nhất cho sảnh khách sạn, resort, "
              "showroom nhờ chiều cao ấn tượng mà vẫn giữ được sự thanh lịch trong đường nét.",
         featured=True),
    dict(slug="chum-2-tai", code="TM-054", name="Chum 2 Tai", cat="cao-cap-trang-tri",
         sizes=[S(None, 29, 11, 145000)],
         colors=["trang", "soi-nau", "kho-hong", "tieu", "xi-mang"],
         tag="Hai quai tai cổ điển, chi tiết đường gân ngang tinh xảo — mẫu bán chạy hàng đầu",
         desc="Chum 2 Tai là một trong những dáng đặc trưng và được đặt nhiều nhất của xưởng: thân bầu với "
              "hai quai tai nhỏ đối xứng hai bên cổ, các đường gân ngang chạm nổi đều đặn quanh thân tạo "
              "chiều sâu cho lớp men. Có sẵn rất nhiều tông men từ trắng lấm tấm, nâu đất, hồng ombre tới "
              "vàng đồng ánh kim — mỗi tông mang một 'cá tính' riêng. Cao 29cm, đủ lớn để làm điểm nhấn "
              "chính giữa bàn tiệc, sảnh khách sạn hoặc phòng khách sang trọng, cắm được cả cành đào, cành "
              "mai lớn dịp Tết.",
         featured=True),
    dict(slug="thoi", code="TM-055", name="Thoi", cat="cao-cap-trang-tri",
         sizes=[S(None, 36, 17, 190000)],
         colors=["soi-nau", "trang"],
         tag="Dáng con thoi dệt vải, hoạ tiết vân đá cẩm thạch sang trọng",
         desc="Thoi mô phỏng hình dáng con thoi trong khung dệt vải truyền thống, thường được hoàn thiện "
              "với men hoạ tiết vân đá cẩm thạch tự nhiên, sang trọng. Cao 36cm, miệng rộng 17cm, là mẫu "
              "trưng bày cỡ lớn dành cho không gian cần điểm nhấn nghệ thuật đẳng cấp.",
         featured=False),
    dict(slug="long-den", code="TM-056", name="Lồng Đèn", cat="cao-cap-trang-tri",
         sizes=[S("S1", 26, 10, 210000)],
         colors=["trang"],
         tag="Gân dọc múi rõ nét như những chiếc lồng đèn truyền thống",
         desc="Lồng Đèn có các múi gân dọc nổi rõ chạy đều quanh thân, gợi hình ảnh chiếc lồng đèn trong "
              "các dịp lễ hội truyền thống. Thường hoàn thiện men trắng tinh khôi để tôn trọn các đường nét "
              "điêu khắc tỉ mỉ, là món trang trí cao cấp cho không gian sang trọng.",
         featured=False),
    dict(slug="mai-san", code="TM-057", name="Mai Sần", cat="cao-cap-trang-tri",
         sizes=[S("S1", 33, 10, 220000), S("S2", None, None, 180000)],
         colors=["trang", "soi-nau"],
         tag="Dáng bình mai cổ điển, bề mặt sần thô mộc mạc đầy chất",
         desc="Mai Sần theo dáng bình mai cổ điển quen thuộc trong nghệ thuật gốm sứ Á Đông, bề mặt được "
              "xử lý sần thô đặc trưng tạo cảm giác cổ kính, mộc mạc. Cao 33cm, là mẫu trưng bày cao cấp "
              "thường xuất hiện trong các không gian mang phong cách cổ điển, sân vườn Nhật.",
         featured=False),
    dict(slug="bom-chan-vuong", code="TM-058", name="Bom Chân Vuông", cat="cao-cap-trang-tri",
         sizes=[S("S1", 47, 11, 270000), S("S2", 39, 7, 170000)],
         colors=["xi-mang", "trang", "kho-den"],
         tag="Thân bom cỡ đại, chân đế vuông vững chãi, cực kỳ bề thế",
         desc="Bom Chân Vuông là một trong những mẫu lớn nhất của xưởng với chiều cao lên tới 47cm, chân đế "
              "được xử lý vuông vức tạo sự vững chãi cho thân bom cỡ đại. Đây là lựa chọn hàng đầu cho "
              "sảnh lớn, tiền sảnh khách sạn hoặc không gian ngoài trời cần điểm nhấn hoành tráng.",
         featured=False),
    dict(slug="chuong-42", code="TM-059", name="Chuông 42", cat="cao-cap-trang-tri",
         sizes=[S(None, 42, 8.5, 265000)],
         colors=["kho-xanh-la", "xi-mang", "trang"],
         tag="Phiên bản chuông cỡ đại 42cm, tâm điểm mọi không gian lớn",
         desc="Chuông 42 là phiên bản cao lớn nhất trong dòng dáng chuông của xưởng, đường nét thân thẳng "
              "vươn cao 42cm tạo cảm giác uy nghi mà vẫn thanh lịch. Là lựa chọn 'must-have' cho các không "
              "gian sảnh lớn, khách sạn 5 sao, hoặc làm quà tặng khai trương tầm cỡ.",
         featured=True),
    dict(slug="ba-beo", code="TM-060", name="Ba Béo", cat="bo-suu-tap",
         sizes=[S("S1", 30, 8, None), S("S2", 26, 7, None), S("S3", 20, 6, None)],
         colors=["kho-hong", "xi-mang", "trang"],
         tag="Bộ 3 dáng béo tròn mập mạp, bày theo bộ cực kỳ ấn tượng",
         desc="Ba Béo là bộ 3 lọ với thân béo tròn mập mạp, kích thước giảm dần rất vui mắt khi bày theo "
              "cụm cao thấp. Cả bộ có giá tham khảo khoảng 265.000đ, là lựa chọn phổ biến cho các không "
              "gian cần trang trí theo cụm ấn tượng, đồng bộ.",
         featured=False),
]

PRODUCTS_BY_SLUG = {p["slug"]: p for p in PRODUCTS}
FEATURED = [p for p in PRODUCTS if p["featured"]]

# Designs with no distinct photo of their own in the source folder, matched
# to the closest same-family shape that DOES have real photos. Their pages
# show that photo with a clear "hình ảnh minh hoạ, dáng cùng dòng" badge
# instead of the plain silhouette placeholder — honest about the gap while
# still giving a concrete sense of the glaze/finish quality.
SIMILAR_TO = {
    "bo-ma": "ong-buong",
    "co-gai": "giot-le",
    "vuong-thang": "bom-van-ngang",
    "lo-mui-loe-day": "lo-soc-be",
    "duoi-ca": "bau-tron",
    "cu-toi": "bau-tron",
    "tru-tum": "tru-ganh",
    "cup": "lu-bia",
    "chai-thang": "ong-buong",
    "bong-mat-na": "hat-mua",
    "bom-mieng-rong": "bom-van-ngang",
    "ong-xoan": "tru-ganh",
    "ly-cao": "ly-thon",
    "long-chim": "lo-soc-be",
    "ly-lun": "ly-thon",
    "cu-lac": "bau-tron",
    "bo-gio-cua": "vo-lun",
    "bo-mui-bo-3": "lo-soc-be",
    "bo-du-du": "bau-tron",
    "lo-chum": "chum-tron",
    "lo-chum-chop": "chum-tron",
    "ruot-phich": "lu-bia",
    "chuong-23": "chuong-mini",
    "lo-bom": "bom-van-ngang",
    "lo-mui-khia": "vo-lun",
    "lo-doc-loe": "lo-soc-be",
    "long-den": "lo-tulip",
    "mai-san": "tru-ganh",
    "bom-chan-vuong": "bom-van-ngang",
    "ba-beo": "vo-lun",
}
