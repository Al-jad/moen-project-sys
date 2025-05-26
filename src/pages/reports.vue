<template>
  <DefaultLayout>
    <div class="dark:bg-darkmode space-y-6 bg-gray-200 p-6">
      <div class="mb-2 flex items-center justify-between">
        <div class="flex items-center justify-between gap-2">
          <BackToMainButton />
          <h1 class="text-2xl font-bold text-gray-900 dark:text-white">التقارير</h1>
        </div>

        <!-- Notification Banner -->

        <div class="flex items-center gap-2">
          <CustomSelect
            v-model="selectedYear"
            :options="yearOptions"
            placeholder="اختر السنة"
            :triggerClass="'w-[200px]'"
            :TriggerIcon="'lucide:calendar'"
          />
        </div>
      </div>
      <Premium />

      <!-- Project Progress Report -->
      <div class="relative">
        <div class="absolute inset-0 z-10 cursor-not-allowed"></div>
        <Card class="border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-900">
          <CardHeader className="space-y-1">
            <div class="mb-4 flex items-center justify-between p-2">
              <CardTitle class="text-gray-900 dark:text-white">تقرير تقدم العمل للمشروع</CardTitle>
              <div class="flex items-center gap-2">
                <div class="min-w-[200px]">
                  <CustomSelect
                    v-model="selectedProject"
                    :options="projectOptions"
                    placeholder="اختر المشروع"
                    :triggerClass="'w-full'"
                    :TriggerIcon="'lucide:folder'"
                  />
                </div>
                <Button variant="outline" class="gap-2 dark:bg-gray-700 dark:hover:bg-gray-600">
                  <Icon icon="lucide:file-down" class="h-4 w-4" />
                  تصدير
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div class="grid grid-cols-3 gap-4">
              <Card class="border dark:border-gray-700 dark:bg-gray-800">
                <CardHeader>
                  <CardTitle class="text-lg text-gray-900 dark:text-white"
                    >نسبة الإنجاز الكلية</CardTitle
                  >
                </CardHeader>
                <CardContent>
                  <div class="flex items-center gap-4">
                    <div class="h-20 w-20">
                      <RadialProgress :progress="85" variant="success" />
                    </div>
                    <div class="space-y-1">
                      <p class="text-2xl font-bold text-success">85%</p>
                      <p class="text-sm text-muted-foreground dark:text-gray-400"
                        >من إجمالي المشروع</p
                      >
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card class="border dark:border-gray-700 dark:bg-gray-800">
                <CardHeader>
                  <CardTitle class="text-lg text-gray-900 dark:text-white"
                    >المدة المتبقية</CardTitle
                  >
                </CardHeader>
                <CardContent>
                  <div class="flex items-center gap-4">
                    <div class="rounded-lg bg-primary/10 p-3 dark:bg-primary/5">
                      <Icon icon="lucide:clock" class="h-8 w-8 text-primary dark:text-primary" />
                    </div>
                    <div class="space-y-1">
                      <p class="text-2xl font-bold text-gray-900 dark:text-white">45 يوم</p>
                      <p class="text-sm text-muted-foreground dark:text-gray-400"
                        >متبقي حتى الانتهاء</p
                      >
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card class="border dark:border-gray-700 dark:bg-gray-800">
                <CardHeader>
                  <CardTitle class="text-lg text-gray-900 dark:text-white"
                    >الميزانية المستهلكة</CardTitle
                  >
                </CardHeader>
                <CardContent>
                  <div class="flex items-center gap-4">
                    <div class="rounded-lg bg-success/10 p-3 dark:bg-success/5">
                      <Icon icon="lucide:dollar-sign" class="h-8 w-8 text-success" />
                    </div>
                    <div class="space-y-1">
                      <p class="text-2xl font-bold text-gray-900 dark:text-white">65%</p>
                      <p class="text-sm text-muted-foreground dark:text-gray-400"
                        >من الميزانية الكلية</p
                      >
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </CardContent>
        </Card>
      </div>

      <!-- Financial Report -->
      <div class="relative">
        <div class="absolute inset-0 z-10 cursor-not-allowed"></div>
        <Card class="border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-900">
          <CardHeader>
            <div class="flex items-center justify-between">
              <div class="space-y-1">
                <CardTitle class="text-gray-900 dark:text-white">
                  التقرير المالي للسنة المالية {{ selectedYear || '2024' }}
                </CardTitle>
                <p class="text-sm text-muted-foreground dark:text-gray-400">
                  تقرير شامل للمصروفات والميزانيات والتخصيصات المالية
                </p>
              </div>
              <div class="flex items-center gap-2">
                <div class="min-w-[200px]">
                  <CustomSelect
                    v-model="selectedReportType"
                    :options="reportTypeOptions"
                    placeholder="نوع التقرير"
                    :triggerClass="'w-full'"
                    :TriggerIcon="'line-md:document-report'"
                  />
                </div>
                <PrimaryButton
                  variant="outline"
                  class="gap-2 dark:bg-gray-700 dark:hover:bg-gray-600"
                  icon="lucide:file-down"
                >
                  تصدير
                </PrimaryButton>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div class="grid gap-6">
              <!-- Summary Cards -->
              <div class="grid grid-cols-4 gap-4">
                <Card
                  className="border rounded-lg border-gray-200 dark:border-gray-700 shadow-sm bg-primary/5 dark:bg-gray-800"
                >
                  <CardContent className="p-6">
                    <div class="flex flex-col gap-2">
                      <span class="text-sm text-muted-foreground dark:text-gray-400"
                        >إجمالي الميزانية</span
                      >
                      <span class="text-2xl font-bold text-gray-900 dark:text-white"
                        >15,234,567</span
                      >
                      <span class="text-sm text-muted-foreground dark:text-gray-400"
                        >دينار عراقي</span
                      >
                    </div>
                  </CardContent>
                </Card>
                <Card
                  className="border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm bg-success/5 dark:bg-gray-800"
                >
                  <CardContent className="p-6">
                    <div class="flex flex-col gap-2">
                      <span class="text-sm text-muted-foreground dark:text-gray-400"
                        >المبالغ المصروفة</span
                      >
                      <span class="text-2xl font-bold text-success">8,567,890</span>
                      <span class="text-sm text-success">56% من الميزانية</span>
                    </div>
                  </CardContent>
                </Card>
                <Card
                  className="border rounded-lg border-gray-200 dark:border-gray-700 shadow-sm bg-warning/5 dark:bg-gray-800"
                >
                  <CardContent className="p-6">
                    <div class="flex flex-col gap-2">
                      <span class="text-sm text-muted-foreground dark:text-gray-400"
                        >المبالغ المتبقية</span
                      >
                      <span class="text-2xl font-bold text-warning">6,666,677</span>
                      <span class="text-sm text-warning">44% من الميزانية</span>
                    </div>
                  </CardContent>
                </Card>
                <Card
                  className="border rounded-lg border-gray-200 dark:border-gray-700 shadow-sm bg-destructive/5 dark:bg-gray-800"
                >
                  <CardContent className="p-6">
                    <div class="flex flex-col gap-2">
                      <span class="text-sm text-muted-foreground dark:text-gray-400"
                        >المبالغ المرجعة</span
                      >
                      <span class="text-2xl font-bold text-destructive">123,456</span>
                      <span class="text-sm text-destructive">0.8% من الميزانية</span>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <!-- Detailed Stats -->
              <div class="grid grid-cols-2 gap-4">
                <Card
                  className="border border-gray-200 dark:border-gray-700 shadow-sm bg-gray-50/50 dark:bg-gray-900"
                >
                  <CardHeader>
                    <CardTitle class="text-base text-muted-foreground dark:text-gray-400"
                      >تفاصيل المشاريع</CardTitle
                    >
                  </CardHeader>
                  <CardContent class="space-y-4">
                    <div class="flex items-center justify-between">
                      <div class="flex items-center gap-2">
                        <Badge variant="success" className="h-2 w-2 rounded-full p-0" />
                        <span class="text-sm text-gray-900 dark:text-white">المشاريع المنجزة</span>
                      </div>
                      <div class="flex items-center gap-2">
                        <Badge variant="outline" class="h-6 dark:border-gray-600">12 مشروع</Badge>
                        <Badge
                          variant="outline"
                          class="h-6 bg-success/10 text-success dark:bg-success/20"
                          >4,567,890 د.ع</Badge
                        >
                      </div>
                    </div>
                    <div class="flex items-center justify-between">
                      <div class="flex items-center gap-2">
                        <Badge variant="default" className="h-2 w-2 rounded-full p-0" />
                        <span class="text-sm text-gray-900 dark:text-white"
                          >المشاريع قيد التنفيذ</span
                        >
                      </div>
                      <div class="flex items-center gap-2">
                        <Badge variant="outline" class="h-6 dark:border-gray-600">8 مشاريع</Badge>
                        <Badge
                          variant="outline"
                          class="h-6 bg-warning/10 text-warning dark:bg-warning/20"
                          >3,890,450 د.ع</Badge
                        >
                      </div>
                    </div>
                    <div class="flex items-center justify-between">
                      <div class="flex items-center gap-2">
                        <Badge variant="destructive" className="h-2 w-2 rounded-full p-0" />
                        <span class="text-sm text-gray-900 dark:text-white">المشاريع المتلكئة</span>
                      </div>
                      <div class="flex items-center gap-2">
                        <Badge variant="outline" class="h-6 dark:border-gray-600">3 مشاريع</Badge>
                        <Badge
                          variant="outline"
                          class="h-6 bg-destructive/10 text-destructive dark:bg-destructive/20"
                          >890,450 د.ع</Badge
                        >
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card
                  className="border border-gray-200 dark:border-gray-700 shadow-sm bg-gray-50/50 dark:bg-gray-900"
                >
                  <CardHeader>
                    <CardTitle class="text-base text-muted-foreground dark:text-gray-400"
                      >التخصيصات المالية</CardTitle
                    >
                  </CardHeader>
                  <CardContent class="space-y-4">
                    <div class="flex items-center justify-between">
                      <div class="flex items-center gap-2">
                        <Badge variant="default" className="h-2 w-2 rounded-full p-0" />
                        <span class="text-sm text-gray-900 dark:text-white">المبالغ المرصودة</span>
                      </div>
                      <div class="space-y-1">
                        <Badge variant="outline" class="h-6 dark:border-gray-600"
                          >15,234,567 د.ع</Badge
                        >
                        <div class="text-left text-xs text-muted-foreground dark:text-gray-400"
                          >تم تخصيصها في 15/1/2024</div
                        >
                      </div>
                    </div>
                    <div class="flex items-center justify-between">
                      <div class="flex items-center gap-2">
                        <Badge variant="success" className="h-2 w-2 rounded-full p-0" />
                        <span class="text-sm text-gray-900 dark:text-white">المبالغ المصروفة</span>
                      </div>
                      <div class="space-y-1">
                        <Badge
                          variant="outline"
                          class="h-6 bg-success/10 text-success dark:bg-success/20"
                          >8,567,890 د.ع</Badge
                        >
                        <div class="text-left text-xs text-success">56% من الميزانية الكلية</div>
                      </div>
                    </div>
                    <div class="flex items-center justify-between">
                      <div class="flex items-center gap-2">
                        <Badge variant="destructive" className="h-2 w-2 rounded-full p-0" />
                        <span class="text-sm text-gray-900 dark:text-white">المبالغ المرجعة</span>
                      </div>
                      <div class="space-y-1">
                        <Badge
                          variant="outline"
                          class="h-6 bg-destructive/10 text-destructive dark:bg-destructive/20"
                          >123,456 د.ع</Badge
                        >
                        <div class="text-left text-xs text-destructive">تم إرجاعها في 1/3/2024</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <!-- Progress Indicators -->
              <Card
                className="border border-gray-200 dark:border-gray-700 shadow-sm bg-gray-50/50 dark:bg-gray-900"
              >
                <CardHeader>
                  <CardTitle class="text-base text-muted-foreground dark:text-gray-400"
                    >مؤشرات الأداء المالي</CardTitle
                  >
                </CardHeader>
                <CardContent>
                  <div class="grid grid-cols-3 gap-8">
                    <div class="flex items-center gap-4">
                      <div class="h-16 w-16">
                        <RadialProgress :progress="56" variant="success" />
                      </div>
                      <div class="space-y-1">
                        <p class="font-medium text-gray-900 dark:text-white">نسبة الصرف</p>
                        <p class="text-sm text-success">8.5 مليار من 15.2 مليار</p>
                      </div>
                    </div>
                    <div class="flex items-center gap-4">
                      <div class="h-16 w-16">
                        <RadialProgress :progress="44" variant="warning" />
                      </div>
                      <div class="space-y-1">
                        <p class="font-medium text-gray-900 dark:text-white">المبالغ المتبقية</p>
                        <p class="text-sm text-warning">6.6 مليار متبقي</p>
                      </div>
                    </div>
                    <div class="flex items-center gap-4">
                      <div class="h-16 w-16">
                        <RadialProgress :progress="85" variant="primary" />
                      </div>
                      <div class="space-y-1">
                        <p class="font-medium text-gray-900 dark:text-white">كفاءة الإنفاق</p>
                        <p class="text-sm text-primary">85% معدل الكفاءة</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  </DefaultLayout>
