<template>
  <div>
    <PrimaryButton variant="ghost" @click="$router.back()" class="flex items-center gap-2">
      <Icon icon="lucide:arrow-right" class="h-4 w-4" />
      رجوع
    </PrimaryButton>
  </div>
</template>

<script setup>
  import { Icon } from '@iconify/vue';
</script>
