<template>
  <header
    class="fixed left-0 right-[60px] top-0 z-10 flex items-center justify-between border-b border-border bg-background-surface p-2 shadow-sm"
    dir="rtl"
  >
    <div class="flex flex-col items-center gap-2 cursor-pointer" @click="router.push('/')">
      <h1 class="text-2xl font-bold transition-colors text-foreground-heading hover:text-primary">
        برنامج ادارة المشاريع
      </h1>
      <span class="text-sm font-medium text-foreground-muted">دائرة التخطيط - وزارة البيئة</span>
    </div>
    <div class="flex items-center gap-4">
      <div class="flex items-center gap-3">
        <div
          class="flex items-center justify-center w-10 h-10 transition-colors rounded-full cursor-pointer bg-background-hover hover:bg-background-hover"
          @click="showLogoutModal = true"
        >
          <Icon icon="lucide:log-out" class="w-6 h-6 text-gray-700 dark:text-gray-300" />
        </div>
        <div class="flex flex-col items-start">
          <span
            class="font-medium transition-colors cursor-pointer text-foreground-heading hover:text-primary"
          >
            {{ authStore.getUser?.name || 'User' }}
          </span>
          <span class="text-sm text-foreground-muted">{{
            userTranslations[authStore.getUser?.role] || 'Guest'
          }}</span>
        </div>
        <div class="w-px h-6 bg-border"></div>
      </div>
      <Button
        variant="ghost"
        size="icon"
        class="transition-colors text-foreground-heading hover:bg-background-hover hover:text-primary"
        @click="handleThemeToggle"
      >
        <Icon v-if="theme === 'dark'" icon="lucide:sun" class="w-5 h-5" />
        <Icon v-else icon="lucide:moon" class="w-5 h-5" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        class="relative transition-colors text-foreground-heading hover:bg-background-hover hover:text-primary"
        @click="isTasksOpen = !isTasksOpen"
      >
        <Icon icon="lucide:bell" class="w-5 h-5" />
        <span
          class="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] text-white"
        >
          2
        </span>
        <!-- Tasks Dropdown -->
        <div
          v-if="isTasksOpen"
          class="absolute left-0 p-4 mt-2 border rounded-lg shadow-lg top-full w-80 border-border bg-background-surface"
        >
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-lg font-medium text-foreground-heading">المهام</h3>
            <button
              @click="router.push('/tasks')"
              class="text-sm text-primary hover:text-primary-hover"
            >
              عرض الكل
            </button>
          </div>
          <div class="space-y-4">
            <!-- Placeholder Tasks -->
            <div
              v-for="i in 3"
              :key="i"
              class="flex items-start gap-3 p-3 border rounded-lg border-border bg-background-surface"
            >
              <div class="p-2 bg-blue-100 rounded-full">
                <Icon icon="lucide:file-text" class="w-4 h-4 text-blue-600" />
              </div>
              <div class="flex-1">
                <h4 class="text-sm font-medium text-foreground-heading">مهمة {{ i }}</h4>
                <p class="text-xs text-foreground-muted">تم إضافة مهمة جديدة للمشروع</p>
                <span class="mt-1 text-[10px] text-foreground-muted">منذ ساعتين</span>
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

<script setup lang="ts">
  import LogoutModal from '@/components/LogoutModal.vue';
  import { useTheme } from '@/composables/useTheme';
  import { useToast } from '@/composables/useToast';
  import { useAuthStore } from '@/stores/auth';
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
  const handleClickOutside = (event: MouseEvent) => {
    if (
      isTasksOpen.value &&
      event.target instanceof Element &&
      !event.target.closest('.relative')
    ) {
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
