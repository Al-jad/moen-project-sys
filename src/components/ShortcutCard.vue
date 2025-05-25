<template>
  <div
    class="flex items-center justify-between rounded-xl border border-border bg-background-surface p-8 shadow transition-all duration-300 hover:scale-[1.01] hover:bg-background-hover hover:shadow-md"
    :class="{ 'cursor-pointer': to && !loading }"
    @click="handleClick"
  >
    <template v-if="loading">
      <div class="h-4 w-32 rounded bg-border"></div>
      <div class="h-8 w-8 rounded-full bg-border"></div>
    </template>
    <template v-else>
      <span class="text-sm font-medium text-foreground-body">{{ title }}</span>
      <div class="p-2">
        <Icon
          :icon="icon"
          class="h-12 w-12 rounded-full p-2"
          :class="[colorMap[color].bg, colorMap[color].icon]"
        />
      </div>
    </template>
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
    icon: {
      type: String,
      required: true,
    },
    to: {
      type: String,
      default: '',
    },
    color: {
      type: String,
      default: 'sky',
      validator: (value) =>
        ['sky', 'blue', 'green', 'yellow', 'red', 'purple', 'pink'].includes(value),
    },
    loading: {
      type: Boolean,
      default: false,
    },
  });

  const colorMap = {
    sky: {
      bg: 'bg-sky-100 dark:bg-sky-500/20',
      icon: 'text-sky-600 dark:text-sky-300',
    },
    blue: {
      bg: 'bg-blue-100 dark:bg-blue-500/20',
      icon: 'text-blue-600 dark:text-blue-300',
    },
    green: {
      bg: 'bg-green-100 dark:bg-green-500/20',
      icon: 'text-green-600 dark:text-green-300',
    },
    yellow: {
      bg: 'bg-yellow-100 dark:bg-yellow-500/20',
      icon: 'text-yellow-600 dark:text-yellow-300',
    },
    red: {
      bg: 'bg-red-100 dark:bg-red-500/20',
      icon: 'text-red-600 dark:text-red-300',
    },
    purple: {
      bg: 'bg-purple-100 dark:bg-purple-500/20',
      icon: 'text-purple-600 dark:text-purple-300',
    },
    pink: {
      bg: 'bg-pink-100 dark:bg-pink-500/20',
      icon: 'text-pink-600 dark:text-pink-300',
    },
  };

  const handleClick = () => {
    if (props.to && !props.loading) {
      router.push(props.to);
    }
  };
</script>
