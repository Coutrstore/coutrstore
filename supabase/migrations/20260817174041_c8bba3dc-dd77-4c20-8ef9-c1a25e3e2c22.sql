CREATE TABLE public.products (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  handle text NOT NULL UNIQUE,
  title text NOT NULL,
  brand text NOT NULL DEFAULT '',
  product_type text NOT NULL DEFAULT '',
  gender text NOT NULL DEFAULT 'unisex',
  category text NOT NULL DEFAULT 'clothing',
  description text NOT NULL DEFAULT '',
  description_html text NOT NULL DEFAULT '',
  images jsonb NOT NULL DEFAULT '[]'::jsonb,
  variants jsonb NOT NULL DEFAULT '[]'::jsonb,
  options jsonb NOT NULL DEFAULT '[]'::jsonb,
  price_min numeric,
  price_max numeric,
  currency text NOT NULL DEFAULT 'USD',
  available boolean NOT NULL DEFAULT true,
  collections text[] NOT NULL DEFAULT '{}',
  created_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT ON public.products TO anon;
GRANT SELECT ON public.products TO authenticated;
GRANT ALL ON public.products TO service_role;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Products are publicly viewable" ON public.products FOR SELECT USING (true);

CREATE INDEX products_collections_idx ON public.products USING gin (collections);
CREATE INDEX products_brand_idx ON public.products (brand);
CREATE INDEX products_category_idx ON public.products (category);
CREATE INDEX products_gender_idx ON public.products (gender);
CREATE INDEX products_price_idx ON public.products (price_min);
CREATE INDEX products_search_idx ON public.products USING gin (to_tsvector('simple', title || ' ' || brand || ' ' || product_type));

CREATE TABLE public.collections (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  handle text NOT NULL UNIQUE,
  title text NOT NULL,
  kind text NOT NULL DEFAULT 'category',
  parent text,
  image_url text,
  description text NOT NULL DEFAULT '',
  sort_order integer NOT NULL DEFAULT 0,
  featured boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT ON public.collections TO anon;
GRANT SELECT ON public.collections TO authenticated;
GRANT ALL ON public.collections TO service_role;
ALTER TABLE public.collections ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Collections are publicly viewable" ON public.collections FOR SELECT USING (true);