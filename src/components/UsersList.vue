<template>
  <div class="grid grid-cols-4 gap-4">
    <div v-for="user in users" :key="user.id" class="p-6 bg-white dark:bg-gray-800/95 shadow-sm dark:shadow-gray-900/50 rounded-xl cursor-pointer hover:scale-[1.01] transition-all duration-300 hover:shadow-md border border-gray-100 dark:border-gray-700/50" @click="$router.push(`/users/${user.id}`)">
      <div class="flex flex-col items-center gap-4">
        <div class="relative">
          <img 
            :src="user.avatar" 
            alt="user avatar" 
            class="object-cover w-16 h-16 rounded-full ring-2 ring-gray-100 dark:ring-gray-700"
          />
          <div class="absolute bottom-0 right-0 w-4 h-4 border-2 border-white rounded-full dark:border-gray-800" 
            :class="user.isActive ? 'bg-green-500' : 'bg-gray-300 dark:bg-gray-600'"
          />
        </div>
        <div class="flex flex-col items-center gap-1 text-center">
          <h3 class="text-lg font-medium text-gray-900 dark:text-white">{{ user.name }}</h3>
          <p class="text-sm text-gray-500 dark:text-gray-400">{{ user.title }}</p>
        </div>
        <Button variant="outline" size="xs" class="w-1/3 py-2 text-xs rounded-full border-sky-500 text-sky-500 dark:border-sky-400 dark:text-sky-400 hover:bg-sky-50 dark:bg-gray-800 dark:hover:bg-sky-900/20">
          مدير المشروع
        </Button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { Button } from '@/components/ui/button'

defineProps({
  users: {
    type: Array,
    required: true
  }
})
</script> 