// Re-export datatable types
export * from './datatable'

// Additional types for old components
export interface Option {
  id: string | number
  name: string
  label?: string
  value?: string | number
}

export interface Branch {
  id: number
  name: string
  code?: string
  location?: string
}

export interface Payment {
  id: string
  amount: number
  currency: string
  status: 'pending' | 'completed' | 'failed'
  date: string
  method: string
}

export interface PurchaseOrder {
  id: string
  orderNo: string
  supplier: string
  amount: number
  status: 'pending' | 'approved' | 'received' | 'cancelled'
  date: string
  items: Array<{
    id: string
    name: string
    quantity: number
    price: number
  }>
}

export interface Return {
  id: string
  orderNo: string
  customer: string
  amount: number
  status: 'pending' | 'approved' | 'completed'
  date: string
  reason: string
}

export interface MenuItem {
  id: string
  label: string
  action: string
  icon?: string
  disabled?: boolean
}

// Filter and sort params
export interface FilterParams {
  [key: string]: any
}

export interface SortParams {
  field: string
  type: 'asc' | 'desc'
}

// Procurement specific types
export const purchaseOrderStatusMap = {
  pending: 'Pending',
  approved: 'Approved', 
  received: 'Received',
  cancelled: 'Cancelled'
}

export const productRequeststatusMap = {
  pending: 'Pending',
  approved: 'Approved',
  fulfilled: 'Fulfilled',
  rejected: 'Rejected'
} 