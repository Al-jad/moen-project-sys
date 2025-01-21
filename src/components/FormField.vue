<template>
  <div class="grid w-full gap-2">
    <Label class="text-right">{{ label }}</Label>
    <slot></slot>
  </div>
</template>

<script setup>
import { Label } from '@/components/ui/label';

defineProps({
  label: {
    type: String,
    required: true
  }
});
</script> 