<template>
  <DefaultLayout>
    <main class="min-h-screen p-6 bg-gray-200 dark:bg-gray-900">
      <div class="max-w-5xl mx-auto space-y-6">
        <!-- Personal Information Card -->
        <div class="p-6 bg-white rounded-xl dark:bg-gray-800 dark:border dark:border-gray-700">
          <div class="mb-6">
            <h1 class="text-xl font-bold dark:text-white">المعلومات الشخصية</h1>
            <p class="text-sm text-gray-500 dark:text-gray-400">يمكنك تغيير إعدادات معلوماتك الشخصية هنا.</p>
          </div>
          <div class="space-y-6">
            <div class="grid grid-cols-2 gap-x-8 gap-y-4">
              <FormField label="الاسم">
                <CustomInput 
                  v-model="personalInfo.name"
                  placeholder="اصيل السلماسي"
                />
              </FormField>
              <FormField label="رقم الهاتف">
                <CustomInput 
                  v-model="personalInfo.phone"
                  placeholder="07724206921"
                />
              </FormField>
              <FormField label="اللقب">
                <CustomInput 
                  v-model="personalInfo.title"
                  placeholder="رئيس مهندسين اقدم"
                />
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
                    class="object-cover w-24 h-24 rounded-full ring-2 ring-gray-200 dark:ring-gray-700"
                  />
                  <div class="flex-1">
                    <div
                      class="flex flex-col items-center justify-center p-8 text-center transition-colors border-2 border-dashed rounded-lg cursor-pointer dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50"
                      @click="() => document.getElementById('avatar-upload').click()"
                    >
                      <ImageUp class="w-6 h-6 text-blue-600 dark:text-blue-400" />
                      <p class="mb-1 text-blue-600 dark:text-blue-400">انقر هنا لرفع ملفك او سحبه</p>
                      <p class="text-sm text-gray-500 dark:text-gray-400">Supported Format: SVG, JPG, PNG (10mb each)</p>
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
              <PrimaryButton>حفظ التعديلات</PrimaryButton>
            </div>
          </div>
        </div>

        <!-- Security Settings Card -->
        <div class="p-6 bg-white rounded-xl dark:bg-gray-800 dark:border dark:border-gray-700">
          <div class="mb-6">
            <h1 class="text-xl font-bold dark:text-white">اعدادات الامان</h1>
            <p class="text-sm text-gray-500 dark:text-gray-400">يمكنك تغيير كلمة المرور او تسجيل الخروج من الحساب</p>
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
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    @click="showCurrentPassword = !showCurrentPassword"
                    class="absolute w-8 h-8 -translate-y-1/2 left-1 top-1/2 hover:bg-transparent"
                  >
                    <EyeOff
                      v-if="showCurrentPassword"
                      class="w-4 h-4 transition-colors text-muted-foreground hover:text-foreground dark:text-gray-400 dark:hover:text-gray-300"
                    />
                    <Eye
                      v-else
                      class="w-4 h-4 transition-colors text-muted-foreground hover:text-foreground dark:text-gray-400 dark:hover:text-gray-300"
                    />
                  </Button>
                </div>
              </FormField>
              <FormField label="كلمة المرور الجديدة">
                <div class="relative w-1/2">
                  <CustomInput
                    v-model="newPassword"
                    :type="showNewPassword ? 'text' : 'password'"
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
                      class="w-4 h-4 transition-colors text-muted-foreground hover:text-foreground dark:text-gray-400 dark:hover:text-gray-300"
                    />
                    <Eye
                      v-else
                      class="w-4 h-4 transition-colors text-muted-foreground hover:text-foreground dark:text-gray-400 dark:hover:text-gray-300"
                    />
                  </Button>
                </div>
              </FormField>
              <FormField label="تأكيد كلمة المرور">
                <div class="relative w-1/2">
                  <CustomInput
                    v-model="confirmPassword"
                    :type="showConfirmPassword ? 'text' : 'password'"
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
                      class="w-4 h-4 transition-colors text-muted-foreground hover:text-foreground dark:text-gray-400 dark:hover:text-gray-300"
                    />
                    <Eye
                      v-else
                      class="w-4 h-4 transition-colors text-muted-foreground hover:text-foreground dark:text-gray-400 dark:hover:text-gray-300"
                    />
                  </Button>
                </div>
              </FormField>
            </div>
            <hr class="border-gray-200 dark:border-gray-700" />
            <div class="flex justify-start">
              <PrimaryButton type="submit">
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
import { ref } from 'vue'
import { Button } from '@/components/ui/button'
import DefaultLayout from '@/layouts/DefaultLayout.vue'
import { ImageUp, Eye, EyeOff } from 'lucide-vue-next'
import PrimaryButton from '@/components/PrimaryButton.vue'
import FormField from '@/components/FormField.vue'
import CustomInput from '@/components/CustomInput.vue'

const personalInfo = ref({
  name: '',
  phone: '',
  title: '',
  department: ''
})

const avatarFile = ref(null)
const currentPassword = ref('')
const newPassword = ref('')
const confirmPassword = ref('')
const showCurrentPassword = ref(false)
const showNewPassword = ref(false)
const showConfirmPassword = ref(false)

const handlePasswordChange = () => {
  console.log('Password change submitted')
}
</script>
