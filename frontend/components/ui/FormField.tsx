import * as React from "react"

interface FormFieldProps {
  children: React.ReactNode
  className?: string
}

export const FormField = ({ children, className }: FormFieldProps) => (
  <div className={`space-y-2 ${className || ""}`}>
    {children}
  </div>
)

interface FormFieldErrorProps {
  message?: string
}

export const FormFieldError = ({ message }: FormFieldErrorProps) => {
  if (!message) return null
  return <p className="text-sm font-medium text-red-500">{message}</p>
}
