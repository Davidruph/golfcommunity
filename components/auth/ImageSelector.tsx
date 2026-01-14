'use client'

import { FormApi } from 'final-form'
import { Field, FieldInputProps } from 'react-final-form'
import { useState, useEffect } from 'react'
import Image from 'next/image'

type ImageSelectorProps = {
  name?: string
  label?: string
  form: FormApi
  className?: string
  existingImage?: string
}

const ImageSelector = ({
  name,
  label,
  form,
  className = '',
  existingImage,
}: ImageSelectorProps) => {
  const [preview, setPreview] = useState<string | null>(null)
  const [fileName, setFileName] = useState<string>('')
  const [uploading, setUploading] = useState(false)

  // Update preview whenever existingImage changes
  useEffect(() => {
    if (existingImage) {
      setPreview(existingImage)
      setFileName('Current image')
    } else {
      setPreview(null)
      setFileName('')
    }
  }, [existingImage])

  const handleFileChange = async (
    e: React.ChangeEvent<HTMLInputElement>,
    input: FieldInputProps<any>
  ) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)
    const formData = new FormData()
    formData.append('file', file)
    formData.append('upload_preset', 'communities')
    formData.append('folder', 'communities')

    try {
      const res = await fetch(
        `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
        {
          method: 'POST',
          body: formData,
        }
      )
      const data = await res.json()
      setPreview(data.secure_url)
      setFileName(file.name)
      input.onChange(data.secure_url)
    } catch (error) {
      console.error('Upload failed:', error)
    } finally {
      setUploading(false)
    }
  }

  const clearImage = (input: FieldInputProps<any>) => {
    if (existingImage) {
      setPreview(existingImage)
      setFileName('Current image')
      input.onChange(existingImage)
    } else {
      setPreview(null)
      setFileName('')
      input.onChange('')
    }
  }

  return (
    <div className="w-full flex flex-col mb-3">
      <label className="auth-label mb-2">{label}</label>

      <Field name={name || ''}>
        {({ input }) => (
          <div className={`relative ${className}`}>
            {!preview ? (
              <label className="flex flex-col items-center justify-center w-full border-2 border-dashed border-[#00000026] rounded-lg py-6 px-4 cursor-pointer hover:border-gray-400 transition-colors max-w-[490px]">
                <span className="text-gray-600 font-medium">
                  {uploading ? 'Uploading...' : 'Select Image'}
                </span>
                <span className="text-gray-400 text-sm mt-1">Click to upload</span>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => handleFileChange(e, input)}
                  disabled={uploading}
                />
              </label>
            ) : (
              <div className="relative max-w-[490px]">
                <div className="relative w-full h-48 border border-[#00000026] rounded-lg overflow-hidden">
                  {uploading && (
                    <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center z-10">
                      <div className="text-white font-medium">Uploading...</div>
                    </div>
                  )}
                  <Image src={preview} alt="Preview" fill className="object-cover" />
                </div>
                <div className="mt-2 flex items-center justify-between">
                  <span className="text-sm text-gray-600 truncate flex-1">{fileName}</span>
                  <div className="flex gap-2">
                    <label
                      className={`text-blue-600 text-sm font-medium ${uploading ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}`}
                    >
                      {uploading ? 'Uploading...' : 'Change'}
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => handleFileChange(e, input)}
                        disabled={uploading}
                      />
                    </label>
                    <button
                      type="button"
                      onClick={() => clearImage(input)}
                      className="text-red-600 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                      disabled={uploading}
                    >
                      {existingImage ? 'Reset' : 'Remove'}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </Field>
    </div>
  )
}

export default ImageSelector
