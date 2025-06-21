-- Script pour mettre à jour les rôles des profils selon leur email
-- Basé sur les données de data.json

-- 1. Tech Solutions Inc
UPDATE profiles 
SET role = 'admin', full_name = 'Alex Johnson'
WHERE id = (SELECT id FROM auth.users WHERE email = 'admin@tech-solutions.com');

UPDATE profiles 
SET role = 'manager', full_name = 'Sarah Williams'
WHERE id = (SELECT id FROM auth.users WHERE email = 'manager@tech-solutions.com');

-- 2. Green Energy Corp
UPDATE profiles 
SET role = 'admin', full_name = 'Michael Green'
WHERE id = (SELECT id FROM auth.users WHERE email = 'admin@green-energy.com');

UPDATE profiles 
SET role = 'member', full_name = 'Robert Chen'
WHERE id = (SELECT id FROM auth.users WHERE email = 'supplier@green-energy.com');

-- 3. MediCare Group
UPDATE profiles 
SET role = 'admin', full_name = 'Dr. Emily Parker'
WHERE id = (SELECT id FROM auth.users WHERE email = 'admin@medicare.com');

UPDATE profiles 
SET role = 'manager', full_name = 'James Wilson'
WHERE id = (SELECT id FROM auth.users WHERE email = 'manager@medicare.com');

-- 4. EduFuture Ltd
UPDATE profiles 
SET role = 'admin', full_name = 'Linda Thompson'
WHERE id = (SELECT id FROM auth.users WHERE email = 'admin@edufuture.com');

UPDATE profiles 
SET role = 'member', full_name = 'Daniel Brown'
WHERE id = (SELECT id FROM auth.users WHERE email = 'user@edufuture.com');

-- 5. LogiTrans International
UPDATE profiles 
SET role = 'admin', full_name = 'Thomas Anderson'
WHERE id = (SELECT id FROM auth.users WHERE email = 'admin@logitrans.com');

UPDATE profiles 
SET role = 'manager', full_name = 'Jessica Lee'
WHERE id = (SELECT id FROM auth.users WHERE email = 'ops@logitrans.com');

-- Vérification des mises à jour
SELECT 
  p.id,
  u.email,
  p.full_name,
  p.role,
  o.name as organization_name
FROM profiles p
JOIN auth.users u ON p.id = u.id
LEFT JOIN organizations o ON p.organization_id = o.id
ORDER BY o.name, p.role; 