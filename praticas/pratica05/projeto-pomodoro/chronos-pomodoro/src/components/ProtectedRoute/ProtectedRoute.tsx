import { Navigate } from 'react-router'
import { useAuth } from '../../contexts/AuthContext'
import type { ReactNode } from 'react'

type Props = {
  children: ReactNode
}

/**
 * Envolve qualquer rota que exige sessão ativa.
 * Se não autenticado, redireciona para '/' (login).
 */
export function ProtectedRoute({ children }: Props) {
  const { isAuthenticated } = useAuth()

  if (!isAuthenticated) {
    return <Navigate to="/" replace />
  }

  return <>{children}</>
}