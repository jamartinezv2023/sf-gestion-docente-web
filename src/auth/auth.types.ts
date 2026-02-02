// src/auth/auth.types.ts
export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthUser {
  id: number;
  email: string;
  role: string;
}

export interface LoginResponse {
  token: string;
  user: AuthUser;
}