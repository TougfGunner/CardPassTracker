import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { NewStarter, SystemType, NewStarterFormData } from '@/types'

export const useNewStarterStore = defineStore('newStarter', () => {
  // State
  const starters = ref<NewStarter[]>([])
  const loading = ref(false)

  // Getters
  const pending = computed(() => starters.value.filter(s => s.status === 'CREATED'))
  const sent = computed(() => starters.value.filter(s => s.status === 'SENT'))
  const confirmed = computed(() => starters.value.filter(s => s.status === 'CONFIRMED'))

  const recentStarters = computed(() => {
    return starters.value.sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )
  })

  const deliveryRate = computed(() => {
    if (starters.value.length === 0) return 0
    const delivered = starters.value.filter(s => s.status !== 'CREATED').length
    return (delivered / starters.value.length) * 100
  })

  // Actions
  async function fetchAll() {
    loading.value = true
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/new-starters`)
      const data = await response.json()
      starters.value = data
    } finally {
      loading.value = false
    }
  }

  async function createNewStarter(payload: NewStarterFormData) {
    loading.value = true
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/new-starters`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })
      const newStarter = await response.json()
      starters.value.push(newStarter)
      return newStarter
    } finally {
      loading.value = false
    }
  }

  async function generateCredentials(starterIds: string[], currentUserEmail: string) {
    loading.value = true
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/new-starters/generate-credentials`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ starterIds, sentByUser: currentUserEmail })
      })
      const updated = await response.json()
      
      // Update local starters
      updated.forEach((updatedStarter: NewStarter) => {
        const idx = starters.value.findIndex(s => s.id === updatedStarter.id)
        if (idx !== -1) {
          starters.value[idx] = updatedStarter
        }
      })
      return updated
    } finally {
      loading.value = false
    }
  }

  async function sendWelcomeEmail(starterId: string) {
    loading.value = true
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/new-starters/${starterId}/send-welcome`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      })
      const updated = await response.json()
      const idx = starters.value.findIndex(s => s.id === updated.id)
      if (idx !== -1) {
        starters.value[idx] = updated
      }
      return updated
    } finally {
      loading.value = false
    }
  }

  function updateStatus(starterId: string, status: 'CREATED' | 'SENT' | 'CONFIRMED') {
    const idx = starters.value.findIndex(s => s.id === starterId)
    if (idx !== -1) {
      starters.value[idx].status = status
    }
  }

  return {
    starters,
    loading,
    pending,
    sent,
    confirmed,
    recentStarters,
    deliveryRate,
    fetchAll,
    createNewStarter,
    generateCredentials,
    sendWelcomeEmail,
    updateStatus
  }
})
