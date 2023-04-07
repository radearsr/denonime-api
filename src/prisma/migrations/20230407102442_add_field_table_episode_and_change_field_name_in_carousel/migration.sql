/*
  Warnings:

  - You are about to drop the column `published` on the `carousel` table. All the data in the column will be lost.
  - Added the required column `originalSourceEp` to the `episodes` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "carousel" DROP COLUMN "published",
ADD COLUMN     "publish" "StatusPublish" NOT NULL DEFAULT 'Publish';

-- AlterTable
ALTER TABLE "episodes" ADD COLUMN     "originalSourceEp" VARCHAR(100) NOT NULL;
