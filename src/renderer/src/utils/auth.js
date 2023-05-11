export const TOKEN_KEY = 'TIK_APP_TOKEN'

export function getToken() {
  const token = localStorage.getItem(TOKEN_KEY) || null
  if (token) $cache.set(TOKEN_KEY, token)
  return token
}

export function setToken(token) {
  localStorage.setItem(TOKEN_KEY, token)
  $cache.set(TOKEN_KEY, token)
}

export function removeToken() {
  localStorage.removeItem(TOKEN_KEY)
  $cache.del(TOKEN_KEY)
}
