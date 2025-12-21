'use client'
import { FormApi } from 'final-form/dist/types'
import { Field } from 'react-final-form'

type InputProps = {
  type?: string
  name?: string
  label?: string
  placeholder?: string
  form: FormApi
}
const Input = ({ type = 'text', name, label, placeholder, form }: InputProps) => {
  return (
    <div className="w-full flex flex-col mb-3">
      <label htmlFor={name} className="auth-label mb-2">
        {label}
      </label>
      <Field
        type={type}
        name={name || ''}
        className="auth-input w-full border border-[#00000026] py-3 px-2 h-10 max-w-[490px] items-center"
        placeholder={placeholder}
        component="input"
      />

      {form.getState().submitFailed && form.getState().errors?.[name || ''] && (
        <small className="text-red-600">{form.getState().errors?.[name || '']}</small>
      )}
    </div>
  )
}

export default Input
