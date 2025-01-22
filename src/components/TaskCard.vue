<template>
  <div class="grid gap-2 p-4">
    <!-- Project Info -->
    <div class="grid grid-cols-[200px,1fr] gap-8">
      <div class="text-sm text-gray-500">اسم المشروع</div>
      <div class="font-medium">{{ task.projectName }}</div>
    </div>

    <!-- Meeting Type -->
    <div class="grid grid-cols-[200px,1fr] gap-8">
      <div class="text-sm text-gray-500">نوع المهمة</div>
      <div class="font-medium">{{ task.type }}</div>
    </div>

    <!-- Notes -->
    <div class="grid grid-cols-[200px,1fr] gap-8">
      <div class="text-sm text-gray-500">الملاحظات</div>
      <div class="font-medium">{{ task.notes }}</div>
    </div>

    <!-- Date & Time -->
    <div class="grid grid-cols-[200px,1fr] gap-8">
      <div class="text-sm text-gray-500">تاريخ الارسال</div>
      <div class="flex items-center gap-2">
        <span>{{ task.date }}</span>
        <span>{{ task.time }}</span>
      </div>
    </div>

    <!-- Sender -->
    <div class="grid grid-cols-[200px,1fr] gap-8">
      <div class="text-sm text-gray-500">الطرف المرسل</div>
      <div class="font-medium">{{ task.sender }}</div>
    </div>

    <!-- Status -->
    <div class="grid grid-cols-[200px,1fr] gap-8">
      <div class="text-sm text-gray-500">حالة المهمة</div>
      <div class="flex items-center gap-2">
        <div class="flex items-center gap-2">
          <Check v-if="task.status === 'مكتملة'" class="w-4 h-4 font-bold text-green-500 border border-green-500 rounded-full" />
          <p class="text-sm" :class="task.status === 'مكتملة' ? 'text-green-500 font-bold' : 'text-none'">
            {{ task.status }}
          </p>
        </div>
        <Button 
          variant="ghost" 
          class="flex items-center gap-2 p-1 px-2 text-blue-600 border border-blue-600 rounded-lg"
          @click="showStatusModal = true"
        >
          <RefreshCw class="w-4 h-4" />
          تغيير الحالة
        </Button>
      </div>
    </div>

    <!-- Note -->
    <div class="grid grid-cols-[200px,1fr] gap-8">
      <div class="text-sm text-gray-500">الملاحظة</div>
      <div>{{ task.description }}</div>
    </div>

    <!-- Status Change Modal -->
    <ChangeStatusModal 
      v-model:open="showStatusModal"
      :current-status="task.status"
      @status-changed="handleStatusChange"
    />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { Check, RefreshCw } from 'lucide-vue-next'
import { Button } from '@/components/ui/button'
import ChangeStatusModal from './ChangeStatusModal.vue'

const props = defineProps({
  task: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['update:task'])

const showStatusModal = ref(false)

const handleStatusChange = ({ status, notes }) => {
  emit('update:task', {
    ...props.task,
    status,
    description: notes || props.task.description
  })
}
</script> 