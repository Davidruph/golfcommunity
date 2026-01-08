'use client'

import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import Loader from '@/components/website/loaders/Loader'
import Spinner from '@/components/website/loaders/Spinner'
import { useGetMembershipTiersQuery, useMembershipTiersMutation } from '@/service/settings.service'
import { showAlert } from '@/utils/showAlert'
import { useEffect, useState } from 'react'

type SubscriptionTier = {
  id?: number
  name: string
  monthlyPrice: string
  yearlyPrice: string
  maxCommunities: string
  prioritySupport: boolean
}

type MembershipTierResponse = {
  id: number
  name: string
  monthly_price: string
  yearly_price: string
  max_communities: number
  priority_support: number | boolean
}

const Subscription = () => {
  const { data: existingTiers, isLoading: isFetching } = useGetMembershipTiersQuery({})
  const [errors, setErrors] = useState<{ [key: number]: { [key: string]: string } }>({})
  const [tiers, setTiers] = useState<SubscriptionTier[]>([])

  useEffect(() => {
    if (existingTiers && existingTiers.length > 0) {
      setTiers(
        existingTiers.map((tier: MembershipTierResponse) => ({
          id: tier.id,
          name: tier.name,
          monthlyPrice: tier.monthly_price,
          yearlyPrice: tier.yearly_price,
          maxCommunities: tier.max_communities.toString(),
          prioritySupport: Boolean(tier.priority_support),
        }))
      )
    } else {
      setTiers([
        {
          name: '',
          monthlyPrice: '',
          yearlyPrice: '',
          maxCommunities: '',
          prioritySupport: false,
        },
      ])
    }
  }, [existingTiers])

  const validateForm = () => {
    const newErrors: { [key: number]: { [key: string]: string } } = {}
    let isValid = true

    tiers.forEach((tier, index) => {
      const tierError: { [key: string]: string } = {}

      if (!tier.name) {
        tierError.name = 'Name is required'
        isValid = false
      }
      if (!tier.monthlyPrice) {
        tierError.monthlyPrice = 'Monthly price is required'
        isValid = false
      }
      if (!tier.yearlyPrice) {
        tierError.yearlyPrice = 'Yearly price is required'
        isValid = false
      }
      if (!tier.maxCommunities) {
        tierError.maxCommunities = 'Max communities is required'
        isValid = false
      }

      if (Object.keys(tierError).length > 0) {
        newErrors[index] = tierError
      }
    })

    setErrors(newErrors)
    return isValid
  }

  // ...existing code...
  const [createTiers, { isLoading }] = useMembershipTiersMutation()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      showAlert('Please fix the validation errors', 'error')
      return
    }

    try {
      const result = await createTiers({ tiers }).unwrap()

      if (result) {
        showAlert('Subscription tiers saved successfully', 'success')
        setTiers([
          {
            name: '',
            monthlyPrice: '',
            yearlyPrice: '',
            maxCommunities: '',
            prioritySupport: false,
          },
        ])
        setErrors({})
      }
    } catch (error) {
      const errorMessage =
        error && typeof error === 'object' && 'message' in error
          ? String(error.message)
          : 'An error occurred while saving subscription tiers'
      showAlert(errorMessage, 'error')
    }
  }

  const addTier = () => {
    setTiers([
      ...tiers,
      {
        name: '',
        monthlyPrice: '',
        yearlyPrice: '',
        maxCommunities: '',
        prioritySupport: false,
      },
    ])
  }

  const removeTier = (index: number) => {
    setTiers(tiers.filter((_, i) => i !== index))
    const newErrors = { ...errors }
    delete newErrors[index]
    setErrors(newErrors)
  }

  const updateTier = (index: number, field: keyof SubscriptionTier, value: string | boolean) => {
    const newTiers = [...tiers]
    newTiers[index] = { ...newTiers[index], [field]: value }
    setTiers(newTiers)

    // Clear error for this field
    if (errors[index]?.[field]) {
      const newErrors = { ...errors }
      delete newErrors[index][field]
      if (Object.keys(newErrors[index]).length === 0) {
        delete newErrors[index]
      }
      setErrors(newErrors)
    }
  }

  return (
    <div className="flex flex-col w-full">
      <div className="flex-col flex w-full gap-1 mb-6">
        <p className="settings-title">Membership Tiers</p>
        <p className="settings-desc">Configure pricing and features for each membership level.</p>
      </div>

      {isFetching ? (
        <Spinner loading={isFetching} />
      ) : (
        <form onSubmit={handleSubmit} className="w-full">
          <div className="flex flex-col flex-wrap md:flex-row gap-5 mb-6">
            {tiers.map((tier, index) => (
              <div
                key={index}
                className="settings-tab bg-[#F6F6F6] p-6 rounded-lg w-full max-w-[354px]"
              >
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold">Tier {index + 1}</h3>
                  {tiers.length > 1 && (
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      onClick={() => removeTier(index)}
                    >
                      Remove Tier
                    </Button>
                  )}
                </div>

                <div className="flex flex-col gap-4">
                  <div className="flex flex-col gap-2">
                    <label className="settings-label">Tier Name</label>
                    <input
                      type="text"
                      placeholder="e.g., Basic, Premium, Enterprise"
                      value={tier.name}
                      onChange={(e) => updateTier(index, 'name', e.target.value)}
                      className="settings-input pl-2"
                    />
                    {errors[index]?.name && (
                      <span className="text-sm text-red-500 mt-1">{errors[index].name}</span>
                    )}
                  </div>

                  <div className="flex flex-col gap-2">
                    <label className="settings-label">Max Communities</label>
                    <input
                      type="number"
                      placeholder="e.g., 5"
                      value={tier.maxCommunities}
                      onChange={(e) => updateTier(index, 'maxCommunities', e.target.value)}
                      className="settings-input pl-2"
                    />
                    {errors[index]?.maxCommunities && (
                      <span className="text-sm text-red-500 mt-1">
                        {errors[index].maxCommunities}
                      </span>
                    )}
                  </div>

                  <div className="flex flex-col gap-2">
                    <label className="settings-label">Monthly Price ($)</label>
                    <input
                      type="number"
                      step="0.01"
                      placeholder="e.g., 9.99"
                      value={tier.monthlyPrice}
                      onChange={(e) => updateTier(index, 'monthlyPrice', e.target.value)}
                      className="settings-input pl-2"
                    />
                    {errors[index]?.monthlyPrice && (
                      <span className="text-sm text-red-500 mt-1">
                        {errors[index].monthlyPrice}
                      </span>
                    )}
                  </div>

                  <div className="flex flex-col gap-2">
                    <label className="settings-label">Yearly Price ($)</label>
                    <input
                      type="number"
                      step="0.01"
                      placeholder="e.g., 99.99"
                      value={tier.yearlyPrice}
                      onChange={(e) => updateTier(index, 'yearlyPrice', e.target.value)}
                      className="settings-input pl-2"
                    />
                    {errors[index]?.yearlyPrice && (
                      <span className="text-sm text-red-500 mt-1">{errors[index].yearlyPrice}</span>
                    )}
                  </div>
                </div>

                <div className="mt-4">
                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={tier.prioritySupport}
                      onCheckedChange={(checked) => updateTier(index, 'prioritySupport', checked)}
                      id={`priority-support-${index}`}
                      className="data-[state=checked]:bg-[#069769]"
                    />
                    <label
                      htmlFor={`priority-support-${index}`}
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      Priority Support
                    </label>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="flex gap-4">
            <Button type="button" variant="outline" onClick={addTier}>
              + Add Tier
            </Button>

            <Button type="submit" disabled={isLoading} className=" bg-[#069769] hover:bg-[#057a56]">
              {isLoading ? <Loader /> : 'Save Tiers'}
            </Button>
          </div>
        </form>
      )}
    </div>
  )
}

export default Subscription
