<template>
  <DefaultLayout>
    <main class="p-4 bg-gray-200 dark:bg-darkmode">
      <div class="container p-4 mx-auto">
        <div class="flex flex-col items-center justify-between mb-8 md:flex-row">
          <div class="flex items-center gap-4">
            <BackToMainButton />
          <h1 class="text-xl font-bold text-right"> عرض المشاريع على الخارطة </h1>
          </div>
        </div>
        <div class="p-4 rounded-lg shadow-sm">
          <div class="flex items-center gap-6 p-4 mb-4">
            <PrimaryButton size="lg" :variant="selected === 'all' ? 'primary' : 'outline'">
              عرض الكل ( 400 )
            </PrimaryButton>
            <PrimaryButton size="lg" :variant="selected === 'completed' ? 'primary' : 'outline'">
              المنجزة (100)
            </PrimaryButton>
            <PrimaryButton size="lg" :variant="selected === 'inProgress' ? 'primary' : 'outline'">
              قيد التنفيذ (100)
            </PrimaryButton>
            <PrimaryButton size="lg" :variant="selected === 'delayed' ? 'primary' : 'outline'">
              المتلكئة ( 100 )
            </PrimaryButton>
            <PrimaryButton size="lg" :variant="selected === 'cancelled' ? 'primary' : 'outline'">
              الملغاة ( 100 )
            </PrimaryButton>
          </div>
          <Map class="h-[600px] w-full rounded-lg mb-4" :is-map-page="true" />
        </div>
      </div>
    </main>
  </DefaultLayout>
</template>

<script setup>
  import BackToMainButton from '@/components/BackToMainButton.vue';
  import PrimaryButton from '@/components/PrimaryButton.vue'
  import Map from '@/components/Map.vue';
  import DefaultLayout from '@/layouts/DefaultLayout.vue';
  import { ref } from 'vue';

  const selected = ref('all');
</script>
