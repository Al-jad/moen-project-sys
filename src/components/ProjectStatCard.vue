<template>
  <div
    class="cursor-pointer rounded-xl border border-gray-100 bg-white p-8 shadow transition-all duration-300 hover:scale-[1.01] hover:bg-gray-50 hover:shadow-md dark:border-gray-700/50 dark:bg-gray-800/95 dark:shadow-gray-900/50 dark:hover:bg-gray-800"
    @click="router.push('/projects')"
  >
    <div class="flex items-center justify-between">
      <div class="flex flex-col gap-2 text-right">
        <p class="text-sm text-gray-500 dark:text-gray-300">{{ title }}</p>
        <p class="text-2xl font-bold text-gray-900 dark:text-white">{{ count }}</p>
      </div>
      <div :class="backgroundColorClass">
        <Icon :icon="icon" class="h-8 w-8" :class="iconColorClass" />
      </div>
    </div>
  </div>
</template>

<script setup>
  import { Icon } from '@iconify/vue';

  const router = useRouter();

  const props = defineProps({
    title: {
      type: String,
      required: true,
    },
    count: {
      type: [Number, String],
      required: true,
    },
    color: {
      type: String,
      default: 'blue',
      validator: (value) => ['blue', 'green', 'yellow', 'red'].includes(value),
    },
    icon: {
      type: String,
      required: true,
    },
  });

  const colorMap = {
    blue: {
      bg: 'bg-blue-100 dark:bg-blue-900/20',
      icon: 'text-blue-600 dark:text-blue-400',
    },
    green: {
      bg: 'bg-green-100 dark:bg-green-900/20',
      icon: 'text-green-600 dark:text-green-400',
    },
    yellow: {
      bg: 'bg-yellow-100 dark:bg-yellow-900/20',
      icon: 'text-yellow-600 dark:text-yellow-400',
    },
    red: {
      bg: 'bg-red-100 dark:bg-red-900/20',
      icon: 'text-red-600 dark:text-red-400',
    },
  };

  const backgroundColorClass = computed(() => {
    return `p-3 rounded-full ${colorMap[props.color].bg}`;
  });

  const iconColorClass = computed(() => {
    return colorMap[props.color].icon;
  });
</script>
