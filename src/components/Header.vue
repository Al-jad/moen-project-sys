<template>
  <header 
    class="fixed top-0 right-[60px] left-0 z-10 flex items-center justify-between p-2 bg-white dark:bg-gray-900 shadow-sm border-b border-gray-200 dark:border-gray-800" 
    dir="rtl"
  >
    <div class="flex flex-col items-center gap-2 cursor-pointer" @click="router.push('/')">
      <h1 class="text-2xl font-bold text-gray-900 transition-colors dark:text-white hover:text-primary">برنامج ادارة المشاريع</h1>
      <span class="text-sm font-medium text-gray-500 dark:text-gray-400">دائرة التخطيط - وزارة البيئة</span>
    </div>
    <div class="flex items-center gap-4">
      <div class="flex items-center gap-3">
        <div class="flex items-center justify-center w-10 h-10 transition-colors bg-gray-100 rounded-full cursor-pointer hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700">
          <User class="w-6 h-6 text-gray-600 dark:text-gray-300" />
        </div>
        <div class="flex flex-col items-start">
          <span class="font-medium text-gray-900 transition-colors cursor-pointer dark:text-white hover:text-primary dark:hover:text-primary"> 
            أ. دعاء الشيخلي
          </span>
          <span class="text-sm text-gray-500 dark:text-gray-400">مدير المشاريع</span>
        </div>
        <div class="w-px h-6 bg-gray-200 dark:bg-gray-700"></div>
      </div>
      <Button 
        variant="ghost" 
        size="icon"
        class="text-gray-600 transition-colors dark:text-gray-300 hover:text-primary dark:hover:text-primary hover:bg-gray-100 dark:hover:bg-gray-800"
        @click="toggleTheme"
      >
        <Sun v-if="theme === 'dark'" class="w-5 h-5" />
        <Moon v-else class="w-5 h-5" />
      </Button>
      <Button 
        variant="ghost" 
        size="icon"
        class="relative text-gray-600 transition-colors dark:text-gray-300 hover:text-primary dark:hover:text-primary hover:bg-gray-100 dark:hover:bg-gray-800"
      >
        <Bell class="w-5 h-5" />
        <span class="absolute -top-1 -right-1 w-4 h-4 bg-primary rounded-full text-[10px] text-white flex items-center justify-center">
          2
        </span>
      </Button>
    </div>
  </header>
</template>
<script setup>
  import { Sun, Moon, Bell, User } from 'lucide-vue-next';
  import { Button } from '@/components/ui/button';
  import { useRouter } from 'vue-router';
  import useTheme from '@/composables/useTheme';

  const router = useRouter();
  const { theme, toggleTheme } = useTheme();
</script>
