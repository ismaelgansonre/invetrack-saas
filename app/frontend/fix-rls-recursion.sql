-- =========================================
--    CORRECTION RÉCURSION INFINIE RLS
-- =========================================

-- 1. SUPPRIMER LES ANCIENNES POLITIQUES PROBLÉMATIQUES
-- =========================================

-- Supprimer toutes les politiques existantes sur profiles
DROP POLICY IF EXISTS "User can see only his own profile" ON profiles;
DROP POLICY IF EXISTS "User can update only his own profile" ON profiles;
DROP POLICY IF EXISTS "Admins can view all org profiles" ON profiles;

-- 2. CRÉER LA FONCTION SECURITY DEFINER
-- =========================================

-- Fonction pour obtenir l'ID de l'organisation de l'utilisateur connecté
CREATE OR REPLACE FUNCTION get_my_organization_id()
RETURNS uuid
LANGUAGE sql
SECURITY DEFINER
AS $$
  SELECT organization_id FROM profiles WHERE id = auth.uid();
$$;

-- 3. CRÉER LES NOUVELLES POLITIQUES SIMPLES
-- =========================================

-- Politique pour la lecture : l'utilisateur peut voir son propre profil
CREATE POLICY "User can view own profile"
  ON profiles
  FOR SELECT
  USING (id = auth.uid());

-- Politique pour la mise à jour : l'utilisateur peut modifier son propre profil
CREATE POLICY "User can update own profile"
  ON profiles
  FOR UPDATE
  USING (id = auth.uid());

-- Politique pour l'insertion : l'utilisateur peut créer son propre profil
CREATE POLICY "User can insert own profile"
  ON profiles
  FOR INSERT
  WITH CHECK (id = auth.uid());

-- 4. CRÉER UNE POLITIQUE SPÉCIALE POUR LES ADMINS
-- =========================================

-- Politique pour permettre aux admins de voir tous les profils de leur organisation
CREATE POLICY "Admins can view org profiles"
  ON profiles
  FOR SELECT
  USING (
    organization_id = get_my_organization_id()
    AND (
      SELECT role FROM profiles WHERE id = auth.uid()
    ) IN ('admin', 'manager')
  );

-- 5. VÉRIFIER QUE LES POLITIQUES FONCTIONNENT
-- =========================================

-- Test de la fonction
SELECT get_my_organization_id() as test_org_id;

-- Lister toutes les politiques sur profiles
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual,
  with_check
FROM pg_policies 
WHERE tablename = 'profiles';

-- =========================================
--      FIN DE LA CORRECTION
-- ========================================= 