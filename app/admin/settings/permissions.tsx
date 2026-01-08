'use client'

import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { useState } from 'react'

type Permission = {
  id: string
  label: string
}

type RolePermissions = {
  [key: string]: boolean
}

const Permissions = () => {
  const permissions: Permission[] = [
    { id: 'view_users', label: 'View Users' },
    { id: 'edit_users', label: 'Edit Users' },
    { id: 'view_reports', label: 'View Reports' },
    { id: 'manage_communities', label: 'Manage Communities' },
  ]

  const roles = ['Admin', 'Captain', 'Sponsor', 'Player']

  const [rolePermissions, setRolePermissions] = useState<{ [role: string]: RolePermissions }>({
    Admin: {
      view_users: false,
      edit_users: false,
      view_reports: false,
      manage_communities: false,
    },
    Captain: {
      view_users: false,
      edit_users: false,
      view_reports: false,
      manage_communities: false,
    },
    Sponsor: {
      view_users: false,
      edit_users: false,
      view_reports: false,
      manage_communities: false,
    },
    Player: {
      view_users: false,
      edit_users: false,
      view_reports: false,
      manage_communities: false,
    },
  })

  const handlePermissionChange = (role: string, permissionId: string, checked: boolean) => {
    setRolePermissions((prev) => ({
      ...prev,
      [role]: {
        ...prev[role],
        [permissionId]: checked,
      },
    }))
  }

  const handleSave = () => {
    // Save permissions logic here
    console.log('Saving permissions:', rolePermissions)
  }

  return (
    <div className="flex flex-col w-full">
      <div className="flex-col flex w-full gap-1 mb-6">
        <p className="settings-title">Role Permissions</p>
        <p className="settings-desc">Configure what each role can access.</p>
      </div>

      <div className="flex flex-col flex-wrap md:flex-row gap-5 mb-6">
        {roles.map((role) => (
          <div key={role} className="settings-tab bg-[#F6F6F6] p-6 rounded-lg w-full">
            <div className="mb-5">
              <h3 className="permission-title">{role}</h3>
            </div>

            <div className="flex flex-col md:flex-row gap-4">
              {permissions.map((permission) => (
                <div key={permission.id} className="flex items-center gap-2 w-full max-w-[245px]">
                  <Switch
                    checked={rolePermissions[role]?.[permission.id] || false}
                    onCheckedChange={(checked) =>
                      handlePermissionChange(role, permission.id, checked)
                    }
                    id={`${role}-${permission.id}`}
                    className="data-[state=checked]:bg-[#069769]"
                  />
                  <label
                    htmlFor={`${role}-${permission.id}`}
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    {permission.label}
                  </label>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="flex gap-4">
        <Button onClick={handleSave} className="bg-[#069769] hover:bg-[#057a56]">
          Save Permissions
        </Button>
      </div>
    </div>
  )
}

export default Permissions
