GRANT INSERT, UPDATE, DELETE ON public.products TO anon;
GRANT INSERT, UPDATE, DELETE ON public.collections TO anon;
CREATE POLICY "temp import products" ON public.products FOR ALL TO anon USING (true) WITH CHECK (true);
CREATE POLICY "temp import collections" ON public.collections FOR ALL TO anon USING (true) WITH CHECK (true);