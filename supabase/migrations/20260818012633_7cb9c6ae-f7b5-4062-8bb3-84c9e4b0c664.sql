DROP POLICY IF EXISTS "temp import products" ON public.products;
DROP POLICY IF EXISTS "temp import collections" ON public.collections;
REVOKE INSERT, UPDATE, DELETE ON public.products FROM anon;
REVOKE INSERT, UPDATE, DELETE ON public.collections FROM anon;