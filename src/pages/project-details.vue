<template>
  <DefaultLayout>
    <main class="bg-gray-200 p-6 dark:bg-gray-900">
      <div
        class="mb-4 rounded-lg bg-white shadow-sm dark:border dark:border-gray-700 dark:bg-gray-800"
      >
        <div class="p-6">
          <div class="mb-6 flex items-center justify-between">
            <BackButton />
          </div>
          <div class="mb-10">
            <h1 class="mb-2 text-xl font-bold">مشروع تجهيز مضخات لمحطة اسالة المياه في الرشيد</h1>
          </div>
          <div class="grid grid-cols-[300px_1fr] gap-x-16 gap-y-6">
            <div>الرقم المرجعي للمشروع</div>
            <div class="text-gray-500 dark:text-gray-400">4457821</div>
            <div>وصف المشروع</div>
            <div class="text-gray-500 dark:text-gray-400">
              المشروع يتكون من عدة سطور. المشروع يتكون من عدة سطور المشروع يتكون من عدة سطور.
              المشروع يتكون من عدة سطور المشروع يتكون من عدة سطور. المشروع يتكون من عدة سطور المشروع
              يتكون من عدة سطور. المشروع يتكون من عدة سطور المشروع يتكون من عدة سطور. المشروع يتكون
              من عدة سطور
            </div>
            <div>الجهة المستفيدة</div>
            <div class="text-gray-500 dark:text-gray-400"
              >دائرة حماية وتحسين البيئة في منطقة الوسط</div
            >
            <div>حالة المشروع</div>
            <div class="text-gray-500 dark:text-gray-400">قيد التنفيذ</div>
            <div>نسبة الانجاز</div>
            <div class="flex flex-row items-center gap-4">
              <div
                class="relative h-4 w-1/2 overflow-hidden rounded-lg bg-gray-100 dark:bg-gray-700"
              >
                <div
                  class="absolute left-0 top-0 h-full rounded-lg bg-gradient-to-r from-green-400 via-green-500 to-green-600 shadow-inner"
                  style="width: 75%"
                >
                  <div class="absolute inset-0 bg-white/20 backdrop-blur-sm"></div>
                </div>
                <div class="absolute left-0 top-0 h-full w-full">
                  <div class="flex h-full">
                    <div class="h-full w-1/4 border-r border-white/30"></div>
                    <div class="h-full w-1/4 border-r border-white/30"></div>
                    <div class="h-full w-1/4 border-r border-white/30"></div>
                    <div class="h-full w-1/4"></div>
                  </div>
                </div>
                <div
                  class="absolute top-1/2 -translate-y-1/2 transition-all duration-300"
                  style="left: 75%"
                >
                  <div
                    class="-ml-3.5 flex h-6 w-6 items-center justify-center rounded-full bg-white shadow-lg ring-2 ring-green-400/50 dark:bg-gray-800"
                  >
                    <div
                      class="h-4 w-4 rounded-full bg-gradient-to-br from-green-400 to-green-600 shadow-inner"
                    ></div>
                  </div>
                </div>
              </div>
              <div class="text-lg font-medium">75%</div>
            </div>
            <div>كلفة المشروع</div>
            <div class="text-gray-500 dark:text-gray-400">1,650,000,000 دينار عراقي</div>
            <div>الشركة المنفذة</div>
            <div class="text-gray-500 dark:text-gray-400">شركة النجار للمقاولات الهندسية</div>
            <div>ملاحظات</div>
            <div class="text-sm text-gray-500 dark:text-gray-400">
              هذه ملاحظات خاصة بالمشروع. نقطة اضافية لمتابعة المشروع في برنامج ادارة المشاريع
            </div>
          </div>
          <hr class="my-4 mt-6 w-full border-dashed border-gray-300 dark:border-gray-600" />
          <div class="mb-10">
            <h1 class="mb-2 text-xl font-bold">هيكلية المشروع</h1>
          </div>
          <div class="grid grid-cols-[300px_1fr] gap-x-16 gap-y-6">
            <div>مدير المشروع</div>
            <div class="text-gray-500 dark:text-gray-400">رئيس مهندسين دعاء محمد علي</div>
            <div>كادر المشروع</div>
            <div class="space-y-2 text-gray-500 dark:text-gray-400">
              <p>م.م. محمد علي محمد (شعبة كذا قسم كذا مديرية كذا)</p>
              <p>حسين علي فاضل</p>
              <p>عباس سعد علي</p>
              <p>احمد باسم احمد</p>
            </div>
            <div>لجنة الاستلام</div>
            <div class="text-gray-500 dark:text-gray-400">لجنة الاستلام الرئاسة ....</div>
            <div>لجنة التدقيق</div>
            <div class="text-gray-500 dark:text-gray-400">لجنة الاستلام الرئاسة ....</div>
            <div>لجنة الاحالة</div>
            <div class="text-gray-500 dark:text-gray-400">لجنة الاستلام الرئاسة ....</div>
            <div>لجنة فتح العطاءات</div>
            <div class="text-gray-500 dark:text-gray-400">لجنة الاستلام الرئاسة ....</div>
            <div>لجنة .....</div>
            <div class="text-gray-500 dark:text-gray-400">لجنة الاستلام الرئاسة ....</div>
            <div>لجنة ......</div>
            <div class="text-gray-500 dark:text-gray-400">لجنة الاستلام الرئاسة ....</div>
          </div>
          <hr class="my-4 mt-6 w-full border-dashed border-gray-300 dark:border-gray-600" />
          <div class="mb-6">
            <div class="flex items-center justify-between">
              <h1 class="text-xl font-bold">المرفقات ({{ project?.attachments?.length || 0 }})</h1>
              <button class="text-blue-600 hover:underline dark:text-blue-400">الكل</button>
            </div>
          </div>
          <div v-if="project?.attachments?.length > 0" class="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            <DocumentCard
              v-for="attachment in project.attachments"
              :key="attachment.id"
              :title="attachment.title"
              :description="attachment.description"
              :date="attachment.date"
              :url="attachment.url"
            />
          </div>
          <div v-else class="rounded-lg border border-dashed border-gray-300 p-6 text-center dark:border-gray-700">
            <p class="text-gray-500 dark:text-gray-400">لا توجد مرفقات لهذا المشروع</p>
          </div>
          <hr class="my-4 mt-6 w-full border-dashed border-gray-300 dark:border-gray-600" />
          <div class="mb-10">
            <h1 class="mb-6 text-xl font-bold">الموقع الجغرافي</h1>
            <div class="mb-6 grid grid-cols-[300px_1fr] gap-x-16 gap-y-6">
              <div>العنوان الكامل</div>
              <div class="text-gray-500 dark:text-gray-400">بغداد المنصور شارع 14 رمضان</div>
            </div>
            <Map />
          </div>
          <hr class="my-4 mt-6 w-full border-dashed border-gray-300 dark:border-gray-600" />
          <div class="mb-10">
            <div class="mb-6 flex items-center justify-between">
              <h1 class="text-xl font-bold"> إجراءات إدارية </h1>
              <div>
                <button
                  @click="
                    router.push({ name: 'project-modifications', params: { id: $route.params.id } })
                  "
                  class="text-blue-600 hover:underline dark:text-blue-400"
                >
                  عرض سجل التعديلات
                </button>
              </div>
            </div>
            <div class="grid grid-cols-[300px_1fr] gap-x-16 gap-y-6">
              <div>تاريخ اخر تعديل</div>
              <div class="text-gray-500 dark:text-gray-400">15.10.2024 ص 10:22</div>
              <div>بواسطة</div>
              <div class="text-gray-500 dark:text-gray-400"
                >م. دعاء محمد علي الشيخلي ( مدير المشروع - شعبة .. قسم .. دائرة ... )</div
              >
              <div>التدقيق</div>
              <div class="text-gray-500 dark:text-gray-400"
                >محمد رياض اسماعيل ( لقب و منصب ومرتبته )</div
              >
              <div>سبب التعديل</div>
              <div class="text-gray-500 dark:text-gray-400">تعديل نسب الانجاز المالي</div>
              <div>النسخة الحالية</div>
              <div class="flex items-center gap-2">
                <div class="text-gray-500 dark:text-gray-400">V33</div>
                <button class="text-sm text-blue-600 hover:underline dark:text-blue-400"
                  >عرض النسخة السابقة V32</button
                >
              </div>
            </div>
          </div>
          <hr class="my-4 mt-6 w-full border-dashed border-gray-300 dark:border-gray-600" />
          <div class="mb-10 flex items-center justify-center gap-12">
            <PrimaryButton icon="lucide:printer"> طباعة </PrimaryButton>
            <PrimaryButton variant="outline" icon="lucide:history">
              عرض النسخة السابقة
            </PrimaryButton>
            <PrimaryButton variant="outline" icon="lucide:check"> تأكيد </PrimaryButton>
            <PrimaryButton variant="outline" icon="lucide:edit"> تعديل </PrimaryButton>
            <PrimaryButton variant="outline" icon="lucide:check-square"> تدقيق </PrimaryButton>
            <PrimaryButton variant="outline" icon="lucide:bell"> ارسال اشعار </PrimaryButton>
          </div>
        </div>
      </div>
    </main>
  </DefaultLayout>
</template>
<script setup>
  import BackButton from '@/components/BackButton.vue';
  import DocumentCard from '@/components/DocumentCard.vue';
  import PrimaryButton from '@/components/PrimaryButton.vue';
  import DefaultLayout from '@/layouts/DefaultLayout.vue';
  import { defineAsyncComponent, ref, onMounted } from 'vue';
  import projectService from '@/services/projectService';
  import projectUtils from '@/utils/projectUtils';
  
  const router = useRouter();
  const route = useRoute();
  const Map = defineAsyncComponent(() => import('@/components/Map.vue'));
  
  const project = ref(null);
  const isLoading = ref(false);
  const error = ref(null);
  
  // Fetch project data
  const fetchProject = function() {
    const projectId = route.params.id;
    if (!projectId) return;
    
    isLoading.value = true;
    error.value = null;
    
    projectService.getProjectById(projectId)
      .then(function(response) {
        project.value = projectUtils.transformProject(response.data);
        isLoading.value = false;
      })
      .catch(function(err) {
        console.error('Error fetching project:', err);
        error.value = err.message || 'Failed to fetch project';
        isLoading.value = false;
      });
  };
  
  onMounted(function() {
    fetchProject();
  });
</script>