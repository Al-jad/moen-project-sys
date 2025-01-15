<template>
  <DefaultLayout>
    <main class="bg-white rounded-lg shadow-sm p-6">
      <div class="flex items-center justify-between mb-6">
        <button @click="$router.back()" class="text-gray-500 hover:text-gray-700">
          رجوع
        </button>
      </div>

      <div class="space-y-6">
        <!-- Project Header -->
        <div class="flex justify-between items-start">
          <div>
            <h1 class="text-2xl font-bold mb-2">{{ project.title }}</h1>
            <p class="text-gray-500">الرقم المرجعي للمشروع: {{ project.id }}</p>
          </div>
        </div>

        <!-- Project Details -->
        <div class="grid grid-cols-2 gap-6">
          <div class="space-y-4">
            <div>
              <h3 class="text-gray-500 mb-1">وصف المشروع</h3>
              <p>{{ project.description }}</p>
            </div>
            <div>
              <h3 class="text-gray-500 mb-1">الجهة المستفيدة</h3>
              <p>{{ project.beneficiary }}</p>
            </div>
            <div>
              <h3 class="text-gray-500 mb-1">حالة المشروع</h3>
              <p>{{ project.status }}</p>
            </div>
          </div>

          <div class="space-y-4">
            <div>
              <h3 class="text-gray-500 mb-1">نسبة الانجاز</h3>
              <div class="w-full bg-gray-200 rounded-full h-2.5">
                <div 
                  class="bg-green-600 h-2.5 rounded-full" 
                  :style="{ width: project.progress + '%' }"
                ></div>
              </div>
              <p class="mt-1 text-sm">{{ project.progress }}%</p>
            </div>
            <div>
              <h3 class="text-gray-500 mb-1">كلفة المشروع</h3>
              <p>{{ formatCurrency(project.cost) }} دينار عراقي</p>
            </div>
          </div>
        </div>

        <!-- Notes -->
        <div v-if="project.notes">
          <h3 class="text-gray-500 mb-2">ملاحظات</h3>
          <p class="text-sm">{{ project.notes }}</p>
        </div>
      </div>
    </main>
  </DefaultLayout>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import DefaultLayout from '@/layouts/DefaultLayout.vue';

const route = useRoute();
const project = ref({
  id: '4457821',
  title: 'مشروع تجهيز مضخات لمحطة اسالة المياه في الرشيد',
  description: 'المشروع يتكون من عدة سطور. المشروع يتكون من عدة سطور',
  beneficiary: 'دائرة حماية وتحسين البيئة في منطقة الوسط',
  status: 'قيد التنفيذ',
  progress: 76,
  cost: 1650000000,
  notes: 'هذه ملاحظات خاصة بالمشروع. نقطة اضافية لمتابعة المشروع في برنامج ادارة المشاريع'
});

const formatCurrency = (value) => {
  return new Intl.NumberFormat('ar-IQ').format(value);
};

onMounted(() => {
  // Here you would typically fetch the project details using the route.params.id
  console.log('Project ID:', route.params.id);
});
</script> 