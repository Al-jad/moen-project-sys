<template>
  <div
    class="cursor-pointer rounded-xl border border-border bg-background-surface p-8 shadow transition-all duration-300 hover:scale-[1.01] hover:bg-background-hover hover:shadow-md"
    @click="navigateToProjects"
  >
    <div class="flex items-center justify-between">
      <template v-if="loading">
        <div class="flex flex-col gap-2">
          <div class="h-4 w-20 rounded bg-border"></div>
          <div class="h-8 w-16 rounded bg-border"></div>
        </div>
        <div class="h-10 w-10 rounded-full bg-border"></div>
      </template>
      <template v-else>
        <div class="flex flex-col gap-2 text-right">
          <p class="text-sm text-foreground-muted">{{ title }}</p>
          <p class="text-2xl font-bold text-foreground-heading">{{ count }}</p>
        </div>
        <div :class="backgroundColorClass">
          <Icon :icon="icon" class="h-8 w-8" :class="iconColorClass" />
        </div>
      </template>
    </div>
  </div>
</template>

<script setup>
  import { Icon } from '@iconify/vue';
  import { computed } from 'vue';
  import { useRouter } from 'vue-router';

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
      validator: (value) => ['blue', 'green', 'yellow', 'red', 'gray'].includes(value),
    },
    icon: {
      type: String,
      required: true,
    },
    to: {
      type: String,
      default: '',
    },
    loading: {
      type: Boolean,
      default: false,
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
    gray: {
      bg: 'bg-gray-100 dark:bg-gray-900/20',
      icon: 'text-gray-600 dark:text-gray-400',
    },
  };

  const backgroundColorClass = computed(() => {
    return `p-3 rounded-full ${colorMap[props.color].bg}`;
  });

  const iconColorClass = computed(() => {
    return colorMap[props.color].icon;
  });

  const navigateToProjects = () => {
    if (props.to && !props.loading) {
      router.push(props.to);
    }
  };
</script>
