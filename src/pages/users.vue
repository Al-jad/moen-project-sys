<template>
  <DefaultLayout>
    <main class="p-6 bg-gray-200">
      <div>
        <div class="flex items-center justify-between mb-6">
          <div class="flex items-center gap-6">
            <Button variant="link" @click="$router.back()" class="flex items-center text-blue-600">
              <ArrowRight class="w-4 h-4" />
              الرئيسية
            </Button>
            <h1 class="text-xl font-bold">قائمة المستخدمين</h1>
          </div>
          <Button
            variant="default"
            class="flex items-center gap-2 bg-slate-700 hover:bg-slate-700/90"
          >
            <UserPlus class="w-4 h-4" />
            اضافة مستخدم جديد
          </Button>
        </div>
      </div>
      <div class="mb-4 bg-white rounded-lg shadow-sm">
        <div class="p-6">
          <div class="flex items-center justify-between gap-4 mb-8">
            <div class="flex items-center gap-6">
              <Button variant="outline" class="px-2">
                <FileSpreadsheet class="w-4 h-4 ml-2" />
                تصدير Excel
              </Button>

              <div class="min-w-[200px]">
                <Select v-model="selectedDepartment">
                  <SelectTrigger class="flex flex-row-reverse w-full">
                    <SelectValue placeholder="اختر الدائرة" dir="rtl">
                      <div class="flex items-center gap-2">
                        <Building2 class="w-4 h-4 text-gray-400" />
                        <span>{{
                          selectedDepartment === 'all'
                            ? 'اختر الدائرة'
                            : 'دائرة حماية وتحسين البيئة'
                        }}</span>
                      </div>
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">الكل</SelectItem>
                    <SelectItem value="1">دائرة حماية وتحسين البيئة</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div class="min-w-[200px]">
                <Select v-model="selectedRole">
                  <SelectTrigger class="flex flex-row-reverse w-full">
                    <SelectValue placeholder="اختر الصلاحية" dir="rtl">
                      <div class="flex items-center gap-2">
                        <ShieldCheck class="w-4 h-4 text-gray-400" />
                        <span>{{ selectedRole === 'all' ? 'اختر الصلاحية' : 'مدير مشروع' }}</span>
                      </div>
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">الكل</SelectItem>
                    <SelectItem value="1">مدير مشروع</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div class="relative min-w-[240px]">
              <Input
                type="text"
                placeholder="بحث سريع"
                class="pr-10 border-gray-200 placeholder:text-gray-400 focus:border-gray-200"
              />
              <span class="absolute inset-y-0 flex items-center justify-center px-2 start-0">
                <Search class="text-gray-400 size-6" />
              </span>
            </div>
          </div>
          <div class="w-full">
            <Table class="overflow-hidden border rounded-xl">
              <TableHeader>
                <TableRow class="bg-gray-100">
                  <TableHead class="text-right text-gray-900 first:rounded-tr-xl"
                    >اسم الموظف</TableHead
                  >
                  <TableHead class="text-right text-gray-900">الدائرة</TableHead>
                  <TableHead class="text-right text-gray-900">القسم</TableHead>
                  <TableHead class="text-right text-gray-900">الشعبة</TableHead>
                  <TableHead class="text-right text-gray-900">الصلاحية</TableHead>
                  <TableHead class="text-right text-gray-900">المشروع</TableHead>
                  <TableHead class="w-10 last:rounded-tl-xl"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow
                  v-for="(n, index) in 7"
                  :key="n"
                  class="hover:bg-gray-50/50"
                  :class="{
                    'last:[&>td:first-child]:rounded-br-xl last:[&>td:last-child]:rounded-bl-xl':
                      index === 6,
                  }"
                >
                  <TableCell>
                    <Button @click="$router.push('/users/1')" variant="link" class="h-auto p-0 text-blue-600">
                      {{ n % 2 === 0 ? 'محمد انور' : ' دعاء الشيخلي' }}
                    </Button>
                  </TableCell>
                  <TableCell class="text-gray-600">دائرة حماية وتحسين البيئة</TableCell>
                  <TableCell class="text-gray-600">قسم المشاريع</TableCell>
                  <TableCell class="text-gray-600">شعبة المتابعة</TableCell>
                  <TableCell class="text-gray-600">مدير مشروع</TableCell>
                  <TableCell class="text-gray-600">
                    تجهيز وتنصيب وتشغيل محطات الأنواء الجوية
                  </TableCell>
                  <TableCell>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          class="text-gray-400 hover:text-gray-600"
                        >
                          <Eye class="w-4 h-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent class="sm:max-w-[600px]">
                        <DialogHeader>
                          <DialogTitle class="text-right">تفاصيل المستخدم</DialogTitle>
                          <DialogDescription class="text-right">
                            معلومات المستخدم الكاملة
                          </DialogDescription>
                        </DialogHeader>
                        <div class="grid py-4 gap-y-4">
                          <div class="grid grid-cols-[120px_1fr] items-center gap-4">
                            <span class="text-right text-gray-500">الاسم الكامل</span>
                            <span>م. دعاء محمد علي الشيخلي</span>
                          </div>
                          <div class="grid grid-cols-[120px_1fr] items-center gap-4">
                            <span class="text-right text-gray-500">الدائرة</span>
                            <span>دائرة حماية وتحسين البيئة</span>
                          </div>
                          <div class="grid grid-cols-[120px_1fr] items-center gap-4">
                            <span class="text-right text-gray-500">القسم</span>
                            <span>قسم المشاريع</span>
                          </div>
                          <div class="grid grid-cols-[120px_1fr] items-center gap-4">
                            <span class="text-right text-gray-500">الشعبة</span>
                            <span>شعبة المتابعة</span>
                          </div>
                          <div class="grid grid-cols-[120px_1fr] items-center gap-4">
                            <span class="text-right text-gray-500">الصلاحية</span>
                            <span>مدير مشروع</span>
                          </div>
                          <div class="grid grid-cols-[120px_1fr] items-center gap-4">
                            <span class="text-right text-gray-500">تاريخ الاضافة</span>
                            <span>2024/10/25</span>
                          </div>
                          <div class="grid grid-cols-[120px_1fr] items-center gap-4">
                            <span class="text-right text-gray-500">الحالة</span>
                            <Badge variant="success" class="font-medium w-fit"> فعال </Badge>
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
                  <PaginationPrevious @click="page > 1 && page--">السابق</PaginationPrevious>
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
                  <PaginationNext @click="page < totalPages && page++">التالي</PaginationNext>
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        </div>
      </div>
    </main>
  </DefaultLayout>
</template>

<script setup lang="ts">
  import { ref } from 'vue';
  import {
    Search,
    Building2,
    ShieldCheck,
    FileSpreadsheet,
    Eye,
    UserPlus,
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
  import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
  } from '@/components/ui/dialog';
  import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
  } from '@/components/ui/pagination';

  const selectedDepartment = ref('all');
  const selectedRole = ref('all');
  const page = ref(1);
  const totalPages = ref(10);
</script>
