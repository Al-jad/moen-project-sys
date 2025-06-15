<template>
  <div>
    <PrimaryButton icon="lucide:arrow-right" variant="ghost" @click="$router.back()" class="flex items-center gap-2">
      رجوع
    </PrimaryButton>
  </div>
</template>

<script setup>
  import { Icon } from '@iconify/vue';
</script>
