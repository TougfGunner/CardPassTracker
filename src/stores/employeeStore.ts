import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Employee, BankingFilterOptions } from '@/types'

export const useEmployeeStore = defineStore('employee', () => {
  // State
  const employees = ref<Employee[]>([])
  const loading = ref(false)
  const selectedEmployee = ref<Employee | null>(null)
  const searchQuery = ref('')

  // Getters
  const filteredEmployees = computed(() => {
    return employees.value.filter(emp => {
      const matchesSearch = emp.name.toLowerCase().includes(searchQuery.value.toLowerCase())
        || emp.email.toLowerCase().includes(searchQuery.value.toLowerCase())
      return matchesSearch
    })
  })

  const needsBanking = computed(() => {
    return employees.value.filter(emp => emp.needsBanking && !emp.bankingCompletedDate)
  })

  const bankingCompleted = computed(() => {
    return employees.value.filter(emp => emp.bankingCompletedDate)
  })

  // Actions
  async function searchADUsers(query: string) {
    loading.value = true
    try {
      // Call backend AD search endpoint
      const response = await fetch(`${import.meta.env.VITE_API_URL}/ad/users?q=${query}`)
      const data = await response.json()
      // Map AD results to Employee objects
      employees.value = data.map((user: any) => ({
        id: user.samAccountName,
        name: user.displayName,
        email: user.mail,
        managerEmail: user.manager,
        department: user.department,
        startDate: user.startDate || new Date().toISOString(),
        needsBanking: false,
        bankingCompletedDate: undefined
      }))
    } finally {
      loading.value = false
    }
  }

  function setSelectedEmployee(employee: Employee) {
    selectedEmployee.value = employee
  }

  function updateEmployee(employeeId: string, updates: Partial<Employee>) {
    const idx = employees.value.findIndex(e => e.id === employeeId)
    if (idx !== -1) {
      employees.value[idx] = { ...employees.value[idx], ...updates }
    }
  }

  function markNeedsBanking(employeeId: string) {
    updateEmployee(employeeId, { needsBanking: true })
  }

  function clearSearch() {
    searchQuery.value = ''
    selectedEmployee.value = null
  }

  return {
    employees,
    loading,
    selectedEmployee,
    searchQuery,
    filteredEmployees,
    needsBanking,
    bankingCompleted,
    searchADUsers,
    setSelectedEmployee,
    updateEmployee,
    markNeedsBanking,
    clearSearch
  }
})
