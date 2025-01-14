<template>
  <div class="bg-white rounded-xl">
    <div class="grid grid-cols-3 gap-6 p-6">
      <div class="col-span-2 space-y-6">
        <div class="grid grid-cols-2 gap-4">
          <div class="space-y-2">
            <h3 class="text-sm text-gray-500">اسم المشروع</h3>
            <p class="text-lg font-medium text-gray-900">{{ title }}</p>
          </div>

          <div class="space-y-2">
            <h3 class="text-sm text-gray-500">تفاصيل المشروع</h3>
            <p class="text-sm font-medium text-gray-900">
              {{ title }} في محطة اسالة المياه في السيدية
            </p>
          </div>
        </div>
        <div class="grid grid-cols-2 gap-4">
          <div class="space-y-1">
            <h3 class="text-sm text-gray-500">الجهة المستفيدة</h3>
            <p class="text-sm font-medium">{{ department }}</p>
          </div>
          <div class="space-y-2">
            <h3 class="text-sm text-gray-500">الفترة</h3>
            <p class="text-sm font-medium">{{ duration }} شهر</p>
          </div>
        </div>
      </div>
      <div class="flex flex-col items-center justify-center">
        <h3 class="mb-4 text-sm font-medium text-gray-700">حالة المشروع</h3>
        <div class="relative w-32 h-32">
          <div class="flex items-center justify-center w-full h-full">
            <div class="absolute w-full h-full">
              <svg class="w-full h-full transform -rotate-90">
                <circle cx="64" cy="64" r="60" stroke="#f3f4f6" stroke-width="8" fill="none" />
                <circle
                  cx="64"
                  cy="64"
                  r="60"
                  :stroke="statusColor"
                  stroke-width="8"
                  fill="none"
                  :stroke-dasharray="circumference"
                  :stroke-dashoffset="dashOffset"
                />
              </svg>
            </div>
            <div class="flex flex-col items-center justify-center text-center">
              <span class="text-3xl font-bold">{{ progress }}%</span>
              <span class="text-sm" :class="statusTextColor">{{ statusText }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Action Buttons -->
    <div class="grid items-center grid-cols-2 gap-4 px-4 py-6">
      <Button
        variant="primary"
        class="p-5 text-sm font-medium text-white rounded-lg bg-slate-700 hover:bg-slate-700/90"
      >
        تعديل المشروع
      </Button>
      <Button variant="outline" class="p-5 text-sm font-medium text-gray-900 border-gray-900">
        عرض المشروع
      </Button>
    </div>
  </div>
</template>

<script setup>
  import { computed } from 'vue';
  import { Button } from '@/components/ui/button';

  const props = defineProps({
    title: String,
    department: String,
    duration: String,
    progress: {
      type: Number,
      default: 100,
    },
    status: {
      type: String,
      default: 'منجز',
    },
  });

  const circumference = 2 * Math.PI * 60;
  const dashOffset = computed(() => {
    return circumference - (props.progress / 100) * circumference;
  });

  const statusColor = computed(() => {
    switch (props.status) {
      case 'منجز':
        return '#22c55e';
      case 'قيد الانجاز':
        return '#eab308';
      case 'متلكئ':
        return '#ef4444';
      default:
        return '#22c55e';
    }
  });

  const statusText = computed(() => {
    switch (props.status) {
      case 'منجز':
        return 'منجز';
      case 'قيد الانجاز':
        return 'قيد التنفيذ';
      case 'متلكئ':
        return 'متلكئ';
      default:
        return 'منجز';
    }
  });

  const statusTextColor = computed(() => {
    switch (props.status) {
      case 'منجز':
        return 'text-green-600';
      case 'قيد الانجاز':
        return 'text-yellow-600';
      case 'متلكئ':
        return 'text-red-600';
      default:
        return 'text-green-600';
    }
  });
</script>
