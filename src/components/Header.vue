<template>
  <header
    class="fixed left-0 right-[60px] top-0 z-10 flex items-center justify-between border-b border-gray-200 dark:border-gray-800 bg-gray-100 dark:bg-gray-900 p-2 shadow-sm"
    dir="rtl"
  >
    <div class="flex cursor-pointer flex-col items-center gap-2" @click="router.push('/')">
      <h1 class="text-2xl font-bold text-gray-800 dark:text-white transition-colors hover:text-primary dark:hover:text-primary"
        >برنامج ادارة المشاريع</h1
      >
      <span class="text-sm font-medium text-gray-600 dark:text-gray-400">دائرة التخطيط - وزارة البيئة</span>
    </div>
    <div class="flex items-center gap-4">
      <div class="flex items-center gap-3">
        <div
          class="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full bg-gray-200 hover:bg-gray-300 dark:bg-gray-800 dark:hover:bg-gray-700 transition-colors"
          @click="handleLogout"
        >
          <Icon icon="lucide:log-out" class="h-6 w-6 text-gray-700 dark:text-gray-300" />
        </div>
        <div class="flex flex-col items-start">
          <span class="cursor-pointer font-medium text-gray-800 dark:text-white transition-colors hover:text-primary dark:hover:text-primary">
            {{ authStore.getUser?.name || 'User' }}
          </span>
          <span class="text-sm text-gray-600 dark:text-gray-400">{{ authStore.getUser?.role || 'Guest' }}</span>
        </div>
        <div class="h-6 w-px bg-gray-300 dark:bg-gray-700"></div>
      </div>
      <Button
        variant="ghost"
        size="icon"
        class="text-gray-700 dark:text-gray-300 transition-colors hover:bg-gray-200 dark:hover:bg-gray-800 hover:text-primary dark:hover:text-primary"
        @click="toggleTheme"
      >
        <Icon v-if="theme === 'dark'" icon="lucide:sun" class="h-5 w-5" />
        <Icon v-else icon="lucide:moon" class="h-5 w-5" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        class="relative text-gray-700 dark:text-gray-300 transition-colors hover:bg-gray-200 dark:hover:bg-gray-800 hover:text-primary dark:hover:text-primary"
      >
        <Icon icon="lucide:bell" class="h-5 w-5" />
        <span
          class="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 dark:bg-red-400 text-[10px] text-white"
        >
          2
        </span>
      </Button>
    </div>
  </header>
</template>

<script setup>
  import { useTheme } from '@/composables/useTheme';
  import { Icon } from '@iconify/vue';
  const router = useRouter();
  const { theme, toggleTheme } = useTheme();
  const authStore = useAuthStore();

  const handleLogout = () => {
    authStore.logout();
    router.push('/login');
  };
</script>
