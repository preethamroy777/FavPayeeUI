import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import api from './api.js'

const AuthContext = createContext(null)

const loadSavedUser = () => {
  try {
    const stored = localStorage.getItem('sg-current-user')
    return stored ? JSON.parse(stored) : null
  } catch {
    return null
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(loadSavedUser)

  useEffect(() => {
    if (user) {
      localStorage.setItem('sg-current-user', JSON.stringify(user))
    } else {
      localStorage.removeItem('sg-current-user')
    }
  }, [user])

  const login = useCallback(async ({ email, password }) => {
    const normalizedEmail = email?.trim()
    if (!normalizedEmail || !password) {
      throw new Error('Email and password are required.')
    }

    const response = await api.login({ email: normalizedEmail, password })
    setUser(response.user)
    return response.user
  }, [])

  const logout = useCallback(() => {
    setUser(null)
  }, [])

  const value = useMemo(
    () => ({ user, isAuthenticated: Boolean(user), login, logout }),
    [user, login, logout],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}
