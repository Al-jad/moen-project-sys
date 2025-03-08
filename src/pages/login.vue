<template>
  <div
    class="relative min-h-screen w-full overflow-hidden bg-cover bg-center dark:before:absolute dark:before:inset-0 dark:before:z-10 dark:before:bg-black/50"
    style="background-image: url('/img/login-background.png')"
  >
    <div class="absolute right-4 top-4 z-20">
      <img src="/img/logo-text.png" alt="Logo" class="h-16" />
    </div>
    <div class="relative z-20 flex min-h-screen items-center justify-center">
      <Card class="mx-4 w-full max-w-md dark:border-gray-700 dark:bg-gray-800/90">
        <CardHeader>
          <div class="space-y-2 text-right">
            <h1 class="text-2xl font-semibold text-[#003049] dark:text-white">
              اهلا بك في برنامج ادارة المشاريع
            </h1>
            <h2 class="text-lg text-[#003049]/80 dark:text-gray-300">
              دائرة التخطيط - وزارة البيئة
            </h2>
            <p class="text-sm text-muted-foreground dark:text-gray-400">
              ادخل الايميل الخاص بك و الرمز السري
            </p>
          </div>
        </CardHeader>
        <CardContent>
          <form @submit.prevent="handleLogin" class="space-y-6" dir="rtl">
            <div class="space-y-4">
              <div class="space-y-2">
                <label
                  class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 dark:text-gray-200"
                >
                  اسم المستخدم
                </label>
                <CustomInput type="text" v-model="username" placeholder="ادخل اسم المستخدم" required />
              </div>
              <div class="space-y-2">
                <label
                  class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 dark:text-gray-200"
                >
                  كلمة السر
                </label>
                <div class="relative">
                  <CustomInput
                    :type="showPassword ? 'text' : 'password'"
                    v-model="password"
                    placeholder="ادخل كلمة السر"
                    required
                    class="pr-4"
                  />
                  <PrimaryButton
                    type="button"
                    variant="ghost"
                    size="icon"
                    @click="showPassword = !showPassword"
                    class="absolute left-1 top-1/2 h-8 w-8 -translate-y-1/2 hover:bg-transparent"
                  >
                    <Icon
                      :icon="showPassword ? 'lucide:eye-off' : 'lucide:eye'"
                      class="h-4 w-4 text-muted-foreground transition-colors hover:text-foreground dark:text-gray-400 dark:hover:text-gray-300"
                    />
                    <span class="sr-only">{{ showPassword ? 'Hide' : 'Show' }} password</span>
                  </PrimaryButton>
                </div>
              </div>
            </div>
            <PrimaryButton type="submit" class="w-full">
              <span class="mr-2 text-lg"> → </span>
              <span>تسجيل الدخول</span>
            </PrimaryButton>
          </form>
        </CardContent>
      </Card>
    </div>
  </div>
</template>

<script setup>
  import { Icon } from '@iconify/vue';
  import { ref } from 'vue';
  import axiosInstance from '@/plugins/axios';
  import { useAuthStore } from '@/stores/authStore';

  const router = useRouter();
  const authStore = useAuthStore();
  const username = ref('');
  const password = ref('');
  const showPassword = ref(false);
  const errorMessage = ref('');

  const handleLogin = async () => {
    errorMessage.value = '';

    try {
      const response = await axiosInstance.post('/login', {
        username: username.value,
        password: password.value
      });

      if (response.status === 200 || response.status === 201) {
        const { user, tokens } = response.data;

        authStore.setUser(user);
        authStore.setToken(tokens.access);

        router.push('/');
      }
    } catch (error) {
      console.error('Login Error:', error);
      errorMessage.value = 'خطأ في تسجيل الدخول. تحقق من اسم المستخدم أو كلمة المرور.';
    }
  };
</script>
