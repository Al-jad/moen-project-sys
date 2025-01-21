<template>
  <div 
    class="bg-white dark:bg-gray-800/95 hover:shadow-md hover:scale-[1.01] transition-all duration-300 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700/50 shadow-sm dark:shadow-gray-900/50" 
    @click="$router.push(`/projects/${id}`)"
  >
    <div class="grid grid-cols-3 gap-3 p-6">
      <div class="flex col-span-2">
        <div class="grid w-full grid-cols-2 gap-y-0">
          <h3 class="text-sm font-medium text-gray-500 dark:text-gray-400">اسم المشروع</h3>
          <p class="text-lg font-medium text-gray-900 dark:text-white">{{ title }}</p>
          
          <h3 class="text-sm font-medium text-gray-500 dark:text-gray-400">فترة التنفيذ</h3>
          <p class="text-sm font-medium text-gray-700 dark:text-gray-200">{{ duration }} شهر</p>
          
          <h3 class="text-sm font-medium text-gray-500 dark:text-gray-400">تاريخ المباشرة</h3>
          <p class="text-sm font-medium text-gray-700 dark:text-gray-200">{{ startDate }}</p>
          
          <h3 class="text-sm font-medium text-gray-500 dark:text-gray-400">الجهة المستفيدة</h3>
          <p class="text-sm font-medium text-gray-700 dark:text-gray-200">{{ department }}</p>
        </div>
      </div>
      <div class="flex flex-col items-center justify-center p-4 after:rounded-xl">
        <div class="relative w-36 h-36">
          <div class="flex items-center justify-center w-full h-full">
            <div class="absolute w-full h-full">
              <svg class="w-full h-full transform -rotate-90">
                <circle cx="72" cy="72" r="66" 
                  class="stroke-gray-100 dark:stroke-gray-700"
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
                  class="transition-all duration-[2500ms] ease-out hover:[stroke-dashoffset:0] animate-progress-fill"
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
      return 'text-green-600 dark:text-green-500';
    } else if (props.progress >= 50) {
      return 'text-yellow-600 dark:text-yellow-500';
    } else {
      return 'text-red-600 dark:text-red-500';
    }
  });

  const statusBgColor = computed(() => {
    if (props.progress >= 90) {
      return 'bg-green-100 dark:bg-green-900/30';
    } else if (props.progress >= 50) {
      return 'bg-yellow-100 dark:bg-yellow-900/30';
    } else {
      return 'bg-red-100 dark:bg-red-900/30';
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
