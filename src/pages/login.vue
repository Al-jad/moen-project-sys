<template>
  <div
    class="relative w-full min-h-screen overflow-hidden bg-center bg-cover"
    style="background-image: url('/img/login-background.png')"
  >
    <div class="absolute right-4 top-4">
      <img src="/img/logo-text.png" alt="Logo" class="h-16" />
    </div>
    <div class="flex items-center justify-center min-h-screen">
      <Card class="w-full max-w-md mx-4">
        <CardHeader>
          <div class="space-y-2 text-right">
            <h1 class="text-2xl font-semibold text-[#003049]">
              اهلا بك في برنامج ادارة المشاريع
            </h1>
            <h2 class="text-lg text-[#003049]/80"> دائرة التخطيط - وزارة البيئة </h2>
            <p class="text-sm text-muted-foreground"> ادخل الايميل الخاص بك و الرمز السري </p>
          </div>
        </CardHeader>
        <CardContent>
          <form @submit.prevent="handleLogin" class="space-y-6" dir="rtl">
            <div class="space-y-4">
              <div class="space-y-2">
                <label
                  class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  الايميل
                </label>
                <Input type="email" v-model="email" placeholder="ادخل الايميل" required />
              </div>
              <div class="space-y-2">
                <label
                  class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  كلمة السر
                </label>
                <div class="relative">
                  <Input
                    :type="showPassword ? 'text' : 'password'"
                    v-model="password"
                    placeholder="ادخل كلمة السر"
                    required
                    class="pr-4"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    @click="showPassword = !showPassword"
                    class="absolute w-8 h-8 -translate-y-1/2 left-1 top-1/2 hover:bg-transparent"
                  >
                    <EyeOff v-if="showPassword" class="w-4 h-4 transition-colors text-muted-foreground hover:text-foreground" />
                    <Eye v-else class="w-4 h-4 transition-colors text-muted-foreground hover:text-foreground" />
                    <span class="sr-only">{{ showPassword ? 'Hide' : 'Show' }} password</span>
                  </Button>
                </div>
              </div>
            </div>
            <Button type="submit" class="w-full bg-[#003049] hover:bg-[#003049]/90">
              <span class="mr-2 text-lg"> → </span>
              <span>تسجيل الدخول</span>
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  </div>
</template>
<script setup>
  import { ref } from 'vue';
  import { useRouter } from 'vue-router';
  import { Button } from '@/components/ui/button';
  import { Input } from '@/components/ui/input';
  import { Card, CardHeader, CardContent } from '@/components/ui/card';
  import { Eye, EyeOff } from 'lucide-vue-next';
  const router = useRouter();
  const email = ref('');
  const password = ref('');
  const showPassword = ref(false);
  const handleLogin = () => {
    router.push('/');
  };
</script>
