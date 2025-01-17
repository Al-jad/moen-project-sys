<template>
  <DefaultLayout>
    <main class="p-6 bg-gray-50">
      <div>
        <div class="flex items-center justify-between mb-6">
          <div class="flex items-center gap-6">
            <Button
              variant="link"
              @click="$router.back()"
              class="flex items-center text-blue-600"
            >
              <ArrowRight class="w-4 h-4" />
              رجوع
            </Button>
            <h1 class="text-xl font-bold"> 
              الاجراءات التنفيذية
            </h1>
          </div>
          <div class="flex items-center gap-6">
            <Button 
              class="gap-2 px-8 py-4 text-white bg-slate-700 hover:bg-slate-800"
              @click="showEditModal = true"
            >
              <CirclePlus class="w-4 h-4" />
              اضافة إجراء تنفيذي
            </Button>
          </div>
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

              <Popover>
                <PopoverTrigger>
                  <Button variant="outline" class="flex justify-start w-56 text-black">
                    <CalendarIcon class="w-4 h-4 ml-2 text-gray-400" />
                    {{ date?.start ? dateRangeText : 'من تاريخ الى' }}
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
                  <SelectTrigger class="flex flex-row-reverse w-full">
                    <SelectValue placeholder="اختر العقد" dir="rtl">
                      <div class="flex items-center gap-2">
                        <FileText class="w-4 h-4 text-gray-400" />
                        <span>{{ selectedEmployee === 'all' ? 'اختر العقد' : 'العقد 1' }}</span>
                      </div>
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">الكل</SelectItem>
                    <SelectItem value="1">العقد 1</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div class="flex items-center gap-4">
              <div class="relative min-w-[240px]">
                <Input type="text" placeholder="بحث سريع" class="pr-10 border-gray-200 focus:border-gray-200 placeholder:text-gray-400" />
                <span class="absolute inset-y-0 flex items-center justify-center px-2 start-0">
                  <Search class="text-gray-400 size-6" />
                </span>
              </div>
              
            </div>
          </div>
          <div class="w-full">
            <Table class="overflow-hidden border rounded-xl">
              <TableHeader class="text-right text-nowrap">
                <TableRow class="bg-gray-100">
                  <TableHead class="text-right text-gray-900 first:rounded-tr-xl">اسم الاجراء</TableHead>
                  <TableHead class="text-right text-gray-900">
                    المشروع 
                  </TableHead>
                  <TableHead class="text-right text-gray-900">
                    العقد 
                  </TableHead>
                  <TableHead class="text-right text-gray-900">وزن الاجراء</TableHead>
                  <TableHead class="text-right text-gray-900">مدة الاجراء يوم</TableHead>
                  <TableHead class="text-right text-gray-900">تاريخ بداية تنفيذ</TableHead>
                  <TableHead class="text-right text-gray-900">نسبة الانجاز الفني المخطط</TableHead>
                  <TableHead class="text-right text-gray-900">نسبة الانجاز الفني الفعلي</TableHead>
                  <TableHead class="text-right text-gray-900">نسبة الانحراف الفني</TableHead>
                  <TableHead class="text-right text-gray-900">نسبة الانجاز المالي المخطط</TableHead>
                  <TableHead class="text-right text-gray-900">نسبة الانجاز المالي الفعلي</TableHead>
                  <TableHead class="w-10 last:rounded-tl-xl"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow 
                  v-for="(n, index) in 9" 
                  :key="n" 
                  class="hover:bg-gray-50/50"
                  :class="{ 
                    'last:[&>td:first-child]:rounded-br-xl last:[&>td:last-child]:rounded-bl-xl': index === 8
                  }"
                >
                  <TableCell>
                    <Button variant="link" class="h-auto p-0 text-blue-600">
                      {{ n % 2 === 0 ? 'التنصيب' : 'التشغيل' }}
                    </Button>
                  </TableCell>
                  <TableCell>{{ n % 2 === 0 ? 'مشروع A' : 'مشروع B' }}</TableCell>
                  <TableCell>{{ n % 2 === 0 ? 'عقد رقم 2023/157' : 'عقد رقم 2023/158' }}</TableCell>
                  <TableCell>{{ n % 2 === 0 ? '25' : '54' }}</TableCell>
                  <TableCell>{{ n % 2 === 0 ? '30' : '20' }}</TableCell>
                  <TableCell>{{ n % 2 === 0 ? '20.03.2025' : '15.03.2025' }}</TableCell>
                  <TableCell>{{ n % 2 === 0 ? '50%' : '75%' }}</TableCell>
                  <TableCell>{{ n % 2 === 0 ? '45%' : '70%' }}</TableCell>
                  <TableCell>{{ n % 2 === 0 ? '5%' : '5%' }}</TableCell>
                  <TableCell>{{ n % 2 === 0 ? '40%' : '60%' }}</TableCell>
                  <TableCell>{{ n % 2 === 0 ? '35%' : '55%' }}</TableCell>
                  <TableCell>
                    <div class="flex items-center gap-2">
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        class="text-gray-400 hover:text-gray-600" 
                        @click="handleViewAction({
                          name: n % 2 === 0 ? 'التنصيب' : 'التشغيل',
                          projectName: n % 2 === 0 ? 'مشروع A' : 'مشروع B',
                          contractNumber: n % 2 === 0 ? 'عقد رقم 2023/157' : 'عقد رقم 2023/158',
                          weight: n % 2 === 0 ? 25 : 54,
                          duration: n % 2 === 0 ? 30 : 20,
                          startDate: n % 2 === 0 ? '20.03.2025' : '15.03.2025',
                          plannedTechnicalProgress: n % 2 === 0 ? '50%' : '75%',
                          actualTechnicalProgress: n % 2 === 0 ? '45%' : '70%',
                          technicalDeviation: n % 2 === 0 ? '5%' : '5%',
                          plannedFinancialProgress: n % 2 === 0 ? '40%' : '60%',
                          actualFinancialProgress: n % 2 === 0 ? '35%' : '55%'
                        })"
                      >
                        <Eye class="w-4 h-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        class="text-gray-400 hover:text-gray-600"
                        @click="handleEditAction({
                          name: n % 2 === 0 ? 'التنصيب' : 'التشغيل',
                          projectName: n % 2 === 0 ? 'مشروع A' : 'مشروع B',
                          contractNumber: n % 2 === 0 ? 'عقد رقم 2023/157' : 'عقد رقم 2023/158',
                          weight: n % 2 === 0 ? 25 : 54,
                          duration: n % 2 === 0 ? 30 : 20,
                          startDate: n % 2 === 0 ? '20.03.2025' : '15.03.2025',
                          plannedTechnicalProgress: n % 2 === 0 ? '50%' : '75%',
                          actualTechnicalProgress: n % 2 === 0 ? '45%' : '70%',
                          technicalDeviation: n % 2 === 0 ? '5%' : '5%',
                          plannedFinancialProgress: n % 2 === 0 ? '40%' : '60%',
                          actualFinancialProgress: n % 2 === 0 ? '35%' : '55%'
                        })"
                      >
                        <Pencil class="w-4 h-4" />
                      </Button>
                    </div>
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
        </div>
      </div>
    </main>
    <ViewActionModal 
      v-model:open="showViewModal"
      :action="selectedAction"
      @submit="handleSubmitAction"
    />
    <AddEditActionModal
      v-model:open="showEditModal"
      @submit="handleSubmitAction"
    />
  </DefaultLayout>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import type { DateRange } from 'radix-vue';
