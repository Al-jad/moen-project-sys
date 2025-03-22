<template>
  <header
    class="fixed left-0 right-[60px] top-0 z-10 flex items-center justify-between border-b border-gray-200 bg-gray-100 p-2 shadow-sm dark:border-gray-800 dark:bg-gray-900"
    dir="rtl"
  >
    <div class="flex cursor-pointer flex-col items-center gap-2" @click="router.push('/')">
      <h1
        class="text-2xl font-bold text-gray-800 transition-colors hover:text-primary dark:text-white dark:hover:text-primary"
        >برنامج ادارة المشاريع</h1
      >
      <span class="text-sm font-medium text-gray-600 dark:text-gray-400"
        >دائرة التخطيط - وزارة البيئة</span
      >
    </div>
    <div class="flex items-center gap-4">
      <div class="flex items-center gap-3">
        <div
          class="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full bg-gray-200 transition-colors hover:bg-gray-300 dark:bg-gray-800 dark:hover:bg-gray-700"
          @click="showLogoutModal = true"
        >
          <Icon icon="lucide:log-out" class="h-6 w-6 text-gray-700 dark:text-gray-300" />
        </div>
        <div class="flex flex-col items-start">
          <span
            class="cursor-pointer font-medium text-gray-800 transition-colors hover:text-primary dark:text-white dark:hover:text-primary"
          >
            {{ authStore.getUser?.name || 'User' }}
          </span>
          <span class="text-sm text-gray-600 dark:text-gray-400">{{
            userTranslations[authStore.getUser?.role] || 'Guest'
          }}</span>
        </div>
        <div class="h-6 w-px bg-gray-300 dark:bg-gray-700"></div>
      </div>
      <Button
        variant="ghost"
        size="icon"
        class="text-gray-700 transition-colors hover:bg-gray-200 hover:text-primary dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-primary"
        @click="handleThemeToggle"
      >
        <Icon v-if="theme === 'dark'" icon="lucide:sun" class="h-5 w-5" />
        <Icon v-else icon="lucide:moon" class="h-5 w-5" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        class="relative text-gray-700 transition-colors hover:bg-gray-200 hover:text-primary dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-primary"
        @click="isTasksOpen = !isTasksOpen"
      >
        <Icon icon="lucide:bell" class="h-5 w-5" />
        <span
          class="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] text-white dark:bg-red-400"
        >
          2
        </span>
        <!-- Tasks Dropdown -->
        <div
          v-if="isTasksOpen"
          class="absolute left-0 top-full mt-2 w-80 rounded-lg border border-gray-200 bg-white p-4 shadow-lg dark:border-gray-700 dark:bg-gray-800"
        >
          <div class="mb-4 flex items-center justify-between">
            <h3 class="text-lg font-medium text-gray-900 dark:text-white">المهام</h3>
            <button
              @click="router.push('/tasks')"
              class="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
            >
              عرض الكل
            </button>
          </div>
          <div class="space-y-4">
            <!-- Placeholder Tasks -->
            <div
              v-for="i in 3"
              :key="i"
              class="flex items-start gap-3 rounded-lg border border-gray-100 bg-gray-50 p-3 dark:border-gray-700 dark:bg-gray-900"
            >
              <div class="rounded-full bg-blue-100 p-2 dark:bg-blue-900">
                <Icon icon="lucide:file-text" class="h-4 w-4 text-blue-600 dark:text-blue-400" />
              </div>
              <div class="flex-1">
                <h4 class="text-sm font-medium text-gray-900 dark:text-white">مهمة {{ i }}</h4>
                <p class="text-xs text-gray-600 dark:text-gray-400">تم إضافة مهمة جديدة للمشروع</p>
                <span class="mt-1 text-[10px] text-gray-500 dark:text-gray-500">منذ ساعتين</span>
              </div>
            </div>
          </div>
        </div>
      </Button>
    </div>
  </header>

  <LogoutModal
    v-model:open="showLogoutModal"
    :loading="isLoggingOut"
    @confirm="handleLogout"
    @cancel="showLogoutModal = false"
  />
</template>

<script setup>
  import LogoutModal from '@/components/LogoutModal.vue';
  import { useTheme } from '@/composables/useTheme';
  import { useToast } from '@/composables/useToast';
  import { useAuthStore } from '@/stores/authStore';
  import { Icon } from '@iconify/vue';
  import { onMounted, onUnmounted, ref } from 'vue';
  import { useRouter } from 'vue-router';

  const router = useRouter();
  const { theme, toggleTheme } = useTheme();
  const authStore = useAuthStore();
  const isTasksOpen = ref(false);
  const showLogoutModal = ref(false);
  const isLoggingOut = ref(false);

  const userTranslations = {
    ADMIN: 'مدير',
    SUPERVISOR: 'مشرف',
    DATA_ENTRY: 'مدخل بيانات',
  };

  const { showInfo, showError } = useToast();

  const handleLogout = async () => {
    isLoggingOut.value = true;
    try {
      await authStore.logout();
      router.push('/login');
    } catch (error) {
      showError('حدث خطأ أثناء تسجيل الخروج');
    } finally {
      isLoggingOut.value = false;
      showLogoutModal.value = false;
    }
  };

  const handleThemeToggle = () => {
    const newTheme = theme.value === 'dark' ? 'light' : 'dark';
    showInfo(
      'تم تغيير المظهر',
      newTheme === 'dark' ? 'تم تفعيل الوضع الليلي' : 'تم تفعيل الوضع النهاري'
    );
    toggleTheme();
  };

  // Close tasks dropdown when clicking outside
  const handleClickOutside = (event) => {
    if (isTasksOpen.value && !event.target.closest('.relative')) {
      isTasksOpen.value = false;
    }
  };

  onMounted(() => {
    document.addEventListener('click', handleClickOutside);
  });

  onUnmounted(() => {
    document.removeEventListener('click', handleClickOutside);
  });
</script>
