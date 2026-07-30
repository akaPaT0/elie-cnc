-- Run this in your Supabase SQL Editor to add the 'images' array column to your existing elie_products table:
-- https://supabase.com/dashboard/project/_/sql

ALTER TABLE public.elie_products ADD COLUMN IF NOT EXISTS images TEXT[] DEFAULT '{}';
