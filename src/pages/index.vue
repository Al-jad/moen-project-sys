<template>
  <div class="flex" dir="rtl">
    <Sidebar />
    
    <main class="flex-1 mr-[60px] bg-gray-200">
      <Header />
      
      <div class="p-6 mt-[6%]">
        <h1 class="mb-4 text-2xl font-bold text-right"> 
          المشاريع
        </h1>
        <!-- Stats Cards -->
        <div class="grid grid-cols-4 gap-4 mb-8">
          <div class="p-8 bg-white shadow rounded-xl">
            <div class="flex items-center justify-between">
              <div class="flex flex-col gap-2 text-right">
                <p class="text-sm text-gray-500">كل المشاريع</p>
                <p class="text-2xl font-bold">1,582</p>
              </div>
              <div class="p-2 bg-blue-100 rounded-full">
                <Users class="w-6 h-6 text-blue-500" />
              </div>
            </div>
          </div>
          <div class="p-8 bg-white shadow rounded-xl">
            <div class="flex items-center justify-between">
              <div class="flex flex-col gap-2 text-right">
                <p class="text-sm text-gray-500">المنجزة</p>
                <p class="text-2xl font-bold">982</p>
              </div>
              <div class="p-2 bg-green-100 rounded-full">
                <Users class="w-6 h-6 text-green-500" />
              </div>
            </div>
          </div>

          <div class="p-8 bg-white shadow rounded-xl">
            <div class="flex items-center justify-between">
              <div class="flex flex-col gap-2 text-right">
                <p class="text-sm text-gray-500">المتلكئة</p>
                <p class="text-2xl font-bold">245</p>
              </div>
              <div class="p-2 bg-yellow-100 rounded-full">
                <LineChart class="w-6 h-6 text-yellow-500" />
              </div>
            </div>
          </div>

          <div class="p-8 bg-white shadow rounded-xl">
            <div class="flex items-center justify-between">
              <div class="flex flex-col gap-2 text-right">
                <p class="text-sm text-gray-500">قيد التنفيذ</p>
                <p class="text-2xl font-bold">382</p>
              </div>
              <div class="p-2 bg-orange-100 rounded-full">
                <Package class="w-6 h-6 text-orange-500" />
              </div>
            </div>
          </div>
        </div>
        <h1 class="mb-4 text-2xl font-bold text-right">
          الاختصارات
        </h1>
        <!-- Shortcuts Cards -->
        <div class="grid grid-cols-4 gap-4 mb-8">
          <div class="flex items-center justify-between p-8 bg-white shadow rounded-xl">
            <span class="text-sm font-medium">البرنامج الحكومي</span>
            <div class="p-2">
              <Users class="w-12 h-12 p-2 rounded-full bg-sky-100 text-sky-500" />
            </div>
          </div>

          <div class="flex items-center justify-between p-8 bg-white shadow rounded-xl">
            <span class="text-sm font-medium">المشاريع</span>
            <div class="p-2">
              <Users class="w-12 h-12 p-2 rounded-full bg-sky-100 text-sky-500" />
            </div>
          </div>

          <div class="flex items-center justify-between p-8 bg-white shadow rounded-xl">
            <span class="text-sm font-medium">تقرير رئاسة الوزراء</span>
            <div class="p-2">
              <LineChart class="w-12 h-12 p-2 text-green-500 bg-green-100 rounded-full" />
            </div>
          </div>

          <div class="flex items-center justify-between p-8 bg-white shadow rounded-xl">
            <span class="text-sm font-medium">بيانات على الخارطة</span>
            <div class="p-2">
              <MapPin class="w-12 h-12 p-2 text-yellow-500 bg-yellow-100 rounded-full" />
            </div>
          </div>
        </div>

        <!-- Chart Section -->
        <div class="w-full p-6 bg-white rounded-lg shadow">
          <div class="flex items-center justify-between mb-4">
            <div class="flex items-center gap-2">
              <Select v-model="selectedYear" class="w-[140px]">
                <SelectTrigger>
                  <SelectValue :placeholder="selectedYear" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>السنة</SelectLabel>
                    <SelectItem value="2024 - 2025">2024 - 2025</SelectItem>
                    <SelectItem value="2023 - 2024">2023 - 2024</SelectItem>
                    <SelectItem value="2022 - 2023">2022 - 2023</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div class="w-full">
            <ProjectsChart :selected-year="selectedYear" />
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { Sun, Bell, Users, LineChart, Package, MapPin } from 'lucide-vue-next'
import { Button } from '@/components/ui/button'
import { 
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import Header from '@/components/Header.vue'
import ProjectsChart from '@/components/ProjectsChart.vue'
import Sidebar from '@/components/Sidebar.vue'

const selectedYear = ref('2024 - 2025')
</script>

<style>
/* Add any custom styles here */
</style>
