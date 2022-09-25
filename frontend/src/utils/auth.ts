
export const TOKEN_KEY = 'TOKEN'

export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY) || null
}

export function setToken(token: string): void {
  localStorage.setItem(TOKEN_KEY, token)
}

export function removeToken(): void {
  localStorage.removeItem(TOKEN_KEY)
}
