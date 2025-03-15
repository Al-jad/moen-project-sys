<template>
  <div dir="rtl" class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
    <div
      v-for="user in users"
      :key="user.id"
      class="group relative flex flex-col rounded-xl border border-gray-100 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg dark:border-gray-700/50 dark:bg-gray-800/95 dark:shadow-gray-900/50"
      @click="$router.push(`/users/${user.id}`)"
    >
      <div class="mb-4 flex justify-end">
        <Badge :class="getRoleBadgeClass(user.role)" class="px-3 py-1 text-xs font-medium">
          {{ user.title }}
        </Badge>
      </div>
      <div class="flex flex-1 flex-col justify-between">
        <div class="space-y-2">
          <h3 class="text-xl font-semibold tracking-tight text-gray-900 dark:text-white">
            {{ user.name }}
          </h3>
          <p class="text-sm font-medium text-gray-500 dark:text-gray-400">
            {{ user.email }}
          </p>
        </div>
        <div class="mt-4 text-xs font-medium text-gray-400 dark:text-gray-500">
          انضم {{ formatDate(user.createdAt) }}
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
  import { Badge } from '@/components/ui/badge';
  defineProps({
    users: {
      type: Array,
      required: true,
    },
  });
  function getRoleBadgeClass(role) {
    switch (role) {
      case 'ADMIN':
        return 'bg-primary/10 text-primary dark:bg-primary/20';
      case 'SUPERVISOR':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-500/20 dark:text-yellow-400';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-500/20 dark:text-gray-400';
    }
  }
  function formatDate(dateString) {
    if (!dateString) return '';
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    if (diffDays <= 30) {
      return `منذ ${diffDays} يوم`;
    }
    return date.toLocaleDateString('ar-IQ', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  }
</script>
