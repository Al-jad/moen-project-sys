<template>
  <div
    class="fixed top-0 right-0 z-50 flex flex-col h-screen shadow-lg group bg-background-surface"
    @mouseenter="isAnyItemHovered = true"
    @mouseleave="isAnyItemHovered = false"
  >
    <div
      class="relative flex items-center h-24 overflow-x-hidden transition-all duration-300 ease-in-out cursor-pointer"
      :class="{ 'w-[60px]': !isAnyItemHovered, 'w-[220px]': isAnyItemHovered }"
      @click="router.push('/')"
    >
      <div
        class="absolute inset-0 transition-opacity duration-300 opacity-0 group-hover:opacity-100"
      />
      <div class="relative flex items-center justify-center w-full h-full px-3">
        <img
          src="/img/Logo.png"
          alt="Logo"
          class="absolute object-contain w-10 h-12 transition-all duration-300 ease-in-out bg-transparent right-3"
          :class="{
            'scale-100 opacity-100': !isAnyItemHovered,
            'scale-95 opacity-0': isAnyItemHovered,
          }"
        />
        <img
          :src="isDark ? '/img/logo-white-text.png' : '/img/logo-text.png'"
          alt="Logo with Text"
          class="absolute object-contain h-12 transition-all duration-300 ease-in-out"
          :class="{
            'scale-95 opacity-0': !isAnyItemHovered,
            'scale-100 opacity-100': isAnyItemHovered,
          }"
        />
      </div>
    </div>

    <nav
      class="flex-1 p-2 overflow-x-hidden transition-all duration-300 ease-in-out hide-scrollbar"
      :class="{ 'w-[60px]': !isAnyItemHovered, 'w-[220px]': isAnyItemHovered }"
    >
      <ul class="mt-4 space-y-1.5">
        <template v-for="(item, index) in menuItems" :key="index">
          <li v-if="item.type === 'separator'" class="px-2">
            <hr class="w-full h-px my-2 border-0 rounded bg-gradient-to-l from-border to-border" />
          </li>
          <li
            v-else
            class="relative group/item"
            @mouseenter="hoveredItem = index"
            @mouseleave="hoveredItem = null"
          >
            <div
              class="absolute inset-0 transition-opacity duration-200 rounded-md opacity-0 bg-gradient-to-l from-background-surface via-transparent to-transparent group-hover/item:opacity-100"
              :class="{ '!opacity-0': isActive(item.path) }"
            />
            <Button
              variant="ghost"
              size="icon"
              class="relative flex items-center justify-start w-full gap-3 px-3 py-2 transition-all duration-200 ease-in-out rounded-md whitespace-nowrap"
              :class="{
                'bg-primary/20 text-primary hover:bg-primary/10 hover:text-primary': isActive(
                  item.path
                ),
                'hover:bg-background-hover': !isActive(item.path),
                'scale-[1.01]': hoveredItem === index && !isActive(item.path),
              }"
              @click="router.push(item.path)"
            >
              <Icon
                :icon="item.icon"
                class="h-5 w-5 min-w-[20px] text-foreground-muted transition-transform duration-200"
                :class="{
                  'scale-105': hoveredItem === index,
                  'text-primary dark:text-primary': isActive(item.path),
                }"
              />
              <span
                class="text-sm font-medium transition-all duration-300 transform translate-x-1 opacity-0 text-foreground-heading group-hover:translate-x-0 group-hover:opacity-100"
                :class="{ 'text-primary': isActive(item.path) }"
              >
                {{ item.label }}
              </span>
              <div
                v-if="isActive(item.path)"
                class="absolute right-0 h-full w-0.5 bg-primary transition-transform duration-200"
                :class="{ 'scale-95': hoveredItem === index }"
              />
            </Button>
          </li>
        </template>
      </ul>
    </nav>

    <!-- User Profile Section -->
    <div
      class="relative flex items-center p-2 transition-all duration-300 ease-in-out border-t cursor-pointer border-border hover:bg-background-hover"
      :class="{ 'w-[60px]': !isAnyItemHovered, 'w-[220px]': isAnyItemHovered }"
    >
      <div class="flex items-center gap-3 px-2 py-1.5">
        <div class="flex items-center justify-center">
          <Icon icon="lucide:user" class="w-4 h-4 text-foreground-muted" />
        </div>
        <div
          class="flex flex-col transition-all duration-300"
          :class="{ 'opacity-0': !isAnyItemHovered, 'opacity-100': isAnyItemHovered }"
        >
          <span class="text-sm font-medium whitespace-nowrap text-foreground-heading">{{
            authStore.getUser?.name || 'User'
          }}</span>
          <span class="text-xs whitespace-nowrap text-foreground-muted">{{
            userTranslations[authStore.getUser?.role] || 'Guest'
          }}</span>
        </div>
        <div
          class="flex items-center justify-center p-2 transition-all duration-200 rounded-full hover:bg-background-card"
          :class="{
            'translate-x-2 opacity-0': !isAnyItemHovered,
            'translate-x-0 opacity-100': isAnyItemHovered,
          }"
        >
          <Icon
            icon="lucide:log-out"
            class="w-4 h-4 transition-all duration-200 text-foreground-muted hover:text-destructive"
            @click.stop="showLogoutModal = true"
          />
        </div>
      </div>
    </div>
  </div>

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
  import { useAuthStore } from '@/stores/auth';
  import { Icon } from '@iconify/vue';
  import { computed, ref } from 'vue';
  import { useRoute, useRouter } from 'vue-router';
  import { toast } from 'vue-sonner';

  const route = useRoute();
  const router = useRouter();
  const authStore = useAuthStore();
  const { theme } = useTheme();
  const hoveredItem = ref(null);
  const isAnyItemHovered = ref(false);
  const showLogoutModal = ref(false);
  const isLoggingOut = ref(false);

  const isDark = computed(() => {
    return theme.value === 'dark';
  });

  const userTranslations = {
    ADMIN: 'مدير',
    SUPERVISOR: 'مشرف',
    DATA_ENTRY: 'مدخل بيانات',
  };

  const menuItems = [
    { path: '/', icon: 'lucide:layout-grid', label: 'لوحة التحكم' },
    { type: 'separator' },

    { path: '/projects', icon: 'lucide:inbox', label: 'المشاريع' },

    { path: '/funded-projects', icon: 'lucide:dollar-sign', label: 'المشاريع الممولة' },
    {
      path: '/regional-projects',
      icon: 'oui:vis-map-region',
      label: 'مشاريع تنمية الأقاليم',
    },
    {
      path: '/demo-projects/investment',
      icon: 'flowbite:chart-outline',
      label: 'المشاريع الإستثمارية',
    },
    { path: '/demo-projects/operational', icon: 'hugeicons:tools', label: 'المشاريع التشغيلية' },

    { type: 'separator' },

    { path: '/contracts', icon: 'lucide:scroll-text', label: 'العقود' },
    { path: '/map', icon: 'lucide:map-pin', label: 'الخريطة' },
    { path: '/reports', icon: 'lucide:chart-line', label: 'التقارير و الاحصائيات' },
    { path: '/modifications', icon: 'lucide:file-pen', label: 'الاجراءات الادارية' },
    { path: '/history-log', icon: 'lucide:file-clock', label: 'سجل الأحداث' },
    { path: '/attachments', icon: 'lucide:paperclip', label: 'المرفقات' },
    { path: '/users', icon: 'lucide:user', label: 'المستخدمين' },
    { path: '/beneficiaries', icon: 'lucide:building-2', label: 'الجهات المستفيدة' },
    { type: 'separator' },
    { path: '/tasks', icon: 'lucide:bell', label: 'المهام' },
    { path: '/settings', icon: 'lucide:settings', label: 'الاعدادات' },
    { path: '/about', icon: 'lucide:info', label: 'حول النظام' },
  ];

  const isActive = (path) => {
    if (path === '/') return route.path === '/';
    return route.path.startsWith(path);
  };

  const handleLogout = async () => {
    isLoggingOut.value = true;
    try {
      await authStore.logout();
      router.push('/login');
    } catch (error) {
      toast.error('حدث خطأ أثناء تسجيل الخروج');
    } finally {
      isLoggingOut.value = false;
      showLogoutModal.value = false;
    }
  };
</script>

<style scoped>
  .hide-scrollbar {
    scrollbar-width: none; /* Firefox */
    -ms-overflow-style: none; /* IE and Edge */
  }

  .hide-scrollbar::-webkit-scrollbar {
    display: none; /* Chrome, Safari and Opera */
  }
</style>
