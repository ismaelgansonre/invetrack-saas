-- =========================================
-- CORRECTION DES POLITIQUES RLS - VERSION 3
-- Éviter la récursion infinie avec une fonction SECURITY DEFINER
-- =========================================

-- =========================================
-- 1. FONCTION POUR OBTENIR L'ORGANISATION DE L'UTILISATEUR
-- =========================================
-- Cette fonction récupère l'ID de l'organisation de l'utilisateur actuel.
-- SECURITY DEFINER permet à la fonction de s'exécuter avec les droits du créateur (qui a accès à toute la table),
-- contournant ainsi les politiques RLS de l'appelant et évitant la récursion infinie.

CREATE OR REPLACE FUNCTION public.get_my_organization_id()
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  org_id uuid;
BEGIN
  SELECT organization_id INTO org_id
  FROM profiles
  WHERE id = auth.uid();
  RETURN org_id;
END;
$$;


-- =========================================
-- 2. POLITIQUES RLS POUR LA TABLE `profiles`
-- =========================================

-- Supprimer toutes les politiques existantes sur `profiles` pour un nouveau départ
DROP POLICY IF EXISTS "User can see only his own profile" ON profiles;
DROP POLICY IF EXISTS "User can insert their own profile" ON profiles;
DROP POLICY IF EXISTS "User can update only his own profile" ON profiles;
DROP POLICY IF EXISTS "Users can view org profiles" ON profiles;
DROP POLICY IF EXISTS "Users can update org profiles" ON profiles;
DROP POLICY IF EXISTS "Users can view profiles from their own organization" ON profiles;


-- Activer RLS sur `profiles` si ce n'est pas déjà fait
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Les utilisateurs peuvent insérer leur propre profil.
-- Nécessaire pour le trigger `handle_new_user` après l'inscription.
CREATE POLICY "User can insert their own profile"
ON profiles
FOR INSERT
WITH CHECK (id = auth.uid());

-- Les utilisateurs peuvent voir leur propre profil.
-- C'est la politique de base qui permet à un utilisateur de voir ses propres informations.
CREATE POLICY "User can see only his own profile"
ON profiles
FOR SELECT
USING (id = auth.uid());

-- Les utilisateurs peuvent voir les profils des autres membres de leur organisation.
-- Utilise la fonction `get_my_organization_id()` pour éviter la récursion.
CREATE POLICY "Users can view profiles from their own organization"
ON profiles
FOR SELECT
USING (organization_id = get_my_organization_id());

-- Les utilisateurs peuvent mettre à jour leur propre profil.
CREATE POLICY "User can update only his own profile"
ON profiles
FOR UPDATE
USING (id = auth.uid())
WITH CHECK (id = auth.uid());


-- =========================================
-- 3. POLITIQUES RLS POUR LA TABLE `organizations`
-- =========================================

-- Supprimer les politiques existantes sur `organizations`
DROP POLICY IF EXISTS "Authenticated users can view organizations" ON organizations;
DROP POLICY IF EXISTS "Authenticated users can create organizations" ON organizations;
DROP POLICY IF EXISTS "Admins can update their organization" ON organizations;
DROP POLICY IF EXISTS "Users can update their organization" ON organizations;
DROP POLICY IF EXISTS "Organization members can update their organization" ON organizations;

-- Activer RLS sur `organizations`
ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;

-- Tout utilisateur authentifié peut créer une organisation.
CREATE POLICY "Authenticated users can create organizations"
ON organizations
FOR INSERT
WITH CHECK (auth.role() = 'authenticated');

-- Tout utilisateur authentifié peut voir toutes les organisations (utile pour en rejoindre une).
CREATE POLICY "Authenticated users can view organizations"
ON organizations
FOR SELECT
USING (auth.role() = 'authenticated');

-- Les membres d'une organisation peuvent la mettre à jour.
-- La logique pour vérifier le rôle ('admin' ou 'manager') doit être gérée côté application.
CREATE POLICY "Organization members can update their organization"
ON organizations
FOR UPDATE
USING (id = get_my_organization_id());


-- =========================================
-- 4. TRIGGER POUR LA CRÉATION DE PROFIL
-- =========================================

-- La fonction et le trigger devraient déjà exister, mais on s'assure qu'ils sont corrects.
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, role)
  VALUES (
    new.id,
    new.raw_user_meta_data->>'full_name',
    'member' -- Rôle par défaut
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- =========================================
-- COMMENTAIRES
-- =========================================
/*
RÉSUMÉ DES CHANGEMENTS (V3):
Le problème de "récursion infinie" venait du fait que les politiques RLS sur la table `profiles`
contenaient des sous-requêtes qui interrogeaient cette même table `profiles`.

SOLUTION :
1.  Création d'une fonction PostgreSQL `get_my_organization_id()` avec `SECURITY DEFINER`.
    - `SECURITY DEFINER` permet à la fonction de s'exécuter avec les permissions de son créateur,
      en ignorant les RLS de l'utilisateur qui l'appelle. Cela casse la boucle de récursion.
2.  Réécriture des politiques RLS pour utiliser cette fonction au lieu d'une sous-requête.
    - Les politiques sont maintenant plus simples, plus sûres et plus performantes.

Cette approche est la méthode standard et recommandée pour gérer ce type de dépendance dans les politiques RLS.
*/ 