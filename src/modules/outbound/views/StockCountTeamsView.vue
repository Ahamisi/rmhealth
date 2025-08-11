<template>
  <div>
    <AppHeader />
    
    <main class="px-4 sm:px-6 lg:px-8 py-6">
      <!-- Page Header -->
      <div class="mb-6">
        <!-- Breadcrumb -->
        <nav class="flex items-center space-x-2 text-sm mb-4" style="color: #626F86; font-size: 14px;">
          <span>Stock Count</span>
          <span>/</span>
          <span>Stock Count Teams</span>
        </nav>
      </div>

      <!-- Search and Create Header -->
      <div class="p-0 mb-4 rounded-lg flex items-center justify-between" style="background-color: #f9fafb;">
        <!-- Search with Sort -->
        <div class="flex items-center">
          <!-- Search Input -->
          <div class="relative">
            <div class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400">
              <img src="/icons/search-icon.svg" alt="Search" class="w-4 h-4">
            </div>
            <input 
              v-model="searchTerm"
              @input="onSearch"
              type="text" 
              placeholder="Search..." 
              class="w-80 bg-white border-2 border-[#091E4224] rounded-l-[8px] pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent border-r-0"
            >
          </div>
          
          <!-- Sort Button (Attached) -->
          <div class="relative" ref="sortDropdownRef">
            <button 
              @click="showSortDropdown = !showSortDropdown"
              class="flex items-center justify-center w-10 h-10 text-gray-600 bg-white border-2 border-[#091E4224] border-l-1 rounded-r-[8px] hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <img src="/icons/arrow-up-down.svg" alt="Sort" class="w-4 h-4">
            </button>
            
            <!-- Sort Dropdown Menu -->
            <div v-if="showSortDropdown" class="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg z-10">
              <div class="py-1">
                <button
                  v-for="column in sortableColumns"
                  :key="column.field"
                  @click="handleSort(column)"
                  class="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center justify-between"
                >
                  <span>{{ column.label }}</span>
                  <div v-if="sortBy === column.field" class="flex items-center">
                    <svg v-if="sortOrder === 'asc'" width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M7 14L12 9L17 14H7Z"/>
                    </svg>
                    <svg v-else width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M7 10L12 15L17 10H7Z"/>
                    </svg>
                  </div>
                </button>
              </div>
            </div>


            
          </div>
        </div>
        
        <!-- Create Button -->
        <button 
          @click="showCreateTeamSheet = true"
          class="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path d="M12 5v14M5 12h14" stroke-width="2" stroke-linecap="round"/>
          </svg>
          <span>Create Team</span>
        </button>
      </div>

      <!-- Data Table -->
      <Card class="p-0" noPadding>
        <StaticDatatable 
          :columns="teamColumns" 
          :data="filteredData"
          :searchable="false"
          :exportable="false"
          :printable="false"
          :perPage="10"
        >
          <template #column="{ props: { row, column } }">
            <div v-if="column.field === 'teamName'" class="font-medium text-gray-900">
              {{ row.teamName }}
            </div>
            <div v-else-if="column.field === 'actions'" class="flex items-center justify-center space-x-2">
              <button 
                @click="editTeam(row)"
                class="p-1 text-gray-600 hover:text-blue-600 transition-colors"
                title="Edit Team"
              >
                <img src="/icons/pen.svg" alt="Edit" class="w-6 h-6" />
              </button>
              <button 
                @click="deleteTeam(row)"
                class="p-1 hover:text-red-600 transition-colors"
                style="color: #172B4D;"
                title="Delete Team"
              >
                <img src="/icons/trash.svg" alt="Delete" class="w-6 h-6" />
              </button>
            </div>
            <span v-else>{{ row[column.field] }}</span>
          </template>
        </StaticDatatable>
      </Card>
    </main>


    <!-- Create Team Sheet -->
    <Teleport to="body">
      <div 
        v-if="showCreateTeamSheet" 
        class="fixed inset-0 z-50 overflow-hidden"
        @click.self="showCreateTeamSheet = false"
      >
        <div class="absolute inset-0 bg-black bg-opacity-50"></div>
        <div class="absolute right-0 top-0 h-full bg-white shadow-xl" style="width: 28vw;">
          <div class="flex flex-col h-full">
            <!-- Header -->
            <div class="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 class="text-lg font-semibold text-gray-900">Create Stock Count Team</h2>
              <button 
                @click="showCreateTeamSheet = false"
                class="text-gray-400 hover:text-gray-600"
              >
                <img src="/icons/x-icon.svg" alt="Close" class="w-6 h-6" />
              </button>
            </div>
            
            <!-- Form -->
            <div class="flex-1 p-6 space-y-6">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Team Name</label>
                <input
                  v-model="createForm.teamName"
                  type="text"
                  placeholder="Enter a team name"
                  class="w-full bg-white border-2 border-[#091E4224] rounded-[8px] px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Admins</label>
                <MultiSelectDropdown
                  v-model="createForm.admins"
                  :options="adminOptions"
                  placeholder="Select team admins"
                  class="w-full"
                />
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Warehouse Shelves</label>
                <MultiSelectDropdown
                  v-model="createForm.shelves"
                  :options="shelfOptions"
                  placeholder="Select stock count shelves"
                  class="w-full"
                />
              </div>
            </div>
            
            <!-- Footer -->
            <div class="flex items-center justify-end space-x-3 p-6 border-t border-gray-200">
              <UiButton 
                variant="ghost" 
                @click="showCreateTeamSheet = false"
              >
                Cancel
              </UiButton>
              <UiButton 
                @click="createTeam"
                :disabled="!createForm.teamName"
              >
                Create
              </UiButton>
            </div>
          </div>
        </div>
      </div>
    </Teleport>

    <!-- Edit Team Sheet -->
    <Teleport to="body">
      <div 
        v-if="showEditTeamSheet" 
        class="fixed inset-0 z-50 overflow-hidden"
        @click.self="showEditTeamSheet = false"
      >
        <div class="absolute inset-0 bg-black bg-opacity-50"></div>
        <div class="absolute right-0 top-0 h-full bg-white shadow-xl" style="width: 28vw;">
          <div class="flex flex-col h-full">
            <!-- Header -->
            <div class="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 class="text-lg font-semibold text-gray-900">Edit Stock Count Team</h2>
              <button 
                @click="showEditTeamSheet = false"
                class="text-gray-400 hover:text-gray-600"
              >
                <img src="/icons/x-icon.svg" alt="Close" class="w-6 h-6" />
              </button>
            </div>
            
            <!-- Form -->
            <div class="flex-1 p-6 space-y-6">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Team Name</label>
                <input
                  v-model="editForm.teamName"
                  type="text"
                  class="w-full bg-white border-2 border-[#091E4224] rounded-[8px] px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Admins</label>
                <div class="flex flex-wrap gap-2 mb-4">
                  <div 
                    v-for="admin in editForm.selectedAdmins" 
                    :key="admin"
                    class="flex items-center bg-gray-50 px-3 py-2 rounded-md"
                  >
                    <span class="text-sm">{{ getAdminName(admin) }}</span>
                    <button 
                      @click="removeAdmin(admin)"
                      class="ml-2 text-gray-400 hover:text-red-600"
                    >
                      <img src="/icons/x-icon.svg" alt="Remove" class="w-6 h-6" />
                    </button>
                  </div>
                </div>
                <MultiSelectDropdown
                  v-model="editForm.admins"
                  :options="adminOptions"
                  placeholder="Select team admins"
                  class="w-full"
                />
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Warehouse Shelves</label>
                <div class="flex flex-wrap gap-2 mb-4">
                  <div 
                    v-for="shelf in editForm.selectedShelves" 
                    :key="shelf"
                    class="flex items-center bg-gray-50 px-3 py-2 rounded-md"
                  >
                    <span class="text-sm">{{ shelf }}</span>
                    <button 
                      @click="removeShelf(shelf)"
                      class="ml-2 text-gray-400 hover:text-red-600"
                    >
                      <img src="/icons/x-icon.svg" alt="Remove" class="w-6 h-6" />
                    </button>
                  </div>
                </div>
                <MultiSelectDropdown
                  v-model="editForm.shelves"
                  :options="shelfOptions"
                  placeholder="Select stock count shelves"
                  class="w-full"
                />
              </div>
            </div>
            
            <!-- Footer -->
            <div class="flex items-center justify-between p-6 border-t border-gray-200">
              <!-- Delete Button (Left) -->
              <button 
                @click="confirmDeleteTeam"
                class="flex items-center space-x-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-md transition-colors"
              >
                <img src="/icons/trash.svg" alt="Delete" class="w-6 h-6" />
                <span>Delete</span>
              </button>
              
              <!-- Action Buttons (Right) -->
              <div class="flex items-center space-x-3">
                <UiButton 
                  variant="ghost" 
                  @click="showEditTeamSheet = false"
                >
                  Cancel
                </UiButton>
                <UiButton 
                  @click="updateTeam"
                  :disabled="!editForm.teamName"
                >
                  Update
                </UiButton>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Teleport>

    <!-- Delete Confirmation Modal -->
    <DeleteModal 
      v-model="showDeleteConfirmation" 
      :message="`You are about to delete this stock count team '${teamToDelete?.teamName}'. This action will permanently remove it from the system.`"
      confirm-text="Delete Team"
      @confirm="handleDeleteTeam"
    />

    <!-- Success Messages -->
    <SuccessModal 
      v-model="showSuccessModal" 
      :title="successTitle"
      :message="successMessage" 
    />
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from 'vue'
import { onClickOutside } from '@vueuse/core'
import AppHeader from '@/components/layout/AppHeader.vue'
import Card from '@/components/ui/Card.vue'
import StaticDatatable from '@/components/ui/StaticDatatable.vue'
import UiButton from '@/components/ui/Button.vue'
import MultiSelectDropdown from '@/components/ui/MultiSelectDropdown.vue'
import SuccessModal from '@/components/ui/SuccessModal.vue'
import DeleteModal from '@/components/ui/DeleteModal.vue'

