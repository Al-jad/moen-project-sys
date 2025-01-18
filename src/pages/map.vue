<template>
  <DefaultLayout>
    <main class="p-4 bg-gray-200">
      <div class="container p-4 mx-auto">
        <div class="flex flex-col items-center justify-between mb-8 md:flex-row">
          <h1 class="text-xl font-bold text-right"> عرض المشاريع على الخارطة </h1>
        </div>
        <div class="p-4 bg-white rounded-lg shadow-sm">
          <div class="flex items-center gap-6 p-4 mb-4">
            <Button variant="primary" class="px-5 py-2 text-white rounded-lg bg-slate-700">
              عرض الكل ( 400 )
            </Button>
            <Button variant="outline" class="px-5 py-2 border-2 rounded-lg text-slate-700 border-slate-700">
              المنجزة (100)
            </Button>
            <Button variant="outline" class="px-5 py-2 border-2 rounded-lg text-slate-700 border-slate-700">
              قيد التنفيذ (100)
            </Button>
            <Button variant="outline" class="px-5 py-2 border-2 rounded-lg text-slate-700 border-slate-700">
              المتلكئة ( 100 )
            </Button>
            <Button variant="outline" class="px-5 py-2 border-2 rounded-lg text-slate-700 border-slate-700">
              الملغاة ( 100 )
            </Button>
          </div>
          <Map class="h-[600px] w-full rounded-lg mb-4" :is-map-page="true" />
        </div>
      </div>
    </main>
  </DefaultLayout>
</template>

<script setup>
  import Map from '@/components/Map.vue';
  import DefaultLayout from '@/layouts/DefaultLayout.vue';
</script>
