'use client'

import Input from '@/components/settings/Input'
import Select from '@/components/settings/Select'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import Loader from '@/components/website/loaders/Loader'
import Spinner from '@/components/website/loaders/Spinner'
import {
  useCommunitySettingsMutation,
  useGetCommunitySettingsQuery,
} from '@/service/settings.service'
import { getErrorMessage } from '@/utils/formatErrorResponse'
import rtkMutation from '@/utils/rtkMutation'
import { showAlert } from '@/utils/showAlert'
import { useEffect } from 'react'
import { Field, Form } from 'react-final-form'
import { useSelector } from 'react-redux'
import { validate } from 'validate.js'

const constraints = {
  maxMembers: {
    presence: { allowEmpty: false, message: 'is required' },
    numericality: {
      onlyInteger: true,
      greaterThan: 0,
      message: 'must be a positive number',
    },
  },
  timezone: {
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

const Community = () => {
  const timezoneOptions = Intl.supportedValuesOf('timeZone').map((tz) => ({
    label: tz,
    value: tz,
  }))

  const { data: communitySettingsData, isLoading } = useGetCommunitySettingsQuery({})

  const validateForm = (values: onSubmitProps) => {
    return validate(values, constraints) || {}
  }

  const { user } = useSelector((state: RootState) => state.user)

  const [communitySettings, { isSuccess, error }] = useCommunitySettingsMutation()
  const onSubmit = async (values: onSubmitProps) => {
    const payload = {
      ...values,
      created_by: user?.id,
    }
    console.log('Payload to be sent:', payload)

    await rtkMutation(communitySettings, payload)
  }

  useEffect(() => {
    if (isSuccess) {
      showAlert('Community settings updated successfully!', 'success')
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
        <p className="settings-title">Community Settings</p>
        <p className="settings-desc">Default settings for new communities.</p>
      </div>

      <div className="flex w-full mb-6">
        <Form
          onSubmit={onSubmit}
          validate={validateForm}
          initialValues={{
            timezone: communitySettingsData?.[0]?.timezone || '',
            maxMembers: communitySettingsData?.[0]?.max_members || '',
            requireCaptainApproval: communitySettingsData?.[0]?.require_captain_approval || false,
            id: communitySettingsData?.[0]?.id || undefined,
          }}
          render={({ handleSubmit, form, submitting }) => (
            <form onSubmit={handleSubmit} className="w-full">
              <Input name="id" type="hidden" form={form} />
              <div className="flex flex-col md:flex-row gap-3 items-center w-full mb-3">
                <Select
                  name="timezone"
                  label="Timezone"
                  placeholder="Select a timezone"
                  form={form}
                  options={timezoneOptions}
                />
                <Input
                  label="Max Members Per Community"
                  name="maxMembers"
                  type="number"
                  placeholder="0"
                  form={form}
                />
              </div>

              <Field name="requireCaptainApproval" type="checkbox">
                {({ input }) => (
                  <div className="flex-row flex w-full gap-2 justify-start md:justify-between items-center mb-3">
                    <div className="flex-col flex w-full gap-1">
                      <p className="settings-title">Require Captain Approval</p>
                      <p className="settings-desc">New communities need admin approval</p>
                    </div>
                    <Switch
                      id="require-captain-approval"
                      checked={input.checked}
                      onCheckedChange={input.onChange}
                      className="data-[state=checked]:bg-[#069769]"
                    />{' '}
                  </div>
                )}
              </Field>

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

export default Community
