export enum BaseRole {
  SUPER_ADMIN = 'super_admin',
  ADMIN = 'admin',
  GOLFER = 'golfer',
}

export enum GroupRole {
  MEMBER = 'member',
  CAPTAIN = 'captain',
  ADMIN = 'admin',
}

export interface Role {
  id: number
  name: BaseRole
  description: string
  createdAt: Date
  updatedAt: Date
}

export interface Group {
  id: number
  name: string
  description: string
  createdBy: number
  createdAt: Date
  updatedAt: Date
}

export interface GroupRoleAssignment {
  id: number
  userId: number
  groupId: number
  role: GroupRole
  assignedAt: Date
  group?: Group
}

export interface UserRoleAssignment {
  id: number
  userId: number
  roleId: number
  assignedAt: Date
  role?: Role
}

export interface UserWithRoles {
  id: number
  firstName: string
  lastName: string
  email: string
  baseRole: BaseRole
  groupRoles: GroupRoleAssignment[]
}
