import { useEffect } from 'react'
import { LoginForm } from '../../components/ProtectedRoute/LoginForm'
import styles from './LoginPage.module.css'

import { useNavigate } from 'react-router'
import { useAuth } from '../../contexts/AuthContext'

export function LoginPage() {
  const { isAuthenticated } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (isAuthenticated) navigate('/home', { replace: true })
  }, [isAuthenticated, navigate])

  return (
    <main className={styles.page} aria-label="Tela de login">
      {/* Efeitos decorativos de fundo */}
      <div className={styles.bgGlow1} aria-hidden="true" />
      <div className={styles.bgGlow2} aria-hidden="true" />

      <LoginForm />
    </main>
  )
}