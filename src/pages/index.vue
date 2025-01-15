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

          <div class="flex items-center justify-between p-8 bg-white shadow cursor-pointer rounded-xl" @click="router.push('/projects')">
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

        <div class="mt-8">
          <Tabs default-value="projects" class="w-full">
            <TabsList class="justify-end w-full p-0 bg-transparent border-b rounded-none">
              <TabsTrigger 
                value="users"
                class="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent"
              >
                المستخدمين
              </TabsTrigger>
              <TabsTrigger 
                value="projects"
                class="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent"
              >
                كل المشاريع
              </TabsTrigger>
            </TabsList>
            <TabsContent dir="rtl" value="projects" class="mt-4">
              <ProjectsList :projects="allProjects" />
            </TabsContent>
            <TabsContent value="users" class="mt-4">
              <UsersList :users="mockUsers" />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router';
import { ref, computed } from 'vue'
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
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from '@/components/ui/tabs'
import ProjectsList from '@/components/ProjectsList.vue'
import UsersList from '@/components/UsersList.vue'

const selectedYear = ref('2024 - 2025')
const router = useRouter();
const mockProjects = [
  {
    id: 1,
    title: 'مشروع تجهيز محطات التحسس الاني لمراقبة المياه',
    department: 'مديرية بيئة بغداد',
    startDate: '15.01.2025',
    endDate: '22.12.205',
    status: 'منجز',
    statusVariant: 'success'
  },
  {
    id: 2,
    title: 'مشروع تجهيز محطات التحسس الاني لمراقبة المياه',
    department: 'مديرية بيئة بغداد',
    startDate: '15.01.2025',
    endDate: '22.12.205',
    status: 'قيد الانجاز',
    statusVariant: 'warning'
  },
  {
    id: 3,
    title: 'مشروع تجهيز محطات التحسس الاني لمراقبة المياه',
    department: 'مديرية بيئة بغداد',
    startDate: '15.01.2025',
    endDate: '22.12.205',
    status: 'متلكئ',
    statusVariant: 'destructive'
  },
  {
    id: 4,
    title: 'مشروع تجهيز محطات التحسس الاني لمراقبة المياه',
    department: 'مديرية بيئة بغداد',
    startDate: '15.01.2025',
    endDate: '22.12.205',
    status: 'منجز',
    statusVariant: 'success'
  },
  {
    id: 5,
    title: 'مشروع تجهيز محطات التحسس الاني لمراقبة المياه',
    department: 'مديرية بيئة بغداد',
    startDate: '15.01.2025',
    endDate: '22.12.205',
    status: 'قيد الانجاز',
    statusVariant: 'warning'
  },
  {
    id: 6,
    title: 'مشروع تجهيز محطات التحسس الاني لمراقبة المياه',
    department: 'مديرية بيئة بغداد',
    startDate: '15.01.2025',
    endDate: '22.12.205',
    status: 'متلكئ',
    statusVariant: 'destructive'
  },
  {
    id: 7,
    title: 'مشروع تجهيز محطات التحسس الاني لمراقبة المياه',
    department: 'مديرية بيئة بغداد',
    startDate: '15.01.2025',
    endDate: '22.12.205',
    status: 'منجز',
    statusVariant: 'success'
  },
  {
    id: 8,
    title: 'مشروع تجهيز محطات التحسس الاني لمراقبة المياه',
    department: 'مديرية بيئة بغداد',
    startDate: '15.01.2025',
    endDate: '22.12.205',
    status: 'قيد الانجاز',
    statusVariant: 'warning'
  }
]

const allProjects = ref(mockProjects)
const completedProjects = computed(() => 
  mockProjects.filter(p => p.status === 'منجز')
)
const inProgressProjects = computed(() => 
  mockProjects.filter(p => p.status === 'قيد الانجاز')
)
const delayedProjects = computed(() => 
  mockProjects.filter(p => p.status === 'متلكئ')
)

const mockUsers = [
  {
    id: 1,
    name: 'أ. دعاء الشيخلي',
    title: 'مديرة المشروع',
    avatar: '/img/avatar.png',
    isActive: true
  },
  {
    id: 2,
    name: 'أ. دعاء الشيخلي',
    title: 'مديرة المشروع',
    avatar: '/img/avatar.png',
    isActive: true
  },
  {
    id: 3,
    name: 'أ. دعاء الشيخلي',
    title: 'مديرة المشروع',
    avatar: '/img/avatar.png',
    isActive: false
  },
  {
    id: 4,
    name: 'أ. دعاء الشيخلي',
    title: 'مديرة المشروع',
    avatar: '/img/avatar.png',
    isActive: true
  },
  {
    id: 5,
    name: 'أ. دعاء الشيخلي',
    title: 'مديرة المشروع',
    avatar: '/img/avatar.png',
    isActive: true
  },
  {
    id: 6,
    name: 'أ. دعاء الشيخلي',
    title: 'مديرة المشروع',
    avatar: '/img/avatar.png',
    isActive: false
  },
  {
    id: 7,
    name: 'أ. دعاء الشيخلي',
    title: 'مديرة المشروع',
    avatar: '/img/avatar.png',
    isActive: false
  },  
  {
    id: 8,
    name: 'أ. دعاء الشيخلي',
    title: 'مديرة المشروع',
    avatar: '/img/avatar.png',
    isActive: false
  }
]
</script>

<style>
/* Add any custom styles here */
</style>
