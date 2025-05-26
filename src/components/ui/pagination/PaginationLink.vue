<template>
  <Button
    variant="outline"
    :class="[
      'h-9 w-9',
      'data-[active=true]:bg-primary data-[active=true]:text-primary-foreground',
      isActive ? '!bg-primary !text-primary-foreground' : '',
    ]"
    :data-active="isActive"
  >
    <slot />
  </Button>
</template>

<script setup>
  import { Button } from '@/components/ui/button';

  defineProps({
    isActive: {
      type: Boolean,
      default: false,
    },
  });
</script>
