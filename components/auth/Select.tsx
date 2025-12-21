'use client'
import { FormApi } from 'final-form/dist/types'
import { Field } from 'react-final-form'

type SelectOption = {
  value: string
  label: string
}

type SelectProps = {
  name?: string
  label?: string
  placeholder?: string
  form: FormApi
  options: SelectOption[]
}

const Select = ({ name, label, placeholder, form, options }: SelectProps) => {
  return (
    <div className="w-full flex flex-col mb-3">
      <label htmlFor={name} className="auth-label mb-2">
        {label}
      </label>
      <Field
        name={name || ''}
        className="auth-input w-full border border-[#00000026] px-2 h-10 max-w-[490px]"
        component="select"
      >
        <option value="">{placeholder}</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </Field>

      {form.getState().submitFailed && form.getState().errors?.[name || ''] && (
        <small className="text-red-600">{form.getState().errors?.[name || '']}</small>
      )}
    </div>
  )
}

export default Select
