<template>
  <DefaultLayout>
    <main class="p-6 bg-gray-50">
      <div class="flex items-center justify-between mb-6">
        <div class="flex items-center gap-4">
          <Select v-model="selectedProject">
            <SelectTrigger class="flex flex-row-reverse w-[200px]">
              <SelectValue placeholder="اختر المشروع" dir="rtl">
                <div class="flex items-center gap-2">
                  <Folder class="w-4 h-4 text-gray-400" />
                  <span>{{ selectedProject === 'all' ? 'اختر المشروع' : `مشروع ${selectedProject}` }}</span>
                </div>
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">الكل</SelectItem>
              <SelectItem value="1">مشروع A</SelectItem>
              <SelectItem value="2">مشروع B</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <h1 class="text-xl font-bold">
          قائمة المهام
        </h1>
      </div>

      <!-- Tasks Grid -->
      <div class="space-y-8">
        <!-- This Week's Tasks -->
        <div>
          <h2 class="mb-4 text-lg font-semibold text-right">هذا الأسبوع</h2>
          <div class="grid gap-4">
            <div 
              v-for="task in thisWeekTasks" 
              :key="task.id" 
              class="p-4 transition-colors bg-white border rounded-lg"
              :class="{'border-green-500 border-2': task.status === 'مكتملة'}"
            >
              <TaskCard :task="task" />
            </div>
          </div>
        </div>

        <!-- Older Tasks -->
        <div>
          <h2 class="mb-4 text-lg font-semibold text-right">السابقة</h2>
          <div class="grid gap-4">
            <div 
              v-for="task in olderThanWeekTasks" 
              :key="task.id" 
              class="p-4 transition-colors bg-white border rounded-lg"
              :class="{'border-green-500 border-2': task.status === 'مكتملة'}"
            >
              <TaskCard :task="task" />
            </div>
          </div>
        </div>
      </div>
    </main>
  </DefaultLayout>
</template>

<script setup>
import { ref, computed } from 'vue'
import DefaultLayout from '@/layouts/DefaultLayout.vue'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Folder } from 'lucide-vue-next'
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select'
import TaskCard from '@/components/TaskCard.vue'

const selectedProject = ref('all')

const tasks = ref([
  {
    id: 1,
    projectName: 'مشروع تجهيز محطات التحسس الاني لمراقبة المياه في محطة اسالة المياه في السيدية',
    type: 'اجتماع طارئ',
    notes: 'للتنسيق لحضور اجتماع في اسرع فرصة',
    date: new Date().toLocaleDateString('ar-EG'),
    time: '10:22',
    sender: 'وكيل الوزير',
    status: 'مكتملة',
    description: 'تم تحديد الاجتماع مع السادة موظفي القسم بتاريخ .....'
  },
  {
    id: 2,
    projectName: 'مشروع تجهيز محطات التحسس الاني لمراقبة المياه في محطة اسالة المياه في السيدية',
    type: 'متابعة',
    notes: 'متابعة تقدم العمل في المشروع',
    date: (() => {
      const tomorrow = new Date()
      tomorrow.setDate(tomorrow.getDate() + 1)
      return tomorrow.toLocaleDateString('ar-EG')
    })(),
    time: '11:00',
    sender: 'مدير المشروع',
    status: 'قيد الانتظار',
    description: 'اجتماع متابعة لمناقشة التقدم في تنفيذ المشروع والتحديات'
  },
  {
    id: 3,
    projectName: 'مشروع تجهيز محطات التحسس الاني لمراقبة المياه في محطة اسالة المياه في السيدية',
    type: 'تقرير',
    notes: 'تقديم تقرير الأداء الأسبوعي',
    date: (() => {
      const dayAfterTomorrow = new Date()
      dayAfterTomorrow.setDate(dayAfterTomorrow.getDate() + 2)
      return dayAfterTomorrow.toLocaleDateString('ar-EG')
    })(),
    time: '14:30',
    sender: 'رئيس القسم',
    status: 'قيد الاجراء',
    description: 'إعداد وتقديم تقرير الأداء الأسبوعي للمشروع'
  },
  {
    id: 4,
    projectName: 'مشروع تجهيز محطات التحسس الاني لمراقبة المياه في محطة اسالة المياه في السيدية',
    type: 'اجتماع سابق',
    notes: 'اجتماع من الأسبوع الماضي',
    date: '12.08.2024',
    time: '10:22',
    sender: 'وكيل الوزير',
    status: 'مكتملة',
    description: 'تم عقد الاجتماع وتوثيق النتائج'
  }
])

const thisWeekTasks = computed(() => {
  const today = new Date()
  const startOfWeek = new Date(today)
  startOfWeek.setDate(today.getDate() - today.getDay()) // Start of current week (Sunday)
  const endOfWeek = new Date(today) 
  endOfWeek.setDate(startOfWeek.getDate() + 6) // End of current week (Saturday)

  return tasks.value.filter(task => {
    const taskDate = new Date(task.date.split('.').reverse().join('-'))
    return taskDate >= startOfWeek && taskDate <= endOfWeek
  })
})

const olderThanWeekTasks = computed(() => {
  const today = new Date()
  const startOfWeek = new Date(today)
  startOfWeek.setDate(today.getDate() - today.getDay()) // Start of current week

  return tasks.value.filter(task => {
    const taskDate = new Date(task.date.split('.').reverse().join('-'))
    return taskDate < startOfWeek
  })
})
</script>