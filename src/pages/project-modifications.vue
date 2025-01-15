<template>
  <DefaultLayout>
    <main class="p-6 bg-gray-100">
      <div class="mb-4 bg-white rounded-lg shadow-sm">
        <div class="p-6">
          <div class="flex items-center justify-between mb-6">
            <div class="flex items-center gap-6">
              <Button
                variant="link"
                @click="$router.back()"
                class="flex items-center text-blue-600"
              >
                <ArrowRight class="w-4 h-4" />
                الرئيسية
              </Button>
              <h1 class="text-xl font-bold">الاجراءات الادارية</h1>
            </div>
          </div>
          <div class="flex items-center justify-between gap-4 mb-8">
            <div class="flex items-center gap-6">
              <Button variant="outline" class="px-2">
                <FileSpreadsheet class="w-4 h-4 ml-2" />
                تصدير Excel
              </Button>

              <Popover>
                <PopoverTrigger>
                  <Button variant="outline" class="flex justify-start w-56 text-black">
                    <CalendarIcon class="w-4 h-4 ml-2 text-gray-400" />
                    {{ date?.start ? dateRangeText : 'اختر التاريخ' }}
                  </Button>
                </PopoverTrigger>
                <PopoverContent class="w-auto p-0">
                  <RangeCalendar v-model="date" :number-of-months="2" />
                </PopoverContent>
              </Popover>

              <div class="min-w-[200px]">
                <Select v-model="selectedProject">
                  <SelectTrigger class="flex flex-row-reverse w-full">
                    <SelectValue placeholder="اختر المشروع" dir="rtl">
                      <div class="flex items-center gap-2">
                        <Folder class="w-4 h-4 text-gray-400" />
                        <span>{{
                          selectedProject === 'all' ? 'اختر المشروع' : 'اسم المشروع'
                        }}</span>
                      </div>
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">الكل</SelectItem>
                    <SelectItem value="1">اسم المشروع</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div class="min-w-[200px]">
                <Select v-model="selectedEmployee">
                  <SelectTrigger class="flex flex-row-reverse w-full" >
                    <SelectValue placeholder="اختر الموظف" dir="rtl">
                      <div class="flex items-center gap-2">
                        <UserCircle class="w-4 h-4 text-gray-400" />
                        <span>{{ selectedEmployee === 'all' ? 'اختر الموظف' : 'محمد انور' }}</span>
                      </div>
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">الكل</SelectItem>
                    <SelectItem value="1">محمد انور</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div class="relative min-w-[240px]">
              <Input type="text" placeholder="بحث سريع" class="pr-10 border-gray-200 focus:border-gray-200 placeholder:text-gray-400" />
              <span class="absolute inset-y-0 flex items-center justify-center px-2 start-0">
                <Search class="text-gray-400 size-6" />
              </span>
            </div>
          </div>
          <div class="w-full">
            <Table class="overflow-hidden border rounded-xl">
              <TableHeader>
                <TableRow class="bg-gray-100">
                  <TableHead class="text-right text-gray-900 first:rounded-tr-xl">اسم الموظف</TableHead>
                  <TableHead class="text-right text-gray-900">المشروع</TableHead>
                  <TableHead class="text-right text-gray-900">تاريخ التعديل</TableHead>
                  <TableHead class="text-right text-gray-900">وقت التعديل</TableHead>
                  <TableHead class="text-right text-gray-900">حقل التعديل</TableHead>
                  <TableHead class="text-right text-gray-900">القيمة السابقة</TableHead>
                  <TableHead class="text-right text-gray-900">القيمة الجديدة</TableHead>
                  <TableHead class="w-10 last:rounded-tl-xl"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow 
                  v-for="(n, index) in 7" 
                  :key="n" 
                  class="hover:bg-gray-50/50"
                  :class="{ 
                    'last:[&>td:first-child]:rounded-br-xl last:[&>td:last-child]:rounded-bl-xl': index === 6
                  }"
                >
                  <TableCell>
                    <Button variant="link" class="h-auto p-0 text-blue-600">
                      {{ n % 2 === 0 ? 'محمد انور' : ' دعاء الشيخلي' }}
                    </Button>
                  </TableCell>
                  <TableCell>
                    <Button variant="link" class="h-auto p-0 text-blue-600">
                      تجهيز أجهزة ومعدات مراقبة المياه
                    </Button>
                  </TableCell>
                  <TableCell class="text-gray-600">2024/10/25</TableCell>
                  <TableCell class="text-gray-600">10:33 ص</TableCell>
                  <TableCell class="text-gray-600">{{
                    n % 2 === 0 ? 'السعر' : 'لجنة الاستلام'
                  }}</TableCell>
                  <TableCell class="text-gray-600">1100$</TableCell>
                  <TableCell class="text-gray-600">5214582$</TableCell>
                  <TableCell>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="ghost" size="icon" class="text-gray-400 hover:text-gray-600">
                          <Eye class="w-4 h-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent class="sm:max-w-[600px]">
                        <DialogHeader>
                          <DialogTitle class="text-right">اجراء اداري</DialogTitle>
                          <DialogDescription class="text-right">
                            تفاصيل الاجراء الاداري
                          </DialogDescription>
                        </DialogHeader>
                        <div class="grid py-4 gap-y-4">
                          <div class="grid grid-cols-[120px_1fr] items-center gap-4">
                            <span class="text-right text-gray-500">تاريخ اخر تعديل</span>
                            <span>15.10.2024 @ 10:22 ص</span>
                          </div>
                          <div class="grid grid-cols-[120px_1fr] items-center gap-4">
                            <span class="text-right text-gray-500">الموظف</span>
                            <span>م. دعاء محمد علي الشيخلي ( مدير المشروع - شعبة ... قسم ... دائرة ... )</span>
                          </div>
                          <div class="grid grid-cols-[120px_1fr] items-center gap-4">
                            <span class="text-right text-gray-500">المشروع</span>
                            <span>مشروع اسم المشروع هنا</span>
                          </div>
                          <div class="grid grid-cols-[120px_1fr] items-center gap-4">
                            <span class="text-right text-gray-500">الحقل</span>
                            <span>الوصف</span>
                          </div>
                          <div class="grid grid-cols-[120px_1fr] items-start gap-4">
                            <span class="text-right text-gray-500">القيمة السابقة</span>
                            <p class="text-sm leading-6">وصف هنا عدة اسطر كامل الوصف كامل الفيماوصف هنا عدة اسطر كامل الوصف كامل الفيماوصف هنا عدة اسطر كامل الوصف كامل اسطر كامل الوصف كامل الفيماوصف هنا عدة اسطر كامل الوصف كامل الوصف كامل اسطر كامل الوصف كامل القيمة</p>
                          </div>
                          <div class="grid grid-cols-[120px_1fr] items-start gap-4">
                            <span class="text-right text-gray-500">القيمة الحالية</span>
                            <p class="text-sm leading-6">وصف هنا عدة اسطر كامل الوصف كامل الفيماوصف هنا عدة اسطر كامل الوصف كامل الفيماوصف هنا عدة اسطر كامل الوصف كامل اسطر كامل الوصف كامل الفيماوصف هنا عدة اسطر كامل الوصف كامل الوصف كامل اسطر كامل الوصف كامل القيمة</p>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
          <div class="flex items-center justify-center py-3 mt-4 border-t">
            <Pagination>
              <PaginationContent>
                
                <PaginationItem>
                  <PaginationPrevious @click="page > 1 && (page--)">السابق</PaginationPrevious>
                </PaginationItem>
                <PaginationItem>
                  <PaginationLink :value="page" isActive>1</PaginationLink>
                </PaginationItem> 
                <PaginationItem>
                  <PaginationLink :value="page">2</PaginationLink>
                </PaginationItem>
                <PaginationItem>
                  <PaginationLink :value="page">3</PaginationLink>
                </PaginationItem>
                <PaginationItem>
                  <PaginationEllipsis />
                </PaginationItem>
                <PaginationItem>
                  <PaginationNext @click="page < totalPages && (page++)">التالي <ArrowRight class="w-4 h-4" /></PaginationNext>
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="ghost" size="icon" class="text-gray-400 hover:text-gray-600">
                <Eye class="w-4 h-4" />
              </Button>
            </DialogTrigger>
            <DialogContent class="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle class="text-right">
                  <p class="text-xl font-bold ">اجراء اداري</p>
                </DialogTitle>
              </DialogHeader>
              <div class="grid py-4 gap-y-4">
                <div class="grid grid-cols-[120px_1fr] items-center gap-4">
                  <span class="text-right text-gray-500">تاريخ اخر تعديل</span>
                  <span>15.10.2024 @ 10:22 ص</span>
                </div>
                <div class="grid grid-cols-[120px_1fr] items-center gap-4">
                  <span class="text-right text-gray-500">الموظف</span>
                  <span>م. دعاء محمد علي الشيخلي ( مدير المشروع - شعبة ... قسم ... دائرة ... )</span>
                </div>
                <div class="grid grid-cols-[120px_1fr] items-center gap-4">
                  <span class="text-right text-gray-500">المشروع</span>
                  <span>مشروع اسم المشروع هنا</span>
                </div>
                <div class="grid grid-cols-[120px_1fr] items-center gap-4">
                  <span class="text-right text-gray-500">الحقل</span>
                  <span>الوصف</span>
                </div>
                <div class="grid grid-cols-[120px_1fr] items-start gap-4">
                  <span class="text-right text-gray-500">القيمة السابقة</span>
                  <p class="text-sm leading-6">وصف هنا عدة اسطر كامل الوصف كامل الفيماوصف هنا عدة اسطر كامل الوصف كامل الفيماوصف هنا عدة اسطر كامل الوصف كامل اسطر كامل الوصف كامل الفيماوصف هنا عدة اسطر كامل الوصف كامل الوصف كامل اسطر كامل الوصف كامل القيمة</p>
                </div>
                <div class="grid grid-cols-[120px_1fr] items-start gap-4">
                  <span class="text-right text-gray-500">القيمة الحالية</span>
                  <p class="text-sm leading-6">وصف هنا عدة اسطر كامل الوصف كامل الفيماوصف هنا عدة اسطر كامل الوصف كامل الفيماوصف هنا عدة اسطر كامل الوصف كامل اسطر كامل الوصف كامل الفيماوصف هنا عدة اسطر كامل الوصف كامل الوصف كامل اسطر كامل الوصف كامل القيمة</p>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </main>
  </DefaultLayout>
