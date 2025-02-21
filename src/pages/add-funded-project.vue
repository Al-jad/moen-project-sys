<template>
  <DefaultLayout>
    <div class="flex flex-col gap-4 p-6 min-h-screen bg-gray-200 dark:bg-gray-900">
      <div class="mx-auto w-full max-w-6xl">
        <h1 class="py-4 pb-6 text-2xl font-bold text-right text-gray-900 dark:text-gray-100"
          >اضافة مشروع - ممول</h1
        >
        <FormSection title="التفاصيل العامة للمشروع" class="dark:border-gray-700">
          <FormField label="اسم المشروع" class="md:col-span-2">
            <CustomInput
              v-model="store.form.projectName"
              dir="rtl"
              placeholder="خطة التكييف المحلية LAPS"
            />
          </FormField>
          <FormField label="الدائرة المنفذة">
            <CustomInput
              v-model="store.form.executingDepartment"
              dir="rtl"
              placeholder="الدائرة المنفذة"
            />
          </FormField>
          <FormField label="الجهة المنفذة">
            <CustomInput
              v-model="store.form.executingEntity"
              dir="rtl"
              placeholder="برنامج الاغذية العالمي World Food Program"
            />
          </FormField>
          <FormField label="الجهات المستفيدة من المشروع" class="md:col-span-2">
            <div class="space-y-2">
              <div
                v-for="(beneficiary, index) in store.form.beneficiaries"
                :key="index"
                class="flex gap-2 items-center"
              >
                <CustomInput
                  v-model="store.form.beneficiaries[index]"
                  dir="rtl"
                  placeholder="ادخل اسم الجهة المستفيدة"
                  class="flex-1"
                />
                <button
                  type="button"
                  class="text-red-500 hover:text-red-600"
                  @click="removeBeneficiary(index)"
                >
                  <X class="w-4 h-4" />
                </button>
              </div>
              <PrimaryButton variant="outline" @click="addBeneficiary" size="sm">
                اضافة جهة مستفيدة
              </PrimaryButton>
            </div>
          </FormField>
          <FormField label="نوع التمويل">
            <CustomInput
              v-model="store.form.fundingType"
              value="دولي"
              dir="rtl"
              placeholder="دولي"
            />
          </FormField>
          <FormField label="كلفة المشروع بالدولار">
            <NumberInput v-model="store.form.totalCost" placeholder="165,000" unit="$" />
          </FormField>
          <FormField label="الهدف من المشروع" class="md:col-span-2">
            <Textarea
              v-model="store.form.projectGoal"
              dir="rtl"
              placeholder="اعداد وثائق خطة التكييف المحلية LAPs لستة من المحافظات العراقية وهي (البصرة، ميسان، المثنى، ديالى، صلاح الدين، نينوى) الاكثر هشاشة لتجاه التغيرات المناخية"
              class="min-h-[100px] dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
            />
          </FormField>
        </FormSection>
        <FormSection title="المدة والفترة الزمنية">
          <FormField label="مدة التنفيذ" class="md:col-span-2">
            <div class="flex flex-col gap-4 items-start sm:flex-row sm:items-center">
              <div class="w-full sm:w-48">
                <NumberInput
                  v-model="store.form.duration"
                  placeholder="ادخل المدة"
                  class="w-full"
                />
              </div>
              <RadioGroup
                v-model="store.form.durationType"
                class="flex gap-6 p-2 rounded-lg border dark:border-gray-700"
              >
                <div class="flex gap-3 items-center">
                  <RadioGroupItem value="weeks" id="duration-weeks" class="dark:border-gray-700" />
                  <Label for="duration-weeks" class="text-sm font-medium dark:text-gray-300"
                    >اسبوع</Label
                  >
                </div>
                <div class="flex gap-3 items-center">
                  <RadioGroupItem
                    value="months"
                    id="duration-months"
                    class="dark:border-gray-700"
                  />
                  <Label for="duration-months" class="text-sm font-medium dark:text-gray-300"
                    >شهر</Label
                  >
                </div>
              </RadioGroup>
            </div>
          </FormField>
          <FormField label="نوع الفترة الزمنية للفعاليات" class="md:col-span-2">
            <div class="flex flex-col gap-4">
              <div
                class="flex justify-between items-center p-4 bg-white rounded-lg border dark:border-gray-700 dark:bg-gray-800"
              >
                <div class="flex gap-3 items-center">
                  <RadioGroup v-model="store.form.periodType" class="flex gap-6">
                    <div class="flex gap-2 items-center">
                      <RadioGroupItem
                        value="weekly"
                        id="period-weekly"
                        class="dark:border-gray-700"
                      />
                      <div class="flex flex-col">
                        <Label for="period-weekly" class="font-medium dark:text-gray-300"
                          >اسبوعي</Label
                        >
                      </div>
                    </div>
                    <div class="flex gap-2 items-center">
                      <RadioGroupItem
                        value="monthly"
                        id="period-monthly"
                        class="dark:border-gray-700"
                      />
                      <div class="flex flex-col">
                        <Label for="period-monthly" class="font-medium dark:text-gray-300"
                          >شهري</Label
                        >
                      </div>
                    </div>
                  </RadioGroup>
                </div>
                <div class="text-sm text-gray-500 dark:text-gray-400">
                  {{
                    store.form.periodType === 'weekly'
                      ? store.form.durationType === 'weeks'
                        ? `عدد الاسابيع: ${store.form.duration || 0}`
                        : `عدد الاسابيع: ${(store.form.duration || 0) * 4}`
                      : store.form.durationType === 'months'
                        ? `عدد الاشهر: ${store.form.duration || 0}`
                        : `عدد الاشهر: ${Math.ceil((store.form.duration || 0) / 4)}`
                  }}
                </div>
              </div>
              <div
                class="p-3 text-sm text-gray-500 bg-gray-50 rounded-lg border dark:border-gray-700 dark:bg-gray-800/50 dark:text-gray-400"
              >
                {{
                  store.form.periodType === 'weekly'
                    ? 'سيتم تقسيم مدة المشروع الى اسابيع لتحديد فترة كل فعالية'
                    : 'سيتم تقسيم مدة المشروع الى اشهر لتحديد فترة كل فعالية'
                }}
              </div>
            </div>
          </FormField>
          <FormField label="التاريخ الفعلي لبدء المشروع" class="md:col-span-2">
            <div class="flex flex-col gap-4">
              <div class="flex gap-4 items-center">
                <DateInput
                  v-model="store.form.actualStartDate"
                  class="flex-1"
                  :min="new Date().toISOString().split('T')[0]"
                />
                <button
                  v-if="store.form.actualStartDate"
                  type="button"
                  class="flex gap-2 items-center px-4 h-10 text-sm text-gray-500 bg-white rounded-md border border-gray-200 transition-colors hover:bg-gray-50 hover:text-red-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-red-400"
                  @click="store.form.actualStartDate = null"
                >
                  <X class="w-4 h-4" />
                  مسح التاريخ
                </button>
              </div>
              <div
                class="flex justify-between items-center px-4 py-2 bg-white rounded-lg border dark:border-gray-700 dark:bg-gray-800"
              >
                <div class="flex gap-2 items-center">
                  <span class="text-sm font-medium text-gray-600 dark:text-gray-300">
                    {{ store.form.actualStartDate ? 'تاريخ البدء:' : 'لم يتم تحديد تاريخ البدء' }}
                  </span>
                  <span
                    v-if="store.form.actualStartDate"
                    class="text-sm text-gray-900 dark:text-gray-100"
                  >
                    {{ formatDate(store.form.actualStartDate) }}
                  </span>
                </div>
                <div
                  v-if="store.form.actualStartDate && store.form.duration"
                  class="text-sm text-gray-500 dark:text-gray-400"
                >
                  تاريخ الانتهاء المتوقع:
                  {{
                    calculateEndDate(
                      store.form.actualStartDate,
                      store.form.duration,
                      store.form.durationType
                    )
                  }}
                </div>
              </div>
            </div>
          </FormField>
        </FormSection>
        <FormSection title="مكونات المشروع">
          <div class="flex justify-between items-center mb-4">
            <span
              class="px-2 py-1 text-xs font-medium text-gray-600 bg-gray-100 rounded-full dark:bg-gray-700 dark:text-gray-300"
            >
              {{ store.form.components.length }} مكون
            </span>
          </div>
          <div class="space-y-6 md:col-span-2">
            <div
              v-for="(component, componentIndex) in store.form.components"
              :key="componentIndex"
              class="p-4 rounded-lg border dark:border-gray-700 dark:bg-gray-800"
            >
              <div class="flex justify-between items-center mb-4">
                <div class="flex gap-4 items-center">
                  <h3 class="text-lg font-medium dark:text-gray-100">
                    المكون رقم {{ componentIndex + 1 }}
                  </h3>
                </div>
                <Button variant="destructive" size="sm" @click="removeComponent(componentIndex)">
                  <X class="w-4 h-4" />
                </Button>
              </div>
              <div class="grid grid-cols-1 gap-y-4 gap-x-6 md:grid-cols-2">
                <FormField label="اسم المكون">
                  <CustomInput v-model="component.name" dir="rtl" placeholder="ادخل اسم المكون" />
                </FormField>
                <FormField label="المستهدف الكلي للمكون">
                  <NumberInput
                    v-model="component.totalTarget"
                    placeholder="ادخل المستهدف الكلي"
                    unit="%"
                  />
                </FormField>
              </div>
              <div class="mt-6">
                <div class="flex justify-between items-center mb-4">
                  <div class="flex gap-4 items-center">
                    <h4 class="font-medium dark:text-gray-100">الفعاليات</h4>
                    <span
                      v-if="component.activities.length > 0"
                      class="text-xs text-gray-500 dark:text-gray-400"
                    >
                      ({{ component.activities.length }} من الفعاليات)
                    </span>
                  </div>
                  <div class="flex gap-2 items-center">
                    <PrimaryButton variant="outline" @click="addActivity(componentIndex)" size="sm">
                      اضافة فعالية
                    </PrimaryButton>
                  </div>
                </div>
                <div class="space-y-4">
                  <div
                    v-for="(activity, activityIndex) in component.activities"
                    :key="activityIndex"
                    class="p-4 bg-gray-50 rounded-lg border dark:border-gray-700 dark:bg-gray-800"
                  >
                    <div class="flex justify-between items-center mb-4">
                      <h5 class="font-medium">الفعالية رقم {{ activityIndex + 1 }}</h5>
                      <Button
                        variant="destructive"
                        size="sm"
                        @click="removeActivity(componentIndex, activityIndex)"
                      >
                        <X class="w-4 h-4" />
                      </Button>
                    </div>
                    <div class="grid grid-cols-1 gap-y-4 gap-x-6 md:grid-cols-2">
                      <FormField label="اسم الفعالية">
                        <CustomInput
                          v-model="activity.name"
                          dir="rtl"
                          placeholder="ادخل اسم الفعالية"
                        />
                      </FormField>
                      <FormField label="المستهدف الكلي للفعالية">
                        <NumberInput
                          v-model="activity.totalTarget"
                          placeholder="ادخل المستهدف الكلي"
                          unit="%"
                        />
                      </FormField>
                      <div class="md:col-span-2">
                        <FormField label="الفترة الزمنية للفعالية">
                          <div v-if="totalPeriods > 0" class="space-y-4">
                            <div
                              class="flex justify-between items-center px-4 py-2 rounded-lg border bg-gray-50/50 dark:border-gray-700 dark:bg-gray-800/50"
                            >
                              <span class="text-sm font-medium text-gray-600 dark:text-gray-300">
                                {{
                                  store.form.periodType === 'weekly'
                                    ? `اختر الاسابيع (${activity.weeks?.length || 0} من ${totalPeriods})`
                                    : `اختر الاشهر (${activity.weeks?.length || 0} من ${totalPeriods})`
                                }}
                              </span>
                              <button
                                v-if="activity.weeks?.length"
                                type="button"
                                class="text-sm text-red-500 hover:text-red-600 dark:text-red-400 dark:hover:text-red-300"
                                @click="activity.weeks = []"
                              >
                                مسح التحديد
                              </button>
                            </div>
                            <div
                              class="grid gap-2 p-4 bg-white rounded-lg border dark:border-gray-700 dark:bg-gray-800"
                              :class="{
                                'grid-cols-4': totalPeriods <= 4,
                                'grid-cols-8': totalPeriods > 4 && totalPeriods <= 8,
                                'grid-cols-12': totalPeriods > 8,
                              }"
                            >
                              <div
                                v-for="period in totalPeriods"
                                :key="period"
                                class="flex flex-col items-center"
                              >
                                <span
                                  class="mb-2 text-sm font-medium text-gray-600 dark:text-gray-300"
                                >
                                  {{
                                    store.form.periodType === 'weekly' ? `${period}` : `${period}`
                                  }}
                                </span>
                                <button
                                  type="button"
                                  class="relative w-full h-12 rounded-md border transition-all duration-200 cursor-pointer group hover:border-blue-400 dark:hover:border-blue-500"
                                  :class="[
                                    activity.weeks?.includes(period)
                                      ? 'border-blue-500 bg-blue-500 dark:border-blue-600 dark:bg-blue-600'
                                      : 'border-gray-200 bg-white hover:bg-blue-50 dark:border-gray-600 dark:bg-gray-700 dark:hover:bg-gray-600',
                                  ]"
                                  @click.prevent="toggleActivityWeek(activity, period)"
                                >
                                  <span
                                    class="flex absolute inset-0 justify-center items-center text-xs font-medium"
                                    :class="[
                                      activity.weeks?.includes(period)
                                        ? 'text-white'
                                        : 'text-gray-600 group-hover:text-blue-600 dark:text-gray-300 dark:group-hover:text-white',
                                    ]"
                                  >
                                    {{ store.form.periodType === 'weekly' ? 'اسبوع' : 'شهر' }}
                                  </span>
                                </button>
                              </div>
                            </div>
                          </div>
                          <div
                            v-else
                            class="flex justify-center items-center p-6 text-center text-gray-500 bg-gray-50 rounded-lg border border-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400"
                          >
                            <div class="space-y-1">
                              <div class="text-sm font-medium">يرجى تحديد مدة المشروع أولاً</div>
                              <div class="text-xs">قم بتحديد المدة ونوع الفترة في القسم السابق</div>
                            </div>
                          </div>
                        </FormField>
                      </div>
                      <FormField label="ملاحظات" class="md:col-span-2">
                        <Textarea
                          v-model="activity.notes"
                          dir="rtl"
                          placeholder="ادخل الملاحظات"
                          class="min-h-[80px]"
                        />
                      </FormField>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <PrimaryButton @click="addComponent" variant="outline" class="w-full"
              >اضافة مكون جديد</PrimaryButton
            >
          </div>
        </FormSection>
        <FormSection title="معاينة المشروع">
          <div class="space-y-6 md:col-span-2">
            <div class="bg-white rounded-lg border dark:border-gray-700 dark:bg-gray-800">
              <div class="p-4 border-b dark:border-gray-700">
                <h4 class="font-medium text-gray-900 dark:text-gray-100">تفاصيل المشروع</h4>
              </div>
              <div class="divide-y dark:divide-gray-700">
                <div class="grid grid-cols-1 gap-4 p-4 md:grid-cols-2">
                  <div>
                    <div class="text-sm text-gray-500 dark:text-gray-400">اسم المشروع</div>
                    <div class="mt-1 text-sm font-medium text-gray-900 dark:text-gray-100">
                      {{ store.form.projectName || 'لم يتم تحديد اسم المشروع' }}
                    </div>
                  </div>
                  <div>
                    <div class="text-sm text-gray-500 dark:text-gray-400">الدائرة المنفذة</div>
                    <div class="mt-1 text-sm font-medium text-gray-900 dark:text-gray-100">
                      {{ store.form.executingDepartment || 'لم يتم تحديد الدائرة' }}
                    </div>
                  </div>
                  <div>
                    <div class="text-sm text-gray-500 dark:text-gray-400">الجهة المنفذة</div>
                    <div class="mt-1 text-sm font-medium text-gray-900 dark:text-gray-100">
                      {{ store.form.executingEntity || 'لم يتم تحديد الجهة' }}
                    </div>
                  </div>
                  <div>
                    <div class="text-sm text-gray-500 dark:text-gray-400">الجهات المستفيدة</div>
                    <div class="mt-1 text-sm font-medium text-gray-900 dark:text-gray-100">
                      {{ store.form.beneficiaries || 'لم يتم تحديد الجهات المستفيدة' }}
                    </div>
                  </div>
                </div>
                <div class="p-4">
                  <div class="text-sm text-gray-500 dark:text-gray-400">الهدف من المشروع</div>
                  <div class="mt-1 text-sm font-medium text-gray-900 dark:text-gray-100">
                    {{ store.form.projectGoal || 'لم يتم تحديد الهدف' }}
                  </div>
                </div>
                <div class="grid grid-cols-1 gap-4 p-4 md:grid-cols-2">
                  <div>
                    <div class="text-sm text-gray-500 dark:text-gray-400">نوع التمويل</div>
                    <div class="mt-1 text-sm font-medium text-gray-900 dark:text-gray-100">
                      {{ store.form.fundingType || 'لم يتم تحديد نوع التمويل' }}
                    </div>
                  </div>
                  <div>
                    <div class="text-sm text-gray-500 dark:text-gray-400">التمويل الدولي</div>
                    <div class="mt-1 text-sm font-medium text-gray-900 dark:text-gray-100">
                      {{
                        store.form.totalCost
                          ? `$${formatCost(store.form.totalCost)}`
                          : 'لم يتم تحديد المبلغ'
                      }}
                    </div>
                  </div>
                </div>
                <div class="grid grid-cols-1 gap-4 p-4 md:grid-cols-2">
                  <div>
                    <div class="text-sm text-gray-500 dark:text-gray-400">تاريخ البدء</div>
                    <div class="mt-1 text-sm font-medium text-gray-900 dark:text-gray-100">
                      {{
                        store.form.actualStartDate
                          ? formatDate(store.form.actualStartDate)
                          : 'لم يتم تحديد تاريخ البدء'
                      }}
                    </div>
                  </div>
                  <div>
                    <div class="text-sm text-gray-500 dark:text-gray-400"
                      >تاريخ الانتهاء المتوقع</div
                    >
                    <div class="mt-1 text-sm font-medium text-gray-900 dark:text-gray-100">
                      {{
                        store.form.actualStartDate && store.form.duration
                          ? calculateEndDate(
                              store.form.actualStartDate,
                              store.form.duration,
                              store.form.durationType
                            )
                          : 'لم يتم تحديد تاريخ الانتهاء'
                      }}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="grid grid-cols-1 gap-4 md:grid-cols-3">
              <div class="p-4 bg-white rounded-lg border dark:border-gray-700 dark:bg-gray-800">
                <div class="mb-1 text-sm text-gray-500 dark:text-gray-400">المدة الكلية</div>
                <div class="text-2xl font-semibold dark:text-gray-100">
                  {{ totalPeriods }} {{ store.form.periodType === 'weekly' ? 'اسبوع' : 'شهر' }}
                </div>
              </div>
              <div class="p-4 bg-white rounded-lg border dark:border-gray-700 dark:bg-gray-800">
                <div class="mb-1 text-sm text-gray-500 dark:text-gray-400">عدد المكونات</div>
                <div class="text-2xl font-semibold dark:text-gray-100">{{
                  store.form.components.length
                }}</div>
              </div>
              <div class="p-4 bg-white rounded-lg border dark:border-gray-700 dark:bg-gray-800">
                <div class="mb-1 text-sm text-gray-500 dark:text-gray-400">عدد الفعاليات</div>
                <div class="text-2xl font-semibold dark:text-gray-100">
                  {{
                    store.form.components.reduce((total, comp) => total + comp.activities.length, 0)
                  }}
                </div>
              </div>
            </div>
            <div class="bg-white rounded-lg border dark:border-gray-700 dark:bg-gray-800">
              <div class="p-4 border-b dark:border-gray-700">
                <div class="flex justify-between items-center">
                  <h4 class="font-medium text-gray-900 dark:text-gray-100"
                    >المخطط الزمني للمشروع</h4
                  >
                  <div class="text-sm text-gray-500 dark:text-gray-400">
                    {{ store.form.periodType === 'weekly' ? 'عرض بالأسابيع' : 'عرض بالأشهر' }}
                  </div>
                </div>
              </div>
              <div class="relative p-4">
                <div
                  v-if="totalPeriods > 0"
                  class="isolate overflow-hidden relative bg-white rounded-lg border dark:border-gray-700 dark:bg-gray-800"
                >
                  <div class="flex">
                    <div
                      class="sticky left-0 z-[15] w-48 shrink-0 border-l bg-white dark:border-gray-700 dark:bg-gray-800"
                    >
                      <div
                        class="sticky top-0 z-[15] h-[4rem] border-b bg-white p-4 font-medium text-gray-700 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
                      >
                        المكون / الفعالية
                      </div>
                      <div class="divide-y dark:divide-gray-700">
                        <template
                          v-for="(component, componentIndex) in store.form.components"
                          :key="componentIndex"
                        >
                          <div
                            class="h-[4rem] border-b p-4 font-medium text-gray-700 dark:border-gray-700 dark:text-gray-200"
                          >
                            <div class="flex gap-2 items-center">
                              <div
                                class="w-3 h-3 rounded-full shrink-0"
                                :style="{ backgroundColor: getComponentColor(componentIndex) }"
                              ></div>
                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <div class="truncate">
                                      {{ component.name || `المكون ${componentIndex + 1}` }}
                                    </div>
                                  </TooltipTrigger>
                                  <TooltipContent class="text-white bg-gray-900 dark:bg-gray-800">
                                    <p>{{ component.name || `المكون ${componentIndex + 1}` }}</p>
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                            </div>
                          </div>
                          <div
                            v-for="(activity, activityIndex) in component.activities"
                            :key="activityIndex"
                            class="h-[4rem] border-b bg-gray-50/50 p-4 pr-8 text-sm text-gray-600 dark:border-gray-700 dark:bg-gray-800/30 dark:text-gray-300"
                          >
                            <div class="flex gap-2 items-center">
                              <div
                                class="w-2 h-2 rounded-full shrink-0"
                                :style="{ backgroundColor: getComponentColor(componentIndex) }"
                              ></div>
                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <div class="truncate">
                                      {{ activity.name || `الفعالية ${activityIndex + 1}` }}
                                    </div>
                                  </TooltipTrigger>
                                  <TooltipContent class="text-white bg-gray-900 dark:bg-gray-800">
                                    <p>{{ activity.name || `الفعالية ${activityIndex + 1}` }}</p>
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                            </div>
                          </div>
                        </template>
                      </div>
                    </div>
                    <div class="overflow-x-auto relative custom-scrollbar">
                      <div class="inline-block min-w-[800px]">
                        <div
                          class="sticky top-0 z-[10] flex h-[4rem] border-b bg-white dark:border-gray-700 dark:bg-gray-800"
                        >
                          <div
                            v-for="period in totalPeriods"
                            :key="period"
                            class="flex justify-center items-center p-4 w-16 h-full text-sm font-medium text-center text-gray-600 border-l shrink-0 dark:border-gray-700 dark:text-gray-300"
                          >
                            {{ store.form.periodType === 'weekly' ? `${period}` : `${period}` }}
                          </div>
                        </div>
                        <div class="divide-y dark:divide-gray-700">
                          <template
                            v-for="(component, componentIndex) in store.form.components"
                            :key="componentIndex"
                          >
                            <div
                              class="flex h-[4rem] border-b transition-colors duration-150 hover:bg-gray-50/80 dark:border-gray-700 dark:hover:bg-gray-800/50"
                            >
                              <div
                                v-for="period in totalPeriods"
                                :key="period"
                                class="w-16 border-l shrink-0 dark:border-gray-700"
                              >
                              </div>
                            </div>
                            <div
                              v-for="(activity, activityIndex) in component.activities"
                              :key="activityIndex"
                              class="flex h-[4rem] border-b bg-gray-50/50 transition-colors duration-150 hover:bg-gray-100/80 dark:border-gray-700 dark:bg-gray-800/30 dark:hover:bg-gray-800/50"
                            >
                              <div
                                v-for="period in totalPeriods"
                                :key="period"
                                class="relative w-16 border-l shrink-0 dark:border-gray-700"
                              >
                                <div
                                  v-if="activity.weeks?.includes(period)"
                                  class="absolute inset-0 m-1 rounded-md transition-colors duration-150"
                                  :style="{
                                    backgroundColor: getComponentColor(componentIndex, true),
                                  }"
                                >
                                </div>
                              </div>
                            </div>
                          </template>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div
                  v-else
                  class="flex justify-center items-center p-8 text-center text-gray-500 bg-gray-50 rounded-lg border border-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400"
                >
                  <div class="space-y-2">
                    <div class="text-sm font-medium">لا يمكن عرض المخطط الزمني</div>
                    <div class="text-xs">يرجى تحديد مدة المشروع ونوع الفترة الزمنية أولاً</div>
                  </div>
                </div>
              </div>
            </div>
            <div class="bg-white rounded-lg border dark:border-gray-700 dark:bg-gray-800">
              <div class="p-4 border-b dark:border-gray-700">
                <h4 class="font-medium text-gray-900 dark:text-gray-100"
                  >تفاصيل المكونات والفعاليات</h4
                >
              </div>
              <div class="divide-y dark:divide-gray-700">
                <template
                  v-for="(component, componentIndex) in store.form.components"
                  :key="componentIndex"
                >
                  <div class="p-4">
                    <div class="flex justify-between items-center mb-4">
                      <div class="flex gap-3 items-center">
                        <div
                          class="w-3 h-3 rounded-full"
                          :style="{ backgroundColor: getComponentColor(componentIndex) }"
                        ></div>
                        <h5 class="font-medium text-gray-900 dark:text-gray-100">
                          {{ component.name || `المكون ${componentIndex + 1}` }}
                        </h5>
                      </div>
                      <div class="text-sm text-gray-500 dark:text-gray-400">
                        المستهدف: {{ component.totalTarget || 0 }}%
                      </div>
                    </div>
                    <div class="pl-6 space-y-3">
                      <template
                        v-for="(activity, activityIndex) in component.activities"
                        :key="activityIndex"
                      >
                        <div class="p-3 bg-gray-50 rounded-lg dark:bg-gray-800/50">
                          <div class="flex justify-between items-center mb-2">
                            <div class="flex gap-2 items-center">
                              <div
                                class="w-2 h-2 rounded-full"
                                :style="{ backgroundColor: getComponentColor(componentIndex) }"
                              ></div>
                              <span class="text-sm font-medium text-gray-900 dark:text-gray-100">
                                {{ activity.name || `الفعالية ${activityIndex + 1}` }}
                              </span>
                            </div>
                            <span class="text-sm text-gray-500 dark:text-gray-400">
                              المستهدف: {{ activity.totalTarget || 0 }}%
                            </span>
                          </div>
                          <div class="grid grid-cols-1 gap-3 md:grid-cols-2">
                            <div>
                              <div class="text-xs text-gray-500 dark:text-gray-400"
                                >الفترات المحددة</div
                              >
                              <div class="mt-1 text-sm text-gray-700 dark:text-gray-300">
                                {{ activity.weeks?.length || 0 }}
                                {{ store.form.periodType === 'weekly' ? 'اسبوع' : 'شهر' }}
                                <span class="text-xs text-gray-500">
                                  ({{ activity.weeks?.join(', ') || 'لم يتم التحديد' }})
                                </span>
                              </div>
                            </div>
                            <div v-if="activity.notes">
                              <div class="text-xs text-gray-500 dark:text-gray-400">ملاحظات</div>
                              <div class="mt-1 text-sm text-gray-700 dark:text-gray-300">
                                {{ activity.notes }}
                              </div>
                            </div>
                          </div>
                        </div>
                      </template>
                      <div
                        v-if="component.activities.length === 0"
                        class="p-3 text-sm text-center text-gray-500 rounded-lg border border-gray-200 border-dashed dark:border-gray-700 dark:text-gray-400"
                      >
                        لا توجد فعاليات لهذا المكون
                      </div>
                    </div>
                  </div>
                </template>
              </div>
            </div>
          </div>
        </FormSection>
        <div class="sticky right-0 left-0 bottom-6 mt-6">
          <div class="px-6 mx-auto max-w-6xl">
            <Button
              @click="saveProject"
              class="w-full h-12 text-lg bg-slate-700 hover:bg-slate-800 dark:bg-slate-600 dark:text-white dark:hover:bg-slate-700"
              :disabled="store.isSaving"
            >
              <Loader2 v-if="store.isSaving" class="ml-2 w-4 h-4 animate-spin" />
              <Plus v-else class="ml-2 w-4 h-4" />
              {{ store.isSaving ? 'جاري الحفظ...' : 'اضافة المشروع' }}
            </Button>
          </div>
        </div>
      </div>
    </div>
  </DefaultLayout>
