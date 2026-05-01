const AUTH_KEY = "leonly_auth";

export function isAuthenticated(): boolean {
  try {
    return localStorage.getItem(AUTH_KEY) === "true";
  } catch {
    return false;
  }
}

export function login(password: string): boolean {
  const correct = import.meta.env.VITE_ACCESS_PASSWORD as string | undefined;
  if (!correct || password !== correct) return false;
  try {
    localStorage.setItem(AUTH_KEY, "true");
  } catch {
    // storage unavailable — silent fail
  }
  return true;
}

export function logout(): void {
  try {
    localStorage.removeItem(AUTH_KEY);
  } catch {
    // storage unavailable — silent fail
  }
}
