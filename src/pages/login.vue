<template>
  <div
    class="relative min-h-screen w-full overflow-hidden bg-cover bg-center dark:before:absolute dark:before:inset-0 dark:before:z-10 dark:before:bg-black/50"
    style="background-image: url('/img/login-background.png')"
  >
    <div class="absolute right-4 top-4 z-20">
      <img src="/img/logo-text.png" alt="Logo" class="h-16" />
    </div>
    <div class="relative z-20 flex min-h-screen items-center justify-center">
      <Card class="mx-4 w-full max-w-md border-border bg-background-surface/90">
        <CardHeader>
          <div class="space-y-2 text-right">
            <h1 class="text-2xl font-semibold text-foreground">
              اهلا بك في برنامج ادارة المشاريع
            </h1>
            <h2 class="text-lg text-foreground"> دائرة التخطيط - وزارة البيئة </h2>
            <p class="text-sm text-muted-foreground"> ادخل الايميل الخاص بك و الرمز السري </p>
          </div>
        </CardHeader>
        <CardContent>
          <form @submit.prevent="handleLogin" class="space-y-6" dir="rtl">
            <div class="space-y-4">
              <div class="space-y-2">
                <label class="text-sm font-medium leading-none"> اسم المستخدم </label>
                <CustomInput
                  type="text"
                  v-model="username"
                  placeholder="ادخل اسم المستخدم"
                  required
                />
              </div>
              <div class="space-y-2">
                <label class="text-sm font-medium leading-none"> كلمة السر </label>
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
                      class="h-4 w-4 text-muted-foreground transition-colors hover:text-foreground"
                    />
                    <span class="sr-only">{{ showPassword ? 'Hide' : 'Show' }} password</span>
                  </PrimaryButton>
                </div>
              </div>
            </div>
            <PrimaryButton type="submit" class="w-full" icon="lucide:arrow-right">
              <span>تسجيل الدخول</span>
            </PrimaryButton>
          </form>
        </CardContent>
      </Card>
    </div>
    <Toaster />
  </div>
</template>
<script setup lang="ts">
  import { useToast } from '@/composables/useToast';
  import { authService } from '@/services/authService';
  import { useAuthStore } from '@/stores/auth';
  import type { LoginRequest } from '@/types/auth';
  import { Icon } from '@iconify/vue';
  import { onMounted, ref } from 'vue';
  import { useRoute, useRouter } from 'vue-router';
  import { Toaster } from 'vue-sonner';
  const router = useRouter();
  const route = useRoute();
  const authStore = useAuthStore();
  const { showError, showSuccess } = useToast();
  const username = ref('');
  const password = ref('');
  const showPassword = ref(false);
  const errorMessage = ref('');
  onMounted(async () => {
    if (authStore.isAuthenticated) {
      try {
        const redirectPath = route.query.redirect
          ? decodeURIComponent(route.query.redirect.toString())
          : '/';
        await router.push(redirectPath);
      } catch (error) {
        console.error('Navigation error:', error);
        await router.push('/');
      }
    }
  });
  const getArabicErrorMessage = (error: any) => {
    const apiMessage = error.response?.data?.message || error.details?.message;
    if (!apiMessage) return 'حدث خطأ غير متوقع. يرجى المحاولة مرة أخرى';
    const errorMessages: Record<string, string> = {
      'User not found': 'المستخدم غير موجود. يرجى التحقق من اسم المستخدم',
      'Invalid credentials': 'كلمة المرور غير صحيحة',
      'Invalid username or password': 'اسم المستخدم أو كلمة المرور غير صحيحة',
      'User is inactive': 'هذا الحساب غير مفعل. يرجى التواصل مع المسؤول',
      'User is blocked': 'هذا الحساب محظور. يرجى التواصل مع المسؤول',
    };
    return errorMessages[apiMessage] || 'يرجى التحقق من اسم المستخدم وكلمة المرور';
  };
  const handleLogin = async () => {
    errorMessage.value = '';
    try {
      const credentials: LoginRequest = {
        username: username.value,
        password: password.value,
      };
      const response = await authService.login(credentials);
      const { user, token } = response.data;
      if (user && token) {
        authStore.setUser(user);
        authStore.setToken(token);
        showSuccess('تم تسجيل الدخول بنجاح', 'مرحباً بك في النظام');
        try {
          const redirectPath = route.query.redirect
            ? decodeURIComponent(route.query.redirect.toString())
            : '/';
          await router.push(redirectPath);
        } catch (error) {
          console.error('Navigation error:', error);
          await router.push('/');
        }
      } else {
        errorMessage.value = 'خطأ في استجابة تسجيل الدخول من الخادم.';
        showError('فشل تسجيل الدخول', 'بيانات تسجيل الدخول غير مكتملة.');
      }
    } catch (error: any) {
      errorMessage.value = 'خطأ في تسجيل الدخول. تحقق من اسم المستخدم أو كلمة المرور.';
      const arabicErrorMsg = getArabicErrorMessage(error);
      showError('فشل تسجيل الدخول', arabicErrorMsg);
    }
  };
</script>
