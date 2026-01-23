'use client'
import { FormApi } from 'final-form/dist/types'
import { Field } from 'react-final-form'

type DatalistOption = {
  value: string
  label: string
}

type DatalistInputProps = {
  name?: string
  label?: string
  placeholder?: string
  form: FormApi
  options: DatalistOption[]
}

const DatalistInput = ({ name, label, placeholder, form, options }: DatalistInputProps) => {
  const listId = `${name}-datalist`

  return (
    <div className="w-full flex flex-col mb-3">
      <label htmlFor={name} className="auth-label mb-2">
        {label}
      </label>
      <Field name={name || ''}>
        {({ input }) => (
          <>
            <input
              {...input}
              list={listId}
              className="auth-input w-full border border-[#00000026] px-2 h-10 max-w-[490px]"
              placeholder={placeholder}
              autoComplete="off"
            />
            <datalist id={listId}>
              {options.map((option, index) => (
                <option key={index} value={option.value}>
                  {option.label}
                </option>
              ))}
            </datalist>
          </>
        )}
      </Field>

      {form.getState().submitFailed && form.getState().errors?.[name || ''] && (
        <small className="text-red-600">{form.getState().errors?.[name || '']}</small>
      )}
    </div>
  )
}

export default DatalistInput
