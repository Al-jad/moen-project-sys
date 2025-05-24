<template>
  <div
    class="bg-background-surface group fixed right-0 top-0 z-50 flex h-screen flex-col shadow-lg"
    @mouseenter="isAnyItemHovered = true"
    @mouseleave="isAnyItemHovered = false"
  >
    <div
      class="relative flex h-24 cursor-pointer items-center overflow-x-hidden transition-all duration-300 ease-in-out"
      :class="{ 'w-[60px]': !isAnyItemHovered, 'w-[220px]': isAnyItemHovered }"
      @click="router.push('/')"
    >
      <div
        class="absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
      />
      <div class="relative flex h-full w-full items-center justify-center px-3">
        <img
          src="/public/img/Logo.png"
          alt="Logo"
          class="absolute right-3 h-12 w-10 bg-transparent object-contain transition-all duration-300 ease-in-out"
          :class="{
            'scale-100 opacity-100': !isAnyItemHovered,
            'scale-95 opacity-0': isAnyItemHovered,
          }"
        />
        <img
          :src="isDark ? '/public/img/logo-white-text.png' : '/public/img/logo-text.png'"
          alt="Logo with Text"
          class="absolute h-12 object-contain transition-all duration-300 ease-in-out"
          :class="{
            'scale-95 opacity-0': !isAnyItemHovered,
            'scale-100 opacity-100': isAnyItemHovered,
          }"
        />
      </div>
    </div>

    <nav
      class="hide-scrollbar flex-1 overflow-x-hidden p-2 transition-all duration-300 ease-in-out"
      :class="{ 'w-[60px]': !isAnyItemHovered, 'w-[220px]': isAnyItemHovered }"
    >
      <ul class="mt-4 space-y-1.5">
        <template v-for="(item, index) in menuItems" :key="index">
          <li v-if="item.type === 'separator'" class="px-2">
            <hr class="my-2 h-px w-full rounded border-0 bg-gradient-to-l from-border to-border" />
          </li>
          <li
            v-else
            class="group/item relative"
            @mouseenter="hoveredItem = index"
            @mouseleave="hoveredItem = null"
          >
            <div
              class="from-background-surface absolute inset-0 rounded-md bg-gradient-to-l via-transparent to-transparent opacity-0 transition-opacity duration-200 group-hover/item:opacity-100"
              :class="{ '!opacity-0': isActive(item.path) }"
            />
            <Button
              variant="ghost"
              size="icon"
              class="relative flex w-full items-center justify-start gap-3 whitespace-nowrap rounded-md px-3 py-2 transition-all duration-200 ease-in-out"
              :class="{
                'bg-primary/10 text-primary': isActive(item.path),
                'hover:bg-background-hover': !isActive(item.path),
                'scale-[1.01]': hoveredItem === index && !isActive(item.path),
              }"
              @click="router.push(item.path)"
            >
              <Icon
                :icon="item.icon"
                class="text-foreground-muted h-5 w-5 min-w-[20px] transition-transform duration-200"
                :class="{
                  'scale-105': hoveredItem === index,
                  'text-primary dark:text-primary': isActive(item.path),
                }"
              />
              <span
                class="text-foreground-heading translate-x-1 transform text-sm font-medium opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100"
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
      class="hover:bg-background-hover relative flex cursor-pointer items-center border-t border-border p-2 transition-all duration-300 ease-in-out"
      :class="{ 'w-[60px]': !isAnyItemHovered, 'w-[220px]': isAnyItemHovered }"
    >
      <div class="flex items-center gap-3 px-2 py-1.5">
        <div class="flex items-center justify-center">
          <Icon icon="lucide:user" class="text-foreground-muted h-4 w-4" />
        </div>
        <div
          class="flex flex-col transition-all duration-300"
          :class="{ 'opacity-0': !isAnyItemHovered, 'opacity-100': isAnyItemHovered }"
        >
          <span class="text-foreground-heading whitespace-nowrap text-sm font-medium">{{
            authStore.getUser?.name || 'User'
          }}</span>
          <span class="text-foreground-muted whitespace-nowrap text-xs">{{
            userTranslations[authStore.getUser?.role] || 'Guest'
          }}</span>
        </div>
        <div
          class="hover:bg-background-card flex items-center justify-center rounded-full p-2 transition-all duration-200"
          :class="{
            'translate-x-2 opacity-0': !isAnyItemHovered,
            'translate-x-0 opacity-100': isAnyItemHovered,
          }"
        >
          <Icon
            icon="lucide:log-out"
            class="text-foreground-muted h-4 w-4 transition-all duration-200 hover:text-destructive"
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
  import { useAuthStore } from '@/stores/authStore';
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
  .router-link-active {
    @apply bg-[#08182F] text-white;
  }

  .hide-scrollbar {
    scrollbar-width: none; /* Firefox */
    -ms-overflow-style: none; /* IE and Edge */
  }

  .hide-scrollbar::-webkit-scrollbar {
    display: none; /* Chrome, Safari and Opera */
  }
</style>
