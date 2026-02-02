// src/auth/auth.service.ts
import http from "../api/http";
import { LoginRequest, LoginResponse } from "./auth.types";

export const login = async (data: LoginRequest): Promise<LoginResponse> => {
  const response = await http.post<LoginResponse>("/auth/login", data);
  return response.data;
};