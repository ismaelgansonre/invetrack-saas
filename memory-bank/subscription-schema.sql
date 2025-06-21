-- Système d'abonnements pour Invetrack
-- Créé le: $(date)
-- Auteur: @ismaelgansonre

-- Table des plans d'abonnement
CREATE TABLE subscription_plans (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    billing_cycle VARCHAR(20) NOT NULL DEFAULT 'monthly', -- monthly, yearly
    max_products INTEGER NOT NULL DEFAULT 5,
    max_suppliers INTEGER NOT NULL DEFAULT 2,
    max_members INTEGER NOT NULL DEFAULT 1,
    features JSONB DEFAULT '{}',
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table des abonnements des organisations
CREATE TABLE organization_subscriptions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    plan_id UUID NOT NULL REFERENCES subscription_plans(id),
    status VARCHAR(20) NOT NULL DEFAULT 'active', -- active, cancelled, expired, trial
    current_period_start TIMESTAMP WITH TIME ZONE NOT NULL,
    current_period_end TIMESTAMP WITH TIME ZONE NOT NULL,
    trial_end TIMESTAMP WITH TIME ZONE,
    cancelled_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(organization_id)
);

-- Table des paiements
CREATE TABLE subscription_payments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    subscription_id UUID NOT NULL REFERENCES organization_subscriptions(id) ON DELETE CASCADE,
    amount DECIMAL(10,2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'USD',
    status VARCHAR(20) NOT NULL DEFAULT 'pending', -- pending, completed, failed, refunded
    payment_method VARCHAR(50),
    stripe_payment_intent_id VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insertion des plans par défaut
INSERT INTO subscription_plans (name, price, max_products, max_suppliers, max_members, features) VALUES
('Free', 0.00, 5, 2, 1, '{"basic_tracking": true, "email_support": false, "reports": false}'),
('Starter', 25.00, 25, 10, 3, '{"basic_tracking": true, "email_support": true, "reports": true, "export": true}'),
('Professional', 75.00, 100, 25, 10, '{"basic_tracking": true, "email_support": true, "phone_support": true, "reports": true, "export": true, "api_access": true}'),
('Enterprise', 199.00, -1, -1, -1, '{"basic_tracking": true, "email_support": true, "phone_support": true, "dedicated_support": true, "reports": true, "export": true, "api_access": true, "custom_integrations": true}');

-- Fonction pour vérifier les limites d'un plan
CREATE OR REPLACE FUNCTION check_subscription_limits(
    p_organization_id UUID,
    p_resource_type VARCHAR(20), -- 'products', 'suppliers', 'members'
    p_current_count INTEGER DEFAULT 0
)
RETURNS BOOLEAN AS $$
DECLARE
    v_plan_max INTEGER;
    v_unlimited BOOLEAN := FALSE;
BEGIN
    -- Récupérer les limites du plan actuel
    SELECT 
        CASE p_resource_type
            WHEN 'products' THEN sp.max_products
            WHEN 'suppliers' THEN sp.max_suppliers
            WHEN 'members' THEN sp.max_members
            ELSE 0
        END
    INTO v_plan_max
    FROM organization_subscriptions os
    JOIN subscription_plans sp ON os.plan_id = sp.id
    WHERE os.organization_id = p_organization_id
    AND os.status = 'active'
    AND (os.current_period_end > NOW() OR os.trial_end > NOW());
    
    -- Si pas d'abonnement actif, utiliser le plan gratuit
    IF v_plan_max IS NULL THEN
        SELECT 
            CASE p_resource_type
                WHEN 'products' THEN max_products
                WHEN 'suppliers' THEN max_suppliers
                WHEN 'members' THEN max_members
                ELSE 0
            END
        INTO v_plan_max
        FROM subscription_plans
        WHERE name = 'Free';
    END IF;
    
    -- Vérifier si illimité (-1)
    IF v_plan_max = -1 THEN
        RETURN TRUE;
    END IF;
    
    -- Vérifier la limite
    RETURN p_current_count < v_plan_max;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Fonction pour obtenir les limites actuelles
CREATE OR REPLACE FUNCTION get_subscription_limits(p_organization_id UUID)
RETURNS TABLE(
    max_products INTEGER,
    max_suppliers INTEGER,
    max_members INTEGER,
    current_products INTEGER,
    current_suppliers INTEGER,
    current_members INTEGER,
    plan_name VARCHAR(100),
    plan_price DECIMAL(10,2)
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        COALESCE(sp.max_products, 5) as max_products,
        COALESCE(sp.max_suppliers, 2) as max_suppliers,
        COALESCE(sp.max_members, 1) as max_members,
        (SELECT COUNT(*) FROM products WHERE organization_id = p_organization_id) as current_products,
        (SELECT COUNT(*) FROM suppliers WHERE organization_id = p_organization_id) as current_suppliers,
        (SELECT COUNT(*) FROM profiles WHERE organization_id = p_organization_id) as current_members,
        COALESCE(sp.name, 'Free') as plan_name,
        COALESCE(sp.price, 0.00) as plan_price
    FROM organization_subscriptions os
    FULL JOIN subscription_plans sp ON os.plan_id = sp.id
    WHERE os.organization_id = p_organization_id
    AND (os.status = 'active' OR os.organization_id IS NULL)
    AND (os.current_period_end > NOW() OR os.trial_end > NOW() OR os.organization_id IS NULL)
    LIMIT 1;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Triggers pour mettre à jour updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_subscription_plans_updated_at
    BEFORE UPDATE ON subscription_plans
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_organization_subscriptions_updated_at
    BEFORE UPDATE ON organization_subscriptions
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- RLS Policies
ALTER TABLE subscription_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE organization_subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscription_payments ENABLE ROW LEVEL SECURITY;

-- Policies pour subscription_plans (lecture publique)
CREATE POLICY "subscription_plans_read_policy" ON subscription_plans
    FOR SELECT USING (is_active = true);

-- Policies pour organization_subscriptions
CREATE POLICY "organization_subscriptions_read_policy" ON organization_subscriptions
    FOR SELECT USING (
        organization_id IN (
            SELECT organization_id FROM profiles 
            WHERE id = auth.uid()
        )
    );

CREATE POLICY "organization_subscriptions_insert_policy" ON organization_subscriptions
    FOR INSERT WITH CHECK (
        organization_id IN (
            SELECT organization_id FROM profiles 
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

CREATE POLICY "organization_subscriptions_update_policy" ON organization_subscriptions
    FOR UPDATE USING (
        organization_id IN (
            SELECT organization_id FROM profiles 
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- Policies pour subscription_payments
CREATE POLICY "subscription_payments_read_policy" ON subscription_payments
    FOR SELECT USING (
        subscription_id IN (
            SELECT os.id FROM organization_subscriptions os
            JOIN profiles p ON os.organization_id = p.organization_id
            WHERE p.id = auth.uid()
        )
    );

CREATE POLICY "subscription_payments_insert_policy" ON subscription_payments
    FOR INSERT WITH CHECK (
        subscription_id IN (
            SELECT os.id FROM organization_subscriptions os
            JOIN profiles p ON os.organization_id = p.organization_id
            WHERE p.id = auth.uid() AND p.role = 'admin'
        )
    ); 