import { DateFormatter, getLocalTimeZone } from '@internationalized/date';
import {
  Eye,
  ArrowRight,
  Folder,
  FileSpreadsheet,
  CalendarIcon,
  FileText,
  Search,
  CirclePlus,
  Pencil,
} from 'lucide-vue-next';
import DefaultLayout from '@/layouts/DefaultLayout.vue';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  RangeCalendar,
} from '@/components/ui/range-calendar';
import ViewActionModal from '@/components/ViewActionModal.vue';
import AddEditActionModal from '@/components/AddEditActionModal.vue';

const route = useRoute();
const router = useRouter();
const projectId = computed(() => route.params.id);
const selectedProject = ref('all');
const page = ref(1);
const totalPages = ref(10);

const df = new DateFormatter('ar', { dateStyle: 'medium' });
const date = ref<DateRange>();

const dateRangeText = computed(() => {
  if (!date.value?.start) return '';

  if (!date.value?.end) {
    return df.format(date.value.start.toDate(getLocalTimeZone()));
  }

  return `${df.format(date.value.start.toDate(getLocalTimeZone()))} - ${df.format(date.value.end.toDate(getLocalTimeZone()))}`;
});

const selectedEmployee = ref('all');

const showViewModal = ref(false);
const selectedAction = ref(null);

const handleViewAction = (action) => {
  selectedAction.value = action;
  showViewModal.value = true;
};

const showEditModal = ref(false);

const handleEditAction = (action) => {
  selectedAction.value = action;
  showEditModal.value = true;
};

const handleSubmitAction = (formData) => {
  console.log('Form submitted:', formData);
  // Handle form submission here
};
</script>

<style scoped></style>