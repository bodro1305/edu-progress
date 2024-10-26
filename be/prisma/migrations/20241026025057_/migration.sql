-- CreateEnum
CREATE TYPE "LessonEnum" AS ENUM ('B_INGGRIS', 'MATEMATIKA', 'IPAS', 'B_INDONESIA', 'PPKN', 'SENI_BUDAYA', 'SEJARAH', 'PKK', 'OLAHRAGA', 'TARIKH', 'ALQURAN_DAN_HADITS', 'AQIDAH_AKHLAK', 'AIJ', 'ASJ');

-- CreateEnum
CREATE TYPE "SubstituteDayEnum" AS ENUM ('senin', 'selasa', 'rabu', 'kamis', 'jumat', 'sabtu', 'minggu');

-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('admin', 'regular');

-- CreateEnum
CREATE TYPE "ClassEnum" AS ENUM ('TKJ_10_A', 'TKJ_10_B', 'TKJ_11_A', 'TKJ_11_B', 'TKJ_12_A', 'TKJ_12_B', 'AKL_10_A', 'AKL_11_A', 'AKL_12_A');

-- CreateEnum
CREATE TYPE "TeachingTimeEnum" AS ENUM ('TIME_1', 'TIME_2', 'TIME_3', 'TIME_4', 'TIME_5', 'TIME_6', 'TIME_7', 'TIME_8', 'TIME_9', 'TIME_10', 'TIME_11');

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "username" TEXT NOT NULL,
    "full_name" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "public_id" TEXT NOT NULL,
    "role" "UserRole" NOT NULL DEFAULT 'regular',
    "is_substitute" BOOLEAN NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Substitute" (
    "id" SERIAL NOT NULL,
    "user_public_id" TEXT NOT NULL,
    "day" "SubstituteDayEnum" NOT NULL,

    CONSTRAINT "Substitute_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Lesson" (
    "id" SERIAL NOT NULL,
    "user_public_id" TEXT NOT NULL,
    "name" "LessonEnum" NOT NULL,
    "lesson_public_id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Lesson_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Journal" (
    "id" SERIAL NOT NULL,
    "class_subject" "ClassEnum" NOT NULL,
    "teaching_time" "TeachingTimeEnum"[],
    "summary" TEXT NOT NULL,
    "public_id" TEXT NOT NULL,
    "is_subsitute" BOOLEAN NOT NULL,
    "filled_by_user_public_id" TEXT NOT NULL,
    "substitute_user_public_id" TEXT,
    "lesson_public_id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Journal_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

-- CreateIndex
CREATE UNIQUE INDEX "User_public_id_key" ON "User"("public_id");

-- CreateIndex
CREATE UNIQUE INDEX "Lesson_lesson_public_id_key" ON "Lesson"("lesson_public_id");

-- CreateIndex
CREATE UNIQUE INDEX "Journal_public_id_key" ON "Journal"("public_id");

-- AddForeignKey
ALTER TABLE "Substitute" ADD CONSTRAINT "Substitute_user_public_id_fkey" FOREIGN KEY ("user_public_id") REFERENCES "User"("public_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Lesson" ADD CONSTRAINT "Lesson_user_public_id_fkey" FOREIGN KEY ("user_public_id") REFERENCES "User"("public_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Journal" ADD CONSTRAINT "Journal_filled_by_user_public_id_fkey" FOREIGN KEY ("filled_by_user_public_id") REFERENCES "User"("public_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Journal" ADD CONSTRAINT "Journal_substitute_user_public_id_fkey" FOREIGN KEY ("substitute_user_public_id") REFERENCES "User"("public_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Journal" ADD CONSTRAINT "Journal_lesson_public_id_fkey" FOREIGN KEY ("lesson_public_id") REFERENCES "Lesson"("lesson_public_id") ON DELETE RESTRICT ON UPDATE CASCADE;
