-- Permite que clientes (sem login) leiam apenas o catálogo e estoque
-- Os dados financeiros e pedidos continuam protegidos
CREATE POLICY "vitrine_publica"
  ON public.app_data
  FOR SELECT
  TO anon
  USING (chave IN ('jayne_catalogo', 'jayne_estoque'));
