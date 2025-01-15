<template>
  <DefaultLayout>
    <main class="p-6 bg-gray-100">
      <div class="max-w-5xl mx-auto">
        <div class="p-6 bg-white rounded-xl">
          <div class="mb-6">
            <h1 class="text-xl font-bold">المعلومات الشخصية</h1>
            <p class="text-sm text-gray-500">يمكنك تغيير إعدادات معلوماتك الشخصية هنا.</p>
          </div>

          <div class="space-y-6">
            <div class="grid grid-cols-2 gap-x-8 gap-y-4">
              <div>
                <label class="block mb-2 text-sm">الاسم</label>
                <input 
                  type="text" 
                  class="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value="اصيل السلماسي"
                  readonly
                />
              </div>

              <div>
                <label class="block mb-2 text-sm">رقم الهاتف</label>
                <input 
                  type="text" 
                  class="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value="07724206921"
                  readonly
                />
              </div>

              <div>
                <label class="block mb-2 text-sm">اللقب</label>
                <input 
                  type="text" 
                  class="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value="رئيس مهندسين اقدم"
                  readonly
                />
              </div>

              <div>
                <label class="block mb-2 text-sm">الدائرة والقسم</label>
                <input 
                  type="text" 
                  class="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value="قسم المشاريع دائرة التخطيط"
                  readonly
                />
              </div>
            </div>

            <div>
              <label class="block mb-2 text-sm">تغيير الصورة الرمزية</label>
              <div class="flex items-center gap-8">
                <img 
                  src="/img/avatar.png" 
                  alt="Profile"
                  class="object-cover w-24 h-24 rounded-full"
                />
                <div class="flex-1">
                  <div 
                    class="flex flex-col items-center justify-center p-8 text-center transition-colors border-2 border-dashed rounded-lg cursor-pointer hover:bg-gray-50"
                    @click="() => document.getElementById('avatar-upload').click()"
                  >
                    <ImageUp class="w-6 h-6 text-blue-600" />
                    <p class="mb-1 text-blue-600">انقر هنا لرفع ملفك او سحبه</p>
                    <p class="text-sm text-gray-500">Supported Format: SVG, JPG, PNG (10mb each)</p>
                  </div>
                  <input 
                    type="file" 
                    id="avatar-upload" 
                    class="hidden"
                    accept="image/svg+xml,image/jpeg,image/png"
                  />
                </div>
              </div>
            </div>

            <div class="flex justify-start">
              <Button class="text-white bg-slate-700 hover:bg-slate-800">حفظ التعديلات</Button>
            </div>
          </div>
        </div>
      </div>
    </main>
  </DefaultLayout>
</template>

<script setup>
import { Button } from '@/components/ui/button';
import DefaultLayout from '@/layouts/DefaultLayout.vue';
import { ImageUp } from 'lucide-vue-next';
</script> 