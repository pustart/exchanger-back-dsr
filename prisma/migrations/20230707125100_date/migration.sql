-- AlterTable
ALTER TABLE "Thing" ALTER COLUMN "photo" DROP NOT NULL;

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "birthday" SET DATA TYPE DATE;
