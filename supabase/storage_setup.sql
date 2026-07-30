-- ========================================================
-- Elie CNC — Supabase Storage Buckets & RLS Setup
-- Run this script in your Supabase SQL Editor:
-- https://supabase.com/dashboard/project/_/sql
-- ========================================================

-- 1. Create Public Bucket for Product & Showcase Images
INSERT INTO storage.buckets (id, name, public)
VALUES ('product-images', 'product-images', true)
ON CONFLICT (id) DO NOTHING;

-- 2. Create Private/Protected Bucket for GCODE & STL Digital Files
INSERT INTO storage.buckets (id, name, public)
VALUES ('product-files', 'product-files', false)
ON CONFLICT (id) DO NOTHING;

-- --------------------------------------------------------
-- Storage Row Level Security (RLS) Policies
-- --------------------------------------------------------

-- Allow Public Read Access to Product Images
CREATE POLICY "Public Read Access for Product Images"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'product-images');

-- Allow Authenticated Admins to Upload Product Images
CREATE POLICY "Admin Upload Access for Product Images"
  ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'product-images');

-- Allow Authenticated Admins to Update/Delete Product Images
CREATE POLICY "Admin Update Access for Product Images"
  ON storage.objects FOR UPDATE TO authenticated
  USING (bucket_id = 'product-images');

CREATE POLICY "Admin Delete Access for Product Images"
  ON storage.objects FOR DELETE TO authenticated
  USING (bucket_id = 'product-images');

-- Allow Authenticated Admins Full Access to Protected Product Files
CREATE POLICY "Admin Full Access for Product Digital Files"
  ON storage.objects FOR ALL TO authenticated
  USING (bucket_id = 'product-files')
  WITH CHECK (bucket_id = 'product-files');
