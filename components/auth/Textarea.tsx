'use client'
import { FormApi } from 'final-form/dist/types'
import { Field } from 'react-final-form'

type TextareaProps = {
  name?: string
  label?: string
  placeholder?: string
  form: FormApi
  rows?: number
  className?: string
}

const Textarea = ({ name, label, placeholder, form, rows = 4, className = '' }: TextareaProps) => {
  return (
    <div className="w-full flex flex-col mb-3">
      <label htmlFor={name} className="auth-label mb-2">
        {label}
      </label>
      <Field
        name={name || ''}
        className={`auth-input w-full border border-[#00000026] py-3 px-2 max-w-[490px] resize-y ${className}`}
        placeholder={placeholder}
        component="textarea"
        rows={rows}
      />

      {form.getState().submitFailed && form.getState().errors?.[name || ''] && (
        <small className="text-red-600">{form.getState().errors?.[name || '']}</small>
      )}
    </div>
  )
}

export default Textarea
