<template>
  <DefaultLayout>
    <div class="flex flex-col min-h-screen gap-4 p-6">
      <div class="w-full max-w-6xl mx-auto">
        <div class="flex flex-col gap-6 p-6 bg-white rounded-lg shadow">
          <h2 class="text-xl font-semibold text-right">التفاصيل العامة للمشروع</h2>
          <div class="grid grid-cols-1 gap-x-6 gap-y-4 md:grid-cols-2">
            <div class="grid w-full gap-2">
              <Label class="text-right">اسم المشروع</Label>
              <Input v-model="form.projectName" dir="rtl" placeholder="ادخل اسم المشروع" />
            </div>
            <div class="grid w-full gap-2">
              <Label class="text-right">الخطة (المديرية)</Label>
              <Input v-model="form.plan" dir="rtl" placeholder="ادخل الخطة" />
            </div>
            <div class="grid w-full gap-2">
              <Label class="text-right">هدف المشروع</Label>
              <Input v-model="form.projectGoal" dir="rtl" placeholder="ادخل هدف المشروع" />
            </div>
            <div class="grid w-full gap-2">
              <Label class="text-right">ربط المشروع بأهداف التنمية المستدامة</Label>
              <CustomSelect
                v-model="form.sustainableDevelopmentGoal"
                :options="sustainableDevelopmentGoals"
                placeholder="اختر الهدف"
                :triggerClass="'flex flex-row-reverse w-full'"
              />
            </div>
            <div class="grid w-full gap-2">
              <Label class="text-right">اسم الجهة المستفيدة</Label>
              <CustomSelect
                v-model="form.beneficiary"
                :options="beneficiaries"
                placeholder="اختر الجهة المستفيدة"
                :triggerClass="'flex flex-row-reverse w-full'"
              />
            </div>
            <div class="grid w-full gap-2">
              <Label class="text-right">الموقع الجغرافي</Label>
              <Input v-model="form.location" dir="rtl" placeholder="ادخل الموقع الجغرافي" />
            </div>
            <div class="grid w-full gap-2 md:col-span-2">
              <Label class="text-right">الجهات الساندة</Label>
              <div class="flex gap-2">
                <Input
                  v-model="currentSupportingEntity"
                  dir="rtl"
                  placeholder="ادخل اسم الجهة الساندة"
                  class="flex-1"
                  @keyup.enter="addSupportingEntity"
                />
                <Button @click="addSupportingEntity" type="button"> اضافة </Button>
              </div>
              <div
                v-if="form.supportingEntities.length > 0"
                class="flex flex-wrap gap-2 p-2 mt-2 rounded-md bg-gray-50"
              >
                <div
                  v-for="(entity, index) in form.supportingEntities"
                  :key="index"
                  class="flex items-center gap-1 px-2 py-1 text-sm bg-white rounded-md shadow-sm"
                >
                  <span>{{ entity }}</span>
                  <button
                    @click="removeSupportingEntity(index)"
                    class="text-gray-500 hover:text-red-500"
                  >
                    <X class="w-3 h-3" />
                  </button>
                </div>
              </div>
            </div>
            <div class="grid w-full gap-2 md:col-span-2">
              <Label class="text-right">الفترة الزمنية لتنفيذ المشروع</Label>
              <div class="flex items-center gap-4">
                <Input
                  v-model="form.duration"
                  type="number"
                  dir="rtl"
                  class="flex-1"
                  placeholder="ادخل المدة"
                />
                <RadioGroup v-model="form.durationType" class="flex gap-4">
                  <div class="flex items-center gap-2">
                    <RadioGroupItem value="days" id="duration-days" />
                    <Label for="duration-days" class="text-sm">يوم</Label>
                  </div>
                  <div class="flex items-center gap-2">
                    <RadioGroupItem value="months" id="duration-months" />
                    <Label for="duration-months" class="text-sm">شهر</Label>
                  </div>
                  <div class="flex items-center gap-2">
                    <RadioGroupItem value="years" id="duration-years" />
                    <Label for="duration-years" class="text-sm">سنة</Label>
                  </div>
                </RadioGroup>
              </div>
            </div>
          </div>
        </div>
        <div class="flex flex-col gap-6 p-6 mt-4 bg-white rounded-lg shadow">
          <h2 class="text-xl font-semibold text-right">التاريخ المخطط والفعلي</h2>
          <div class="grid grid-cols-1 gap-x-6 gap-y-4 md:grid-cols-2">
            <div class="grid w-full gap-2">
              <Label class="text-right">تاريخ المباشرة المخطط له</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    class="justify-between w-full text-right"
                    :class="!form.plannedStartDate && 'text-muted-foreground'"
                  >
                    <span>{{
                      form.plannedStartDate ? formatDate(form.plannedStartDate) : 'اختر التاريخ'
                    }}</span>
                    <CalendarIcon class="w-4 h-4" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent class="w-auto p-0" align="start">
                  <Calendar mode="single" v-model="form.plannedStartDate" initialFocus />
                </PopoverContent>
              </Popover>
            </div>
            <div class="grid w-full gap-2">
              <Label class="text-right">تاريخ المباشرة الفعلي</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    class="justify-between w-full text-right"
                    :class="!form.actualStartDate && 'text-muted-foreground'"
                  >
                    <span>{{
                      form.actualStartDate ? formatDate(form.actualStartDate) : 'اختر التاريخ'
                    }}</span>
                    <CalendarIcon class="w-4 h-4" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent class="w-auto p-0" align="start">
                  <Calendar mode="single" v-model="form.actualStartDate" initialFocus />
                </PopoverContent>
              </Popover>
            </div>
            <div class="grid w-full gap-2">
              <Label class="text-right">تاريخ الانجاز المخطط له</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    class="justify-between w-full text-right"
                    :class="!form.plannedCompletionDate && 'text-muted-foreground'"
                  >
                    <span>{{
                      form.plannedCompletionDate
                        ? formatDate(form.plannedCompletionDate)
                        : 'اختر التاريخ'
                    }}</span>
                    <CalendarIcon class="w-4 h-4" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent class="w-auto p-0" align="start">
                  <Calendar mode="single" v-model="form.plannedCompletionDate" initialFocus />
                </PopoverContent>
              </Popover>
            </div>
            <div class="grid w-full gap-2">
              <Label class="text-right">تاريخ الانجاز الفعلي</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    class="justify-between w-full text-right"
                    :class="!form.actualCompletionDate && 'text-muted-foreground'"
                  >
                    <span>{{
                      form.actualCompletionDate
                        ? formatDate(form.actualCompletionDate)
                        : 'اختر التاريخ'
                    }}</span>
                    <CalendarIcon class="w-4 h-4" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent class="w-auto p-0" align="start">
                  <Calendar mode="single" v-model="form.actualCompletionDate" initialFocus />
                </PopoverContent>
              </Popover>
            </div>
          </div>
        </div>
        <div class="flex flex-col gap-6 p-6 mt-4 bg-white rounded-lg shadow">
          <h2 class="text-xl font-semibold text-right">تفاصيل العقد</h2>
          <div class="space-y-6">
            <div
              v-for="(contract, contractIndex) in form.contracts"
              :key="contractIndex"
              class="p-4 border rounded-lg"
            >
              <div class="flex items-center justify-between mb-4">
                <h3 class="text-lg font-medium"> عقد رقم {{ contractIndex + 1 }} </h3>
                <Button variant="destructive" size="sm" @click="removeContract(contractIndex)">
                  <X class="w-4 h-4" />
                </Button>
              </div>
              <div class="grid grid-cols-1 gap-x-6 gap-y-4 md:grid-cols-2">
                <div class="grid w-full gap-2">
                  <Label class="text-right">اسم الجهة المنفذة \ الشركة</Label>
                  <Input
                    v-model="contract.executingCompany"
                    dir="rtl"
                    placeholder="ادخل اسم الشركة"
                  />
                </div>
                <div class="grid w-full gap-2">
                  <Label class="text-right">كلفة العقد</Label>
                  <Input
                    v-model="contract.cost"
                    type="number"
                    dir="rtl"
                    placeholder="ادخل كلفة العقد"
                  />
                </div>
                <div class="grid w-full gap-2">
                  <Label class="text-right">تاريخ الاحالة</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        class="justify-between w-full text-right"
                        :class="!contract.referralDate && 'text-muted-foreground'"
                      >
                        <span>{{
                          contract.referralDate ? formatDate(contract.referralDate) : 'اختر التاريخ'
                        }}</span>
                        <CalendarIcon class="w-4 h-4" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent class="w-auto p-0" align="start">
                      <Calendar mode="single" v-model="contract.referralDate" initialFocus />
                    </PopoverContent>
                  </Popover>
                </div>
                <div class="grid w-full gap-2">
                  <Label class="text-right">تاريخ توقيع العقد</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        class="justify-between w-full text-right"
                        :class="!contract.signingDate && 'text-muted-foreground'"
                      >
                        <span>{{
                          contract.signingDate ? formatDate(contract.signingDate) : 'اختر التاريخ'
                        }}</span>
                        <CalendarIcon class="w-4 h-4" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent class="w-auto p-0" align="start">
                      <Calendar mode="single" v-model="contract.signingDate" initialFocus />
                    </PopoverContent>
                  </Popover>
                </div>
                <div class="grid w-full gap-2">
                  <Label class="text-right">رقم العقد</Label>
                  <Input v-model="contract.number" dir="rtl" placeholder="ادخل رقم العقد" />
                </div>
                <div class="grid w-full gap-2">
                  <Label class="text-right">عدد الاجراءات التنفيذية</Label>
                  <Input
                    v-model="contract.executionProcedures.length"
                    type="number"
                    dir="rtl"
                    readonly
                    disabled
                  />
                </div>
              </div>
              <div class="mt-6">
                <div class="flex items-center justify-between mb-4">
                  <h4 class="font-medium">الاجراءات التنفيذية</h4>
                  <Button @click="addExecutionProcedure(contractIndex)" size="sm">
                    اضافة اجراء تنفيذي
                  </Button>
                </div>
                <div class="space-y-4">
                  <div
                    v-for="(procedure, procedureIndex) in contract.executionProcedures"
                    :key="procedureIndex"
                    class="p-4 border rounded-lg bg-gray-50"
                  >
                    <div class="flex items-center justify-between mb-4">
                      <h5 class="font-medium">
                        الاجراء التنفيذي رقم
                        {{ procedureIndex + 1 }}
                      </h5>
                      <Button
                        variant="destructive"
                        size="sm"
                        @click="removeExecutionProcedure(contractIndex, procedureIndex)"
                      >
                        <X class="w-4 h-4" />
                      </Button>
                    </div>
                    <div class="grid grid-cols-1 gap-x-6 gap-y-4 md:grid-cols-2">
                      <div class="grid w-full gap-2">
                        <Label class="text-right">وزن الاجراء</Label>
                        <Input
                          v-model="procedure.weight"
                          type="number"
                          dir="rtl"
                          placeholder="ادخل وزن الاجراء"
                        />
                      </div>
                      <div class="grid w-full gap-2">
                        <Label class="text-right">مدة الاجراء</Label>
                        <Input
                          v-model="procedure.duration"
                          type="number"
                          dir="rtl"
                          placeholder="ادخل مدة الاجراء"
                        />
                      </div>
                      <div class="grid w-full gap-2">
                        <Label class="text-right">تاريخ تنفيذ الاجراء</Label>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              class="justify-between w-full text-right"
                              :class="!procedure.executionDate && 'text-muted-foreground'"
                            >
                              <span>{{
                                procedure.executionDate
                                  ? formatDate(procedure.executionDate)
                                  : 'اختر التاريخ'
                              }}</span>
                              <CalendarIcon class="w-4 h-4" />
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent class="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              v-model="procedure.executionDate"
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                      </div>
                      <div class="grid w-full gap-2">
                        <Label class="text-right">تاريخ انجاز تنفيذ الاجراء</Label>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              class="justify-between w-full text-right"
                              :class="!procedure.completionDate && 'text-muted-foreground'"
                            >
                              <span>{{
                                procedure.completionDate
                                  ? formatDate(procedure.completionDate)
                                  : 'اختر التاريخ'
                              }}</span>
                              <CalendarIcon class="w-4 h-4" />
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent class="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              v-model="procedure.completionDate"
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                      </div>
                      <div class="grid w-full gap-2">
                        <Label class="text-right">نسبة الانجاز الفني المخطط</Label>
                        <Input
                          v-model="procedure.plannedTechnicalProgress"
                          type="number"
                          dir="rtl"
                          placeholder="ادخل النسبة"
                        />
                      </div>
                      <div class="grid w-full gap-2">
                        <Label class="text-right">نسبة الانجاز الفني الفعلي</Label>
                        <Input
                          v-model="procedure.actualTechnicalProgress"
                          type="number"
                          dir="rtl"
                          placeholder="ادخل النسبة"
                        />
                      </div>
                      <div class="grid w-full gap-2">
                        <Label class="text-right">نسبة الانحراف الفني</Label>
                        <Input
                          v-model="procedure.technicalDeviation"
                          type="number"
                          dir="rtl"
                          placeholder="ادخل النسبة"
                        />
                      </div>
                      <div class="grid w-full gap-2">
                        <Label class="text-right">نسبة الانجاز المالي المخطط</Label>
                        <Input
                          v-model="procedure.plannedFinancialProgress"
                          type="number"
                          dir="rtl"
                          placeholder="ادخل النسبة"
                        />
                      </div>
                      <div class="grid w-full gap-2">
                        <Label class="text-right">نسبة الانجاز المالي الفعلي</Label>
                        <Input
                          v-model="procedure.actualFinancialProgress"
                          type="number"
                          dir="rtl"
                          placeholder="ادخل النسبة"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <Button @click="addContract" class="w-full"> اضافة عقد جديد </Button>
          </div>
        </div>
        <div class="flex flex-col gap-6 p-6 mt-4 bg-white rounded-lg shadow">
          <h2 class="text-xl font-semibold text-right">تفاصيل الموقف المالي</h2>
          <div class="grid grid-cols-1 gap-x-6 gap-y-4 md:grid-cols-2">
            <div class="grid w-full gap-2">
              <Label class="text-right"
                >كلفة الاجراءات التنفيذية المخطط لها لغاية تاريخ اليوم ({{
                  new Date().toLocaleDateString('ar-US', {
                    year: 'numeric',
                    month: 'numeric',
                    day: 'numeric',
                  })
                }})
              </Label>
              <div class="relative">
                <Input
                  v-model="form.financials.plannedCost"
                  type="number"
                  dir="rtl"
                  placeholder="ادخل الكلفة"
                />
                <span class="absolute text-sm text-gray-500 -translate-y-1/2 left-2 top-1/2"
                  >د.ع</span
                >
              </div>
            </div>
            <div class="grid w-full gap-2">
              <Label class="text-right">ميزانية المشروع (الكلفة الكلية للمشروع)</Label>
              <div class="relative">
                <Input
                  v-model="form.financials.totalBudget"
                  type="number"
                  dir="rtl"
                  placeholder="ادخل الميزانية"
                />
                <span class="absolute text-sm text-gray-500 -translate-y-1/2 left-2 top-1/2"
                  >د.ع</span
                >
              </div>
            </div>
            <div class="grid w-full gap-2">
              <Label class="text-right"
                >قيمة العمل المنجز الفعلي للجراءات التنفيذية لغاية تاريخ اليوم ({{
                  new Date().toLocaleDateString('ar-US', {
                    year: 'numeric',
                    month: 'numeric',
                    day: 'numeric',
                  })
                }})</Label
              >
              <div class="relative">
                <Input
                  v-model="form.financials.actualWorkValue"
                  type="number"
                  dir="rtl"
                  placeholder="ادخل قيمة العمل المنجز"
                />
                <span class="absolute text-sm text-gray-500 -translate-y-1/2 left-2 top-1/2"
                  >د.ع</span
                >
              </div>
            </div>
            <div class="grid w-full gap-2">
              <Label class="text-right">المصروف التراكمي للمشروع</Label>
              <div class="relative">
                <Input
                  v-model="form.financials.cumulativeExpenses"
                  type="number"
                  dir="rtl"
                  placeholder="ادخل المصروف التراكمي"
                />
                <span class="absolute text-sm text-gray-500 -translate-y-1/2 left-2 top-1/2"
                  >د.ع</span
                >
              </div>
            </div>
            <div class="grid w-full gap-2">
              <Label class="text-right">نسبة الانجاز المالي التراكمي</Label>
              <div class="relative">
                <Input
                  v-model="form.financials.cumulativeProgress"
                  type="number"
                  dir="rtl"
                  placeholder="ادخل نسبة الانجاز"
                />
                <span class="absolute text-sm text-gray-500 -translate-y-1/2 left-2 top-1/2"
                  >%</span
                >
              </div>
            </div>
          </div>
        </div>
        <div class="flex flex-col gap-6 p-6 mt-4 bg-white rounded-lg shadow">
          <h2 class="text-xl font-semibold text-right">تفاصيل موقف تنفيذ المشروع</h2>
          <div class="grid grid-cols-1 gap-x-6 gap-y-4 md:grid-cols-2">
            <div class="grid w-full gap-2">
              <Label class="text-right">حالة المشروع الحالية</Label>
              <CustomSelect
                v-model="form.executionDetails.currentStatus"
                :options="projectStatuses"
                placeholder="اختر حالة المشروع"
                :triggerClass="'flex flex-row-reverse w-full'"
              />
            </div>
            <div class="grid w-full gap-2">
              <Label class="text-right">نسبة الانجاز الفني التراكمي</Label>
              <div class="relative">
                <Input
                  v-model="form.executionDetails.cumulativeTechnicalProgress"
                  type="number"
                  dir="rtl"
                  placeholder="ادخل النسبة"
                />
                <span class="absolute text-sm text-gray-500 -translate-y-1/2 left-2 top-1/2"
                  >%</span
                >
              </div>
            </div>
            <div class="grid w-full gap-2">
              <Label class="text-right">نسبة الانحراف الفني التراكمي</Label>
              <div class="relative">
                <Input
                  v-model="form.executionDetails.cumulativeTechnicalDeviation"
                  type="number"
                  dir="rtl"
                  placeholder="ادخل النسبة"
                />
                <span class="absolute text-sm text-gray-500 -translate-y-1/2 left-2 top-1/2"
                  >%</span
                >
              </div>
            </div>
            <div class="grid w-full gap-2 md:col-span-2">
              <Label class="text-right">اسباب الانحراف</Label>
              <div class="flex gap-2">
                <Input
                  v-model="currentDeviationReason"
                  dir="rtl"
                  placeholder="ادخل سبب الانحراف"
                  class="flex-1"
                  @keyup.enter="addDeviationReason"
                />
                <Button @click="addDeviationReason" type="button"> اضافة </Button>
              </div>
              <div
                v-if="form.executionDetails.deviationReasons.length > 0"
                class="flex flex-wrap gap-2 p-2 mt-2 rounded-md bg-gray-50"
              >
                <div
                  v-for="(reason, index) in form.executionDetails.deviationReasons"
                  :key="index"
                  class="flex items-center gap-1 px-2 py-1 text-sm bg-white rounded-md shadow-sm"
                >
                  <span>{{ reason }}</span>
                  <button
                    @click="removeDeviationReason(index)"
                    class="text-gray-500 hover:text-red-500"
                  >
                    <X class="w-3 h-3" />
                  </button>
                </div>
              </div>
            </div>
            <div class="grid w-full gap-2 md:col-span-2">
              <Label class="text-right">مدد التوقفات</Label>
              <div class="flex gap-2">
                <Input
                  v-model="currentStoppagePeriod"
                  dir="rtl"
                  placeholder="ادخل مدة التوقف"
                  class="flex-1"
                  @keyup.enter="addStoppagePeriod"
                />
                <Button @click="addStoppagePeriod" type="button"> اضافة </Button>
              </div>
              <div
                v-if="form.executionDetails.stoppagePeriods.length > 0"
                class="flex flex-wrap gap-2 p-2 mt-2 rounded-md bg-gray-50"
              >
                <div
                  v-for="(period, index) in form.executionDetails.stoppagePeriods"
                  :key="index"
                  class="flex items-center gap-1 px-2 py-1 text-sm bg-white rounded-md shadow-sm"
                >
                  <span>{{ period }}</span>
                  <button
                    @click="removeStoppagePeriod(index)"
                    class="text-gray-500 hover:text-red-500"
                  >
                    <X class="w-3 h-3" />
                  </button>
                </div>
              </div>
            </div>
            <div class="grid w-full gap-2 md:col-span-2">
              <Label class="text-right">اوامر الغيار</Label>
              <div class="flex gap-2">
                <Input
                  v-model="currentChangeOrder"
                  dir="rtl"
                  placeholder="ادخل امر الغيار"
                  class="flex-1"
                  @keyup.enter="addChangeOrder"
                />
                <Button @click="addChangeOrder" type="button"> اضافة </Button>
              </div>
              <div
                v-if="form.executionDetails.changeOrders.length > 0"
                class="flex flex-wrap gap-2 p-2 mt-2 rounded-md bg-gray-50"
              >
                <div
                  v-for="(order, index) in form.executionDetails.changeOrders"
                  :key="index"
                  class="flex items-center gap-1 px-2 py-1 text-sm bg-white rounded-md shadow-sm"
                >
                  <span>{{ order }}</span>
                  <button
                    @click="removeChangeOrder(index)"
                    class="text-gray-500 hover:text-red-500"
                  >
                    <X class="w-3 h-3" />
                  </button>
                </div>
              </div>
            </div>
            <div class="grid w-full gap-2 md:col-span-2">
              <Label class="text-right">المدد الاضافية</Label>
              <div class="flex gap-2">
                <Input
                  v-model="currentAdditionalPeriod"
                  dir="rtl"
                  placeholder="ادخل المدة الاضافية"
                  class="flex-1"
                  @keyup.enter="addAdditionalPeriod"
                />
                <Button @click="addAdditionalPeriod" type="button"> اضافة </Button>
              </div>
              <div
                v-if="form.executionDetails.additionalPeriods.length > 0"
                class="flex flex-wrap gap-2 p-2 mt-2 rounded-md bg-gray-50"
              >
                <div
                  v-for="(period, index) in form.executionDetails.additionalPeriods"
                  :key="index"
                  class="flex items-center gap-1 px-2 py-1 text-sm bg-white rounded-md shadow-sm"
                >
                  <span>{{ period }}</span>
                  <button
                    @click="removeAdditionalPeriod(index)"
                    class="text-gray-500 hover:text-red-500"
                  >
                    <X class="w-3 h-3" />
                  </button>
                </div>
              </div>
            </div>
            <div class="grid w-full gap-2 md:col-span-2">
              <Label class="text-right">الملاحظات</Label>
              <Textarea
                v-model="form.executionDetails.notes"
                dir="rtl"
                placeholder="ادخل الملاحظات"
                class="min-h-[100px]"
              />
            </div>
          </div>
        </div>
        <div class="sticky left-0 right-0 mt-6 bottom-6">
          <div class="max-w-6xl px-6 mx-auto">
            <Button
              @click="saveProject"
              class="w-full h-12 text-lg bg-slate-700 hover:bg-slate-800"
              :disabled="isSaving"
            >
              <Loader2 v-if="isSaving" class="w-4 h-4 ml-2 animate-spin" />
              <Plus v-else class="w-4 h-4 ml-2" />
              {{ isSaving ? 'جاري الحفظ...' : 'اضافة المشروع' }}
            </Button>
          </div>
        </div>
      </div>
    </div>
  </DefaultLayout>
