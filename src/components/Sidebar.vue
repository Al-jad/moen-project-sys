<template>
  <div 
    class="fixed top-0 right-0 z-50 flex flex-col h-screen bg-white shadow-lg dark:bg-gray-900 group"
    @mouseenter="isAnyItemHovered = true"
    @mouseleave="isAnyItemHovered = false"
  >
    <div 
      class="relative flex items-center h-24 overflow-hidden transition-all duration-300 ease-in-out cursor-pointer"
      :class="{'w-[60px]': !isAnyItemHovered, 'w-[220px]': isAnyItemHovered}"
      @click="router.push('/')"
    >
      <div class="absolute inset-0 transition-opacity duration-300 opacity-0 group-hover:opacity-100"/>
      <div class="relative flex items-center justify-center w-full h-full px-3">
        <img 
          src="/public/img/Logo.png" 
          alt="Logo" 
          class="absolute object-contain w-10 h-12 transition-all duration-300 ease-in-out bg-transparent right-3"
          :class="{'opacity-100 scale-100': !isAnyItemHovered, 'opacity-0 scale-95': isAnyItemHovered}"
        />
        <img 
          src="/public/img/logo-text.png" 
          alt="Logo with Text" 
          class="absolute object-contain h-12 transition-all duration-300 ease-in-out"
          :class="{'opacity-0 scale-95': !isAnyItemHovered, 'opacity-100 scale-100': isAnyItemHovered}"
        />
      </div>
    </div>

    <nav 
      class="flex-1 p-2 overflow-hidden transition-all duration-300 ease-in-out"
      :class="{'w-[60px]': !isAnyItemHovered, 'w-[220px]': isAnyItemHovered}"
    >
      <ul class="mt-4 space-y-1.5">
        <template v-for="(item, index) in menuItems" :key="index">
          <li v-if="item.type === 'separator'" class="px-2">
            <hr class="w-full h-px my-2 border-0 rounded opacity-30 bg-gradient-to-l from-gray-200 dark:from-gray-700 to-transparent">
          </li>
          <li 
            v-else
            class="relative group/item"
            @mouseenter="hoveredItem = index"
            @mouseleave="hoveredItem = null"
          >
            <div 
              class="absolute inset-0 transition-opacity duration-200 rounded-md opacity-0 bg-gradient-to-l from-gray-100 dark:from-gray-800 via-transparent to-transparent group-hover/item:opacity-100"
              :class="{'!opacity-0': isActive(item.path)}"
            />
            <Button
              variant="ghost"
              size="icon"
              class="relative flex items-center justify-start w-full gap-3 px-3 py-2 transition-all duration-200 ease-in-out rounded-md whitespace-nowrap"
              :class="{ 
                'bg-primary/10 text-primary dark:bg-primary/20': isActive(item.path),
                'hover:bg-gray-100 dark:hover:bg-gray-800': !isActive(item.path),
                'scale-[1.01]': hoveredItem === index && !isActive(item.path)
              }"
              @click="router.push(item.path)"
            >
              <component 
                :is="item.icon" 
                class="w-5 h-5 min-w-[20px] text-gray-500 dark:text-gray-400 transition-transform duration-200"
                :class="{
                  'scale-105': hoveredItem === index,
                  'text-primary dark:text-primary': isActive(item.path)
                }"
              />
              <span 
                class="text-sm font-medium text-gray-700 transition-all duration-300 transform translate-x-1 opacity-0 dark:text-gray-200 group-hover:opacity-100 group-hover:translate-x-0"
                :class="{'text-primary dark:text-primary': isActive(item.path)}"
              >
                {{ item.label }}
              </span>
              <div 
                v-if="isActive(item.path)"
                class="absolute right-0 w-0.5 h-full transition-transform duration-200 bg-primary"
                :class="{'scale-95': hoveredItem === index}"
              />
            </Button>
          </li>
        </template>
      </ul>
    </nav>

    <!-- User Profile Section -->
    <div 
      class="relative flex items-center p-2 transition-all duration-300 ease-in-out border-t border-gray-200 cursor-pointer dark:border-gray-800 hover:bg-gray-100 dark:hover:bg-gray-800"
      :class="{'w-[60px]': !isAnyItemHovered, 'w-[220px]': isAnyItemHovered}"
      @click="router.push('/profile')"
    >
      <div class="flex items-center gap-3 px-2 py-1.5">
        <img 
          src="/public/img/avatar.png" 
          alt="User Avatar" 
          class="object-cover w-8 h-8 rounded-full ring-2 ring-gray-200 dark:ring-gray-700"
        />
        <div 
          class="flex flex-col transition-all duration-300"
          :class="{'opacity-0': !isAnyItemHovered, 'opacity-100': isAnyItemHovered}"
        >
          <span class="text-sm font-medium text-gray-900 dark:text-white whitespace-nowrap">أ. دعاء الشيخلي</span>
          <span class="text-xs text-gray-500 dark:text-gray-400 whitespace-nowrap">مدير المشروع</span>
        </div>
        <LogOut 
          class="w-4 h-4 mr-auto text-gray-400 transition-all duration-200 hover:text-red-500"
          :class="{'opacity-0 translate-x-2': !isAnyItemHovered, 'opacity-100 translate-x-0': isAnyItemHovered}"
          @click.stop="handleLogout"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { Button } from '@/components/ui/button';
import useTheme from '@/composables/useTheme';
import { 
  LayoutGrid, 
  Inbox, 
  MapPinned,
  FilePen,
  User,    
  Bell, 
  Settings,
  Info,
  Paperclip,
  ChartLine,
  FileClock,
  Building2,
  LogOut,
  ScrollText,
} from 'lucide-vue-next';

const route = useRoute();
const router = useRouter();
const hoveredItem = ref(null);
const isAnyItemHovered = ref(false);
const { theme } = useTheme();

const menuItems = [
  { path: '/', icon: LayoutGrid, label: 'لوحة التحكم' },
  { path: '/projects', icon: Inbox, label: 'المشاريع' },
  { path: '/contracts', icon: ScrollText, label: 'العقود' },
  { path: '/map', icon: MapPinned, label: 'الخريطة' },
  { path: '/reports', icon: ChartLine, label: 'التقارير و الاحصائيات' },
  { path: '/modifications', icon: FilePen, label: 'الاجراءات الادارية' },
  { path: '/history-log', icon: FileClock, label: 'سجل الأحداث' },
  { path: '/attachments', icon: Paperclip, label: 'المرفقات' },
  { path: '/users', icon: User, label: 'المستخدمين' },
  { path: '/beneficiaries', icon: Building2, label: 'الجهات المستفيدة' },
  { type: 'separator' },
  { path: '/tasks', icon: Bell, label: 'المهام' },
  { path: '/settings', icon: Settings, label: 'الاعدادات' },
  { path: '/info', icon: Info, label: 'المعلومات' },
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
