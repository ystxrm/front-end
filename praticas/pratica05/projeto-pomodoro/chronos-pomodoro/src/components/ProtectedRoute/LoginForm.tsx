import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router'
import styles from './LoginForm.module.css'
import { useAuth } from '../../contexts/AuthContext'
import { LoginInput } from './LoginInput'
import { LoginActions } from './LoginActions'


type ViewMode = 'login' | 'register' | 'recover'

const VIEW_LABELS: Record<ViewMode, string> = {
  login: 'Entrar no Pomodoro',
  register: 'Criar conta',
  recover: 'Recuperar senha',
}

export function LoginForm() {
  const navigate = useNavigate()
  const { login } = useAuth()

  
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  
  const [viewMode, setViewMode] = useState<ViewMode>('login')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error' | 'info'; text: string } | null>(null)
  const [errors, setErrors] = useState<{ username?: string; password?: string }>({})

 
  const usernameRef = useRef<HTMLInputElement>(null)

  
  useEffect(() => {
    usernameRef.current?.focus()
  }, [viewMode])

  
  useEffect(() => {
    if (!feedback) return
    const timer = setTimeout(() => setFeedback(null), 4000)
    return () => clearTimeout(timer)
  }, [feedback])

  
  const validate = (): boolean => {
    const newErrors: typeof errors = {}
    if (!username.trim()) newErrors.username = 'Informe seu e-mail ou usuário.'
    if (!password.trim()) newErrors.password = 'Informe sua senha.'
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!validate()) return

    setIsSubmitting(true)
    setFeedback(null)

    
    setTimeout(() => {
      const success = login(username.trim(), password)
      if (success) {
        setFeedback({ type: 'success', text: 'Login realizado! Redirecionando…' })
        setTimeout(() => navigate('/home'), 800)
      } else {
        setFeedback({ type: 'error', text: 'Usuário ou senha incorretos. Tente novamente.' })
        setPassword('')
      }
      setIsSubmitting(false)
    }, 200)
  }

  
  const handleRegisterClick = () => {
    setViewMode('register')
    setFeedback({ type: 'info', text: 'Fluxo de cadastro ainda será implementado.' })
    setErrors({})
    setUsername('')
    setPassword('')
  }

  
  const handleRecoverClick = () => {
    setViewMode('recover')
    setFeedback({ type: 'info', text: 'Fluxo de recuperação de senha ainda será implementado.' })
    setErrors({})
    setUsername('')
    setPassword('')
  }

  
  const handleBackToLogin = () => {
    setViewMode('login')
    setFeedback(null)
    setErrors({})
  }

  return (
    <div className={styles.card}>
      
      <div className={styles.icon} aria-hidden="true"></div>

      <h1 className={styles.title}>{VIEW_LABELS[viewMode]}</h1>
      <p className={styles.subtitle}>
        {viewMode === 'login' && 'Use suas credenciais para continuar.'}
        {viewMode === 'register' && 'Crie uma conta para começar a usar.'}
        {viewMode === 'recover' && 'Informe seu e-mail para recuperar o acesso.'}
      </p>

      
      {feedback && (
        <div
          className={`${styles.feedback} ${styles[`feedback_${feedback.type}`]}`}
          role="status"
          aria-live="polite"
        >
          {feedback.text}
        </div>
      )}

      
      <form onSubmit={handleSubmit} className={styles.form} noValidate>
        <LoginInput
          id="username"
          label="E-mail ou usuário"
          type="email"
          placeholder="seu@email.com"
          value={username}
          onChange={(e) => {
            setUsername(e.target.value)
            if (errors.username) setErrors((prev) => ({ ...prev, username: undefined }))
          }}
          autoComplete="username"
          error={errors.username}
        />

        <LoginInput
          id="password"
          label="Senha"
          type="password"
          placeholder="••••••••"
          value={password}
          onChange={(e) => {
            setPassword(e.target.value)
            if (errors.password) setErrors((prev) => ({ ...prev, password: undefined }))
          }}
          autoComplete="current-password"
          error={errors.password}
        />

        {/* Credenciais de demonstração visíveis só no modo login */}
        {viewMode === 'login' && (
          <p className={styles.hint}>
            Demo: <strong>admin@pomodoro.com</strong> / <strong>1234</strong>
          </p>
        )}

        <LoginActions
          isSubmitting={isSubmitting}
          onRegisterClick={handleRegisterClick}
          onRecoverClick={handleRecoverClick}
        />
      </form>

      {/* Botão de voltar quando não está no modo login */}
      {viewMode !== 'login' && (
        <button
          type="button"
          className={styles.backBtn}
          onClick={handleBackToLogin}
        >
          ← Voltar para o login
        </button>
      )}
    </div>
  )
}