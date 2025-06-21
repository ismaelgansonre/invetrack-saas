-- =========================================
--    AMÉLIORATIONS SIMPLES DU SCHÉMA
-- =========================================

-- 1. AJOUTER DES CONTRAINTES DE VALIDATION
-- =========================================

-- Contrainte sur les rôles (seulement admin, manager, member)
ALTER TABLE profiles 
ADD CONSTRAINT valid_role CHECK (role IN ('admin', 'manager', 'member'));

-- Contrainte sur les statuts de commande
ALTER TABLE orders 
ADD CONSTRAINT valid_status CHECK (status IN ('pending', 'completed', 'cancelled'));

-- Contrainte sur les statuts d'invitation
ALTER TABLE invitations 
ADD CONSTRAINT valid_invitation_status CHECK (status IN ('pending', 'accepted', 'declined'));

-- Contrainte sur les prix (doit être positif)
ALTER TABLE products 
ADD CONSTRAINT positive_price CHECK (price >= 0);

ALTER TABLE order_items 
ADD CONSTRAINT positive_unit_price CHECK (unit_price >= 0);

-- Contrainte sur les quantités (doit être positif)
ALTER TABLE products 
ADD CONSTRAINT positive_quantity CHECK (quantity >= 0);

ALTER TABLE order_items 
ADD CONSTRAINT positive_item_quantity CHECK (quantity > 0);

-- 2. AJOUTER DES COLONNES UTILES
-- =========================================

-- Ajouter une colonne pour les images de produits
ALTER TABLE products 
ADD COLUMN IF NOT EXISTS image_url TEXT;

-- Ajouter une colonne pour les notes/commentaires
ALTER TABLE orders 
ADD COLUMN IF NOT EXISTS notes TEXT;

-- Ajouter une colonne pour le numéro de commande (plus lisible)
ALTER TABLE orders 
ADD COLUMN IF NOT EXISTS order_number TEXT;

-- 3. AMÉLIORER LES INDEXES
-- =========================================

-- Index sur les emails pour les recherches rapides
CREATE INDEX IF NOT EXISTS idx_profiles_email ON profiles(id) WHERE id IN (SELECT id FROM auth.users);

-- Index sur les statuts pour filtrer rapidement
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_invitations_status ON invitations(status);

-- Index sur les dates pour les rapports
CREATE INDEX IF NOT EXISTS idx_orders_date ON orders(order_date);
CREATE INDEX IF NOT EXISTS idx_audit_logs_date ON audit_logs(created_at);

-- 4. AJOUTER DES FONCTIONS UTILES
-- =========================================

-- Fonction pour générer un numéro de commande automatique
CREATE OR REPLACE FUNCTION generate_order_number()
RETURNS TRIGGER AS $$
BEGIN
  NEW.order_number := 'ORD-' || EXTRACT(YEAR FROM NOW()) || '-' || 
                     LPAD(EXTRACT(MONTH FROM NOW())::TEXT, 2, '0') || '-' ||
                     LPAD((SELECT COALESCE(MAX(CAST(SUBSTRING(order_number FROM 12) AS INTEGER)), 0) + 1 
                           FROM orders 
                           WHERE order_number LIKE 'ORD-' || EXTRACT(YEAR FROM NOW()) || '-' || 
                                 LPAD(EXTRACT(MONTH FROM NOW())::TEXT, 2, '0') || '-%')::TEXT, 4, '0');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger pour générer automatiquement le numéro de commande
CREATE TRIGGER auto_generate_order_number
  BEFORE INSERT ON orders
  FOR EACH ROW
  WHEN (NEW.order_number IS NULL)
  EXECUTE FUNCTION generate_order_number();

-- 5. AMÉLIORER LES POLITIQUES RLS
-- =========================================

-- Politique pour permettre aux admins de voir tous les profils de leur organisation
DROP POLICY IF EXISTS "Admins can view all org profiles" ON profiles;
CREATE POLICY "Admins can view all org profiles"
  ON profiles
  FOR SELECT
  USING (
    organization_id = (
      SELECT organization_id FROM profiles WHERE id = auth.uid()
    )
    AND (
      SELECT role FROM profiles WHERE id = auth.uid()
    ) IN ('admin', 'manager')
  );

-- 6. AJOUTER DES VUES UTILES
-- =========================================

-- Vue pour les commandes avec détails
CREATE OR REPLACE VIEW orders_with_details AS
SELECT 
  o.id,
  o.order_number,
  o.status,
  o.order_date,
  o.total_amount,
  o.notes,
  o.organization_id,
  org.name as organization_name,
  s.name as supplier_name,
  s.contact_info as supplier_contact,
  COUNT(oi.id) as item_count
FROM orders o
LEFT JOIN organizations org ON o.organization_id = org.id
LEFT JOIN suppliers s ON o.supplier_id = s.id
LEFT JOIN order_items oi ON o.id = oi.order_id
GROUP BY o.id, o.order_number, o.status, o.order_date, o.total_amount, o.notes, 
         o.organization_id, org.name, s.name, s.contact_info;

-- Vue pour les produits avec stock faible
CREATE OR REPLACE VIEW low_stock_products AS
SELECT 
  p.id,
  p.name,
  p.description,
  p.quantity,
  p.min_quantity,
  p.price,
  p.organization_id,
  org.name as organization_name,
  CASE 
    WHEN p.quantity = 0 THEN 'Rupture'
    WHEN p.quantity <= p.min_quantity THEN 'Stock faible'
    ELSE 'OK'
  END as stock_status
FROM products p
LEFT JOIN organizations org ON p.organization_id = org.id
WHERE p.quantity <= p.min_quantity;

-- 7. COMMENTAIRES POUR LA DOCUMENTATION
-- =========================================

COMMENT ON TABLE organizations IS 'Organisations/entreprises utilisant le SaaS';
COMMENT ON TABLE profiles IS 'Profils utilisateurs liés à Supabase Auth';
COMMENT ON TABLE products IS 'Produits en inventaire par organisation';
COMMENT ON TABLE suppliers IS 'Fournisseurs par organisation';
COMMENT ON TABLE orders IS 'Commandes passées aux fournisseurs';
COMMENT ON TABLE order_items IS 'Détail des articles dans chaque commande';
COMMENT ON TABLE invitations IS 'Invitations à rejoindre une organisation';
COMMENT ON TABLE audit_logs IS 'Logs d''audit pour tracer les actions importantes';

COMMENT ON COLUMN profiles.role IS 'Rôle: admin (tout), manager (gestion), member (lecture)';
COMMENT ON COLUMN orders.status IS 'Statut: pending, completed, cancelled';
COMMENT ON COLUMN invitations.status IS 'Statut: pending, accepted, declined';
COMMENT ON COLUMN products.image_url IS 'URL de l''image du produit (optionnel)';
COMMENT ON COLUMN orders.order_number IS 'Numéro de commande généré automatiquement';
COMMENT ON COLUMN orders.notes IS 'Notes/commentaires sur la commande';

-- =========================================
--      FIN DES AMÉLIORATIONS
-- ========================================= 