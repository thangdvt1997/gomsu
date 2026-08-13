# -*- coding: utf-8 -*-
"""
Mapping from source photos in ceramic/product_image/ to product slugs,
built from a manual visual review of all 96 images (see /memory or
conversation for the batch-by-batch catalog). Three source files carry a
third-party shop watermark ("Tiem gom Chi May") and are intentionally
EXCLUDED from any use on the site.
"""

SRC_DIR = "ceramic/product_image"


def f(ts, h):
    return f"1786603{ts}_7145057879396684846_7145057879396684846_{h}.jpg"


WATERMARKED_EXCLUDE = {
    f("782093", "02d2b9123f9357c3da8bf31d6e20fa5c"),
    f("782097", "1146467f1826fe4691dc6b1235c0f3fa"),
    f("782107", "d76d1967d0cecded7561834b480fa47b"),
}

# slug -> ordered list of source filenames (first = primary/hero image)
PRODUCT_IMAGES = {
    "lo-mini": [
        f("814298", "baa80fdf356899f4cd304afc5a427693"),
        f("814394", "5b3b9de9200b875d67fe2cbb5a4ff1b1"),
    ],
    "ong-ganh": [
        f("729275", "5a5c2cab4aec7aa737ceb238d5fbc4d4"),
        f("716153", "d1ac80572972315a78d41f0d17272756"),
        f("716178", "3a5b540b5d4614bb16bb8ed1ce7b50d0"),
    ],
    "lo-soc-be": [
        f("782034", "818650f4fc491e6ac3540975aa9e6428"),
        f("782046", "8be490bc405e3d8160360eb07fce96cb"),
        f("782128", "4511f8e617cf75a1d278d8050ed048d4"),
        f("814434", "0ee21cfb89c44f4f58f8cec13d41f7de"),
        f("814417", "083ccdcdb94f89d7c99ee8ee7162cb05"),
        f("716158", "45ddf648451e2ec2229f28e7a87f1139"),
    ],
    "van-go": [
        f("782145", "b3dc1b69ea58f19610f53e3c93bf6f61"),
    ],
    "lo-phieu-tron": [
        f("814368", "86b539fef28c506e7ef62d725250c7e4"),
    ],
    "lu-bia": [
        f("781953", "6ff4a1606d615c76c95bcb4d223a735a"),
        f("814375", "10b6224eda370c801091a45bb9b451f1"),
        f("814382", "f59f51337d8e6791ac2b16f8a6ae5cb7"),
        f("814422", "7e71b3352f48de51e143a1994a01a216"),
        f("814457", "aa642339784cea69d36d8536dc90f437"),
        f("716173", "de29d3479844a4e8ea70a39be3c4d26f"),
    ],
    "vai-tron": [
        f("716139", "49b132a68cadc84dfb90cb81053dc939"),
        f("716161", "073211cf459e0b05002028b3cdf98b61"),
        f("716170", "22b9ab0353e3183b68691059c5e5a3da"),
        f("716175", "1fe985e472b54a784fd33d6b23e65aec"),
        f("729280", "c6bc80a057ff628beeaa7dcf60eefbb7"),
        f("814274", "0da34188794e0f8e653bae8929db85ec"),
    ],
    "chuong-mini": [
        f("814314", "b935e3e5e23370a7926e97e543a2fe11"),
    ],
    "bau-tron": [
        f("814359", "d5f9583e97a7c1565acfe1c41dbe8020"),
        f("781851", "b742313a4f9bf1c08cde8231e4696e17"),
        f("782052", "84d8ed55ac8c6a50b4836768cdc5e99e"),
        f("782124", "e9a8f518de7eb9abc10b462918a33248"),
        f("782151", "554fe4fc125a05bca1e0fee3ba5caa55"),
        f("782027", "6128b7f3fc50a7bd792c52679cd756d1"),
        f("781889", "1c527ea11990a15e26cb30d79b4ba035"),
        f("814400", "be9f03ce78e915e75e55c2519052d8c6"),
    ],
    "lo-ho-lo": [
        f("781948", "cceb5ad4835c4aaeea3c9e9b1ca2e68c"),
        f("781918", "2a041d7323d96881c2f4c4d50329d0f0"),
        f("781974", "98f6bc66f05bbd006ac22c7bd3138d5c"),
        f("782008", "228f4e61c977a3309a96d41718f21126"),
        f("782014", "0a6941ed8c9983e8cfbb1342097df0ce"),
    ],
    "tru-ganh": [
        f("729245", "e8855f321103d1dd1ea105955f7d7ead"),
        f("729265", "079316b3a722b7c90d7a83bfa6d6ca5a"),
        f("782157", "552c9e463682c799465dde833cf684d6"),
    ],
    "lo-tulip": [
        f("721043", "a20db104be3eb1eab0ddee67b71abe6b"),
        f("721055", "fc65418150fac75afdd4b330467846ef"),
        f("814445", "38a99c82e830fff4289506a8cf58284f"),
    ],
    "bom-van-ngang": [
        f("729272", "2587e52dca3dca35ad6bffd42b048094"),
        f("781829", "315acc14ee1392346043167325f7d02e"),
        f("782020", "3b438577982383c365688fdf8400bc39"),
    ],
    "binh-quai": [
        f("781935", "d79ff0001118183c9f3c1c9dec6f2617"),
        f("781985", "be6a3b8449927d7a549afd9ecdff51c2"),
        f("782068", "7d01bd97f0dab62ab3833d55030ba1af"),
    ],
    "chum-tron": [
        f("814327", "21bfb28c91b7cdc6957e6466420c7e42"),
        f("781969", "ecdc782f29a381dde630c874f66ffca6"),
    ],
    "chum-2-tai": [
        f("782058", "1901fa253377b8b753dab01f97fb634c"),
        f("782063", "c898870b0124ce65a940aa08bbb459d0"),
        f("782073", "69e817fa27c4f6f08ee754531d62b316"),
        f("782078", "0d321a39efab8976f4a8160755f1376d"),
        f("782083", "a57eabdd34da6494a1cb49dc000bd2c1"),
        f("782088", "d3f62f1238e56d9a285dd47b51a2ef50"),
        f("782118", "037f0bd448793a7e90a4ef15cee8216c"),
        f("716180", "7d4dc256135d25b119443f67907e0c81"),
        f("729268", "a7526d3e709912a06441816133daf395"),
    ],
    "vo-lun": [
        f("814439", "095d0c590eda8e58b940c30a68147053"),
        f("814405", "bd531e63a7299798ce94d6af05e79f09"),
        f("814428", "2a24a3631057f3dc6f24acd8b6894134"),
        f("782113", "eafe0ee6aab054920d974a3c2c7c453b"),
    ],
    "ly-thon": [
        f("814350", "a64122b97aead6c871dc3d6c14b67c4e"),
    ],
    "canh-buom": [
        f("814411", "eee526e40a3e29b5c8f428ed68c5f2d3"),
    ],
    "phieu-cao": [
        f("814451", "af31671e23d99b0f9802769b00fccb1c"),
    ],
    "giot-le": [
        f("716165", "c77fd69fe09ce674323669c0b2c80393"),
    ],
    "hat-mua": [
        f("716167", "3002e55743354bd502fade2f8f64e9e2"),
    ],
    "ong-buong": [
        f("814388", "5287361ba5980e9f6e6ce3266e34f385"),
    ],
    "chuong-35": [
        f("782040", "cb461e0301032fa8a7e0c3a1f4694d51"),
    ],
    "chuong-42": [
        f("782040", "cb461e0301032fa8a7e0c3a1f4694d51"),
    ],
}

