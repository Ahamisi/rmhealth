// Mock API for Dashboard Fulfilment Stats
import type { PaginationData } from '@/types/datatable'

// Mock fulfilment data
const mockFulfilmentData = [
  { id: 25, agentName: 'Babajide Raji', orders: 20, items: 20, checkIn: '08:30 am', checkOut: '05:30 pm', productivity: 95, avatar: 'https://i.pravatar.cc/40?img=1' },
  { id: 24, agentName: 'Daniel Makinde', orders: 18, items: 22, checkIn: '09:00 am', checkOut: '06:00 pm', productivity: 88, avatar: 'https://i.pravatar.cc/40?img=2' },
  { id: 23, agentName: 'Esther Joel', orders: 15, items: 18, checkIn: '08:45 am', checkOut: '05:45 pm', productivity: 85, avatar: 'https://i.pravatar.cc/40?img=3' },
  { id: 22, agentName: 'Adebayo Tunde', orders: 12, items: 15, checkIn: '09:15 am', checkOut: '06:15 pm', productivity: 78, avatar: 'https://i.pravatar.cc/40?img=4' },
  { id: 21, agentName: 'Femi Babalola', orders: 14, items: 16, checkIn: '08:20 am', checkOut: '05:20 pm', productivity: 82, avatar: 'https://i.pravatar.cc/40?img=5' },
  { id: 20, agentName: 'Sarah Badmus', orders: 11, items: 13, checkIn: '09:30 am', checkOut: '06:30 pm', productivity: 75, avatar: 'https://i.pravatar.cc/40?img=6' },
  { id: 19, agentName: 'Kemi Adeyemi', orders: 16, items: 19, checkIn: '08:10 am', checkOut: '05:10 pm', productivity: 90, avatar: 'https://i.pravatar.cc/40?img=7' },
  { id: 18, agentName: 'Josh Michael', orders: 13, items: 14, checkIn: '09:45 am', checkOut: '06:45 pm', productivity: 80, avatar: 'https://i.pravatar.cc/40?img=8' },
  { id: 17, agentName: 'Tolu Fashina', orders: 17, items: 21, checkIn: '08:00 am', checkOut: '05:00 pm', productivity: 92, avatar: 'https://i.pravatar.cc/40?img=9' },
  { id: 16, agentName: 'Seun Okafor', orders: 10, items: 12, checkIn: '10:00 am', checkOut: '07:00 pm', productivity: 70, avatar: 'https://i.pravatar.cc/40?img=10' },
  { id: 15, agentName: 'Chioma Nwankwo', orders: 19, items: 23, checkIn: '07:45 am', checkOut: '04:45 pm', productivity: 98, avatar: 'https://i.pravatar.cc/40?img=11' },
  { id: 14, agentName: 'Yemi Alade', orders: 9, items: 11, checkIn: '10:30 am', checkOut: '07:30 pm', productivity: 65, avatar: 'https://i.pravatar.cc/40?img=12' },
  { id: 13, agentName: 'Ibrahim Musa', orders: 21, items: 25, checkIn: '07:30 am', checkOut: '04:30 pm', productivity: 100, avatar: 'https://i.pravatar.cc/40?img=13' },
  { id: 12, agentName: 'Grace Okoro', orders: 8, items: 10, checkIn: '11:00 am', checkOut: '08:00 pm', productivity: 60, avatar: 'https://i.pravatar.cc/40?img=14' },
  { id: 11, agentName: 'Emeka Okoye', orders: 22, items: 26, checkIn: '07:15 am', checkOut: '04:15 pm', productivity: 105, avatar: 'https://i.pravatar.cc/40?img=15' },
  { id: 10, agentName: 'Blessing Akpan', orders: 7, items: 9, checkIn: '11:30 am', checkOut: '08:30 pm', productivity: 55, avatar: 'https://i.pravatar.cc/40?img=16' },
  { id: 9, agentName: 'Kunle Adebayo', orders: 23, items: 28, checkIn: '07:00 am', checkOut: '04:00 pm', productivity: 110, avatar: 'https://i.pravatar.cc/40?img=17' },
  { id: 8, agentName: 'Folake Adeniran', orders: 6, items: 8, checkIn: '12:00 pm', checkOut: '09:00 pm', productivity: 50, avatar: 'https://i.pravatar.cc/40?img=18' },
  { id: 7, agentName: 'Chukwu Obioma', orders: 24, items: 30, checkIn: '06:45 am', checkOut: '03:45 pm', productivity: 115, avatar: 'https://i.pravatar.cc/40?img=19' },
  { id: 6, agentName: 'Aisha Bello', orders: 5, items: 7, checkIn: '12:30 pm', checkOut: '09:30 pm', productivity: 45, avatar: 'https://i.pravatar.cc/40?img=20' },
  { id: 5, agentName: 'Damilola Ogundipe', orders: 25, items: 32, checkIn: '06:30 am', checkOut: '03:30 pm', productivity: 120, avatar: 'https://i.pravatar.cc/40?img=21' },
  { id: 4, agentName: 'Fatima Aliyu', orders: 4, items: 6, checkIn: '01:00 pm', checkOut: '10:00 pm', productivity: 40, avatar: 'https://i.pravatar.cc/40?img=22' },
  { id: 3, agentName: 'Gbenga Adeleye', orders: 26, items: 35, checkIn: '06:15 am', checkOut: '03:15 pm', productivity: 125, avatar: 'https://i.pravatar.cc/40?img=23' },
  { id: 2, agentName: 'Hauwa Yakubu', orders: 3, items: 5, checkIn: '01:30 pm', checkOut: '10:30 pm', productivity: 35, avatar: 'https://i.pravatar.cc/40?img=24' },
  { id: 1, agentName: 'Ikechukwu Onwuka', orders: 27, items: 38, checkIn: '06:00 am', checkOut: '03:00 pm', productivity: 130, avatar: 'https://i.pravatar.cc/40?img=25' },
]