</template>
<script setup>
  import { ref } from 'vue';
  import DefaultLayout from '@/layouts/DefaultLayout.vue';
  import { Input } from '@/components/ui/input';
  import { Label } from '@/components/ui/label';
  import { Button } from '@/components/ui/button';
  import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
  import { Calendar } from '@/components/ui/calendar';
  import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
  import CustomSelect from '@/components/CustomSelect.vue';
  import { X, Calendar as CalendarIcon, Plus, Loader2 } from 'lucide-vue-next';
  import { Textarea } from '@/components/ui/textarea';
  import { toast } from 'vue-sonner';
  const form = ref({
    projectName: '',
    plan: '',
    projectGoal: '',
    sustainableDevelopmentGoal: '',
    beneficiary: '',
    supportingEntities: [],
    location: '',
    duration: '',
    durationType: 'days',
    plannedStartDate: null,
    actualStartDate: null,
    plannedCompletionDate: null,
    actualCompletionDate: null,
    contracts: [
      {
        executingCompany: '',
        cost: '',
        referralDate: null,
        signingDate: null,
        number: '',
        executionProcedures: [
          {
            weight: '',
            duration: '',
            executionDate: null,
            completionDate: null,
            plannedTechnicalProgress: '',
            actualTechnicalProgress: '',
            technicalDeviation: '',
            plannedFinancialProgress: '',
            actualFinancialProgress: '',
          },
        ],
      },
    ],
    financials: {
      plannedCost: '',
      totalBudget: '',
      actualWorkValue: '',
      cumulativeExpenses: '',
      cumulativeProgress: '',
    },
    executionDetails: {
      currentStatus: '',
      cumulativeTechnicalProgress: '',
      cumulativeTechnicalDeviation: '',
      deviationReasons: [],
      stoppagePeriods: [],
      changeOrders: [],
      additionalPeriods: [],
      notes: '',
    },
  });
  const currentSupportingEntity = ref('');
  const currentDeviationReason = ref('');
  const currentStoppagePeriod = ref('');
  const currentChangeOrder = ref('');
  const currentAdditionalPeriod = ref('');
  const sustainableDevelopmentGoals = [
    { value: '1', label: 'القضاء على الفقر' },
    { value: '2', label: 'القضاء التام على الجوع' },
    { value: '3', label: 'الصحة الجيدة والرفاه' },
    { value: '4', label: 'التعليم الجيد' },
    { value: '5', label: 'المساواة بين الجنسين' },
    { value: '6', label: 'المياه النظيفة والنظافة الصحية' },
    { value: '7', label: 'طاقة نظيفة وبأسعار معقولة' },
    { value: '8', label: 'العمل اللائق ونمو الاقتصاد' },
    { value: '9', label: 'الصناعة والابتكار والهياكل الأساسية' },
    { value: '10', label: 'الحد من أوجه عدم المساواة' },
    { value: '11', label: 'مدن ومجتمعات محلية مستدامة' },
    { value: '12', label: 'الاستهلاك والإنتاج المسؤولان' },
    { value: '13', label: 'العمل المناخي' },
    { value: '14', label: 'الحياة تحت الماء' },
    { value: '15', label: 'الحياة في البر' },
    { value: '16', label: 'السلام والعدل والمؤسسات القوية' },
    { value: '17', label: 'عقد الشراكات لتحقيق الأهداف' },
  ];
  const beneficiaries = [
    { value: 'baghdad', label: 'مديرية تربية بغداد' },
    { value: 'environment', label: 'دائرة حماية تحسين بيئة' },
    { value: 'najaf', label: 'مديرية تربية النجف' },
    { value: 'basra', label: 'مديرية تربية البصرة' },
  ];
  const projectStatuses = [
    { value: 'ongoing', label: 'قيد التنفيذ' },
    { value: 'completed', label: 'منجز' },
    { value: 'stopped', label: 'متوقف' },
  ];
  const addSupportingEntity = () => {
    if (currentSupportingEntity.value.trim()) {
      form.value.supportingEntities.push(currentSupportingEntity.value.trim());
      currentSupportingEntity.value = '';
    }
  };
  const removeSupportingEntity = (index) => {
    form.value.supportingEntities.splice(index, 1);
  };
  const formatDate = (date) => {
    if (!date) return '';
    return new Date(date).toLocaleDateString('ar-US', {
      year: 'numeric',
      month: 'numeric',
      day: 'numeric',
    });
  };
  const addContract = () => {
    form.value.contracts.push({
      executingCompany: '',
      cost: '',
      referralDate: null,
      signingDate: null,
      number: '',
      executionProcedures: [],
    });
  };
  const removeContract = (contractIndex) => {
    form.value.contracts.splice(contractIndex, 1);
  };
  const addExecutionProcedure = (contractIndex) => {
    form.value.contracts[contractIndex].executionProcedures.push({
      weight: '',
      duration: '',
      executionDate: null,
      completionDate: null,
      plannedTechnicalProgress: '',
      actualTechnicalProgress: '',
      technicalDeviation: '',
      plannedFinancialProgress: '',
      actualFinancialProgress: '',
    });
  };
  const removeExecutionProcedure = (contractIndex, procedureIndex) => {
    form.value.contracts[contractIndex].executionProcedures.splice(procedureIndex, 1);
  };
  const addDeviationReason = () => {
    if (currentDeviationReason.value.trim()) {
      form.value.executionDetails.deviationReasons.push(currentDeviationReason.value.trim());
      currentDeviationReason.value = '';
    }
  };
  const removeDeviationReason = (index) => {
    form.value.executionDetails.deviationReasons.splice(index, 1);
  };
  const addStoppagePeriod = () => {
    if (currentStoppagePeriod.value.trim()) {
      form.value.executionDetails.stoppagePeriods.push(currentStoppagePeriod.value.trim());
      currentStoppagePeriod.value = '';
    }
  };
  const removeStoppagePeriod = (index) => {
    form.value.executionDetails.stoppagePeriods.splice(index, 1);
  };
  const addChangeOrder = () => {
    if (currentChangeOrder.value.trim()) {
      form.value.executionDetails.changeOrders.push(currentChangeOrder.value.trim());
      currentChangeOrder.value = '';
    }
  };
  const removeChangeOrder = (index) => {
    form.value.executionDetails.changeOrders.splice(index, 1);
  };
  const addAdditionalPeriod = () => {
    if (currentAdditionalPeriod.value.trim()) {
      form.value.executionDetails.additionalPeriods.push(currentAdditionalPeriod.value.trim());
      currentAdditionalPeriod.value = '';
    }
  };
  const removeAdditionalPeriod = (index) => {
    form.value.executionDetails.additionalPeriods.splice(index, 1);
  };
  const isSaving = ref(false);
  const saveProject = async () => {
    try {
      isSaving.value = true;
      if (!form.value.projectName) {
        toast.error('يرجى ادخال اسم المشروع', {
          description: 'الرجاء ملء جميع الحقول المطلوبة',
        });
        return;
      }
      await new Promise((resolve) => setTimeout(resolve, 1000));
      toast.success('تم حفظ المشروع بنجاح', {
        description: 'تم حفظ جميع بيانات المشروع',
      });
    } catch (error) {
      toast.error('حدث خطأ اثناء الحفظ', {
        description: 'لم يتم حفظ المشروع، يرجى المحاولة مرة أخرى',
      });
    } finally {
      isSaving.value = false;
    }
  };
</script>
