import { Navigate } from 'react-router'
import type { ReactNode } from 'react'
import { useAuth } from '../../contexts/AuthContext'

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