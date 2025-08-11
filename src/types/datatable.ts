// Types for the old Datatable system integration

export interface TableColumn {
  field: string
  label: string
  sortable?: boolean
  format?: (value: any) => string
  width?: string
}

export interface FilterField {
  field: string
  label: string
  type: 'text' | 'number' | 'date' | 'select' | 'multi-select' | 'date-range'
  options?: Array<{ id: string | number; name: string }>
  placeholder?: string
}

export interface FilterFields<T extends FilterField = FilterField> {
  [key: string]: T
}

export interface ServerParams {
  searchTerm: string
  sort: {
    field: string
    type: 'asc' | 'desc'
  }
  filterValues: Record<string, any>
  page: number
  perPage: number
}

export interface PaginationData {
  current_page: number
  last_page: number
  per_page: number
  total: number
  from: number
  to: number
}

// Outbound specific interfaces
export interface OutboundOrder {
  id: string
  orderNo: string
  orderNoSuffix?: string
  customerName: string
  storeName: string
  state: string
  payment: string
  orderDate: string
  deliveryDate: string
  totalAmount: string
  status: 'new' | 'confirmed' | 'processing' | 'picked' | 'delivered'
  assignedTo?: {
    id: string
    name: string
    avatar: string
  } | null
  tags?: Array<{
    name: string
    type: 'status' | 'payment' | 'category' | 'priority'
  }>
}

export interface LogBookEntry {
  id: string
  driverName: string
  orderCount: number
  state: string
  deliveryTimeline: string
  createdAt: string
  status: 'active' | 'completed' | 'pending'
}

// Tab interfaces
export interface Tab {
  name: string
  count?: number
}

export type TabItem = string | Tab 