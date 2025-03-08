<template>
  <div
    class="group fixed right-0 top-0 z-50 flex h-screen flex-col bg-white shadow-lg dark:bg-gray-900"
    @mouseenter="isAnyItemHovered = true"
    @mouseleave="isAnyItemHovered = false"
  >
    <div
      class="relative flex h-24 cursor-pointer items-center overflow-hidden transition-all duration-300 ease-in-out"
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
          src="/public/img/logo-white-text.png"
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
      class="flex-1 overflow-hidden p-2 transition-all duration-300 ease-in-out"
      :class="{ 'w-[60px]': !isAnyItemHovered, 'w-[220px]': isAnyItemHovered }"
    >
      <ul class="mt-4 space-y-1.5">
        <template v-for="(item, index) in menuItems" :key="index">
          <li v-if="item.type === 'separator'" class="px-2">
            <hr
              class="my-2 h-px w-full rounded border-0 bg-gradient-to-l from-gray-200 to-transparent opacity-30 dark:from-gray-700"
            />
          </li>
          <li
            v-else
            class="group/item relative"
            @mouseenter="hoveredItem = index"
            @mouseleave="hoveredItem = null"
          >
            <div
              class="absolute inset-0 rounded-md bg-gradient-to-l from-gray-100 via-transparent to-transparent opacity-0 transition-opacity duration-200 group-hover/item:opacity-100 dark:from-gray-800"
              :class="{ '!opacity-0': isActive(item.path) }"
            />
            <Button
              variant="ghost"
              size="icon"
              class="relative flex w-full items-center justify-start gap-3 whitespace-nowrap rounded-md px-3 py-2 transition-all duration-200 ease-in-out"
              :class="{
                'bg-primary/10 text-primary dark:bg-primary/20': isActive(item.path),
                'hover:bg-gray-100 dark:hover:bg-gray-800': !isActive(item.path),
                'scale-[1.01]': hoveredItem === index && !isActive(item.path),
              }"
              @click="router.push(item.path)"
            >
              <Icon
                :icon="item.icon"
                class="h-5 w-5 min-w-[20px] text-gray-500 transition-transform duration-200 dark:text-gray-400"
                :class="{
                  'scale-105': hoveredItem === index,
                  'text-primary dark:text-primary': isActive(item.path),
                }"
              />
              <span
                class="translate-x-1 transform text-sm font-medium text-gray-700 opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100 dark:text-gray-200"
                :class="{ 'text-primary dark:text-primary': isActive(item.path) }"
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
      class="relative flex cursor-pointer items-center border-t border-gray-200 p-2 transition-all duration-300 ease-in-out hover:bg-gray-100 dark:border-gray-800 dark:hover:bg-gray-800"
      :class="{ 'w-[60px]': !isAnyItemHovered, 'w-[220px]': isAnyItemHovered }"
      @click="router.push('/profile')"
    >
      <div class="flex items-center gap-3 px-2 py-1.5">
        <img
          src="/public/img/avatar.png"
          alt="User Avatar"
          class="h-8 w-8 rounded-full object-cover ring-2 ring-gray-200 dark:ring-gray-700"
        />
        <div
          class="flex flex-col transition-all duration-300"
          :class="{ 'opacity-0': !isAnyItemHovered, 'opacity-100': isAnyItemHovered }"
        >
          <span class="whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white"
            >أ. دعاء الشيخلي</span
          >
          <span class="whitespace-nowrap text-xs text-gray-500 dark:text-gray-400"
            >مدير المشروع</span
          >
        </div>
        <Icon
          icon="lucide:log-out"
          class="mr-auto h-4 w-4 text-gray-400 transition-all duration-200 hover:text-red-500"
          :class="{
            'translate-x-2 opacity-0': !isAnyItemHovered,
            'translate-x-0 opacity-100': isAnyItemHovered,
          }"
          @click.stop="handleLogout"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
  import { Icon } from '@iconify/vue';

  import { useRoute, useRouter } from 'vue-router';

  const route = useRoute();
  const router = useRouter();
  const hoveredItem = ref(null);
  const isAnyItemHovered = ref(false);

  const menuItems = [
    { path: '/', icon: 'lucide:layout-grid', label: 'لوحة التحكم' },
    { path: '/projects', icon: 'lucide:inbox', label: 'المشاريع' },
    { path: '/funded-projects', icon: 'lucide:dollar-sign', label: 'المشاريع الممولة' },
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
    { path: '/info', icon: 'lucide:info', label: 'المعلومات' },
  ];

  const isActive = (path) => {
    if (path === '/') return route.path === '/';
    return route.path.startsWith(path);
  };

  const handleLogout = () => {
    // Add your logout logic here
    console.log('Logging out...');
  };
</script>

<style scoped>
  .router-link-active {
    @apply bg-[#08182F] text-white;
  }
</style>
