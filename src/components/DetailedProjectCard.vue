<template>
  <div class="bg-white rounded-xl">
    <div class="grid grid-cols-3 gap-6 p-6">
      <div class="flex col-span-2">
        <div class="grid w-full grid-cols-2 gap-y-4">
          <h3 class="text-sm font-medium text-gray-500">اسم المشروع</h3>
          <p class="text-lg font-medium text-gray-900">{{ title }}</p>
          
          <h3 class="text-sm font-medium text-gray-500">فترة التنفيذ</h3>
          <p class="text-sm font-medium">{{ duration }} شهر</p>
          
          <h3 class="text-sm font-medium text-gray-500">تاريخ المباشرة</h3>
          <p class="text-sm font-medium">{{ startDate }}</p>
          
          <h3 class="text-sm font-medium text-gray-500">الجهة المستفيدة</h3>
          <p class="text-sm font-medium">{{ department }}</p>
        </div>
      </div>
      <div class="flex flex-col items-center justify-center p-4 after:rounded-xl">
        <h3 class="mb-6 text-base font-semibold text-gray-700">حالة المشروع</h3>
        <div class="relative w-36 h-36">
          <div class="flex items-center justify-center w-full h-full">
            <div class="absolute w-full h-full">
              <svg class="w-full h-full transform -rotate-90">
                <circle cx="72" cy="72" r="66" 
                  stroke="#f3f4f6"
                  stroke-width="10" 
                  fill="none" 
                />
                <circle
                  cx="72"
                  cy="72"
                  r="66"
                  :stroke="statusColor"
                  stroke-width="10"
                  fill="none"
                  :stroke-dasharray="circumference"
                  :stroke-dashoffset="circumference"
                  class="transition-all duration-700 ease-out animate-progress-fill"
                />
              </svg>
            </div>
            <div class="flex flex-col items-center justify-center space-y-2 text-center">
              <span class="text-4xl font-bold" :class="statusTextColor">
                {{ progress }}%
              </span>
              <span class="px-3 py-1 text-sm font-medium rounded-full" 
                :class="[statusTextColor, statusBgColor]"
              >
                {{ statusText }}
              </span>
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
      <Button @click="router.push({ name: 'project-details', params: { id }})" variant="outline" class="p-5 text-sm font-medium text-gray-900 border-gray-900">
        عرض المشروع
      </Button>
    </div>
  </div>
</template>

<script setup>
  import { computed } from 'vue';
  import { Button } from '@/components/ui/button';
  import { useRouter } from 'vue-router';

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
    startDate: String,
    id: {
      type: [String, Number],
      required: true
    }
  });

  const router = useRouter();

  const circumference = 2 * Math.PI * 66;
  const dashOffset = computed(() => {
    return circumference - (props.progress / 100) * circumference;
  });

  const statusColor = computed(() => {
    if (props.progress >= 90) {
      return '#22c55e';
    } else if (props.progress >= 50) {
      return '#eab308';
    } else {
      return '#ef4444';
    }
  });

  const statusText = computed(() => {
    if (props.progress >= 90) {
      return 'منجز';
    } else if (props.progress >= 50) {
      return 'قيد الانجاز';
    } else {
      return 'متلكئ';
    }
  });

  const statusTextColor = computed(() => {
    if (props.progress >= 90) {
      return 'text-green-600';
    } else if (props.progress >= 50) {
      return 'text-yellow-600';
    } else {
      return 'text-red-600';
    }
  });

  const statusBgColor = computed(() => {
    if (props.progress >= 90) {
      return 'bg-green-100';
    } else if (props.progress >= 50) {
      return 'bg-yellow-100';
    } else {
      return 'bg-red-100';
    }
  });
</script>

<style>
@keyframes fillProgress {
  from {
    stroke-dashoffset: 414.72; /* circumference value */
  }
  to {
    stroke-dashoffset: v-bind(dashOffset);
  }
}

.animate-progress-fill {
  animation: fillProgress 1s ease-out forwards;
}
</style>
