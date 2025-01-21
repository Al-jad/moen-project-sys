<template>
  <header class="fixed top-0 right-[60px] left-0 z-10 flex items-center justify-between p-2 bg-[#08182F] shadow-md shadow-gray-400 text-white" dir="rtl">
    <div class="flex flex-col items-center gap-2 cursor-pointer" @click="router.push('/')">
      <h1 class="text-2xl font-bold text-white transition-colors hover:text-gray-200">برنامج ادارة المشاريع</h1>
      <span class="text-sm font-medium text-gray-200">دائرة التخطيط - وزارة البيئة</span>
    </div>
    <div class="flex items-center gap-4">
      <div class="flex items-center gap-3">
        <div class="flex items-center justify-center w-10 h-10 transition-colors rounded-full cursor-pointer bg-white/10 hover:bg-white/20">
          <User class="w-6 h-6 text-white" />
        </div>
        <div class="flex flex-col items-start">
          <span class="font-medium text-white transition-colors cursor-pointer hover:text-gray-200"> 
            أ. دعاء الشيخلي
          </span>
          <span class="text-sm text-gray-200">مدير المشاريع</span>
        </div>
        <div class="w-px h-6 bg-white/20"></div>
      </div>
      <Button 
        variant="ghost" 
        size="icon"
        class="text-white transition-colors hover:bg-white/10"
        @click="toggleTheme"
      >
        <Sun v-if="theme === 'dark'" class="w-5 h-5" />
        <Moon v-else class="w-5 h-5" />
      </Button>
      <Button 
        variant="ghost" 
        size="icon"
        class="relative text-white transition-colors hover:bg-white/10"
      >
        <Bell class="w-5 h-5" />
        <span class="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-[10px] text-white flex items-center justify-center">
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
