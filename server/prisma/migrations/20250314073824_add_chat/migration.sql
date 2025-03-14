-- CreateTable
CREATE TABLE "chats" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "admin_id" INTEGER,
    "subject" VARCHAR(255) NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "chats_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "chat_messages" (
    "id" SERIAL NOT NULL,
    "chat_id" INTEGER NOT NULL,
    "sender_id" INTEGER NOT NULL,
    "message" TEXT NOT NULL,
    "is_system" BOOLEAN NOT NULL DEFAULT false,
    "is_read" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "chat_messages_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "chats_user_id_idx" ON "chats"("user_id");

-- CreateIndex
CREATE INDEX "chats_admin_id_idx" ON "chats"("admin_id");

-- CreateIndex
CREATE INDEX "chats_status_idx" ON "chats"("status");

-- CreateIndex
CREATE INDEX "chats_created_at_idx" ON "chats"("created_at");

-- CreateIndex
CREATE INDEX "chat_messages_chat_id_idx" ON "chat_messages"("chat_id");

-- CreateIndex
CREATE INDEX "chat_messages_sender_id_idx" ON "chat_messages"("sender_id");

-- CreateIndex
CREATE INDEX "chat_messages_created_at_idx" ON "chat_messages"("created_at");

-- AddForeignKey
ALTER TABLE "chats" ADD CONSTRAINT "chats_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "chats" ADD CONSTRAINT "chats_admin_id_fkey" FOREIGN KEY ("admin_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "chat_messages" ADD CONSTRAINT "chat_messages_chat_id_fkey" FOREIGN KEY ("chat_id") REFERENCES "chats"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "chat_messages" ADD CONSTRAINT "chat_messages_sender_id_fkey" FOREIGN KEY ("sender_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
