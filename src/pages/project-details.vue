<template>
  <DefaultLayout>
    <main class="p-6 bg-gray-200">
      <div class="mb-4 bg-white rounded-lg shadow-sm">
        <div class="p-6">
          <div class="flex items-center justify-between mb-6">
            <button
              @click="$router.back()"
              class="flex items-center gap-2 text-gray-500 hover:text-gray-700"
            >
              <ArrowRight class="w-4 h-4" />
              رجوع
            </button>
          </div>
          <div class="mb-10">
            <h1 class="mb-2 text-xl font-bold">مشروع تجهيز مضخات لمحطة اسالة المياه في الرشيد</h1>
          </div>
          <div class="grid grid-cols-[300px_1fr] gap-x-16 gap-y-6">
            <div class="text-black">الرقم المرجعي للمشروع</div>
            <div class="text-gray-500">4457821</div>
            <div class="text-black">وصف المشروع</div>
            <div class="text-gray-500">
              المشروع يتكون من عدة سطور. المشروع يتكون من عدة سطور المشروع يتكون من عدة سطور.
              المشروع يتكون من عدة سطور المشروع يتكون من عدة سطور. المشروع يتكون من عدة سطور المشروع
              يتكون من عدة سطور. المشروع يتكون من عدة سطور المشروع يتكون من عدة سطور. المشروع يتكون
              من عدة سطور
            </div>
            <div class="text-black">الجهة المستفيدة</div>
            <div class="text-gray-500">دائرة حماية وتحسين البيئة في منطقة الوسط</div>
            <div class="text-black">حالة المشروع</div>
            <div class="text-gray-500">قيد التنفيذ</div>
            <div class="text-black">نسبة الانجاز</div>
            <div class="flex flex-row items-center gap-4">
              <div class="relative w-1/2 h-4 overflow-hidden bg-gray-100 rounded-lg">
                <div class="absolute top-0 left-0 h-full rounded-lg shadow-inner bg-gradient-to-r from-green-400 via-green-500 to-green-600" style="width: 75%">
                  <div class="absolute inset-0 bg-white/20 backdrop-blur-sm"></div>
                </div>
                <div class="absolute top-0 left-0 w-full h-full">
                  <div class="flex h-full">
                    <div class="w-1/4 h-full border-r border-white/30"></div>
                    <div class="w-1/4 h-full border-r border-white/30"></div>
                    <div class="w-1/4 h-full border-r border-white/30"></div>
                    <div class="w-1/4 h-full"></div>
                  </div>
                </div>
                <div 
                  class="absolute transition-all duration-300 -translate-y-1/2 top-1/2"
                  style="left: 75%"
                >
                  <div class="flex items-center justify-center w-6 h-6 -ml-3.5 bg-white rounded-full shadow-lg ring-2 ring-green-400/50">
                    <div class="w-4 h-4 rounded-full shadow-inner bg-gradient-to-br from-green-400 to-green-600"></div>
                  </div>
                </div>
              </div>
              <div class="text-lg font-medium text-gray-700">75%</div>
            </div>
            <div class="text-black">كلفة المشروع</div>
            <div class="text-gray-500">1,650,000,000 دينار عراقي</div>
            <div class="text-black">الشركة المنفذة</div>
            <div class="text-gray-500">شركة النجار للمقاولات الهندسية</div>
            <div class="text-black">ملاحظات</div>
            <div class="text-sm text-gray-500">
              هذه ملاحظات خاصة بالمشروع. نقطة اضافية لمتابعة المشروع في برنامج ادارة المشاريع
            </div>
          </div>
          <hr class="w-full my-4 mt-6 border-gray-300 border-dashed" />
          <div class="mb-10">
            <h1 class="mb-2 text-xl font-bold">هيكلية المشروع</h1>
          </div>
          <div class="grid grid-cols-[300px_1fr] gap-x-16 gap-y-6">
            <div class="text-black">مدير المشروع</div>
            <div class="text-gray-500">رئيس مهندسين دعاء محمد علي</div>
            <div class="text-black">كادر المشروع</div>
            <div class="space-y-2 text-gray-500">
              <p>م.م. محمد علي محمد (شعبة كذا قسم كذا مديرية كذا)</p>
              <p>حسين علي فاضل</p>
              <p>عباس سعد علي</p>
              <p>احمد باسم احمد</p>
            </div>
            <div class="text-black">لجنة الاستلام</div>
            <div class="text-gray-500">لجنة الاستلام الرئاسة ....</div>
            <div class="text-black">لجنة التدقيق</div>
            <div class="text-gray-500">لجنة الاستلام الرئاسة ....</div>
            <div class="text-black">لجنة الاحالة</div>
            <div class="text-gray-500">لجنة الاستلام الرئاسة ....</div>
            <div class="text-black">لجنة فتح العطاءات</div>
            <div class="text-gray-500">لجنة الاستلام الرئاسة ....</div>
            <div class="text-black">لجنة .....</div>
            <div class="text-gray-500">لجنة الاستلام الرئاسة ....</div>
            <div class="text-black">لجنة ......</div>
            <div class="text-gray-500">لجنة الاستلام الرئاسة ....</div>
          </div>
          <hr class="w-full my-4 mt-6 border-gray-300 border-dashed" />
          <div class="mb-6">
            <div class="flex items-center justify-between">
              <h1 class="text-xl font-bold">المرفقات (251)</h1>
              <button class="text-blue-600 hover:underline">الكل</button>
            </div>
          </div>
          <div class="grid grid-cols-4 gap-4">
            <DocumentCard
              v-for="n in 8"
              :key="n"
              title="جدول الكميات والمواصفات العمل في مراحل المناقصة"
            />
          </div>
          <hr class="w-full my-4 mt-6 border-gray-300 border-dashed" />
          <div class="mb-10">
            <h1 class="mb-6 text-xl font-bold"> الموقع الجغرافي </h1>
            <div class="mb-6 grid grid-cols-[300px_1fr] gap-x-16 gap-y-6">
              <div class="text-black">العنوان الكامل</div>
              <div class="text-gray-500">بغداد المنصور شارع 14 رمضان</div>
            </div>
            <Map />
          </div>
          <hr class="w-full my-4 mt-6 border-gray-300 border-dashed" />
          <div class="mb-10">
            <div class="flex items-center justify-between mb-6">
              <h1 class="text-xl font-bold">
                إجراءات إدارية
              </h1>
              <div>
                <button 
                  @click="router.push({ name: 'project-modifications', params: { id: $route.params.id }})"
                  class="text-blue-600 hover:underline"
                >
                  عرض سجل التعديلات
                </button>
              </div>
            </div>
            <div class="grid grid-cols-[300px_1fr] gap-x-16 gap-y-6">
              <div class="text-black">تاريخ اخر تعديل</div>
              <div class="text-gray-500">15.10.2024 ص 10:22</div>
              <div class="text-black">بواسطة</div>
              <div class="text-gray-500"
                >م. دعاء محمد علي الشيخلي ( مدير المشروع - شعبة .. قسم .. دائرة ... )</div
              >
              <div class="text-black">التدقيق</div>
              <div class="text-gray-500">محمد رياض اسماعيل ( لقب و منصب ومرتبته )</div>
              <div class="text-black">سبب التعديل</div>
              <div class="text-gray-500">تعديل نسب الانجاز المالي</div>
              <div class="text-black">النسخة الحالية</div>
              <div class="flex items-center gap-2">
                <div class="text-gray-500">V33</div>
                <button class="text-sm text-blue-600 hover:underline"
                  >عرض النسخة السابقة V32</button
                >
              </div>
            </div>
          </div>
          <hr class="w-full my-4 mt-6 border-gray-300 border-dashed" />
          <div class="flex items-center justify-center gap-12 mb-10">
            <Button
              class="px-12 py-3 font-medium text-white rounded-lg bg-slate-700 hover:bg-slate-700/90"
            >
              طباعة
            </Button>
            <Button
              class="px-12 py-3 font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              عرض النسخة السابقة
            </Button>
            <Button
              class="px-12 py-3 font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              تأكيد
            </Button>
            <Button
              class="px-12 py-3 font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              تعديل
            </Button>
            <Button
              class="px-12 py-3 font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              تدقيق
            </Button>
            <Button
              class="px-12 py-3 font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              ارسال اشعار
            </Button>
          </div>
        </div>
      </div>
    </main>
  </DefaultLayout>
</template>
<script setup>
  import { defineAsyncComponent } from 'vue';
  import { ArrowRight } from 'lucide-vue-next';
  import { useRouter } from 'vue-router';
  import DefaultLayout from '@/layouts/DefaultLayout.vue';
  import DocumentCard from '@/components/DocumentCard.vue';
  import { Button } from '@/components/ui/button';
  
  const router = useRouter();
  const Map = defineAsyncComponent(() => import('@/components/Map.vue'));
</script>