</template>
<script setup>
  import CustomInput from '@/components/CustomInput.vue';
  import DateInput from '@/components/DateInput.vue';
  import FormField from '@/components/FormField.vue';
  import FormSection from '@/components/FormSection.vue';
  import NumberInput from '@/components/NumberInput.vue';
  import PrimaryButton from '@/components/PrimaryButton.vue';
  import { Button } from '@/components/ui/button';
  import { Label } from '@/components/ui/label';
  import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
  import { Textarea } from '@/components/ui/textarea';
  import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
  } from '@/components/ui/tooltip';
  import DefaultLayout from '@/layouts/DefaultLayout.vue';
  import { useFundedProjectStore } from '@/stores/fundedProject';
  import { Loader2, Plus, X } from 'lucide-vue-next';
  import { computed, onMounted, onUnmounted } from 'vue';
  import { useRouter } from 'vue-router';
  import { toast } from 'vue-sonner';
  const store = useFundedProjectStore();
  const router = useRouter();
  onMounted(() => {
    store.initializeForm();
    window.addEventListener('beforeunload', handleBeforeUnload);
  });
  onUnmounted(() => {
    window.removeEventListener('beforeunload', handleBeforeUnload);
  });
  const handleBeforeUnload = (e) => {
    if (store.hasUnsavedChanges) {
      e.preventDefault();
      e.returnValue = '';
    }
  };
  const totalPeriods = computed(() => store.totalPeriods);
  const saveProject = async () => {
    if (!store.form.projectName) {
      toast.error('يرجى ادخال اسم المشروع', {
        description: 'الرجاء ملء جميع الحقول المطلوبة',
      });
      return;
    }
    if (!store.form.executingDepartment) {
      toast.error('يرجى اختيار الدائرة المنفذة', {
        description: 'الرجاء ملء جميع الحقول المطلوبة',
      });
      return;
    }
    if (!store.form.executingEntity) {
      toast.error('يرجى ادخال الجهة المنفذة', {
        description: 'الرجاء ملء جميع الحقول المطلوبة',
      });
      return;
    }
    if (!store.form.totalCost) {
      toast.error('يرجى ادخال كلفة المشروع', {
        description: 'الرجاء ملء جميع الحقول المطلوبة',
      });
      return;
    }
    if (!store.form.duration || !store.form.durationType) {
      toast.error('يرجى تحديد مدة المشروع', {
        description: 'الرجاء ملء جميع الحقول المطلوبة',
      });
      return;
    }
    if (!store.form.actualStartDate) {
      toast.error('يرجى تحديد تاريخ بدء المشروع', {
        description: 'الرجاء ملء جميع الحقول المطلوبة',
      });
      return;
    }
    if (store.form.components.length === 0) {
      toast.error('يرجى اضافة مكون واحد على الأقل', {
        description: 'المشروع يجب أن يحتوي على مكون واحد على الأقل',
      });
      return;
    }
    for (const [componentIndex, component] of store.form.components.entries()) {
      if (!component.name) {
        toast.error(`يرجى ادخال اسم المكون رقم ${componentIndex + 1}`, {
          description: 'الرجاء ملء جميع الحقول المطلوبة',
        });
        return;
      }
      if (!component.totalTarget) {
        toast.error(`يرجى ادخال المستهدف الكلي للمكون رقم ${componentIndex + 1}`, {
          description: 'الرجاء ملء جميع الحقول المطلوبة',
        });
        return;
      }
      for (const [activityIndex, activity] of component.activities.entries()) {
        if (!activity.name) {
          toast.error(
            `يرجى ادخال اسم الفعالية رقم ${activityIndex + 1} في المكون رقم ${componentIndex + 1}`,
            {
              description: 'الرجاء ملء جميع الحقول المطلوبة',
            }
          );
          return;
        }
        if (!activity.totalTarget) {
          toast.error(
            `يرجى ادخال المستهدف الكلي للفعالية رقم ${activityIndex + 1} في المكون رقم ${
              componentIndex + 1
            }`,
            {
              description: 'الرجاء ملء جميع الحقول المطلوبة',
            }
          );
          return;
        }
        if (!activity.weeks || activity.weeks.length === 0) {
          toast.error(
            `يرجى تحديد الفترة الزمنية للفعالية رقم ${activityIndex + 1} في المكون رقم ${
              componentIndex + 1
            }`,
            {
              description: 'الرجاء ملء جميع الحقول المطلوبة',
            }
          );
          return;
        }
      }
    }
    try {
      const response = await store.saveProject();
      if (response.success) {
        toast.success('تم حفظ المشروع بنجاح');
        router.push('/projects');
      }
    } catch (error) {
      toast.error('حدث خطأ أثناء الحفظ', {
        description: error.response?.data?.message || 'يرجى المحاولة مرة أخرى',
      });
    }
  };
  const addComponent = () => {
    store.addComponent();
  };
  const removeComponent = (componentIndex) => {
    store.removeComponent(componentIndex);
  };
  const addActivity = (componentIndex) => {
    store.addActivity(componentIndex);
  };
  const removeActivity = (componentIndex, activityIndex) => {
    store.removeActivity(componentIndex, activityIndex);
  };
  const toggleActivityWeek = (activity, period) => {
    const componentIndex = store.form.components.findIndex((comp) =>
      comp.activities.some((act) => act === activity)
    );
    if (componentIndex === -1) return;
    const activityIndex = store.form.components[componentIndex].activities.findIndex(
      (act) => act === activity
    );
    if (activityIndex === -1) return;
    store.toggleActivityWeek(componentIndex, activityIndex, period);
  };
  const formatDate = (date) => {
    if (!date) return '';
    return new Date(date).toLocaleDateString('ar-EG', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };
  const calculateEndDate = (startDate, duration, durationType) => {
    if (!startDate || !duration) return '';
    const start = new Date(startDate);
    const durationNum = parseInt(duration);
    if (durationType === 'weeks') {
      start.setDate(start.getDate() + durationNum * 7);
    } else if (durationType === 'months') {
      start.setMonth(start.getMonth() + durationNum);
    }
    return start.toLocaleDateString('ar-EG', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };
  const componentColors = [
    { base: '#3B82F6', light: 'rgba(59, 130, 246, 0.2)' },
    { base: '#10B981', light: 'rgba(16, 185, 129, 0.2)' },
    { base: '#F59E0B', light: 'rgba(245, 158, 11, 0.2)' },
    { base: '#EF4444', light: 'rgba(239, 68, 68, 0.2)' },
    { base: '#8B5CF6', light: 'rgba(139, 92, 246, 0.2)' },
    { base: '#EC4899', light: 'rgba(236, 72, 153, 0.2)' },
  ];
  const getComponentColor = (index, isLight = false) => {
    const colorIndex = index % componentColors.length;
    return isLight ? componentColors[colorIndex].light : componentColors[colorIndex].base;
  };
  const formatCost = (value) => {
    if (!value) return '';
    return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  };
  const addBeneficiary = () => {
    store.form.beneficiaries.push('');
  };
  const removeBeneficiary = (index) => {
    store.form.beneficiaries.splice(index, 1);
  };
</script>
<style scoped>
  .form-section {
    @apply transition-all duration-200;
  }
  .form-field:focus-within {
    @apply ring-2 ring-blue-500 ring-opacity-50;
  }
  .custom-scrollbar {
    scrollbar-width: thin;
    scrollbar-color: #94a3b8 #e2e8f0;
  }
  .custom-scrollbar::-webkit-scrollbar {
    height: 8px;
    width: 8px;
  }
  .custom-scrollbar::-webkit-scrollbar-track {
    @apply bg-gray-200 dark:bg-gray-700;
    border-radius: 4px;
  }
  .custom-scrollbar::-webkit-scrollbar-thumb {
    @apply bg-gray-400 dark:bg-gray-500;
    border-radius: 4px;
  }
  .custom-scrollbar::-webkit-scrollbar-thumb:hover {
    @apply bg-gray-500 dark:bg-gray-400;
  }
  :deep(.dark) .custom-scrollbar {
    scrollbar-color: #4b5563 #1f2937;
  }
</style>
