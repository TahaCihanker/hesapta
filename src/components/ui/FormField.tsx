import type { ReactNode } from 'react'

interface FormFieldProps {
  label: string
  htmlFor: string
  error?: string
  hint?: ReactNode
  optional?: boolean
  children: ReactNode
}

// Etiket, giriş kutusu ve hata metni
export function FormField({
  label,
  htmlFor,
  error,
  hint,
  optional = false,
  children,
}: FormFieldProps) {
  return (
    <div>
      <label
        htmlFor={htmlFor}
        className="mb-1.5 block text-sm font-medium text-slate-700"
      >
        {label}
        {optional && (
          <span className="font-normal text-slate-400"> (isteğe bağlı)</span>
        )}
      </label>
      {children}
      {error ? (
        <p id={`${htmlFor}-error`} className="mt-1.5 text-xs text-red-600">
          {error}
        </p>
      ) : (
        hint && <p className="mt-1.5 text-xs text-slate-500">{hint}</p>
      )}
    </div>
  )
}
