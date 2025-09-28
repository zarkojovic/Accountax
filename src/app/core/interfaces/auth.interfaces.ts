export interface RegisterPayload {
  email: string;
  password: string;
  first_name: string;
  last_name: string;
  company_name: string;
  company_id: string;
}

export interface UserProfile {
  first_name: string;
  last_name: string;
  company_name: string;
  company_id: string;
  email: string;
}

export interface AuthResult {
  userId?: string;
  error?: string;
}
export interface LoginPayload {
  email: string;
  password: string;
}
