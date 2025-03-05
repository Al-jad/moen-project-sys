<template>
  <DefaultLayout>
    <main class="bg-gray-200 p-4 dark:bg-darkmode">
      <div class="container mx-auto p-4">
        <div class="mb-8 flex flex-col items-center justify-between md:flex-row">
          <div class="flex items-center gap-4">
            <BackToMainButton />
            <h1 class="text-right text-xl font-bold"> عرض المشاريع على الخارطة </h1>
          </div>
        </div>
        <div class="rounded-lg p-4 shadow-sm">
          <div class="mb-4 flex flex-wrap items-center gap-6 p-4">
            <PrimaryButton
              size="lg"
              :variant="selected === 'all' ? 'primary' : 'outline'"
              icon="lucide:layout-grid"
              @click="selected = 'all'"
            >
              عرض الكل ( 400 )
            </PrimaryButton>
            <PrimaryButton
              size="lg"
              :variant="selected === 'completed' ? 'primary' : 'outline'"
              icon="lucide:check-circle"
              @click="selected = 'completed'"
            >
              المنجزة (100)
            </PrimaryButton>
            <PrimaryButton
              size="lg"
              :variant="selected === 'inProgress' ? 'primary' : 'outline'"
              icon="lucide:loader"
              @click="selected = 'inProgress'"
            >
              قيد التنفيذ (100)
            </PrimaryButton>
            <PrimaryButton
              size="lg"
              :variant="selected === 'delayed' ? 'primary' : 'outline'"
              icon="lucide:alert-circle"
              @click="selected = 'delayed'"
            >
              المتلكئة ( 100 )
            </PrimaryButton>
            <PrimaryButton
              size="lg"
              :variant="selected === 'cancelled' ? 'primary' : 'outline'"
              icon="lucide:x-circle"
              @click="selected = 'cancelled'"
            >
              الملغاة ( 100 )
            </PrimaryButton>
          </div>
          <Map class="mb-4 h-[600px] w-full rounded-lg" :is-map-page="true" />
        </div>
      </div>
    </main>
  </DefaultLayout>
</template>

<script setup>
  import BackToMainButton from '@/components/BackToMainButton.vue';
  import Map from '@/components/Map.vue';
  import PrimaryButton from '@/components/PrimaryButton.vue';
  import DefaultLayout from '@/layouts/DefaultLayout.vue';

  const selected = ref('all');
</script>
