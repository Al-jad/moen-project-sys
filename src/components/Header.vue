<template>
  <header class="fixed top-0 right-[60px] left-0 z-10 flex items-center justify-between p-4 bg-white shadow-md" dir="rtl">
    <div class="flex flex-col items-center gap-2 cursor-pointer" @click="router.push('/')">
      <h1 class="text-2xl font-bold text-gray-800 transition-colors hover:text-gray-900">برنامج ادارة المشاريع</h1>
      <span class="text-sm font-medium text-gray-600">دائرة التخطيط - وزارة البيئة</span>
    </div>
    <div class="flex items-center gap-4">
      <div class="flex items-center gap-3">
        <div class="flex items-center justify-center w-10 h-10 transition-colors bg-blue-100 rounded-full cursor-pointer hover:bg-blue-200">
          <User class="w-6 h-6 text-blue-600" />
        </div>
        <div class="flex flex-col items-start">
          <span class="font-medium text-gray-800 transition-colors cursor-pointer hover:text-gray-900"> 
            أ. دعاء الشيخلي
          </span>
          <span class="text-sm text-gray-500">مدير المشاريع</span>
        </div>
        <div class="w-px h-6 bg-gray-300"></div>
      </div>
      <Button 
        variant="ghost" 
        size="icon"
        class="transition-colors hover:bg-yellow-100 hover:text-yellow-600"
      >
        <Sun class="w-5 h-5" />
      </Button>
      <Button 
        variant="ghost" 
        size="icon"
        class="relative transition-colors hover:bg-red-100 hover:text-red-600"
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
  import { Sun, Bell, User } from 'lucide-vue-next';
  import { Button } from '@/components/ui/button';
  import { useRouter } from 'vue-router';

  const router = useRouter();
</script>
