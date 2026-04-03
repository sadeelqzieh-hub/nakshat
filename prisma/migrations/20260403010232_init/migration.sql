/*
  Warnings:

  - Added the required column `filePath` to the `ClientFile` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_ClientFile" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "size" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "date" TEXT NOT NULL,
    "filePath" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "ClientFile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_ClientFile" ("createdAt", "date", "id", "name", "size", "status", "type", "userId") SELECT "createdAt", "date", "id", "name", "size", "status", "type", "userId" FROM "ClientFile";
DROP TABLE "ClientFile";
ALTER TABLE "new_ClientFile" RENAME TO "ClientFile";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
