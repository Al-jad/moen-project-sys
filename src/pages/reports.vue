<template>
  <DefaultLayout>
    <div class="p-6 space-y-6 bg-gray-200">
      <div class="flex items-center justify-between mb-2">
        <div class="flex items-center justify-between gap-2">
          <Button variant="link" class="gap-2 text-blue-500 hover:text-blue-600 hover:underline">
            <ArrowRight class="w-4 h-4" />
            الرئيسية
          </Button>
          <h1 class="text-2xl font-bold">التقارير</h1>
        </div>
        <div class="flex items-center gap-2">
          <Popover>
            <PopoverTrigger>
              <Button variant="outline" class="flex justify-start w-56 text-black">
                <CalendarIcon class="w-4 h-4 ml-2 text-gray-400" />
                {{ dateFrom ? formatDate(dateFrom) : 'اختر السنة' }}
              </Button>
            </PopoverTrigger>
            <PopoverContent class="w-auto p-0">
              <Calendar v-model="dateFrom" />
            </PopoverContent>
          </Popover>
        </div>
      </div>

      <!-- Project Progress Report -->
      <Card class="p-4">
        <CardHeader className="space-y-1">
          <div class="flex items-center justify-between p-2 mb-4">
            <CardTitle>تقرير تقدم العمل للمشروع</CardTitle>
            <div class="flex items-center gap-2">
              <Select>
                <SelectTrigger class="w-[240px]">
                  <SelectValue placeholder="اختر المشروع" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">مشروع تجهيز محطات الخمس</SelectItem>
                  <SelectItem value="2">مشروع تجهيز مضخات المياه</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" class="gap-2">
                <FileDown class="w-4 h-4" />
                تصدير
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div class="grid grid-cols-3 gap-4">
            <Card>
              <CardHeader>
                <CardTitle class="text-lg">نسبة الإنجاز الكلية</CardTitle>
              </CardHeader>
              <CardContent>
                <div class="flex items-center gap-4">
                  <div class="w-20 h-20">
                    <RadialProgress :progress="85" variant="success" />
                  </div>
                  <div class="space-y-1">
                    <p class="text-2xl font-bold text-success">85%</p>
                    <p class="text-sm text-muted-foreground">من إجمالي المشروع</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle class="text-lg">المدة المتبقية</CardTitle>
              </CardHeader>
              <CardContent>
                <div class="flex items-center gap-4">
                  <div class="p-3 rounded-lg bg-primary/10">
                    <Clock class="w-8 h-8 text-primary" />
                  </div>
                  <div class="space-y-1">
                    <p class="text-2xl font-bold">45 يوم</p>
                    <p class="text-sm text-muted-foreground">متبقي حتى الانتهاء</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle class="text-lg">الميزانية المستهلكة</CardTitle>
              </CardHeader>
              <CardContent>
                <div class="flex items-center gap-4">
                  <div class="p-3 rounded-lg bg-success/10">
                    <DollarSign class="w-8 h-8 text-success" />
                  </div>
                  <div class="space-y-1">
                    <p class="text-2xl font-bold">65%</p>
                    <p class="text-sm text-muted-foreground">من الميزانية الكلية</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>

      <!-- Financial Report -->
      <Card>
        <CardHeader>
          <div class="flex items-center justify-between">
            <div class="space-y-1">
              <CardTitle>التقرير المالي للسنة المالية {{ dateFrom ? formatDate(dateFrom) : '2024' }}</CardTitle>
              <p class="text-sm text-muted-foreground">تقرير شامل للمصروفات والميزانيات والتخصيصات المالية</p>
            </div>
            <div class="flex items-center gap-2">
              <Select>
                <SelectTrigger class="w-[180px]">
                  <SelectValue placeholder="نوع التقرير" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="detailed">تقرير تفصيلي</SelectItem>
                  <SelectItem value="summary">تقرير ملخص</SelectItem>
                  <SelectItem value="quarterly">تقرير ربع سنوي</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" class="gap-2">
                <FileDown class="w-4 h-4" />
                تصدير التقرير
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div class="grid gap-6">
            <!-- Summary Cards -->
            <div class="grid grid-cols-4 gap-4">
              <Card className="border-none shadow-none bg-primary/5">
                <CardContent className="p-6">
                  <div class="flex flex-col gap-2">
                    <span class="text-sm text-muted-foreground">إجمالي الميزانية</span>
                    <span class="text-2xl font-bold">15,234,567</span>
                    <span class="text-sm text-muted-foreground">دينار عراقي</span>
                  </div>
                </CardContent>
              </Card>
              <Card className="border-none shadow-none bg-success/5">
                <CardContent className="p-6">
                  <div class="flex flex-col gap-2">
                    <span class="text-sm text-muted-foreground">المبالغ المصروفة</span>
                    <span class="text-2xl font-bold text-success">8,567,890</span>
                    <span class="text-sm text-success">56% من الميزانية</span>
                  </div>
                </CardContent>
              </Card>
              <Card className="border-none shadow-none bg-warning/5">
                <CardContent className="p-6">
                  <div class="flex flex-col gap-2">
                    <span class="text-sm text-muted-foreground">المبالغ المتبقية</span>
                    <span class="text-2xl font-bold text-warning">6,666,677</span>
                    <span class="text-sm text-warning">44% من الميزانية</span>
                  </div>
                </CardContent>
              </Card>
              <Card className="border-none shadow-none bg-destructive/5">
                <CardContent className="p-6">
                  <div class="flex flex-col gap-2">
                    <span class="text-sm text-muted-foreground">المبالغ المرجعة</span>
                    <span class="text-2xl font-bold text-destructive">123,456</span>
                    <span class="text-sm text-destructive">0.8% من الميزانية</span>
                  </div>
                </CardContent>
              </Card>
            </div>

            <!-- Detailed Stats -->
            <div class="grid grid-cols-2 gap-4">
              <Card className="border-none shadow-none bg-gray-50/50">
                <CardHeader>
                  <CardTitle class="text-base text-muted-foreground">تفاصيل المشاريع</CardTitle>
                </CardHeader>
                <CardContent class="space-y-4">
                  <div class="flex items-center justify-between">
                    <div class="flex items-center gap-2">
                      <Badge variant="success" className="h-2 w-2 rounded-full p-0" />
                      <span class="text-sm">المشاريع المنجزة</span>
                    </div>
                    <div class="flex items-center gap-2">
                      <Badge variant="outline" class="h-6">12 مشروع</Badge>
                      <Badge variant="outline" class="h-6 bg-success/10 text-success">4,567,890 د.ع</Badge>
                    </div>
                  </div>
                  <div class="flex items-center justify-between">
                    <div class="flex items-center gap-2">
                      <Badge variant="warning" className="h-2 w-2 rounded-full p-0" />
                      <span class="text-sm">المشاريع قيد التنفيذ</span>
                    </div>
                    <div class="flex items-center gap-2">
                      <Badge variant="outline" class="h-6">8 مشاريع</Badge>
                      <Badge variant="outline" class="h-6 bg-warning/10 text-warning">3,890,450 د.ع</Badge>
                    </div>
                  </div>
                  <div class="flex items-center justify-between">
                    <div class="flex items-center gap-2">
                      <Badge variant="destructive" className="h-2 w-2 rounded-full p-0" />
                      <span class="text-sm">المشاريع المتلكئة</span>
                    </div>
                    <div class="flex items-center gap-2">
                      <Badge variant="outline" class="h-6">3 مشاريع</Badge>
                      <Badge variant="outline" class="h-6 bg-destructive/10 text-destructive">890,450 د.ع</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-none shadow-none bg-gray-50/50">
                <CardHeader>
                  <CardTitle class="text-base text-muted-foreground">التخصيصات المالية</CardTitle>
                </CardHeader>
                <CardContent class="space-y-4">
                  <div class="flex items-center justify-between">
                    <div class="flex items-center gap-2">
                      <Badge variant="primary" className="h-2 w-2 rounded-full p-0" />
                      <span class="text-sm">المبالغ المرصودة</span>
                    </div>
                    <div class="space-y-1">
                      <Badge variant="outline" class="h-6">15,234,567 د.ع</Badge>
                      <div class="text-xs text-left text-muted-foreground">تم تخصيصها في 15/1/2024</div>
                    </div>
                  </div>
                  <div class="flex items-center justify-between">
                    <div class="flex items-center gap-2">
                      <Badge variant="success" className="h-2 w-2 rounded-full p-0" />
                      <span class="text-sm">المبالغ المصروفة</span>
                    </div>
                    <div class="space-y-1">
                      <Badge variant="outline" class="h-6 bg-success/10 text-success">8,567,890 د.ع</Badge>
                      <div class="text-xs text-left text-success">56% من الميزانية الكلية</div>
                    </div>
                  </div>
                  <div class="flex items-center justify-between">
                    <div class="flex items-center gap-2">
                      <Badge variant="destructive" className="h-2 w-2 rounded-full p-0" />
                      <span class="text-sm">المبالغ المرجعة</span>
                    </div>
                    <div class="space-y-1">
                      <Badge variant="outline" class="h-6 bg-destructive/10 text-destructive">123,456 د.ع</Badge>
                      <div class="text-xs text-left text-destructive">تم إرجاعها في 1/3/2024</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <!-- Progress Indicators -->
            <Card className="border-none shadow-none bg-gray-50/50">
              <CardHeader>
                <CardTitle class="text-base text-muted-foreground">مؤشرات الأداء المالي</CardTitle>
              </CardHeader>
              <CardContent>
                <div class="grid grid-cols-3 gap-8">
                  <div class="flex items-center gap-4">
                    <div class="w-16 h-16">
                      <RadialProgress :progress="56" variant="success" />
                    </div>
                    <div class="space-y-1">
                      <p class="font-medium">نسبة الصرف</p>
                      <p class="text-sm text-success">8.5 مليار من 15.2 مليار</p>
                    </div>
                  </div>
                  <div class="flex items-center gap-4">
                    <div class="w-16 h-16">
                      <RadialProgress :progress="44" variant="warning" />
                    </div>
                    <div class="space-y-1">
                      <p class="font-medium">المبالغ المتبقية</p>
                      <p class="text-sm text-warning">6.6 مليار متبقي</p>
                    </div>
                  </div>
                  <div class="flex items-center gap-4">
                    <div class="w-16 h-16">
                      <RadialProgress :progress="85" variant="primary" />
                    </div>
                    <div class="space-y-1">
                      <p class="font-medium">كفاءة الإنفاق</p>
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
  </DefaultLayout>
</template>

<script setup>
import DefaultLayout from '@/layouts/DefaultLayout.vue'
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Calendar } from '@/components/ui/calendar'
import { FileDown, Calendar as CalendarIcon, Clock, DollarSign, ArrowRight } from 'lucide-vue-next'
import RadialProgress from '@/components/RadialProgress.vue'
import { format } from 'date-fns'
import { ar } from 'date-fns/locale'
import { ref } from 'vue'

const dateFrom = ref('')

const formatDate = (date) => {
  if (!date) return ''
  return format(date, 'yyyy', { locale: ar })
}
</script>