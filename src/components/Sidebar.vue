<template>
  <div class="fixed right-0 top-0 flex h-1/2 w-[60px] flex-col bg-white">
    <div class="flex items-center justify-center h-16 pt-4 mt-4 cursor-pointer" @click="router.push('/')">
      <img src="/public/img/Logo.png" alt="Logo" class="bg-transparent" />
    </div>

    <nav class="flex-1 p-2">
      <ul class="mt-4 space-y-4">
        <li>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  class="relative w-full"
                  :class="{ 'bg-blue-50 text-blue-600': route.path === '/' }"
                  @click="router.push('/')"
                >
                  <LayoutGrid class="w-5 h-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="left">
                <p>لوحة التحكم</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </li>
        <li>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  class="relative w-full"
                  :class="{ 'bg-blue-50 text-blue-600': route.path.startsWith('/project') }"
                  @click="router.push('/projects')"
                >
                  <Inbox class="w-5 h-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="left">
                <p>المشاريع</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </li>
        <li>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  class="relative w-full"
                  :class="{ 'bg-blue-50 text-blue-600': route.path.startsWith('/map') }"
                  @click="router.push('/map')"
                >
                  <MapPinned class="w-5 h-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="left">
                <p>الخريطة</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </li>
        <li>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  class="relative w-full"
                  :class="{ 'bg-blue-50 text-blue-600': route.path.startsWith('/modifications') }"
                  @click="router.push('/modifications')"
                >
                  <FilePen class="w-5 h-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="left">
                <p>الاجراءات الادارية</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </li>
        <li>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  class="relative w-full"
                  :class="{ 'bg-blue-50 text-blue-600': route.path.startsWith('/attachments') }"
                  @click="router.push('/attachments')"
                >
                  <Paperclip class="w-5 h-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="left">
                <p>المرفقات</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </li>
        <li>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  class="relative w-full"
                  :class="{ 'bg-blue-50 text-blue-600': route.path.startsWith('/users') }"
                  @click="router.push('/users')"
                >
                  <User class="w-5 h-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="left">
                <p>المستخدمين</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </li>
        <li>
          <hr class="w-full h-px bg-gray-200 border-0 rounded">
        </li>
        <li>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" class="w-full">
                  <Bell class="w-5 h-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="left">
                <p>الاشعارات</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </li>
        <li>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  class="w-full"
                  :class="{ 'bg-blue-50 text-blue-600': route.path.startsWith('/settings') }"
                  @click="router.push('/settings')"
                >
                  <Settings class="w-5 h-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="left">
                <p>الاعدادات</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </li>
        <li>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" class="w-full">
                  <Info class="w-5 h-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="left">
                <p>المعلومات</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </li>
      </ul>
    </nav>
  </div>
</template>

<script setup>
import { useRoute, useRouter } from 'vue-router';
import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { 
  LayoutGrid, 
  Inbox, 
  MapPinned,
  FilePen,
  User,    
  Bell, 
  Settings,
  Info,
  Paperclip
} from 'lucide-vue-next';

const route = useRoute();
const router = useRouter();
</script>

<style scoped>
/* Remove CSS tooltip styles as we're using shadcn tooltips now */
</style>
