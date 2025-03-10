/*
  Warnings:

  - Changed the type of `category` on the `Product` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "ProductCategory" AS ENUM ('SMARTPHONES', 'LAPTOPS', 'TVS', 'GAMING', 'ACCESSORIES', 'CAMERAS', 'AUDIO');

-- CreateEnum
CREATE TYPE "ProductStatus" AS ENUM ('ACTIVE', 'DRAFT', 'OUT_OF_STOCK');

-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "originalPrice" DECIMAL(65,30),
ADD COLUMN     "status" "ProductStatus" NOT NULL DEFAULT 'ACTIVE',
DROP COLUMN "category",
ADD COLUMN     "category" "ProductCategory" NOT NULL;
