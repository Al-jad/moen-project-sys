<template>
  <DefaultLayout>
    <main class="p-6 bg-gray-200 dark:bg-gray-900">
      <div class="flex items-center justify-between mb-6">
        <BackButton />
      </div>
      <div class="flex gap-6">
        <div class="flex flex-col items-center justify-center p-6 mb-6 bg-white rounded-lg dark:bg-gray-800 w-fit">
          <img
            src="/img/avatar.png"
            alt="User Avatar"
            class="object-cover w-20 h-20 mb-3 rounded-full"
          />
          <h1 class="mb-1 text-lg font-medium dark:text-gray-100">أ. دعاء الشيخلي</h1>
          <div class="flex flex-col items-center mb-2 text-sm text-gray-500 dark:text-gray-400">
            <span>شعبة المشاريع - قسم المشاريع - دائرة التخطيط</span>
            <span>وزارة البيئة</span>
          </div>
          <PrimaryButton variant="outline" class="rounded-full">مدير مشروع</PrimaryButton>
        </div>

        <div class="flex-1 p-6 mb-6 bg-white rounded-lg dark:bg-gray-800">
          <div class="flex items-center justify-between">
            <h2 class="mb-4 text-xl font-bold dark:text-gray-100">سجل الاحداث</h2>
            <PrimaryButton variant="ghost">عرض سجل التعديلات</PrimaryButton>
          </div>
          <Timeline :events="events" />
        </div>
      </div>
      <div class="p-6 mb-6 bg-white rounded-lg dark:bg-gray-800">
        <div class="flex items-center justify-between">
          <h2 class="mb-4 text-xl font-bold dark:text-gray-100">المشاريع</h2>
          <PrimaryButton variant="ghost">عرض كل المشاريع</PrimaryButton>
        </div>
        <div class="grid grid-cols-3 gap-4">
          <ProjectCard
            v-for="project in projects"
            :key="project.id"
            :id="project.id"
            :title="project.title"
            :department="project.location"
            :start-date="project.startDate"
            :end-date="project.startDate"
            :status="project.status"
            :status-variant="
              project.status === 'منجز'
                ? 'success'
                : project.status === 'متلكئ'
                  ? 'destructive'
                  : 'warning'
            "
            container-class="border border-gray-200 dark:border-gray-700"
            :show-actions="false"
          />
        </div>
      </div>
    </main>
  </DefaultLayout>
</template>
<script setup>
  import { ref } from 'vue';
  import DefaultLayout from '@/layouts/DefaultLayout.vue';
  import BackButton from '@/components/BackButton.vue';
  import Timeline from '@/components/Timeline.vue';
  import ProjectCard from '@/components/ProjectCard.vue';
  const events = ref([
    {
      id: 1,
      date: '19 يناير 2024',
      time: '5:50 PM - 5:55 PM',
      description:
        'مشروع تجهيز مضخات لمحطة اسالة المياه في الرشيد / تعديل / اضافة / مشروع جديد وضعت فيه الاولى في محافظة كربلاء العراق',
    },
    {
      id: 2,
      date: '19 يناير 2024',
      time: '5:50 PM - 5:55 PM',
      description: 'تعديل / اضافة / مشروع تجهيز اجهزة وعدات لمحطة الهواء في محافظة كربلاء العراق',
    },
    {
      id: 3,
      date: '19 يناير 2024',
      time: '5:50 PM - 5:55 PM',
      description: 'تعديل / اضافة / مشروع تجهيز اجهزة وعدات لمحطة الهواء في محافظة كربلاء العراق',
    },
  ]);
  const projects = ref([
    {
      id: 1,
      title: 'مشروع تجهيز محطات الخمس الثاني لمراقبة البيئة',
      location: 'مديرية بيئة بغداد',
      startDate: '22.12.2025',
      status: 'متلكئ',
    },
    {
      id: 2,
      title: 'مشروع تجهيز محطات الخمس الثاني لمراقبة البيئة',
      location: 'مديرية بيئة بغداد',
      startDate: '16.01.2025',
      status: 'قيد الانجاز',
    },
    {
      id: 3,
      title: 'مشروع تجهيز محطات الخمس الثاني لمراقبة البيئة',
      location: 'مديرية بيئة بغداد',
      startDate: '22.12.2025',
      status: 'منجز',
    },
    {
      id: 4,
      title: 'مشروع تجهيز محطات الخمس الثاني لمراقبة البيئة',
      location: 'مديرية بيئة بغداد',
      startDate: '22.12.2025',
      status: 'منجز',
    },
  ]);
</script>
