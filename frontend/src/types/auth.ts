export interface UserProfile {
  id?: number;
  user_id?: number;
  phone_number?: string | null;
  avatar?: string | null;
  gender?: 'male' | 'female' | 'other' | null;
  birthday?: string | null;
  address?: string | null;
  ward?: string | null;
  district?: string | null;
  city?: string | null;
  bio?: string | null;
}

export interface User {
  id: number;
  name: string;
  email: string;
  roles: string[];
  permissions: string[];
  profile?: UserProfile | null;
}

export interface AuthResponse {
  message?: string;
  token: string;
  user: User;
}

export interface ApiErrorResponse {
  message: string;
  errors?: Record<string, string[]>;
}
