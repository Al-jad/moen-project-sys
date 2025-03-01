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
          <Icon icon="lucide:check" class="h-4 w-4 text-green-500" />
          <p
            class="text-sm"
            :class="task.status === 'مكتملة' ? 'font-bold text-green-500' : 'text-none'"
          >
            {{ task.status }}
          </p>
        </div>
        <Button
          variant="ghost"
          class="flex items-center gap-2 rounded-lg border border-blue-600 p-1 px-2 text-blue-600"
          @click="showStatusModal = true"
        >
          <Icon icon="lucide:refresh-cw" class="h-4 w-4" />
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
  import { Button } from '@/components/ui/button';
  import { Icon } from '@iconify/vue';
  import { ref } from 'vue';
  import ChangeStatusModal from './ChangeStatusModal.vue';

  const props = defineProps({
    task: {
      type: Object,
      required: true,
    },
  });

  const emit = defineEmits(['update:task']);

  const showStatusModal = ref(false);

  const handleStatusChange = ({ status, notes }) => {
    emit('update:task', {
      ...props.task,
      status,
      description: notes || props.task.description,
    });
  };
</script>
