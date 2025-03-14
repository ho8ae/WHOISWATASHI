-- CreateTable
CREATE TABLE "inquiries" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER,
    "email" VARCHAR(255) NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "title" VARCHAR(255) NOT NULL,
    "content" TEXT NOT NULL,
    "is_private" BOOLEAN NOT NULL DEFAULT false,
    "password" VARCHAR(100),
    "status" TEXT NOT NULL DEFAULT 'pending',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "inquiries_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "inquiry_answers" (
    "id" SERIAL NOT NULL,
    "inquiry_id" INTEGER NOT NULL,
    "admin_id" INTEGER NOT NULL,
    "content" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "inquiry_answers_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "inquiries_user_id_idx" ON "inquiries"("user_id");

-- CreateIndex
CREATE INDEX "inquiries_status_idx" ON "inquiries"("status");

-- CreateIndex
CREATE INDEX "inquiries_created_at_idx" ON "inquiries"("created_at");

-- CreateIndex
CREATE INDEX "inquiry_answers_inquiry_id_idx" ON "inquiry_answers"("inquiry_id");

-- AddForeignKey
ALTER TABLE "inquiries" ADD CONSTRAINT "inquiries_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "inquiry_answers" ADD CONSTRAINT "inquiry_answers_inquiry_id_fkey" FOREIGN KEY ("inquiry_id") REFERENCES "inquiries"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "inquiry_answers" ADD CONSTRAINT "inquiry_answers_admin_id_fkey" FOREIGN KEY ("admin_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
