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
  useGetNotificationSettingsQuery,
  useNotificationSettingsMutation,
} from '@/service/settings.service'
import { getErrorMessage } from '@/utils/formatErrorResponse'
import rtkMutation from '@/utils/rtkMutation'
import { showAlert } from '@/utils/showAlert'
import { useEffect } from 'react'
import { Field, Form } from 'react-final-form'
import { useSelector } from 'react-redux'
import { validate } from 'validate.js'

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

const Notification = () => {
  const { user } = useSelector((state: RootState) => state.user)
  const { data: notificationSettingsData, isLoading } = useGetNotificationSettingsQuery(
    { userId: user?.id },
    { skip: !user?.id }
  )

  const [notificationSettings, { isSuccess, error }] = useNotificationSettingsMutation()

  const onSubmit = async (values: onSubmitProps) => {
    const payload = {
      user_id: user?.id,
      new_user_registrations: values.newUserRegistrations || false,
      sponsorship_alerts: values.sponsorshipAlerts || false,
      report_notifications: values.reportNotifications || false,
      system_alerts: values.systemAlerts || false,
      id: values.id,
    }
    console.log('Payload to be sent:', payload)

    await rtkMutation(notificationSettings, payload)
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
        <p className="settings-title">Notification Settings</p>
        <p className="settings-desc">Configure system notifications and alerts.</p>
      </div>

      <div className="flex w-full mb-6 settings-tab bg-[#F6F6F6]">
        <Form
          onSubmit={onSubmit}
          initialValues={{
            newUserRegistrations: notificationSettingsData?.new_user_registrations || false,
            sponsorshipAlerts: notificationSettingsData?.sponsorship_alerts || false,
            reportNotifications: notificationSettingsData?.report_notifications || false,
            systemAlerts: notificationSettingsData?.system_alerts || false,
            id: notificationSettingsData?.id || undefined,
          }}
          render={({ handleSubmit, form, submitting }) => (
            <form onSubmit={handleSubmit} className="w-full flex flex-col gap-2">
              <Input name="id" type="hidden" form={form} />

              <Field name="newUserRegistrations" type="checkbox">
                {({ input }) => (
                  <div className="flex-row flex w-full gap-2 justify-start md:justify-between items-center mb-3">
                    <div className="flex-col flex w-full gap-1">
                      <p className="settings-title">New User Registrations</p>
                      <p className="settings-desc">Get notified when new users sign up</p>
                    </div>
                    <Switch
                      id="new-user-registrations"
                      checked={input.checked}
                      onCheckedChange={input.onChange}
                      className="data-[state=checked]:bg-[#069769]"
                    />{' '}
                  </div>
                )}
              </Field>
              <Field name="sponsorshipAlerts" type="checkbox">
                {({ input }) => (
                  <div className="flex-row flex w-full gap-2 justify-start md:justify-between items-center mb-3">
                    <div className="flex-col flex w-full gap-1">
                      <p className="settings-title">Sponsorship Alerts</p>
                      <p className="settings-desc">Notifications for new sponsorships</p>
                    </div>
                    <Switch
                      id="sponsorship-alerts"
                      checked={input.checked}
                      onCheckedChange={input.onChange}
                      className="data-[state=checked]:bg-[#069769]"
                    />{' '}
                  </div>
                )}
              </Field>
              <Field name="reportNotifications" type="checkbox">
                {({ input }) => (
                  <div className="flex-row flex w-full gap-2 justify-start md:justify-between items-center mb-3">
                    <div className="flex-col flex w-full gap-1">
                      <p className="settings-title">Report Notifications</p>
                      <p className="settings-desc">Alerts for reported content</p>
                    </div>
                    <Switch
                      id="report-notifications"
                      checked={input.checked}
                      onCheckedChange={input.onChange}
                      className="data-[state=checked]:bg-[#069769]"
                    />{' '}
                  </div>
                )}
              </Field>
              <Field name="systemAlerts" type="checkbox">
                {({ input }) => (
                  <div className="flex-row flex w-full gap-2 justify-start md:justify-between items-center mb-3">
                    <div className="flex-col flex w-full gap-1">
                      <p className="settings-title">System Alerts</p>
                      <p className="settings-desc">Critical system notifications</p>
                    </div>
                    <Switch
                      id="system-alerts"
                      checked={input.checked}
                      onCheckedChange={input.onChange}
                      className="data-[state=checked]:bg-[#069769]"
                    />{' '}
                  </div>
                )}
              </Field>

              <div>
                <Button
                  type="submit"
                  variant="default"
                  className="mt-4 bg-[#069769] hover:bg-[#057a56]"
                  disabled={submitting}
                >
                  {submitting ? <Loader /> : 'Save Changes'}
                </Button>
              </div>
            </form>
          )}
        />
      </div>
    </div>
  )
}

export default Notification
