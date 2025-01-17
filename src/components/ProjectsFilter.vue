<template>
  <div class="min-h-screen w-[400px] bg-gray-200 p-6">
    <div class="flex flex-col gap-6">
      <!-- Search Input -->

      <div class="p-6 bg-white rounded-md">
        <!-- Filter Header -->
        <div class="bg-white">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-2">
              <FilterIcon class="w-4 h-4 text-gray-500" />
              <span class="text-sm font-medium text-gray-700">فلتر</span>
            </div>
          </div>
          <hr class="w-full my-2 border-gray-200" />
        </div>
        <div class="my-4 rounded-md">
          <label class="text-sm font-medium text-gray-700"> بحث </label>
          <div class="relative">
            <Search class="absolute right-3 top-2.5 h-4 w-4 text-gray-500" />
            <Input type="text" placeholder="ابحث عن اسم او وصف او الرقم المرجعي" class="pr-10" />
          </div>
        </div>
        <div>
          <hr class="my-4 border border-gray-100 border-dashed" />
        </div>

        <!-- Funding Type -->
        <div class="space-y-3">
          <label class="text-sm text-gray-600">نوع التمويل</label>
          <div class="space-y-2">
            <div class="flex items-center gap-2">
              <Checkbox id="all" />
              <label for="all" class="text-sm">الكل</label>
            </div>
            <div class="flex items-center gap-2">
              <Checkbox id="government" />
              <label for="government" class="text-sm">البرنامج الحكومي</label>
            </div>
            <div class="flex items-center gap-2">
              <Checkbox id="investment" />
              <label for="investment" class="text-sm">الموازنة الاستثمارية</label>
            </div>
            <div class="flex items-center gap-2">
              <Checkbox id="operational" />
              <label for="operational" class="text-sm">الموازنة التشغيلية</label>
            </div>
            <div class="flex items-center gap-2">
              <Checkbox id="environment" />
              <label for="environment" class="text-sm">صندوق حماية وتحسين البيئة</label>
            </div>
          </div>
        </div>

        <div>
          <hr class="my-4 border border-gray-100 border-dashed" />
        </div>

        <!-- Budget Range -->
        <div class="mt-4 space-y-3">
          <label class="text-sm font-medium text-gray-700">المبلغ</label>
          <div class="space-y-4">
            <Slider
              v-model="budgetRange"
              :min="100000"
              :max="9000000"
              :step="100000"
              class="w-full"
            />
            <div class="grid grid-cols-2 gap-4">
              <div class="space-y-2">
                <label class="text-xs text-gray-500">الحد الادنى</label>
                <div class="relative">
                  <Input
                    v-model="budgetRange[0]"
                    type="number"
                    :min="100000"
                    :max="budgetRange[1]"
                  />
                  <span class="absolute text-sm text-gray-500 -translate-y-1/2 left-2 top-1/2"
                    >د.ع</span
                  >
                </div>
              </div>
              <div class="space-y-2">
                <label class="text-xs text-gray-500">الحد الاعلى</label>
                <div class="relative">
                  <Input
                    v-model="budgetRange[1]"
                    type="number"
                    :min="budgetRange[0]"
                    :max="9000000"
                  />
                  <span class="absolute text-sm text-gray-500 -translate-y-1/2 left-2 top-1/2"
                    >د.ع</span
                  >
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Implementation Years -->
        <div class="space-y-2">
          <label class="text-sm text-gray-600">سنوات التنفيذ</label>
          <Select>
            <SelectTrigger>
              <SelectValue placeholder="جميع المواعيد" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="all">جميع المواعيد</SelectItem>
                <SelectItem value="2024">2024</SelectItem>
                <SelectItem value="2023">2023</SelectItem>
                <SelectItem value="2022">2022</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>

        <div>
          <hr class="my-4 border border-gray-100 border-dashed" />
        </div>

        <!-- Project Status -->
        <div class="space-y-3">
          <label class="text-sm font-medium text-gray-700">حالة المشروع</label>
          <div class="space-y-2">
            <div class="flex items-center gap-2">
              <Checkbox id="status-all" />
              <label for="status-all" class="text-sm">الكل</label>
            </div>
            <div class="flex items-center gap-2">
              <Checkbox id="status-completed" />
              <div class="flex items-center gap-2">
                <span class="inline-block w-2 h-2 bg-green-500 rounded-full"></span>
                <label for="status-completed" class="text-sm">منجز</label>
              </div>
            </div>
            <div class="flex items-center gap-2">
              <Checkbox id="status-in-progress" />
              <div class="flex items-center gap-2">
                <span class="inline-block w-2 h-2 bg-yellow-500 rounded-full"></span>
                <label for="status-in-progress" class="text-sm">قيد الانجاز</label>
              </div>
            </div>
            <div class="flex items-center gap-2">
              <Checkbox id="status-delayed" />
              <div class="flex items-center gap-2">
                <span class="inline-block w-2 h-2 bg-red-500 rounded-full"></span>
                <label for="status-delayed" class="text-sm">متلكئ</label>
              </div>
            </div>
          </div>

          <div>
            <hr class="my-4 border border-gray-100 border-dashed" />
          </div>
        </div>

        <!-- Beneficiary -->
        <div class="space-y-3">
          <label class="text-sm font-medium text-gray-700">الجهة المستفيدة</label>
          <div class="space-y-2">
            <div class="flex items-center gap-2">
              <Checkbox id="beneficiary-all" v-model="selectedBeneficiaries.all" />
              <label for="beneficiary-all" class="text-sm">الكل</label>
            </div>
            <div class="flex items-center gap-2">
              <Checkbox id="beneficiary-baghdad" v-model="selectedBeneficiaries.baghdadEducation" />
              <label for="beneficiary-baghdad" class="text-sm">مديرية تربية بغداد</label>
            </div>
            <div class="flex items-center gap-2">
              <Checkbox
                id="beneficiary-environment"
                v-model="selectedBeneficiaries.environmentProtection"
              />
              <label for="beneficiary-environment" class="text-sm">دائرة حماية تحسين بيئة</label>
            </div>
            <div class="flex items-center gap-2">
              <Checkbox id="beneficiary-najaf" v-model="selectedBeneficiaries.najafEducation" />
              <label for="beneficiary-najaf" class="text-sm">مديرية تربية النجف</label>
            </div>
            <div class="flex items-center gap-2">
              <Checkbox id="beneficiary-basra" v-model="selectedBeneficiaries.basraEducation" />
              <label for="beneficiary-basra" class="text-sm">مديرية تربية البصرة</label>
            </div>
          </div>
        </div>

        <div>
          <hr class="my-4 border border-gray-100 border-dashed" />
        </div>
        <div class="flex gap-3 mt-6">
          <Button variant="outline" class="flex-1 text-gray-700"> الغاء </Button>
          <Button class="flex-1 bg-slate-700"> تطبيق </Button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
  import { ref } from 'vue';
  import { FilterIcon, Search } from 'lucide-vue-next';
  import { Button } from '@/components/ui/button';
  import { Input } from '@/components/ui/input';
  import { Checkbox } from '@/components/ui/checkbox';
  import { Slider } from '@/components/ui/slider';
  import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
  } from '@/components/ui/select';

  const budgetRange = ref([100000, 9000000]);

  const selectedStatuses = ref({
    all: true,
    completed: false,
    inProgress: false,
    delayed: false,
  });

  const selectedBeneficiaries = ref({
    all: true,
    baghdadEducation: false,
    environmentProtection: false,
    najafEducation: false,
    basraEducation: false,
  });
</script>
