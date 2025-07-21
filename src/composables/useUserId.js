export function useUserId() {
  const COOKIE_NAME = 'user_id'

  const getCookie = (name) => {
    const value = `; ${document.cookie}`
    const parts = value.split(`; ${name}=`)
    if (parts.length === 2) return parts.pop().split(';').shift()
  }

  const setCookie = (name, value, days = 365) => {
    const expires = new Date(Date.now() + days * 864e5).toUTCString()
    document.cookie = `${name}=${value}; expires=${expires}; path=/`
  }

  const generateRandomId = () =>
    Math.random().toString(36).substring(2, 10) + Date.now().toString(36)

  let userId = getCookie(COOKIE_NAME)

  if (!userId) {
    userId = generateRandomId()
    setCookie(COOKIE_NAME, userId)
  }

  return userId
}
