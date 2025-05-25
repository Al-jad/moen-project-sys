<template>
  <footer class="mt-auto border-t border-border bg-background-surface">
    <!-- Top Section with Three Logos -->
    <div class="container max-w-7xl py-12">
      <div class="grid grid-cols-1 gap-12 md:grid-cols-3">
        <div class="flex flex-col items-center space-y-4">
          <div class="flex flex-col items-center gap-3 text-center">
            <img src="/img/Logo.png" alt="Ministry Logo" class="h-14 w-14 object-contain" />
            <div class="space-y-1.5">
              <h3 class="text-lg font-bold text-foreground-heading">نظام إدارة المشاريع</h3>
              <p class="text-sm text-foreground-muted">وزارة البيئة - جمهورية العراق</p>
            </div>
          </div>
        </div>
        <div class="flex flex-col items-center space-y-4">
          <div class="flex flex-col items-center gap-3 text-center">
            <img src="/img/MinisterLogo.png" alt="Ministry Logo" class="h-14 w-14 object-contain" />
            <div class="space-y-1.5">
              <h3 class="text-lg font-bold text-foreground-heading">رئاسة الوزراء</h3>
              <p class="text-sm text-foreground-muted">جمهورية العراق</p>
            </div>
          </div>
        </div>
        <div class="flex flex-col items-center space-y-4">
          <div class="flex flex-col items-center gap-3 text-center">
            <img
              src="/img/WhatsApp.jpg"
              alt="Ministry Logo"
              class="h-14 w-14 rounded-full object-cover"
            />
            <div class="space-y-1.5">
              <h3 class="text-lg font-bold text-foreground-heading">مركز البيانات الوطني</h3>
              <p class="text-sm text-foreground-muted">الأمانة العامة لمجلس الوزراء</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Bottom Bar -->
      <div class="mt-12 border-t border-border/50 pt-6">
        <div
          class="flex flex-col items-center justify-between gap-6 text-center md:flex-row md:text-start"
        >
          <!-- Copyright -->
          <p class="text-sm text-foreground-muted"
            >جميع الحقوق محفوظة © {{ new Date().getFullYear() }}</p
          >

          <!-- Developer Info -->
          <div class="group flex items-center gap-2 text-sm text-foreground-muted">
            <span>تم التطوير بواسطة</span>
            <a
              href="https://www.alfakharco.com/"
              target="_blank"
              class="flex items-center gap-2 transition-all duration-200 hover:text-primary"
            >
              <img
                src="/img/Fakhar.png"
                class="h-5 w-5 opacity-75 transition-opacity duration-200 group-hover:opacity-100"
                alt="Fakhar co. logo"
              />
              <span class="font-medium">شركة الفخار للمقاولات الهندسية المحدودة</span>
            </a>
          </div>

          <!-- Legal Links -->
          <div class="flex items-center gap-6">
            <RouterLink
              class="text-sm text-foreground-muted transition-colors hover:text-primary"
              to="/privacy"
              >سياسة الخصوصية</RouterLink
            >
            <RouterLink
              class="text-sm text-foreground-muted transition-colors hover:text-primary"
              to="/terms"
              >شروط الاستخدام</RouterLink
            >
          </div>
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup>
  import { RouterLink } from 'vue-router';
</script>