// Types
interface Team {
  id: string
  teamName: string
  users: number
  shelves: number
}

interface CreateForm {
  teamName: string
  admins: string[]
  shelves: string[]
}

interface EditForm {
  id: string
  teamName: string
  admins: string[]
  shelves: string[]
  selectedAdmins: string[]
  selectedShelves: string[]
}

// Options for dropdowns
const adminOptions = [
  { value: 'david', label: 'David Otun' },
  { value: 'basit', label: 'Basit Adeagbo' },
  { value: 'moyosore', label: 'Moyosore Balogun' },
  { value: 'isah', label: 'Isah Ibrahim' }
]

const shelfOptions = [
  { value: 'EC008', label: 'EC008' },
  { value: 'GWA005', label: 'GWA005' },
  { value: 'SH001', label: 'SH001' },
  { value: 'WH002', label: 'WH002' }
]

// Table columns
const teamColumns = [
  { field: 'id', label: 'ID', sortable: true },
  { field: 'teamName', label: 'Team Name', sortable: true },
  { field: 'users', label: 'Users', sortable: true },
  { field: 'shelves', label: 'Shelves', sortable: true },
  { field: 'actions', label: 'Action', sortable: false }
]

// Sample data
const teamsData = ref<Team[]>([
  { id: '15', teamName: 'Team A (Azeez)', users: 0, shelves: 0 },
  { id: '14', teamName: 'Team B (David)', users: 4, shelves: 2 },
  { id: '13', teamName: 'Team C (Sam)', users: 0, shelves: 0 },
  { id: '12', teamName: 'Team D (Osas)', users: 0, shelves: 0 },
  { id: '11', teamName: 'Team E (Bruno)', users: 0, shelves: 0 },
  { id: '10', teamName: 'Team F (Ade)', users: 0, shelves: 0 },
  { id: '09', teamName: 'Team E (Stella)', users: 0, shelves: 0 },
  { id: '08', teamName: 'Team F (Tunji)', users: 1, shelves: 1 },
  { id: '07', teamName: 'Team G (Mariam)', users: 0, shelves: 0 },
  { id: '06', teamName: 'Team H (Dele)', users: 1, shelves: 1 },
  { id: '05', teamName: 'Team I (Joseph)', users: 0, shelves: 0 },
  { id: '04', teamName: 'Team J (Harrison)', users: 1, shelves: 1 },
  { id: '03', teamName: 'Team K (Chukwudi)', users: 0, shelves: 0 },
  { id: '02', teamName: 'Team L (Victor)', users: 1, shelves: 1 },
  { id: '01', teamName: 'Team M (Emmanuel)', users: 0, shelves: 0 }
])

