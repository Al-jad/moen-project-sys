<template>
  <footer>
    <Card class="border-none rounded-none bg-[#1e293b]">
      <CardContent class="container max-w-6xl py-16">
        <div class="grid grid-cols-3 gap-16">
          <!-- About Section -->
          <div class="flex flex-col items-center space-y-6">
            <div class="flex flex-col items-center gap-4 text-center">
              <img src="/img/Logo.png" alt="Ministry Logo" class="w-16 h-16" />
              <div class="space-y-1">
                <h3 class="text-xl font-bold text-white">نظام إدارة المشاريع</h3>
                <p class="text-sm text-gray-300">وزارة البيئة - جمهورية العراق</p>
              </div>
            </div>
            <p class="text-sm leading-7 text-center text-gray-300">
              نظام متكامل لإدارة وتتبع المشاريع البيئية في وزارة البيئة العراقية.
            </p>
            <!-- Social Links -->
            <div class="flex justify-center gap-3">
              <a href="https://www.facebook.com/profile.php?id=100068257788511" target="_blank" 
                class="p-2.5 text-gray-400 transition-all rounded-lg bg-gray-800/50 hover:bg-gray-800 hover:text-white">
                <Facebook class="w-4 h-4" />
              </a>
              <a href="https://www.instagram.com/moen.gov.iq" target="_blank" 
                class="p-2.5 text-gray-400 transition-all rounded-lg bg-gray-800/50 hover:bg-gray-800 hover:text-white">
                <Instagram class="w-4 h-4" />
              </a>
              <a href="https://youtube.com/@user-zo6lr7ez4q" target="_blank" 
                class="p-2.5 text-gray-400 transition-all rounded-lg bg-gray-800/50 hover:bg-gray-800 hover:text-white">
                <Youtube class="w-4 h-4" />
              </a>
              <a href="https://x.com" target="_blank" 
                class="p-2.5 text-gray-400 transition-all rounded-lg bg-gray-800/50 hover:bg-gray-800 hover:text-white">
                <Twitter class="w-4 h-4" />
              </a>
            </div>
          </div>

          <!-- Quick Links -->
          <div class="flex flex-col items-center space-y-6">
            <h3 class="text-lg font-semibold text-white">روابط سريعة</h3>
            <div class="flex flex-col items-center w-full gap-3">
              <RouterLink to="/projects" class="flex items-center justify-center w-full gap-3 text-sm text-gray-300 transition-colors hover:text-white group">
                <div class="p-2 transition-colors rounded-lg bg-gray-800/50 group-hover:bg-gray-800">
                  <ChevronLeft class="w-4 h-4" />
                </div>
                <span>المشاريع</span>
              </RouterLink>
              <RouterLink to="/reports" class="flex items-center justify-center w-full gap-3 text-sm text-gray-300 transition-colors hover:text-white group">
                <div class="p-2 transition-colors rounded-lg bg-gray-800/50 group-hover:bg-gray-800">
                  <ChevronLeft class="w-4 h-4" />
                </div>
                <span>التقارير</span>
              </RouterLink>
              <RouterLink to="/contracts" class="flex items-center justify-center w-full gap-3 text-sm text-gray-300 transition-colors hover:text-white group">
                <div class="p-2 transition-colors rounded-lg bg-gray-800/50 group-hover:bg-gray-800">
                  <ChevronLeft class="w-4 h-4" />
                </div>
                <span>العقود</span>
              </RouterLink>
              <RouterLink to="/tasks" class="flex items-center justify-center w-full gap-3 text-sm text-gray-300 transition-colors hover:text-white group">
                <div class="p-2 transition-colors rounded-lg bg-gray-800/50 group-hover:bg-gray-800">
                  <ChevronLeft class="w-4 h-4" />
                </div>
                <span>المهام</span>
              </RouterLink>
              <RouterLink to="/history-log" class="flex items-center justify-center w-full gap-3 text-sm text-gray-300 transition-colors hover:text-white group">
                <div class="p-2 transition-colors rounded-lg bg-gray-800/50 group-hover:bg-gray-800">
                  <ChevronLeft class="w-4 h-4" />
                </div>
                <span>سجل الأحداث</span>
              </RouterLink>
              <RouterLink to="/contact" class="flex items-center justify-center w-full gap-3 text-sm text-gray-300 transition-colors hover:text-white group">
                <div class="p-2 transition-colors rounded-lg bg-gray-800/50 group-hover:bg-gray-800">
                  <ChevronLeft class="w-4 h-4" />
                </div>
                <span>اتصل بنا</span>
              </RouterLink>
            </div>
          </div>

          <!-- Contact Info -->
          <div class="flex flex-col items-center space-y-6">
            <h3 class="text-lg font-semibold text-white">معلومات الاتصال</h3>
            <div class="flex flex-col items-center gap-4">
              <div class="flex items-center justify-center w-full gap-3 text-sm text-gray-300 group">
                <div class="p-2.5 transition-colors rounded-lg bg-gray-800/50 group-hover:bg-gray-800">
                  <MapPin class="w-4 h-4 text-gray-400 group-hover:text-white" />
                </div>
                <span>العراق، بغداد</span>
              </div>
              <div class="flex items-center justify-center w-full gap-3 text-sm group">
                <div class="p-2.5 transition-colors rounded-lg bg-gray-800/50 group-hover:bg-gray-800">
                  <Phone class="w-4 h-4 text-gray-400 group-hover:text-white" />
                </div>
                <a dir="ltr" href="tel:+964 1 442 2183" class="text-gray-300 transition-colors hover:text-white">
                  +964 1 442 2183
                </a>
              </div>
              <div class="flex items-center justify-center w-full gap-3 text-sm group">
                <div class="p-2.5 transition-colors rounded-lg bg-gray-800/50 group-hover:bg-gray-800">
                  <Mail class="w-4 h-4 text-gray-400 group-hover:text-white" />
                </div>
                <a href="mailto:info@moen.gov.iq" class="text-gray-300 transition-colors hover:text-white">info@moen.gov.iq</a>
              </div>
              <div class="flex items-center justify-center w-full gap-3 text-sm group">
                <div class="p-2.5 transition-colors rounded-lg bg-gray-800/50 group-hover:bg-gray-800">
                  <Globe class="w-4 h-4 text-gray-400 group-hover:text-white" />
                </div>
                <a href="https://www.moen.gov.iq/" target="_blank" class="text-gray-300 transition-colors hover:text-white">moen.gov.iq</a>
              </div>
              <div class="flex items-center justify-center w-full gap-3 text-sm text-gray-300 group">
                <div class="p-2.5 transition-colors rounded-lg bg-gray-800/50 group-hover:bg-gray-800">
                  <Clock class="w-4 h-4 text-gray-400 group-hover:text-white" />
                </div>
                <span>ساعات العمل: 9:00 ص - 3:00 م</span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>

    <!-- Bottom Bar -->
    <div class="w-full bg-[#0f172a] border-t border-gray-800">
      <div class="container flex flex-col items-center justify-between max-w-6xl py-6 space-y-4 text-xs md:flex-row md:space-y-0">
        <div class="flex items-center gap-2 text-xs text-gray-400 group">
          <span>تم التطوير بواسطة</span>
          <a href="https://www.alfakharcompany.com/" target="_blank" class="flex items-center gap-2 transition-all duration-200 hover:text-white">
            شركة الجاد للحلول البرمجية  
            <img src="/img/jad.jpeg" class="w-5 h-5 transition-opacity duration-200 opacity-75 group-hover:opacity-100" alt="Fakhar co. logo" />
          </a>
        </div>
        
        <div class="flex items-center gap-8 text-sm">
          <RouterLink class="text-gray-400 transition-all duration-200 hover:text-white hover:translate-x-0.5" to="/privacy">سياسة الخصوصية</RouterLink>
          <RouterLink class="text-gray-400 transition-all duration-200 hover:text-white hover:translate-x-0.5" to="/terms">شروط الاستخدام</RouterLink>
        </div>
        
        <p class="text-xs font-medium text-gray-400">جميع الحقوق محفوظة © {{ new Date().getFullYear() }}</p>
      </div>
    </div>
  </footer>
</template>

<script setup>
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { RouterLink } from 'vue-router'
import { 
  MapPin, 
  Phone, 
  Mail, 
  Globe, 
  Clock, 
  Smartphone,
  Facebook,
  Instagram,
  Youtube,
  Twitter,
  ChevronLeft
} from 'lucide-vue-next'
</script>

<style scoped>
/* Remove the existing style block since shadcn will handle text colors through its theming */
</style>
