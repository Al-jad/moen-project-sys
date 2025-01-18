<template>
  <div class="grid grid-cols-4 gap-4 ">
    <div v-for="user in users" :key="user.id" class="p-6 bg-white shadow-sm rounded-xl cursor-pointer hover:scale-[1.01] transition-all duration-300 hover:shadow-md" @click="$router.push(`/users/${user.id}`)">
      <div class="flex flex-col items-center gap-4">
        <div class="relative">
          <img 
            :src="user.avatar" 
            alt="user avatar" 
            class="object-cover w-16 h-16 rounded-full"
          />
          <div class="absolute bottom-0 right-0 w-4 h-4 border-2 border-white rounded-full" 
            :class="user.isActive ? 'bg-green-500' : 'bg-gray-300'"
          />
        </div>
        <div class="flex flex-col items-center gap-1 text-center">
          <h3 class="text-lg font-medium text-gray-900">{{ user.name }}</h3>
          <p class="text-sm text-gray-500">{{ user.title }}</p>
        </div>
        <Button variant="outline" size="xs" class="w-1/3 py-2 text-xs rounded-full border-sky-500 text-sky-500">
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