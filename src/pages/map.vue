<template>
  <DefaultLayout>
    <main class="p-4 bg-gray-200">
      <div class="container p-4 mx-auto">
        <div class="flex flex-col items-center justify-between mb-8 md:flex-row">
          <h1 class="text-xl font-bold text-right"> عرض المشاريع على الخارطة </h1>
        </div>
        <div class="p-4 bg-white rounded-lg shadow-sm">
          <div class="flex items-center gap-6 p-4 mb-4">
            <PrimaryButton >
              عرض الكل ( 400 )
            </PrimaryButton>
            <PrimaryButton variant="outline" >
              المنجزة (100)
            </PrimaryButton>
            <PrimaryButton variant="outline" >
              قيد التنفيذ (100)
            </PrimaryButton>
            <PrimaryButton variant="outline">
              المتلكئة ( 100 )
            </PrimaryButton>
            <PrimaryButton variant="outline">
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
  import PrimaryButton from '@/components/PrimaryButton.vue'
  import Map from '@/components/Map.vue';
  import DefaultLayout from '@/layouts/DefaultLayout.vue';
</script>
