-- DropForeignKey
ALTER TABLE "Thing" DROP CONSTRAINT "Thing_authorId_fkey";

-- DropForeignKey
ALTER TABLE "Thing" DROP CONSTRAINT "Thing_categoryId_fkey";

-- DropForeignKey
ALTER TABLE "Thing" DROP CONSTRAINT "Thing_exchangeCategoryId_fkey";

-- AlterTable
ALTER TABLE "Thing" ALTER COLUMN "exchangeCategoryId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Thing" ADD CONSTRAINT "Thing_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Thing" ADD CONSTRAINT "Thing_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Thing" ADD CONSTRAINT "Thing_exchangeCategoryId_fkey" FOREIGN KEY ("exchangeCategoryId") REFERENCES "Category"("id") ON DELETE CASCADE ON UPDATE CASCADE;
