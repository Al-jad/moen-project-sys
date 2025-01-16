<template>
  <DefaultLayout>
    <main class="p-6 bg-gray-100">
      <div class="max-w-5xl mx-auto space-y-6">
        <div class="p-6 bg-white rounded-xl">
          <div class="mb-6">
            <h1 class="text-xl font-bold">المعلومات الشخصية</h1>
            <p class="text-sm text-gray-500">يمكنك تغيير إعدادات معلوماتك الشخصية هنا.</p>
          </div>
          <div class="space-y-6">
            <div class="grid grid-cols-2 gap-x-8 gap-y-4">
              <div>
                <label class="block mb-2 text-sm">الاسم</label>
                <Input type="text"  placeholder="اصيل السلماسي" />
              </div>
              <div>
                <label class="block mb-2 text-sm">رقم الهاتف</label>
                <Input type="text" placeholder="07724206921" />
              </div>
              <div>
                <label class="block mb-2 text-sm">اللقب</label>
                <Input type="text" placeholder="رئيس مهندسين اقدم" />
              </div>
              <div>
                <label class="block mb-2 text-sm">الدائرة والقسم</label>
                <Input type="text" placeholder="قسم المشاريع دائرة التخطيط" />
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
        <div class="p-6 bg-white rounded-xl">
          <div class="mb-6">
            <h1 class="text-xl font-bold">اعدادات الامان</h1>
            <p class="text-sm text-gray-500">يمكنك تغيير كلمة المرور او تسجيل الخروج من الحساب</p>
          </div>
          <form @submit.prevent="handlePasswordChange" class="space-y-6" dir="rtl">
            <div class="space-y-4">
              <div class="flex items-center justify-between gap-4">
                <label class="min-w-[120px] text-right text-sm font-medium"
                  >كلمة المرور الحالية</label
                >
                <div class="relative flex-1">
                  <div class="relative w-1/2">
                    <Input
                      :type="showCurrentPassword ? 'text' : 'password'"
                      v-model="currentPassword"
                      placeholder="****************"
                      required
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      @click="showCurrentPassword = !showCurrentPassword"
                      class="absolute w-8 h-8 -translate-y-1/2 left-1 top-1/2 hover:bg-transparent"
                    >
                      <EyeOff
                        v-if="showCurrentPassword"
                        class="w-4 h-4 transition-colors text-muted-foreground hover:text-foreground"
                      />
                      <Eye
                        v-else
                        class="w-4 h-4 transition-colors text-muted-foreground hover:text-foreground"
                      />
                    </Button>
                  </div>
                </div>
              </div>
              <div class="flex items-center justify-between gap-4">
                <label class="min-w-[120px] text-right text-sm font-medium"
                  >كلمة المرور الجديدة</label
                >
                <div class="relative flex-1">
                  <div class="relative w-1/2">
                    <Input
                      :type="showNewPassword ? 'text' : 'password'"
                      v-model="newPassword"
                      placeholder="ادخل كلمة المرور الجديدة"
                      required
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      @click="showNewPassword = !showNewPassword"
                      class="absolute w-8 h-8 -translate-y-1/2 left-1 top-1/2 hover:bg-transparent"
                    >
                      <EyeOff
                        v-if="showNewPassword"
                        class="w-4 h-4 transition-colors text-muted-foreground hover:text-foreground"
                      />
                      <Eye
                        v-else
                        class="w-4 h-4 transition-colors text-muted-foreground hover:text-foreground"
                      />
                    </Button>
                  </div>
                </div>
              </div>
              <div class="flex items-center justify-between gap-4">
                <label class="min-w-[120px] text-right text-sm font-medium"
                  >تأكيد كلمة المرور</label
                >
                <div class="relative flex-1">
                  <div class="relative w-1/2">
                    <Input
                      :type="showConfirmPassword ? 'text' : 'password'"
                      v-model="confirmPassword"
                      placeholder="تأكيد كلمة المرور"
                      required
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      @click="showConfirmPassword = !showConfirmPassword"
                      class="absolute w-8 h-8 -translate-y-1/2 left-1 top-1/2 hover:bg-transparent"
                    >
                      <EyeOff
                        v-if="showConfirmPassword"
                        class="w-4 h-4 transition-colors text-muted-foreground hover:text-foreground"
                      />
                      <Eye
                        v-else
                        class="w-4 h-4 transition-colors text-muted-foreground hover:text-foreground"
                      />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
            <hr class="border-gray-200" />
            <div class="flex justify-start">
              <Button type="submit" class="text-white bg-slate-700 hover:bg-slate-800">
                تأكيد تغيير كلمة المرور
              </Button>
            </div>
          </form>
        </div>
      </div>
    </main>
  </DefaultLayout>
</template>
<script setup>
  import { ref } from 'vue';
  import { Button } from '@/components/ui/button';
  import { Input } from '@/components/ui/input';
  import DefaultLayout from '@/layouts/DefaultLayout.vue';
  import { ImageUp, Eye, EyeOff } from 'lucide-vue-next';
  const avatarFile = ref(null);
  const currentPassword = ref('');
  const newPassword = ref('');
  const confirmPassword = ref('');
  const showCurrentPassword = ref(false);
  const showNewPassword = ref(false);
  const showConfirmPassword = ref(false);
  const handlePasswordChange = () => {
    console.log('Password change submitted');
  };
</script>
