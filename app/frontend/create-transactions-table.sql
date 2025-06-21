-- =========================================
--    CRÉATION DE LA TABLE TRANSACTIONS
-- =========================================

-- Table pour les transactions d'inventaire et financières
CREATE TABLE IF NOT EXISTS transactions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  type VARCHAR(20) NOT NULL CHECK (type IN ('sale', 'purchase', 'adjustment', 'transfer')),
  product_id UUID REFERENCES products(id) ON DELETE SET NULL,
  quantity INTEGER NOT NULL,
  unit_price DECIMAL(10,2) NOT NULL DEFAULT 0,
  total_amount DECIMAL(10,2) NOT NULL DEFAULT 0,
  description TEXT,
  reference_id UUID, -- Pour lier à orders, etc.
  reference_type VARCHAR(50), -- 'order', 'manual', etc.
  created_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index pour les performances
CREATE INDEX IF NOT EXISTS idx_transactions_organization ON transactions(organization_id);
CREATE INDEX IF NOT EXISTS idx_transactions_type ON transactions(type);
CREATE INDEX IF NOT EXISTS idx_transactions_date ON transactions(created_at);
CREATE INDEX IF NOT EXISTS idx_transactions_product ON transactions(product_id);

-- Trigger pour mettre à jour updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_transactions_updated_at
  BEFORE UPDATE ON transactions
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Politiques RLS pour les transactions
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;

-- Les utilisateurs peuvent voir les transactions de leur organisation
CREATE POLICY "Users can view their organization transactions"
  ON transactions
  FOR SELECT
  USING (
    organization_id = (
      SELECT organization_id FROM profiles WHERE id = auth.uid()
    )
  );

-- Les utilisateurs peuvent créer des transactions pour leur organisation
CREATE POLICY "Users can create transactions for their organization"
  ON transactions
  FOR INSERT
  WITH CHECK (
    organization_id = (
      SELECT organization_id FROM profiles WHERE id = auth.uid()
    )
  );

-- Les utilisateurs peuvent modifier les transactions de leur organisation
CREATE POLICY "Users can update their organization transactions"
  ON transactions
  FOR UPDATE
  USING (
    organization_id = (
      SELECT organization_id FROM profiles WHERE id = auth.uid()
    )
  );

-- Les utilisateurs peuvent supprimer les transactions de leur organisation
CREATE POLICY "Users can delete their organization transactions"
  ON transactions
  FOR DELETE
  USING (
    organization_id = (
      SELECT organization_id FROM profiles WHERE id = auth.uid()
    )
  );

-- Fonction pour calculer automatiquement le montant total
CREATE OR REPLACE FUNCTION calculate_transaction_total()
RETURNS TRIGGER AS $$
BEGIN
  NEW.total_amount = NEW.quantity * NEW.unit_price;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER auto_calculate_transaction_total
  BEFORE INSERT OR UPDATE ON transactions
  FOR EACH ROW
  EXECUTE FUNCTION calculate_transaction_total();

-- Commentaires
COMMENT ON TABLE transactions IS 'Transactions d''inventaire et financières';
COMMENT ON COLUMN transactions.type IS 'Type: sale (vente), purchase (achat), adjustment (ajustement), transfer (transfert)';
COMMENT ON COLUMN transactions.reference_id IS 'ID de référence (ex: order_id pour les commandes)';
COMMENT ON COLUMN transactions.reference_type IS 'Type de référence (ex: order, manual)';

-- =========================================
--      FIN DE LA CRÉATION
-- ========================================= 