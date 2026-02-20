import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { BankingItem, BankingStatus, BankingItemType, BankingFilterOptions, BankingItemStats } from '@/types'

export const useBankingStore = defineStore('banking', () => {
  // State
  const items = ref<BankingItem[]>([])
  const loading = ref(false)
  const filters = ref<BankingFilterOptions>({
    status: 'ALL',
    type: 'ALL',
    department: 'ALL',
    searchQuery: '',
    sortBy: 'orderedDate'
  })

  // Getters
  const pending = computed(() => items.value.filter(i => i.status === 'ORDERED'))
  const ready = computed(() => items.value.filter(i => i.status === 'READY'))
  const overdue = computed(() => items.value.filter(i => i.status === 'OVERDUE'))
  const collected = computed(() => items.value.filter(i => i.status === 'COLLECTED'))

  const filteredItems = computed(() => {
    let result = items.value

    if (filters.value.status !== 'ALL') {
      result = result.filter(i => i.status === filters.value.status)
    }
    if (filters.value.type !== 'ALL') {
      result = result.filter(i => i.type === filters.value.type)
    }
    if (filters.value.searchQuery) {
      const q = filters.value.searchQuery.toLowerCase()
      result = result.filter(i => 
        i.bankName?.toLowerCase().includes(q) || 
        i.systemName?.toLowerCase().includes(q)
      )
    }

    // Sort
    result.sort((a, b) => {
      if (filters.value.sortBy === 'orderedDate') {
        return new Date(b.orderedDate).getTime() - new Date(a.orderedDate).getTime()
      } else if (filters.value.sortBy === 'readyDate' && a.readyDate && b.readyDate) {
        return new Date(b.readyDate).getTime() - new Date(a.readyDate).getTime()
      } else if (filters.value.sortBy === 'daysWaiting') {
        const aDays = a.readyDate ? Math.floor((Date.now() - new Date(a.readyDate).getTime()) / (1000 * 60 * 60 * 24)) : 0
        const bDays = b.readyDate ? Math.floor((Date.now() - new Date(b.readyDate).getTime()) / (1000 * 60 * 60 * 24)) : 0
        return bDays - aDays
      }
      return 0
    })

    return result
  })

  const stats = computed<BankingItemStats>(() => {
    const all = items.value
    const ord = all.filter(i => i.status === 'ORDERED').length
    const rdy = all.filter(i => i.status === 'READY').length
    const ovd = all.filter(i => i.status === 'OVERDUE').length
    const col = all.filter(i => i.status === 'COLLECTED').length
    const total = all.length

    // Calculate average days to collection
    const collectedWithDates = all.filter(i => i.collectedDate && i.readyDate)
    const avgDays = collectedWithDates.length > 0
      ? collectedWithDates.reduce((sum, i) => {
          const days = Math.floor((new Date(i.collectedDate!).getTime() - new Date(i.readyDate!).getTime()) / (1000 * 60 * 60 * 24))
          return sum + days
        }, 0) / collectedWithDates.length
      : 0

    return {
      totalOrdered: ord,
      ready: rdy,
      overdue: ovd,
      collected: col,
      averageDaysToCollection: Math.round(avgDays * 10) / 10,
      collectionRate: total > 0 ? (col / total) * 100 : 0
    }
  })

  // Actions
  async function fetchAll() {
    loading.value = true
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/banking-items`)
      const data = await response.json()
      items.value = data
    } finally {
      loading.value = false
    }
  }

  async function createOrder(payload: { employeeId: string; bankName?: string; systemName?: string }) {
    loading.value = true
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/banking-items`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: payload.bankName ? 'BANK_LETTER' : 'SYSTEM_PASSWORD',
          ...payload
        })
      })
      const newItem = await response.json()
      items.value.push(newItem)
    } finally {
      loading.value = false
    }
  }

  async function confirmCollection(token: string) {
    loading.value = true
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/banking-items/confirm`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token })
      })
      const updated = await response.json()
      const idx = items.value.findIndex(i => i.id === updated.id)
      if (idx !== -1) {
        items.value[idx] = updated
      }
    } finally {
      loading.value = false
    }
  }

  function setFilters(newFilters: Partial<BankingFilterOptions>) {
    filters.value = { ...filters.value, ...newFilters }
  }

  function updateItemStatus(itemId: string, status: BankingStatus) {
    const idx = items.value.findIndex(i => i.id === itemId)
    if (idx !== -1) {
      items.value[idx].status = status
    }
  }

  return {
    items,
    loading,
    filters,
    pending,
    ready,
    overdue,
    collected,
    filteredItems,
    stats,
    fetchAll,
    createOrder,
    confirmCollection,
    setFilters,
    updateItemStatus
  }
})
