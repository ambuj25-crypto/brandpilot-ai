-- ============================================================
-- Supabase SQL: businesses table
-- Paste this into Supabase Dashboard → SQL Editor → New Query
-- ============================================================

-- 1. Create the businesses table
CREATE TABLE IF NOT EXISTS public.businesses (
  id          uuid        DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id     uuid        REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name        text,
  industry    text,
  target_audience text,
  tone        text,
  created_at  timestamptz DEFAULT now()
);

-- 2. Enable Row Level Security
ALTER TABLE public.businesses ENABLE ROW LEVEL SECURITY;

-- 3. RLS Policies — users can only access their own rows

-- SELECT: users can read their own business profile
CREATE POLICY "Users can view their own business"
  ON public.businesses
  FOR SELECT
  USING (auth.uid() = user_id);

-- INSERT: users can create their own business profile
CREATE POLICY "Users can insert their own business"
  ON public.businesses
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- UPDATE: users can update their own business profile
CREATE POLICY "Users can update their own business"
  ON public.businesses
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- DELETE: users can delete their own business profile
CREATE POLICY "Users can delete their own business"
  ON public.businesses
  FOR DELETE
  USING (auth.uid() = user_id);

-- 4. Create an index on user_id for faster lookups
CREATE INDEX IF NOT EXISTS idx_businesses_user_id ON public.businesses(user_id);
