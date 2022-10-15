-- CreateTable
CREATE TABLE "pendingUser" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "hash" TEXT NOT NULL,

    CONSTRAINT "pendingUser_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "pendingUser_email_key" ON "pendingUser"("email");

-- CreateIndex
CREATE UNIQUE INDEX "pendingUser_username_key" ON "pendingUser"("username");
