<script setup lang="ts">
import { RouterView } from 'vue-router'
import { useEmployeeStore } from '@/stores/employeeStore'

const employeeStore = useEmployeeStore()
</script>

<template>
  <div class="min-h-screen bg-gray-900 text-white">
    <header class="bg-gray-800 shadow-lg">
      <div class="max-w-7xl mx-auto px-4 py-6">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-3">
            <span class="text-3xl">🎫</span>
            <h1 class="text-2xl font-bold">CardPassTracker</h1>
          </div>
          <nav class="flex gap-4">
            <RouterLink to="/" class="hover:text-blue-400">Dashboard</RouterLink>
            <RouterLink to="/employees" class="hover:text-blue-400">Employees</RouterLink>
          </nav>
        </div>
      </div>
    </header>
    <main class="max-w-7xl mx-auto px-4 py-8">
      <RouterView />
    </main>
  </div>
</template>

<style>
@import './assets/main.css';
</style>