// State
const showCreateTeamSheet = ref(false)
const showEditTeamSheet = ref(false)
const showDeleteConfirmation = ref(false)
const showSuccessModal = ref(false)
const successTitle = ref('')
const successMessage = ref('')
const teamToDelete = ref<Team | null>(null)

// Search and sort state
const searchTerm = ref('')
const sortBy = ref('')
const sortOrder = ref<'asc' | 'desc'>('asc')
const showSortDropdown = ref(false)
const sortDropdownRef = ref()

// Sortable columns
const sortableColumns = teamColumns.filter(col => col.sortable)

// Filtered data
const filteredData = computed(() => {
  let result = [...teamsData.value]
  
  // Apply search filter
  if (searchTerm.value) {
    const search = searchTerm.value.toLowerCase()
    result = result.filter(item => {
      return Object.values(item).some(value => 
        String(value).toLowerCase().includes(search)
      )
    })
  }
  
  // Apply sorting
  if (sortBy.value) {
    result.sort((a, b) => {
      const aValue = a[sortBy.value as keyof Team]
      const bValue = b[sortBy.value as keyof Team]
      
      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return sortOrder.value === 'asc' ? aValue - bValue : bValue - aValue
      }
      
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        const comparison = aValue.localeCompare(bValue)
        return sortOrder.value === 'asc' ? comparison : -comparison
      }
      
      return 0
    })
  }
  
  return result
})

