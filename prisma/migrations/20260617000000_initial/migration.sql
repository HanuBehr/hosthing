CREATE TYPE "ExperienceGuideStatus" AS ENUM ('PENDING', 'COMPLETED', 'FAILED');

CREATE TABLE "Property" (
  "id" TEXT NOT NULL,
  "code" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "propertyType" TEXT NOT NULL,
  "bedroomQuantity" INTEGER NOT NULL,
  "bathroomQuantity" INTEGER NOT NULL,
  "guestCapacity" INTEGER NOT NULL,
  "address" JSONB NOT NULL,
  "operational" JSONB NOT NULL,
  "rules" JSONB NOT NULL,
  "amenities" JSONB NOT NULL,
  "images" TEXT[],
  "host" JSONB NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,

  CONSTRAINT "Property_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "ExperienceGuide" (
  "id" TEXT NOT NULL,
  "propertyId" TEXT NOT NULL,
  "status" "ExperienceGuideStatus" NOT NULL DEFAULT 'PENDING',
  "content" JSONB,
  "errorMessage" TEXT,
  "generatedAt" TIMESTAMP(3),
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,

  CONSTRAINT "ExperienceGuide_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "Property_code_key" ON "Property"("code");

CREATE UNIQUE INDEX "ExperienceGuide_propertyId_key" ON "ExperienceGuide"("propertyId");

ALTER TABLE "ExperienceGuide" ADD CONSTRAINT "ExperienceGuide_propertyId_fkey"
  FOREIGN KEY ("propertyId") REFERENCES "Property"("id") ON DELETE CASCADE ON UPDATE CASCADE;
