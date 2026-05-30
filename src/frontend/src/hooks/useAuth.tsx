import { useInternetIdentity } from "@caffeineai/core-infrastructure";
import type { Principal } from "@dfinity/principal";

export interface AuthState {
  isAuthenticated: boolean;
  principal: Principal | null;
  isLoading: boolean;
  login: () => void;
  logout: () => void;
}

export function useAuth(): AuthState {
  const { login, clear, loginStatus, identity } = useInternetIdentity();

  const isAuthenticated = loginStatus === "success" && identity !== null;
  const isLoading = loginStatus === "logging-in";
  const principal =
    isAuthenticated && identity ? identity.getPrincipal() : null;

  return {
    isAuthenticated,
    principal,
    isLoading,
    login,
    logout: clear,
  };
}
