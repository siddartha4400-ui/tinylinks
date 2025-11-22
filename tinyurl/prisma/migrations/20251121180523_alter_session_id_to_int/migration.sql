/*
  Warnings:

  - You are about to alter the column `session_id` on the `link` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Int`.

*/
-- AlterTable
ALTER TABLE `link` MODIFY `session_id` INTEGER NOT NULL;