// Click outside to close sort dropdown
onClickOutside(sortDropdownRef, () => {
  showSortDropdown.value = false
})

// Create form
const createForm = reactive<CreateForm>({
  teamName: '',
  admins: [],
  shelves: []
})

// Edit form
const editForm = reactive<EditForm>({
  id: '',
  teamName: '',
  admins: [],
  shelves: [],
  selectedAdmins: [],
  selectedShelves: []
})

// Methods
const onSearch = () => {
  // Search is handled by the computed filteredData
}

const handleSort = (column: { field: string; label: string }) => {
  const newOrder = sortBy.value === column.field && sortOrder.value === 'asc' ? 'desc' : 'asc'
  sortBy.value = column.field
  sortOrder.value = newOrder
  showSortDropdown.value = false
}

const editTeam = (team: Team) => {
  editForm.id = team.id
  editForm.teamName = team.teamName
  editForm.selectedAdmins = ['david', 'basit', 'moyosore', 'isah'] // Mock selected admins
  editForm.selectedShelves = ['EC008', 'GWA005'] // Mock selected shelves
  showEditTeamSheet.value = true
}

const deleteTeam = (team: Team) => {
  teamToDelete.value = team
  showDeleteConfirmation.value = true
}

const confirmDeleteTeam = () => {
  const team = teamsData.value.find(t => t.id === editForm.id)
  if (team) {
    teamToDelete.value = team
    showDeleteConfirmation.value = true
    showEditTeamSheet.value = false
  }
}

const createTeam = () => {
  // Create new team
  const newId = String(parseInt(teamsData.value[0].id) + 1).padStart(2, '0')
  const newTeam: Team = {
    id: newId,
    teamName: createForm.teamName,
    users: 0,
    shelves: 0
  }
  
  teamsData.value.unshift(newTeam)
  
  // Reset form
  createForm.teamName = ''
  createForm.admins = []
  createForm.shelves = []
  
  // Show success
  successTitle.value = 'Stock Count Team Created'
  successMessage.value = `The stock count team "${newTeam.teamName}" has been successfully added to the system.`
  showSuccessModal.value = true
  showCreateTeamSheet.value = false
}

const updateTeam = () => {
  const teamIndex = teamsData.value.findIndex(t => t.id === editForm.id)
  if (teamIndex !== -1) {
    teamsData.value[teamIndex].teamName = editForm.teamName
    
    // Show success
    successTitle.value = 'Stock Count Team Updated'
    successMessage.value = `Team "${editForm.teamName}" has been successfully updated.`
    showSuccessModal.value = true
    showEditTeamSheet.value = false
  }
}

const handleDeleteTeam = () => {
  if (teamToDelete.value) {
    const teamIndex = teamsData.value.findIndex(t => t.id === teamToDelete.value!.id)
    if (teamIndex !== -1) {
      const teamName = teamToDelete.value.teamName
      teamsData.value.splice(teamIndex, 1)
      
      // Show success
      successTitle.value = 'Stock Count Team Deleted'
      successMessage.value = `Team "${teamName}" has been successfully deleted from the system.`
      showSuccessModal.value = true
    }
  }
  
  showDeleteConfirmation.value = false
  teamToDelete.value = null
}

const removeAdmin = (admin: string) => {
  const index = editForm.selectedAdmins.indexOf(admin)
  if (index > -1) {
    editForm.selectedAdmins.splice(index, 1)
  }
}

const removeShelf = (shelf: string) => {
  const index = editForm.selectedShelves.indexOf(shelf)
  if (index > -1) {
    editForm.selectedShelves.splice(index, 1)
  }
}

const getAdminName = (admin: string): string => {
  const names: Record<string, string> = {
    'david': 'David Otun',
    'basit': 'Basit Adeagbo',
    'moyosore': 'Moyosore Balogun',
    'isah': 'Isah Ibrahim'
  }
  return names[admin] || admin
}
</script> 