</template>

<script setup lang="ts">
  import BackToMainButton from '@/components/BackToMainButton.vue';
  import CustomSelect from '@/components/CustomSelect.vue';
  import Premium from '@/components/Premium.vue';
  import PrimaryButton from '@/components/PrimaryButton.vue';
  import RadialProgress from '@/components/RadialProgress.vue';
  import { Badge } from '@/components/ui/badge';
  import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
  import DefaultLayout from '@/layouts/DefaultLayout.vue';
  import { Icon } from '@iconify/vue';

  interface SelectOption {
    value: string;
    label: string;
    icon?: string;
  }

  // Select Options Configuration
  const yearOptions: SelectOption[] = [
    { value: '2024', label: '2024', icon: 'lucide:calendar' },
    { value: '2023', label: '2023', icon: 'lucide:calendar' },
    { value: '2022', label: '2022', icon: 'lucide:calendar' },
  ];

  const projectOptions: SelectOption[] = [
    { value: 'all', label: 'الكل', icon: 'lucide:layout-grid' },
    { value: '1', label: 'مشروع تجهيز محطات الخمس', icon: 'lucide:folder' },
    { value: '2', label: 'مشروع تجهيز مضخات المياه', icon: 'lucide:folder' },
  ];

  const reportTypeOptions: SelectOption[] = [
    { value: 'detailed', label: 'تقرير تفصيلي', icon: 'lucide:file-text' },
    { value: 'summary', label: 'تقرير ملخص', icon: 'lucide:file-bar-chart' },
    { value: 'quarterly', label: 'تقرير ربع سنوي', icon: 'lucide:calendar-range' },
  ];

  const selectedYear = ref('');
  const selectedProject = ref('');
  const selectedReportType = ref('');
</script>
