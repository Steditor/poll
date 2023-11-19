-- CreateTable
CREATE TABLE "PollSettings" (
    "roomId" TEXT NOT NULL PRIMARY KEY,
    "numberOfOptions" INTEGER NOT NULL,
    "numbering" TEXT NOT NULL,
    "openVote" BOOLEAN NOT NULL,
    "showResults" BOOLEAN NOT NULL,
    "moderationKey" TEXT NOT NULL,
    "expiry" DATETIME NOT NULL,
    "expiryDelay" TEXT NOT NULL
);
