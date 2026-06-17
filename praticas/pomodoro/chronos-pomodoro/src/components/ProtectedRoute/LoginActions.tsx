import styles from './LoginActions.module.css'

type Props = {
  isSubmitting: boolean
  onRegisterClick: () => void
  onRecoverClick: () => void
}

export function LoginActions({ isSubmitting, onRegisterClick, onRecoverClick }: Props) {
  return (
    <div className={styles.wrapper}>
      <button type="submit" className={styles.submitBtn} disabled={isSubmitting}>
        {isSubmitting ? (
          <span className={styles.spinner} aria-hidden="true" />
        ) : null}
        {isSubmitting ? 'Entrando…' : 'Entrar'}
      </button>

      <div className={styles.links}>
        <button type="button" className={styles.linkBtn} onClick={onRecoverClick}>
          Esqueci minha senha
        </button>

        <button type="button" className={styles.linkBtn} onClick={onRegisterClick}>
          Não tem conta?&nbsp;<span className={styles.linkAccent}>Cadastre-se</span>
        </button>
      </div>
    </div>
  )
}