interface FulfilmentStatsParams {
  searchTerm?: string
  sort?: {
    field: string
    type: 'asc' | 'desc'
  }
  page?: number
  perPage?: number
  filterValues?: Record<string, any>
}

export const dashboardAPI = {
  async getFulfilmentStats(params: FulfilmentStatsParams = {}) {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500))

    let filteredData = [...mockFulfilmentData]

    // Apply search filter
    if (params.searchTerm) {
      const searchLower = params.searchTerm.toLowerCase()
      filteredData = filteredData.filter(item => 
        item.agentName.toLowerCase().includes(searchLower) ||
        item.id.toString().includes(searchLower)
      )
    }

    // Apply sorting
    if (params.sort) {
      filteredData.sort((a, b) => {
        const aValue = a[params.sort!.field as keyof typeof a]
        const bValue = b[params.sort!.field as keyof typeof b]
        
        if (typeof aValue === 'number' && typeof bValue === 'number') {
          return params.sort!.type === 'asc' ? aValue - bValue : bValue - aValue
        }
        
        if (typeof aValue === 'string' && typeof bValue === 'string') {
          const comparison = aValue.localeCompare(bValue)
          return params.sort!.type === 'asc' ? comparison : -comparison
        }
        
        return 0
      })
    }

    // Apply pagination
    const page = params.page || 1
    const perPage = params.perPage || 10
    const total = filteredData.length
    const from = (page - 1) * perPage + 1
    const to = Math.min(page * perPage, total)
    const paginatedData = filteredData.slice((page - 1) * perPage, page * perPage)

    const pagination: PaginationData = {
      current_page: page,
      last_page: Math.ceil(total / perPage),
      per_page: perPage,
      total,
      from,
      to
    }

    return {
      success: true,
      data: {
        data: paginatedData,
        pagination
      }
    }
  }
} 