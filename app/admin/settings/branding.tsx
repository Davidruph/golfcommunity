'use client'

import Input from '@/components/settings/Input'
import { Button } from '@/components/ui/button'
import Loader from '@/components/website/loaders/Loader'
import Spinner from '@/components/website/loaders/Spinner'
import {
  useBrandingSettingsMutation,
  useGetBrandingSettingsQuery,
} from '@/service/settings.service'
import { getErrorMessage } from '@/utils/formatErrorResponse'
import rtkMutation from '@/utils/rtkMutation'
import { showAlert } from '@/utils/showAlert'
import { useEffect } from 'react'
import { Form } from 'react-final-form'
import { validate } from 'validate.js'

const constraints = {
  platformName: {
    presence: { allowEmpty: false, message: 'is required' },
  },
  supportEmail: {
    presence: { allowEmpty: false, message: 'is required' },
  },
}

type onSubmitProps = {
  [key: string]: undefined | string
}

interface UserState {
  user: {
    id: number
  } | null
  token: string | null
}
interface RootState {
  user: UserState
}

const Branding = () => {
  const { data: brandingSettingsData, isLoading } = useGetBrandingSettingsQuery({})

  const validateForm = (values: onSubmitProps) => {
    return validate(values, constraints) || {}
  }

  const [brandingSettings, { isSuccess, error }] = useBrandingSettingsMutation()
  const onSubmit = async (values: onSubmitProps) => {
    console.log('Payload to be sent:', values)

    await rtkMutation(brandingSettings, values)
  }

  useEffect(() => {
    if (isSuccess) {
      showAlert('Branding settings updated successfully!', 'success')
    } else if (error) {
      showAlert(getErrorMessage(error), 'error')
    }
  }, [isSuccess, error])

  if (isLoading) {
    return <Spinner loading={isLoading} />
  }

  return (
    <div className="flex flex-col w-full">
      <div className="flex-col flex w-full gap-1 mb-6">
        <p className="settings-title">Branding Settings</p>
        <p className="settings-desc">Customize your platform&apos;s appearance.</p>
      </div>

      <div className="flex w-full mb-6">
        <Form
          onSubmit={onSubmit}
          validate={validateForm}
          initialValues={{
            platformName: brandingSettingsData?.[0]?.platform_name || '',
            supportEmail: brandingSettingsData?.[0]?.support_email || '',
            id: brandingSettingsData?.[0]?.id || undefined,
          }}
          render={({ handleSubmit, form, submitting }) => (
            <form onSubmit={handleSubmit} className="w-full">
              <Input name="id" type="hidden" form={form} />
              <div className="flex flex-col md:flex-row gap-3 items-center w-full mb-3">
                <Input
                  label="Platform Name"
                  name="platformName"
                  type="text"
                  placeholder="Admin Panel"
                  form={form}
                />
                <Input
                  label="Support Email"
                  name="supportEmail"
                  type="email"
                  placeholder="support@example.com"
                  form={form}
                />
              </div>
              {/* <Input
                label="Primary Color"
                name="primaryColor"
                type="color"
                placeholder="support@example.com"
                form={form}
              /> */}

              <Button
                type="submit"
                variant="default"
                className="mt-4 bg-[#069769] hover:bg-[#057a56]"
                disabled={submitting}
              >
                {submitting ? <Loader /> : 'Save Changes'}
              </Button>
            </form>
          )}
        />
      </div>
    </div>
  )
}

export default Branding
