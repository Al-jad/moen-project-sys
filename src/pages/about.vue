<template>
  <DefaultLayout>
    <main class="min-h-screen bg-gray-100 p-6 dark:bg-gray-900">
      <div
        class="flex flex-col gap-4 rounded-lg bg-white p-6 shadow-sm transition-colors dark:bg-gray-800/50 dark:shadow-gray-900/10"
      >
        <div class="mb-8">
          <h1 class="mb-4 text-2xl font-bold text-gray-900 dark:text-white">حول النظام</h1>
          <p class="mb-4 text-gray-700 dark:text-gray-300">
            نظام إدارة المشاريع - دائرة التخطيط والمتابعة وزارة البيئة
          </p>
          <p class="mb-4 text-gray-600 dark:text-gray-400">
            هذا النظام مقدم من قبل
            <span class="font-bold text-gray-900 dark:text-white"
              >شركة الفخار للمقاولات الهندسية المحدودة</span
            >
            لصالح دائرة التخطيط والمتابعة لغرض تجربة النظام وتقييم أداءه ومتابعة وإدخال وتعديل
            وإدارة المشاريع والعقود والإجراءات التنفيذية وتقارير تقدم العمل وغيرها...
          </p>
          <p class="mb-6 text-gray-600 dark:text-gray-400">
            النسخة التجريبية الحالية تقدم عدد من المزايا والنسخة الكاملة تقدم كافة المزايا وكما يلي:
          </p>
        </div>

        <!-- Feature Comparison Table -->
        <div
          class="overflow-x-auto rounded-lg border border-gray-200 bg-white shadow-sm transition-colors dark:border-gray-700/50 dark:bg-gray-800/30"
        >
          <table class="w-full divide-y divide-gray-200 text-right dark:divide-gray-700/50">
            <thead class="bg-gray-50 transition-colors dark:bg-gray-800/80">
              <tr>
                <th class="px-6 py-4 text-lg font-semibold text-gray-900 dark:text-white"
                  >المزايا</th
                >
                <th class="px-6 py-4 text-lg font-semibold text-gray-900 dark:text-white"
                  >النسخة التجريبية</th
                >
                <th class="px-6 py-4 text-lg font-semibold text-gray-900 dark:text-white"
                  >النسخة الكاملة</th
                >
              </tr>
            </thead>
            <tbody
              class="divide-y divide-gray-200 bg-white transition-colors dark:divide-gray-700/50 dark:bg-gray-800/30"
            >
              <tr class="transition-colors hover:bg-gray-50 dark:hover:bg-gray-700/30">
                <td class="px-6 py-4 text-gray-700 dark:text-gray-300"> المشاريع</td>
                <td class="px-6 py-4">
                  <span class="text-red-500 dark:text-red-400">
                    <Icon icon="lucide:x" class="h-4 w-4" />
                  </span>
                </td>
                <td class="px-6 py-4">
                  <span class="text-emerald-500 dark:text-emerald-400">
                    <Icon icon="lucide:check" class="h-4 w-4" />
                  </span>
                </td>
              </tr>
              <tr class="transition-colors hover:bg-gray-50 dark:hover:bg-gray-700/30">
                <td class="px-6 py-4 text-gray-700 dark:text-gray-300">
                  المشاريع الممولة: إنشاء، تعديل، حذف، عرض، كافة تفاصيل المشروع (عدا الإنجاز الفني)
                </td>
                <td class="px-6 py-4">
                  <span class="text-emerald-500 dark:text-emerald-400">
                    <Icon icon="lucide:check" class="h-4 w-4" />
                  </span>
                </td>
                <td class="px-6 py-4">
                  <span class="text-emerald-500 dark:text-emerald-400">
                    <Icon icon="lucide:check" class="h-4 w-4" />
                  </span>
                </td>
              </tr>
              <tr class="transition-colors hover:bg-gray-50 dark:hover:bg-gray-700/30">
                <td class="px-6 py-4 text-gray-700 dark:text-gray-300">العقود</td>
                <td class="px-6 py-4">
                  <span class="text-red-500 dark:text-red-400">
                    <Icon icon="lucide:x" class="h-4 w-4" />
                  </span>
                </td>
                <td class="px-6 py-4">
                  <span class="text-emerald-500 dark:text-emerald-400">
                    <Icon icon="lucide:check" class="h-4 w-4" />
                  </span>
                </td>
              </tr>
              <tr class="transition-colors hover:bg-gray-50 dark:hover:bg-gray-700/30">
                <td class="px-6 py-4 text-gray-700 dark:text-gray-300">الخريطة</td>
                <td class="px-6 py-4">
                  <span class="text-emerald-500 dark:text-emerald-400">
                    <Icon icon="lucide:check" class="h-4 w-4" />
                  </span>
                </td>
                <td class="px-6 py-4">
                  <span class="text-emerald-500 dark:text-emerald-400">
                    <Icon icon="lucide:check" class="h-4 w-4" />
                  </span>
                </td>
              </tr>
              <tr class="transition-colors hover:bg-gray-50 dark:hover:bg-gray-700/30">
                <td class="px-6 py-4 text-gray-700 dark:text-gray-300"> التقارير والإحصائيات</td>
                <td class="px-6 py-4">
                  <span class="text-red-500 dark:text-red-400">
                    <Icon icon="lucide:x" class="h-4 w-4" />
                  </span>
                </td>
                <td class="px-6 py-4">
                  <span class="text-emerald-500 dark:text-emerald-400">
                    <Icon icon="lucide:check" class="h-4 w-4" />
                  </span>
                </td>
              </tr>
              <tr class="transition-colors hover:bg-gray-50 dark:hover:bg-gray-700/30">
                <td class="px-6 py-4 text-gray-700 dark:text-gray-300"> الاجراءات الادارية</td>
                <td class="px-6 py-4">
                  <span class="text-red-500 dark:text-red-400">
                    <Icon icon="lucide:x" class="h-4 w-4" />
                  </span>
                </td>
                <td class="px-6 py-4">
                  <span class="text-emerald-500 dark:text-emerald-400">
                    <Icon icon="lucide:check" class="h-4 w-4" />
                  </span>
                </td>
              </tr>
              <tr class="transition-colors hover:bg-gray-50 dark:hover:bg-gray-700/30">
                <td class="px-6 py-4 text-gray-700 dark:text-gray-300"> سجل الأحداث</td>
                <td class="px-6 py-4">
                  <span class="text-emerald-500 dark:text-emerald-400">
                    <Icon icon="lucide:check" class="h-4 w-4" />
                  </span>
                </td>
                <td class="px-6 py-4">
                  <span class="text-emerald-500 dark:text-emerald-400">
                    <Icon icon="lucide:check" class="h-4 w-4" />
                  </span>
                </td>
              </tr>
              <tr class="transition-colors hover:bg-gray-50 dark:hover:bg-gray-700/30">
                <td class="px-6 py-4 text-gray-700 dark:text-gray-300"> المرفقات</td>
                <td class="px-6 py-4">
                  <span class="text-emerald-500 dark:text-emerald-400">
                    <Icon icon="lucide:check" class="h-4 w-4" />
                  </span>
                </td>
                <td class="px-6 py-4">
                  <span class="text-emerald-500 dark:text-emerald-400">
                    <Icon icon="lucide:check" class="h-4 w-4" />
                  </span>
                </td>
              </tr>
              <tr class="transition-colors hover:bg-gray-50 dark:hover:bg-gray-700/30">
                <td class="px-6 py-4 text-gray-700 dark:text-gray-300"> واجهة المستخدمين</td>
                <td class="px-6 py-4">
                  <span class="text-emerald-500 dark:text-emerald-400">
                    <Icon icon="lucide:check" class="h-4 w-4" />
                  </span>
                </td>
                <td class="px-6 py-4">
                  <span class="text-emerald-500 dark:text-emerald-400">
                    <Icon icon="lucide:check" class="h-4 w-4" />
                  </span>
                </td>
              </tr>
              <tr class="transition-colors hover:bg-gray-50 dark:hover:bg-gray-700/30">
                <td class="px-6 py-4 text-gray-700 dark:text-gray-300"> الجهات المستفيدة</td>
                <td class="px-6 py-4">
                  <span class="text-emerald-500 dark:text-emerald-400">
                    <Icon icon="lucide:check" class="h-4 w-4" />
                  </span>
                </td>
                <td class="px-6 py-4">
                  <span class="text-emerald-500 dark:text-emerald-400">
                    <Icon icon="lucide:check" class="h-4 w-4" />
                  </span>
                </td>
              </tr>
              <tr class="transition-colors hover:bg-gray-50 dark:hover:bg-gray-700/30">
                <td class="px-6 py-4 text-gray-700 dark:text-gray-300"> المهام</td>
                <td class="px-6 py-4">
                  <span class="text-red-500 dark:text-red-400">
                    <Icon icon="lucide:x" class="h-4 w-4" />
                  </span>
                </td>
                <td class="px-6 py-4">
                  <span class="text-emerald-500 dark:text-emerald-400">
                    <Icon icon="lucide:check" class="h-4 w-4" />
                  </span>
                </td>
              </tr>
              <tr class="transition-colors hover:bg-gray-50 dark:hover:bg-gray-700/30">
                <td class="px-6 py-4 text-gray-700 dark:text-gray-300"> الإعدادات </td>
                <td class="px-6 py-4">
                  <span class="text-red-500 dark:text-red-400">
                    <Icon icon="lucide:x" class="h-4 w-4" />
                  </span>
                </td>
                <td class="px-6 py-4">
                  <span class="text-emerald-500 dark:text-emerald-400">
                    <Icon icon="lucide:check" class="h-4 w-4" />
                  </span>
                </td>
              </tr>
              <tr class="transition-colors hover:bg-gray-50 dark:hover:bg-gray-700/30">
                <td class="px-6 py-4 text-gray-700 dark:text-gray-300">
                  الطباعة / توجيه المهام / عرض النسخة السابقة / تدقيق المشروع / التصدير / الإنجاز
                  الفني</td
                >
                <td class="px-6 py-4">
                  <span class="text-red-500 dark:text-red-400">
                    <Icon icon="lucide:x" class="h-4 w-4" />
                  </span>
                </td>
                <td class="px-6 py-4">
                  <span class="text-emerald-500 dark:text-emerald-400">
                    <Icon icon="lucide:check" class="h-4 w-4" />
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </main>
  </DefaultLayout>
</template>

<script setup>
  import DefaultLayout from '@/layouts/DefaultLayout.vue';
  import { Icon } from '@iconify/vue';
</script>