</template>
<script setup lang="ts">
  import { ref, computed } from 'vue';
  import type { DateRange } from 'radix-vue';
  import { useRoute, useRouter } from 'vue-router';
  import {
    Search,
    UserCircle,
    Folder,
    Calendar as CalendarIcon,
    FileSpreadsheet,
    Eye,
    
    ArrowRight,
  } from 'lucide-vue-next';
  import DefaultLayout from '@/layouts/DefaultLayout.vue';
  import { Button } from '@/components/ui/button';
  import { Input } from '@/components/ui/input';
  import { Badge } from '@/components/ui/badge';
  import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
  } from '@/components/ui/table';
  import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
  } from '@/components/ui/select';
  import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
  import { RangeCalendar } from '@/components/ui/range-calendar';
  import { DateFormatter, getLocalTimeZone } from '@internationalized/date';
  import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
  } from '@/components/ui/pagination'
  import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
  } from '@/components/ui/dialog'

  const route = useRoute();
  const router = useRouter();
  const projectId = computed(() => route.params.id);
  const selectedProject = ref('all');
  const selectedEmployee = ref('all');
  const currentPage = ref(2);

  const df = new DateFormatter('ar', { dateStyle: 'medium' });
  const date = ref<DateRange>();

  const dateRangeText = computed(() => {
    if (!date.value?.start) return '';

    if (!date.value?.end) {
      return df.format(date.value.start.toDate(getLocalTimeZone()));
    }

    return `${df.format(date.value.start.toDate(getLocalTimeZone()))} - ${df.format(date.value.end.toDate(getLocalTimeZone()))}`;
  });

  const page = ref(1)
  const totalPages = ref(10)
</script>
<style scoped></style>
