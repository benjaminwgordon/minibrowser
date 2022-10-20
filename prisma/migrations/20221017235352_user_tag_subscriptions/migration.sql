-- CreateTable
CREATE TABLE "UserTagSubscriptions" (
    "userId" INTEGER NOT NULL,
    "tagId" INTEGER NOT NULL,

    CONSTRAINT "UserTagSubscriptions_pkey" PRIMARY KEY ("userId","tagId")
);

-- AddForeignKey
ALTER TABLE "UserTagSubscriptions" ADD CONSTRAINT "UserTagSubscriptions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserTagSubscriptions" ADD CONSTRAINT "UserTagSubscriptions_tagId_fkey" FOREIGN KEY ("tagId") REFERENCES "Tag"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
