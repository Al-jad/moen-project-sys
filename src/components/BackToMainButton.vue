<template>
  <div>
    <PrimaryButton variant="link" @click="$router.push('/')" class="">
      <Icon icon="lucide:arrow-right" class="h-4 w-4" />
      الرئيسية
    </PrimaryButton>
  </div>
</template>

<script setup>
  import { Icon } from '@iconify/vue';
</script>
