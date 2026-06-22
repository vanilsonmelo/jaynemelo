-- ═══════════════════════════════════════════════════════════
--  JAYNE MELO · BORDANDO SONHOS — Setup Supabase
-- ═══════════════════════════════════════════════════════════

-- 1. Tabela principal de dados (key-value, espelha o localStorage)
CREATE TABLE IF NOT EXISTS public.app_data (
  chave        TEXT PRIMARY KEY,
  valor        JSONB,
  atualizado_em TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Segurança: só usuários autenticados acessam
ALTER TABLE public.app_data ENABLE ROW LEVEL SECURITY;

CREATE POLICY "acesso_autenticado"
  ON public.app_data
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- 3. Função que atualiza o timestamp automaticamente
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.atualizado_em = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_app_data_updated
  BEFORE UPDATE ON public.app_data
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ═══════════════════════════════════════════════════════════
--  Após rodar este SQL, crie os 3 usuários em:
--  Authentication → Users → Add User
--    1. vanilson@jm.com  (ou o email que preferir)
--    2. jayne@jm.com
--    3. colaboradora@jm.com
-- ═══════════════════════════════════════════════════════════
