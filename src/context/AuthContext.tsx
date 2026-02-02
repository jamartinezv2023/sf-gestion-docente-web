// src/context/AuthContext.tsx
/**
 * AuthContext
 * -------------------------------------------------------
 * Contexto global de autenticación.
 *
 * Responsabilidades:
 * - Gestionar el estado del usuario autenticado
 * - Persistir y restaurar el token JWT
 * - Exponer funciones de login y logout
 * - Servir como base para protección de rutas y roles
 *
 * Este contexto se integra con:
 * - authService (capa de servicios)
 * - localStorage (persistencia de sesión)
 */

import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";

import { authService } from "../services/auth.service";
import type {
  LoginPayload,
  LoginResponse,
} from "../services/auth.service";

/* ======================================================
   TIPOS
====================================================== */

/**
 * Forma del contexto de autenticación
 */
interface AuthContextType {
  user: LoginResponse["user"] | null;
  token: string | null;
  login: (payload: LoginPayload) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

/* ======================================================
   CONTEXTO
====================================================== */

const AuthContext = createContext<AuthContextType | undefined>(undefined);

/* ======================================================
   PROVIDER
====================================================== */

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<LoginResponse["user"] | null>(null);
  const [token, setToken] = useState<string | null>(null);

  /**
   * Al montar la aplicación:
   * - Restaurar token desde localStorage si existe
   * - (Opcional futuro) validar token contra backend
   */
  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      setToken(storedToken);
    }
  }, []);

  /**
   * Login
   * ---------------------------------------------------
   * Llama al backend (/auth/login), guarda token y usuario
   */
  const login = async (payload: LoginPayload) => {
    const data = await authService.login(payload);

    setUser(data.user);
    setToken(data.token);
    localStorage.setItem("token", data.token);
  };

  /**
   * Logout
   * ---------------------------------------------------
   * Limpia estado local y storage
   * (el backend no necesita endpoint de logout en JWT)
   */
  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("token");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        login,
        logout,
        isAuthenticated: Boolean(token),
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

/* ======================================================
   HOOK PERSONALIZADO
====================================================== */

/**
 * useAuth
 * ---------------------------------------------------
 * Hook seguro para consumir el contexto de autenticación
 */
export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth debe usarse dentro de <AuthProvider>");
  }

  return context;
}