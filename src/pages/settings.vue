<template>
  <DefaultLayout>
    <main class="min-h-screen bg-gray-200 p-6 dark:bg-gray-900">
      <div class="mx-auto max-w-5xl space-y-6">
        <Premium />
        <!-- Personal Information Card -->
        <div class="rounded-xl bg-white p-6 dark:border dark:border-gray-700 dark:bg-gray-800">
          <div class="mb-6">
            <h1 class="text-xl font-bold dark:text-white">المعلومات الشخصية</h1>
            <p class="text-sm text-gray-500 dark:text-gray-400"
              >يمكنك تغيير إعدادات معلوماتك الشخصية هنا.</p
            >
          </div>
          <div class="space-y-6">
            <div class="grid grid-cols-2 gap-x-8 gap-y-4">
              <FormField label="الاسم">
                <CustomInput v-model="personalInfo.name" placeholder="اصيل السلماسي" />
              </FormField>
              <FormField label="رقم الهاتف">
                <CustomInput v-model="personalInfo.phone" placeholder="07724206921" />
              </FormField>
              <FormField label="اللقب">
                <CustomInput v-model="personalInfo.title" placeholder="رئيس مهندسين اقدم" />
              </FormField>
              <FormField label="الدائرة والقسم">
                <CustomInput
                  v-model="personalInfo.department"
                  placeholder="قسم المشاريع دائرة التخطيط"
                />
              </FormField>
            </div>
            <div>
              <FormField label="تغيير الصورة الرمزية">
                <div class="flex items-center gap-8">
                  <img
                    src="/img/avatar.png"
                    alt="Profile"
                    class="h-24 w-24 rounded-full object-cover ring-2 ring-gray-200 dark:ring-gray-700"
                  />
                  <div class="flex-1">
                    <div
                      class="flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed p-8 text-center transition-colors hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-700/50"
                      @click="() => document.getElementById('avatar-upload').click()"
                    >
                      <Icon
                        icon="lucide:image-plus"
                        class="h-6 w-6 text-blue-600 dark:text-blue-400"
                      />
                      <p class="mb-1 text-blue-600 dark:text-blue-400"
                        >انقر هنا لرفع ملفك او سحبه</p
                      >
                      <p class="text-sm text-gray-500 dark:text-gray-400"
                        >Supported Format: SVG, JPG, PNG (10mb each)</p
                      >
                    </div>
                    <input
                      type="file"
                      id="avatar-upload"
                      class="hidden"
                      accept="image/svg+xml,image/jpeg,image/png"
                    />
                  </div>
                </div>
              </FormField>
            </div>
            <div class="flex justify-start">
              <PrimaryButton icon="lucide:save">حفظ التعديلات</PrimaryButton>
            </div>
          </div>
        </div>

        <!-- Security Settings Card -->
        <div class="rounded-xl bg-white p-6 dark:border dark:border-gray-700 dark:bg-gray-800">
          <div class="mb-6">
            <h1 class="text-xl font-bold dark:text-white">اعدادات الامان</h1>
            <p class="text-sm text-gray-500 dark:text-gray-400"
              >يمكنك تغيير كلمة المرور او تسجيل الخروج من الحساب</p
            >
          </div>
          <form @submit.prevent="handlePasswordChange" class="space-y-6" dir="rtl">
            <div class="space-y-4">
              <FormField label="كلمة المرور الحالية">
                <div class="relative w-1/2">
                  <CustomInput
                    v-model="currentPassword"
                    :type="showCurrentPassword ? 'text' : 'password'"
                    placeholder="****************"
                    required
                  />
                </div>
              </FormField>
              <FormField label="كلمة المرور الجديدة">
                <div class="relative w-1/2">
                  <CustomInput
                    v-model="newPassword"
                    :type="showNewPassword ? 'text' : 'password'"
                    placeholder="ادخل كلمة المرور الجديدة"
                    :TriggerIcon="showNewPassword ? 'lucide:eye-off' : 'lucide:eye'"
                    @trigger-click="showNewPassword = !showNewPassword"
                    required
                  />
                </div>
              </FormField>
              <FormField label="تأكيد كلمة المرور">
                <div class="relative w-1/2">
                  <CustomInput
                    v-model="confirmPassword"
                    :type="showConfirmPassword ? 'text' : 'password'"
                    placeholder="تأكيد كلمة المرور"
                    :TriggerIcon="showConfirmPassword ? 'lucide:eye-off' : 'lucide:eye'"
                    @trigger-click="showConfirmPassword = !showConfirmPassword"
                    required
                  />
                </div>
              </FormField>
            </div>
            <hr class="border-gray-200 dark:border-gray-700" />
            <div class="flex justify-start">
              <PrimaryButton type="submit" icon="lucide:key">
                تأكيد تغيير كلمة المرور
              </PrimaryButton>
            </div>
          </form>
        </div>
      </div>
    </main>
  </DefaultLayout>
</template>

<script setup>
  import CustomInput from '@/components/CustomInput.vue';
  import FormField from '@/components/FormField.vue';
  import PrimaryButton from '@/components/PrimaryButton.vue';
  import DefaultLayout from '@/layouts/DefaultLayout.vue';
  import { Icon } from '@iconify/vue';

  const personalInfo = ref({
    name: '',
    phone: '',
    title: '',
    department: '',
  });

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
