/* eslint-disable react-refresh/only-export-components */
import {
  createContext,
  useContext,
  useReducer,
  useEffect,
  type ReactNode,
} from 'react'


export const MOCK_USERS = [
  { username: 'admin@pomodoro.com', password: '1234' },
  { username: 'aluno@pomodoro.com', password: 'senha123' },
]

// Tipos
type AuthState = {
  isAuthenticated: boolean
  username: string | null
}

type AuthAction =
  | { type: 'LOGIN'; payload: string }
  | { type: 'LOGOUT' }

type AuthContextType = AuthState & {
  login: (username: string, password: string) => boolean
  logout: () => void
}

// Reducer
function authReducer(state: AuthState, action: AuthAction): AuthState {
  switch (action.type) {
    case 'LOGIN':
      return { isAuthenticated: true, username: action.payload }
    case 'LOGOUT':
      return { isAuthenticated: false, username: null }
    default:
      return state
  }
}

// Estado inicial — verifica sessionStorage para persistir ao F5
const initialState: AuthState = (() => {
  const stored = sessionStorage.getItem('auth')
  if (stored) {
    try {
      return JSON.parse(stored) as AuthState
    } catch {
      return { isAuthenticated: false, username: null }
    }
  }
  return { isAuthenticated: false, username: null }
})()

// Contexto
const AuthContext = createContext<AuthContextType | null>(null)

// Provider
export function AuthContextProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(authReducer, initialState)

  // Persiste no sessionStorage quando o estado muda
  useEffect(() => {
    sessionStorage.setItem('auth', JSON.stringify(state))
  }, [state])

  const login = (username: string, password: string): boolean => {
    const found = MOCK_USERS.find(
      (u) => u.username === username && u.password === password
    )
    if (found) {
      dispatch({ type: 'LOGIN', payload: username })
      return true
    }
    return false
  }

  const logout = () => {
    dispatch({ type: 'LOGOUT' })
    sessionStorage.removeItem('auth')
  }

  return (
    <AuthContext.Provider value={{ ...state, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

// Hook de conveniência
export function useAuth(): AuthContextType {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth deve ser usado dentro de AuthContextProvider')
  return ctx
}