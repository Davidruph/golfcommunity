'use client'
import { FormApi } from 'final-form/dist/types'
import { Field, FieldInputProps } from 'react-final-form'
import { useState } from 'react'
import Image from 'next/image'

type ImageSelectorProps = {
  name?: string
  label?: string
  form: FormApi
  className?: string
  accept?: string
}

const ImageSelector = ({
  name,
  label,
  form,
  className = '',
  accept = 'image/*',
}: ImageSelectorProps) => {
  const [preview, setPreview] = useState<string | null>(null)
  const [fileName, setFileName] = useState<string>('')

  const handleFileChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    input: FieldInputProps<File | null>
  ) => {
    const file = event.target.files?.[0]
    if (file) {
      setFileName(file.name)

      // Create preview
      const reader = new FileReader()
      reader.onloadend = () => {
        setPreview(reader.result as string)
      }
      reader.readAsDataURL(file)

      // Update form value
      input.onChange(file)
    }
  }

  const clearImage = (input: FieldInputProps<File | null>) => {
    setPreview(null)
    setFileName('')
    input.onChange(null)
  }

  return (
    <div className="w-full flex flex-col mb-3">
      <label htmlFor={name} className="auth-label mb-2">
        {label}
      </label>

      <Field name={name || ''}>
        {({ input }) => (
          <div className={`relative ${className}`}>
            <input
              type="file"
              id={name}
              accept={accept}
              onChange={(e) => handleFileChange(e, input)}
              className="hidden"
            />

            {!preview ? (
              <label
                htmlFor={name}
                className="flex flex-col items-center justify-center w-full border-2 border-dashed border-[#00000026] rounded-lg py-6 px-4 cursor-pointer hover:border-gray-400 transition-colors max-w-[490px]"
              >
                <svg
                  className="w-12 h-12 text-gray-400 mb-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
                <span className="text-gray-600 font-medium">Select Image</span>
                <span className="text-gray-400 text-sm mt-1">Click to upload</span>
              </label>
            ) : (
              <div className="relative max-w-[490px]">
                <div className="relative w-full h-48 border border-[#00000026] rounded-lg overflow-hidden">
                  <Image src={preview} alt="Preview" fill className="object-cover" />
                </div>
                <div className="mt-2 flex items-center justify-between">
                  <span className="text-sm text-gray-600 truncate flex-1">{fileName}</span>
                  <button
                    type="button"
                    onClick={() => clearImage(input)}
                    className="ml-2 text-red-600 hover:text-red-800 text-sm font-medium"
                  >
                    Remove
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </Field>

      {form.getState().submitFailed && form.getState().errors?.[name || ''] && (
        <small className="text-red-600">{form.getState().errors?.[name || '']}</small>
      )}
    </div>
  )
}

export default ImageSelector
