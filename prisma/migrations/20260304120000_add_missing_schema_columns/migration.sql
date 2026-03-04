-- Migration: Add missing columns to sync database with current Prisma schema
-- Fixes: "column 'notes' of relation 'orders' does not exist"
-- The database may have 'orders' as the backing table for the Booking model.
-- This migration adds the missing 'notes' column and all other columns/tables
-- introduced in recent schema changes that were never migrated.

-- ============================================================
-- Fix: Add notes to the 'orders' table if it exists
-- (covers deployments where Booking was historically mapped to orders)
-- ============================================================
DO $$ BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.tables
    WHERE table_schema = 'public' AND table_name = 'orders'
  ) THEN
    IF NOT EXISTS (
      SELECT 1 FROM information_schema.columns
      WHERE table_schema = 'public' AND table_name = 'orders' AND column_name = 'notes'
    ) THEN
      EXECUTE 'ALTER TABLE "orders" ADD COLUMN "notes" TEXT';
    END IF;
  END IF;
END $$;

-- ============================================================
-- Client: add genre and notes columns
-- ============================================================
ALTER TABLE "Client" ADD COLUMN IF NOT EXISTS "genre" TEXT;
ALTER TABLE "Client" ADD COLUMN IF NOT EXISTS "notes" TEXT;

-- ============================================================
-- ClientRevenue: create table if not exists
-- ============================================================
CREATE TABLE IF NOT EXISTS "ClientRevenue" (
    "id" TEXT NOT NULL,
    "clientId" TEXT NOT NULL,
    "totalRevenue" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ClientRevenue_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "ClientRevenue_clientId_key" UNIQUE ("clientId")
);

-- Add foreign key for ClientRevenue -> Client only if it doesn't exist
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints
    WHERE constraint_name = 'ClientRevenue_clientId_fkey'
  ) THEN
    ALTER TABLE "ClientRevenue"
      ADD CONSTRAINT "ClientRevenue_clientId_fkey"
      FOREIGN KEY ("clientId") REFERENCES "Client"("id") ON DELETE CASCADE ON UPDATE CASCADE;
  END IF;
END $$;

-- ============================================================
-- Booking: add stripePaymentIntentId column
-- ============================================================
ALTER TABLE "Booking" ADD COLUMN IF NOT EXISTS "stripePaymentIntentId" TEXT;

-- ============================================================
-- PaymentMethod enum: add STRIPE value if not present
-- ============================================================
DO $$ BEGIN
  ALTER TYPE "PaymentMethod" ADD VALUE 'STRIPE';
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- ============================================================
-- Referral: add clientId column and unique constraint on bookingId
-- ============================================================
ALTER TABLE "Referral" ADD COLUMN IF NOT EXISTS "clientId" TEXT;

-- Add foreign key for Referral -> Client (clientId) if not present
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints
    WHERE constraint_name = 'Referral_clientId_fkey'
  ) THEN
    ALTER TABLE "Referral"
      ADD CONSTRAINT "Referral_clientId_fkey"
      FOREIGN KEY ("clientId") REFERENCES "Client"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
  END IF;
END $$;

-- Add unique constraint on Referral.bookingId if not present
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints
    WHERE constraint_name = 'Referral_bookingId_key'
  ) THEN
    ALTER TABLE "Referral" ADD CONSTRAINT "Referral_bookingId_key" UNIQUE ("bookingId");
  END IF;
END $$;

-- ============================================================
-- WorkOrder: add foreign key for createdByUser relation if not present
-- ============================================================
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints
    WHERE constraint_name = 'WorkOrder_createdBy_fkey'
  ) THEN
    ALTER TABLE "WorkOrder"
      ADD CONSTRAINT "WorkOrder_createdBy_fkey"
      FOREIGN KEY ("createdBy") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
  END IF;
END $$;

-- ============================================================
-- ServicePricing: add unique constraint on (serviceType, sessionMode) if not present
-- ============================================================
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints
    WHERE constraint_name = 'ServicePricing_serviceType_sessionMode_key'
  ) THEN
    ALTER TABLE "ServicePricing"
      ADD CONSTRAINT "ServicePricing_serviceType_sessionMode_key"
      UNIQUE ("serviceType", "sessionMode");
  END IF;
END $$;
