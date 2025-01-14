<template>
  <div class="fixed right-0 top-0 flex h-1/2 w-[60px] flex-col bg-white ">
    <div class="flex items-center justify-center h-16 pt-4 mt-4">
      <img src="/public/img/Logo.png" alt="Logo" class="bg-transparent" />
    </div>

    <nav class="flex-1 p-2">
      <ul class="mt-4 space-y-4">
        <li>
          <Button
            variant="ghost"
            size="icon"
            class="w-full"
            :class="{ 'bg-blue-50 text-blue-600': route.path === '/' }"
            @click="router.push('/')"
          >
            <LayoutGrid class="w-5 h-5" />
          </Button>
        </li>
        <li>
          <Button 
            variant="ghost" 
            size="icon" 
            class="w-full"
            :class="{ 'bg-blue-50 text-blue-600': route.path === '/projects' }"
            @click="router.push('/projects')"
          >
            <Inbox class="w-5 h-5" />
          </Button>
        </li>
        <li>
          <Button variant="ghost" size="icon" class="w-full">
            <Percent class="w-5 h-5" />
          </Button>
        </li>
        <li>
          <Button variant="ghost" size="icon" class="w-full">
            <Truck class="w-5 h-5" />
          </Button>
        </li>
        <li>
          <Button variant="ghost" size="icon" class="w-full">
            <Presentation class="w-5 h-5" />
          </Button>
        </li>
        <li>
          <hr class="w-full h-px bg-gray-200 border-0 rounded">
        </li>
        <li>
          <Button variant="ghost" size="icon" class="w-full">
            <Bell class="w-5 h-5" />
          </Button>
        </li>
        <li>
          <Button variant="ghost" size="icon" class="w-full">
            <Settings class="w-5 h-5" />
          </Button>
        </li>
        <li>
          <Button variant="ghost" size="icon" class="w-full">
            <Info class="w-5 h-5" />
          </Button>
        </li>
      </ul>
    </nav>
  </div>
</template>

<script setup>
  import { useRoute, useRouter } from 'vue-router';
  import { Button } from '@/components/ui/button';
  import { 
    LayoutGrid, 
    Inbox, 
    Percent,
    Truck,
    Presentation,    
    Bell, 
    Settings ,
    Info
  } from 'lucide-vue-next';

  const route = useRoute();
  const router = useRouter();
</script>
