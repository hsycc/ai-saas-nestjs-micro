-- CreateTable
CREATE TABLE "user" (
    "id" TEXT NOT NULL,
    "username" VARCHAR(50) NOT NULL,
    "avatar" TEXT NOT NULL DEFAULT '',
    "password" TEXT NOT NULL,
    "status" INTEGER NOT NULL DEFAULT 1,
    "role" INTEGER NOT NULL DEFAULT 1,
    "access_key" TEXT NOT NULL DEFAULT '',
    "secret_key" TEXT NOT NULL DEFAULT '',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "user_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "user_id_key" ON "user"("id");

-- CreateIndex
CREATE UNIQUE INDEX "user_username_key" ON "user"("username");

-- CreateIndex
CREATE UNIQUE INDEX "user_access_key_key" ON "user"("access_key");