# Extra lifestyle / group photos not tied to one SKU -> used for homepage
# hero, category banners and general gallery sections.
LIFESTYLE_IMAGES = [
    f("781865", "456eefbda8c4adf03a45621bcde24287"),
    f("781878", "3a1589dda4e17a56bd3648ea3b70d072"),
    f("782102", "dc3c8833afb77615fe125f5171fa0892"),
    f("781900", "4b21d28e926c6eaa5a3fde41dc13e6cf"),
    f("781909", "6e0b6c2c11cfa4d5b7b0322ebdb6c292"),
    f("781941", "f05a073928e5df9f0e314627709238f1"),
    f("781958", "e2107e654c3ba62a8b18fd3b43d8d8eb"),
    f("781964", "7be9f2820a0f8fb757a64c5d9d798c7d"),
    f("781980", "237b08e1d16e19e88cd3f47e8db163b5"),
    f("781991", "9d41a9ba9996df7e205f636d88190cdc"),
    f("781996", "dc1767bfc870835b4633f492f38b6987"),
]

# Workshop / behind-the-scenes photos -> About page.
WORKSHOP_IMAGES = [
    f("721060", "a9d7f6b8711700d11bab58782e4a4e77"),
    f("729277", "609ff92eb265ba6a572519419fbda199"),
    f("781927", "6d192b0913043e4893efe72acf686af2"),
    f("782001", "5b6094cf838d8f847dbb952d8cd5a964"),
    f("782134", "8852c08270575483c4c2ac999b157826"),
    f("782139", "5fde23a9e869526218ddacc15917b215"),
    f("814339", "f2b2aff2359f60f94419b304db2148b6"),
]
