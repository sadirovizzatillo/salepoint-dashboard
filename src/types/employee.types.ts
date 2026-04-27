export type StaffRole = 'admin' | 'manager' | 'cashier'

export interface StaffUser {
  id: string
  name: string
  email: string
}

export interface StaffMember {
  id: string
  userId: string
  shopId: string
  roles: StaffRole[]
  isActive: boolean
  createdAt: string
  user: StaffUser
}

export interface CreateStaffRequest {
  name: string
  email: string
  password: string
  roles: StaffRole[]
}
