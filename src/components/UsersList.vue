<template>
  <div dir="rtl" class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
    <template v-if="loading">
      <div
        v-for="i in 8"
        :key="i"
        class="animate-pulse rounded-xl border border-border bg-background-card p-6"
      >
        <div class="mb-4 flex justify-end">
          <div class="h-6 w-20 rounded-full bg-border"></div>
        </div>
        <div class="space-y-4">
          <div class="space-y-2">
            <div class="h-6 w-3/4 rounded bg-border"></div>
            <div class="h-4 w-1/2 rounded bg-border"></div>
          </div>
          <div class="h-3 w-24 rounded bg-border"></div>
        </div>
      </div>
    </template>
    <template v-else>
      <div
        v-for="user in users"
        :key="user.id"
        class="group relative flex flex-col rounded-xl border border-border bg-background-card p-6 shadow-sm shadow-muted transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
        @click="$router.push(`/users/${user.id}`)"
      >
        <div class="mb-4 flex justify-end">
          <Badge :class="getRoleBadgeClass(user.role)" class="px-3 py-1 text-xs font-medium">
            {{ user.title }}
          </Badge>
        </div>
        <div class="flex flex-1 flex-col justify-between">
          <div class="space-y-2">
            <h3 class="text-xl font-semibold tracking-tight text-foreground">
              {{ user.name }}
            </h3>
            <p class="text-sm font-medium text-muted-foreground">
              {{ user.email }}
            </p>
          </div>
          <div class="mt-4 text-xs font-medium text-muted-foreground">
            انضم {{ formatDate(user.createdAt) }}
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup>
  import { Badge } from '@/components/ui/badge';

  defineProps({
    users: {
      type: Array,
      required: true,
    },
    loading: {
      type: Boolean,
      default: false,
    },
  });

  function getRoleBadgeClass(role) {
    switch (role) {
      case 'ADMIN':
        return 'bg-primary text-primary';
      case 'SUPERVISOR':
        return 'bg-warning text-warning-foreground';
      default:
        return 'bg-info text-info-foreground';
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
