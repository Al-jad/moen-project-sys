<template>
  <div>
    <PrimaryButton icon="lucide:arrow-right" variant="link" @click="$router.push('/')" class="">
      الرئيسية
    </PrimaryButton>
  </div>
</template>

<script setup>
  import { Icon } from '@iconify/vue';
</script>
