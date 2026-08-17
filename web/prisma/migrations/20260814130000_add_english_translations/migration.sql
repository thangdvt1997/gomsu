-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "nameEn" TEXT,
ADD COLUMN     "tagEn" TEXT,
ADD COLUMN     "descriptionEn" TEXT,
ADD COLUMN     "metaTitleEn" TEXT,
ADD COLUMN     "metaDescriptionEn" TEXT;

-- AlterTable
ALTER TABLE "Post" ADD COLUMN     "titleEn" TEXT,
ADD COLUMN     "excerptEn" TEXT,
ADD COLUMN     "contentHtmlEn" TEXT,
ADD COLUMN     "metaTitleEn" TEXT,
ADD COLUMN     "metaDescriptionEn" TEXT;
