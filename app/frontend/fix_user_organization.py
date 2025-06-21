import json
import os
import time
from datetime import datetime
from supabase import create_client, Client
from supabase.lib.client_options import ClientOptions
import bcrypt

# Configuration Supabase
SUPABASE_URL = "https://quqkoacpcuegovmfsddg.supabase.co"
SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF1cWtvYWNwY3VlZ292bWZzZGRnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA1MjUwNTcsImV4cCI6MjA2NjEwMTA1N30.R2uIsVEx2EAMhxD0Bg5-u0hGgiNJRxU7SZmK4tfwc3k"

supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY, options=ClientOptions())

def diagnose_user_organization():
    """Diagnostiquer le problème avec l'utilisateur et l'organisation"""
    
    # 1. Vérifier si l'utilisateur existe
    print("=== Vérification de l'utilisateur ===")
    user_response = supabase.table("auth.users").select("id, email").eq("email", "admin@tech-solutions.com").execute()
    print(f"Utilisateur trouvé: {user_response.data}")
    
    if not user_response.data:
        print("❌ L'utilisateur n'existe pas dans auth.users")
        return
    
    user_id = user_response.data[0]["id"]
    
    # 2. Vérifier si l'organisation existe
    print("\n=== Vérification de l'organisation ===")
    org_response = supabase.table("organizations").select("*").eq("slug", "tech-solutions").execute()
    print(f"Organisation trouvée: {org_response.data}")
    
    if not org_response.data:
        print("❌ L'organisation n'existe pas")
        return
    
    org_id = org_response.data[0]["id"]
    
    # 3. Vérifier le profil
    print("\n=== Vérification du profil ===")
    profile_response = supabase.table("profiles").select("*").eq("id", user_id).execute()
    print(f"Profil trouvé: {profile_response.data}")
    
    if not profile_response.data:
        print("❌ Le profil n'existe pas")
        # Créer le profil
        print("Création du profil...")
        profile_data = {
            "id": user_id,
            "organization_id": org_id,
            "role": "admin",
            "full_name": "Alex Johnson"
        }
        try:
            supabase.table("profiles").insert(profile_data).execute()
            print("✅ Profil créé avec succès")
        except Exception as e:
            print(f"❌ Erreur lors de la création du profil: {e}")
    else:
        profile = profile_response.data[0]
        if not profile.get("organization_id"):
            print("❌ Le profil n'a pas d'organization_id")
            # Mettre à jour le profil
            print("Mise à jour du profil...")
            try:
                supabase.table("profiles").update({
                    "organization_id": org_id,
                    "role": "admin",
                    "full_name": "Alex Johnson"
                }).eq("id", user_id).execute()
                print("✅ Profil mis à jour avec succès")
            except Exception as e:
                print(f"❌ Erreur lors de la mise à jour du profil: {e}")
        else:
            print("✅ Le profil a un organization_id")
    
    # 4. Vérifier la liaison finale
    print("\n=== Vérification finale ===")
    final_response = supabase.table("profiles").select("*, organizations(*)").eq("id", user_id).execute()
    print(f"Liaison finale: {final_response.data}")

def create_test_data():
    """Créer des données de test simplifiées"""
    
    # 1. Créer l'organisation
    print("=== Création de l'organisation ===")
    org_data = {"name": "Tech Solutions Inc", "slug": "tech-solutions"}
    try:
        org_response = supabase.table("organizations").insert(org_data).execute()
        org_id = org_response.data[0]["id"]
        print(f"✅ Organisation créée: {org_id}")
    except Exception as e:
        print(f"❌ Erreur création organisation: {e}")
        # Récupérer l'ID existant
        org_response = supabase.table("organizations").select("id").eq("slug", "tech-solutions").execute()
        org_id = org_response.data[0]["id"]
        print(f"📋 Organisation existante: {org_id}")
    
    # 2. Créer l'utilisateur auth (si nécessaire)
    print("\n=== Création de l'utilisateur auth ===")
    try:
        auth_response = supabase.auth.sign_up({
            "email": "admin@tech-solutions.com",
            "password": "AdminPass123!"
        })
        user_id = auth_response.user.id
        print(f"✅ Utilisateur auth créé: {user_id}")
    except Exception as e:
        print(f"⚠️ Erreur création utilisateur auth: {e}")
        # Récupérer l'ID existant
        user_response = supabase.table("auth.users").select("id").eq("email", "admin@tech-solutions.com").execute()
        user_id = user_response.data[0]["id"]
        print(f"📋 Utilisateur auth existant: {user_id}")
    
    # 3. Créer le profil
    print("\n=== Création du profil ===")
    profile_data = {
        "id": user_id,
        "organization_id": org_id,
        "role": "admin",
        "full_name": "Alex Johnson"
    }
    try:
        supabase.table("profiles").insert(profile_data).execute()
        print("✅ Profil créé avec succès")
    except Exception as e:
        print(f"⚠️ Erreur création profil: {e}")
        # Mettre à jour le profil existant
        try:
            supabase.table("profiles").update(profile_data).eq("id", user_id).execute()
            print("✅ Profil mis à jour avec succès")
        except Exception as e2:
            print(f"❌ Erreur mise à jour profil: {e2}")
    
    # 4. Vérification finale
    print("\n=== Vérification finale ===")
    final_response = supabase.table("profiles").select("*, organizations(*)").eq("id", user_id).execute()
    print(f"Résultat final: {final_response.data}")

if __name__ == "__main__":
    print("🔍 Diagnostic du problème utilisateur-organisation")
    print("=" * 50)
    
    # Option 1: Diagnostiquer
    diagnose_user_organization()
    
    print("\n" + "=" * 50)
    print("🛠️ Création de données de test")
    print("=" * 50)
    
    # Option 2: Créer des données de test
    create_test_data() 