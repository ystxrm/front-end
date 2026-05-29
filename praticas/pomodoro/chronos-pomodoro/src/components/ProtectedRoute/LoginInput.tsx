
import type { InputHTMLAttributes } from 'react'
import styles from './LoginInput.module.css'

type Props = InputHTMLAttributes<HTMLInputElement> & {
  label: string
  id: string
  error?: string
}

/**
 * Input controlado com label acessível e exibição de erro.
 */
export function LoginInput({ label, id, error, ...rest }: Props) {
  return (
    <div className={styles.wrapper}>
      <label htmlFor={id} className={styles.label}>
        {label}
      </label>
      <input
        id={id}
        className={`${styles.input} ${error ? styles.inputError : ''}`}
        aria-describedby={error ? `${id}-error` : undefined}
        aria-invalid={!!error}
        {...rest}
      />
      {error && (
        <span id={`${id}-error`} className={styles.error} role="alert">
          {error}
        </span>
      )}
    </div>
  )
}