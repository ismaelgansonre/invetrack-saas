export interface User {
  id: string;
  email: string;
  created_at: string;
  updated_at?: string;
}

export interface Profile {
  id: string;
  organization_id: string | null;
  role: UserRole;
  full_name: string | null;
  invited_by: string | null;
  created_at: string;
}

export enum UserRole {
  ADMIN = 'admin',
  MANAGER = 'manager',
  MEMBER = 'member'
}

export interface Organization {
  id: string;
  name: string;
  slug: string;
  created_at: string;
}

export interface Invitation {
  id: string;
  organization_id: string;
  email: string;
  role: UserRole;
  status: InvitationStatus;
  invited_by: string;
  created_at: string;
}

export enum InvitationStatus {
  PENDING = 'pending',
  ACCEPTED = 'accepted',
  DECLINED = 'declined'
} 