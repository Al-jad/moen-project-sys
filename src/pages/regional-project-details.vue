<template>
  <DefaultLayout>
    <div class="min-h-screen bg-gray-100 p-6 dark:bg-gray-900">
      <div class="mx-auto w-full max-w-6xl space-y-8">
        <div v-if="loading" class="space-y-4">
          <div class="h-24 animate-pulse rounded-xl bg-gray-200 dark:bg-gray-800"></div>
          <div class="h-48 animate-pulse rounded-xl bg-gray-200 dark:bg-gray-800"></div>
          <div class="h-96 animate-pulse rounded-xl bg-gray-200 dark:bg-gray-800"></div>
        </div>
        <div
          v-else-if="error"
          class="rounded-xl border border-red-200 bg-white p-6 text-center dark:border-red-800 dark:bg-gray-800"
        >
          <div class="mb-3 inline-block rounded-full bg-red-100 p-3 dark:bg-red-900/30">
            <Icon icon="lucide:alert-circle" class="h-6 w-6 text-red-600 dark:text-red-400" />
          </div>
          <h3 class="text-lg font-medium text-gray-900 dark:text-gray-100">
            حدث خطأ في تحميل المشروع
          </h3>
          <p class="mt-2 text-sm text-gray-500 dark:text-gray-400">
            {{ error }}
          </p>
          <Button @click="fetchProject" variant="outline" class="mt-4">
            <Icon icon="lucide:refresh-cw" class="mr-2 h-4 w-4" />
            إعادة المحاولة
          </Button>
        </div>
        <template v-else-if="project">
          <div class="rounded-xl border bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-3">
                <div class="h-10 w-10 rounded-lg bg-blue-500/10 dark:bg-blue-500/20">
                  <div
                    class="flex h-full w-full items-center justify-center text-lg font-semibold text-blue-600 dark:text-blue-400"
                  >
                    {{ project?.id }}
                  </div>
                </div>
                <div>
                  <h1 class="text-2xl font-bold text-gray-900 dark:text-gray-100">
                    {{ project?.name }}
                  </h1>
                  <p class="text-sm text-gray-500 dark:text-gray-400">
                    {{ project?.directorate }}
                  </p>
                </div>
              </div>
              <div class="flex items-center gap-4">
                <Badge :variant="getStatusVariant(project?.projectStatus)">
                  {{ getStatusLabel(project?.projectStatus) }}
                </Badge>
              </div>
            </div>
          </div>
          <div class="grid grid-cols-1 gap-4 md:grid-cols-4">
            <div class="rounded-xl border bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
              <div class="flex items-center gap-4">
                <div class="rounded-lg bg-blue-500/10 p-3 dark:bg-blue-500/20">
                  <Icon icon="lucide:clock" class="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <div class="text-2xl font-bold text-gray-900 dark:text-gray-100">
                    {{ project?.duration || 0 }} يوم
                  </div>
                  <div class="text-sm text-gray-500 dark:text-gray-400">المدة الكلية</div>
                </div>
              </div>
            </div>

            <div class="rounded-xl border bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
              <div class="flex items-center gap-4">
                <div class="rounded-lg bg-green-500/10 p-3 dark:bg-green-500/20">
                  <Icon
                    icon="lucide:file-text"
                    class="h-6 w-6 text-green-600 dark:text-green-400"
                  />
                </div>
                <div>
                  <div class="text-2xl font-bold text-gray-900 dark:text-gray-100">
                    {{ contracts.length || 0 }}
                  </div>
                  <div class="text-sm text-gray-500 dark:text-gray-400">عدد العقود</div>
                </div>
              </div>
            </div>

            <div class="rounded-xl border bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
              <div class="flex items-center gap-4">
                <div class="rounded-lg bg-purple-500/10 p-3 dark:bg-purple-500/20">
                  <Icon
                    icon="lucide:list-checks"
                    class="h-6 w-6 text-purple-600 dark:text-purple-400"
                  />
                </div>
                <div>
                  <div class="text-2xl font-bold text-gray-900 dark:text-gray-100">
                    {{ totalProcedures }}
                  </div>
                  <div class="text-sm text-gray-500 dark:text-gray-400">الاجراءات التنفيذية</div>
                </div>
              </div>
            </div>

            <div class="rounded-xl border bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
              <div class="flex items-center gap-4">
                <div class="rounded-lg bg-orange-500/10 p-3 dark:bg-orange-500/20">
                  <Icon icon="lucide:wallet" class="h-6 w-6 text-orange-600 dark:text-orange-400" />
                </div>
                <div>
                  <div class="text-2xl font-bold text-gray-900 dark:text-gray-100">
                    {{ formatCurrency(project?.cost) }}
                  </div>
                  <div class="text-sm text-gray-500 dark:text-gray-400">الكلفة</div>
                </div>
              </div>
            </div>
          </div>
          <RegionalProjectDetails
            :project="project"
            @save="handleSaveProject"
            @cancel="handleCancelEdit"
          />
          <div class="rounded-xl border bg-white dark:border-gray-700 dark:bg-gray-800">
            <div class="flex items-center justify-between border-b p-4 dark:border-gray-700">
              <div class="flex items-center gap-2">
                <Icon icon="lucide:file-text" class="h-5 w-5 text-gray-500 dark:text-gray-400" />
                <h4 class="font-medium text-gray-900 dark:text-gray-100">العقود والاجراءات</h4>
              </div>
              <Button @click="handleAdd" variant="ghost" size="sm">
                <Icon icon="lucide:plus" class="h-4 w-4" />
                اضافة عقد
              </Button>
            </div>
            <div class="p-4">
              <div v-if="isLoadingContracts" class="space-y-4">
                <div
                  v-for="n in 3"
                  :key="n"
                  class="h-32 animate-pulse rounded-lg bg-gray-200 dark:bg-gray-800"
                ></div>
              </div>
              <div v-else-if="contracts.length > 0" class="space-y-6">
                <div
                  v-for="contract in contracts"
                  :key="contract.id"
                  class="overflow-hidden rounded-lg border bg-white transition-all duration-300 dark:border-gray-700 dark:bg-gray-800"
                >
                  <!-- Contract Header -->
                  <div class="border-b p-4 dark:border-gray-700">
                    <div class="mb-4 flex items-center justify-between">
                      <div class="flex items-center gap-3">
                        <div class="rounded-lg bg-blue-500/10 p-2 dark:bg-blue-500/20">
                          <span class="text-lg font-bold text-blue-600 dark:text-blue-400"
                            >#{{ contract.contractNumber }}</span
                          >
                        </div>
                        <div>
                          <h3 class="text-lg font-medium text-gray-900 dark:text-gray-100">{{
                            contract.name
                          }}</h3>
                          <p class="text-sm text-gray-500 dark:text-gray-400">{{
                            contract.executingDepartment
                          }}</p>
                        </div>
                      </div>
                      <div class="flex items-center gap-2">
                        <Button @click="handleEdit(contract)" variant="ghost" size="sm">
                          <Icon icon="lucide:edit" class="h-4 w-4" />
                        </Button>
                        <Button @click="handleDelete(contract)" variant="ghost" size="sm">
                          <Icon icon="lucide:trash" class="h-4 w-4 text-red-500" />
                        </Button>
                        <Button @click="handleView(contract)" variant="ghost" size="sm">
                          <Icon icon="lucide:eye" class="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                      <div class="flex items-center gap-2">
                        <Icon icon="lucide:calendar" class="h-4 w-4 text-gray-500" />
                        <span class="text-sm text-gray-600 dark:text-gray-300"
                          >تاريخ التوقيع: {{ formatDate(contract.signingDate) }}</span
                        >
                      </div>
                      <div class="flex items-center gap-2">
                        <Icon icon="lucide:calendar-check" class="h-4 w-4 text-gray-500" />
                        <span class="text-sm text-gray-600 dark:text-gray-300"
                          >تاريخ الإحالة: {{ formatDate(contract.referralDate) }}</span
                        >
                      </div>
                      <div class="flex items-center gap-2">
                        <Icon icon="lucide:wallet" class="h-4 w-4 text-gray-500" />
                        <span class="text-sm text-gray-600 dark:text-gray-300"
                          >الكلفة: {{ formatCurrency(contract.cost) }}</span
                        >
                      </div>
                      <div class="flex items-center gap-2">
                        <Icon icon="lucide:list-checks" class="h-4 w-4 text-gray-500" />
                        <span class="text-sm text-gray-600 dark:text-gray-300"
                          >عدد الاجراءات: {{ contract.procedures?.length || 0 }}</span
                        >
                      </div>
                    </div>
                  </div>

                  <!-- Procedures Section -->
                  <div class="p-4">
                    <div class="mb-4 flex items-center justify-between">
                      <h4 class="font-medium text-gray-900 dark:text-gray-100"
                        >الاجراءات التنفيذية</h4
                      >
                      <Button @click="handleAddProcedure(contract)" variant="ghost" size="sm">
                        <Icon icon="lucide:plus" class="h-4 w-4" />
                        اضافة اجراء
                      </Button>
                    </div>

                    <div
                      v-if="contract.procedures && contract.procedures.length > 0"
                      class="space-y-4"
                    >
                      <div
                        v-for="procedure in contract.procedures"
                        :key="procedure.id"
                        class="group relative overflow-hidden rounded-xl border bg-white shadow-sm transition-all hover:shadow-md dark:border-gray-700 dark:bg-gray-800/50"
                      >
                        <!-- Upper Section -->
                        <div class="relative">
                          <!-- Header -->
                          <div
                            class="flex items-center justify-between border-b p-4 dark:border-gray-700"
                          >
                            <div class="flex items-center gap-3">
                              <div
                                class="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500/10 to-purple-500/10 dark:from-blue-500/20 dark:to-purple-500/20"
                              >
                                <span
                                  class="text-lg font-semibold text-blue-600 dark:text-blue-400"
                                >
                                  {{ procedure.weight }}%
                                </span>
                              </div>
                              <div>
                                <h5 class="text-lg font-medium text-gray-900 dark:text-gray-100">
                                  {{ procedure.name }}
                                </h5>
                                <p class="text-sm text-gray-500 dark:text-gray-400">
                                  {{ formatDate(procedure.startDate) }} -
                                  {{ formatDate(procedure.endDate) }}
                                </p>
                              </div>
                            </div>

                            <div class="flex items-center gap-3">
                              <div
                                class="flex items-center gap-1.5 rounded-lg bg-gray-50 px-3 py-1.5 dark:bg-gray-800"
                              >
                                <Icon icon="lucide:clock" class="h-4 w-4 text-gray-500" />
                                <span class="text-sm font-medium text-gray-700 dark:text-gray-300">
                                  مدة الاجراء: {{ procedure.duration }} يوم
                                </span>
                              </div>
                              <div
                                class="flex items-center gap-2 opacity-0 transition-opacity group-hover:opacity-100"
                              >
                                <Button
                                  @click="handleEditProcedure(procedure, contract)"
                                  variant="ghost"
                                  size="icon"
                                  class="h-8 w-8 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                                >
                                  <Icon icon="lucide:edit" class="h-4 w-4" />
                                </Button>
                                <Button
                                  @click="handleDeleteProcedure(procedure)"
                                  variant="ghost"
                                  size="icon"
                                  class="h-8 w-8 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20"
                                >
                                  <Icon icon="lucide:trash" class="h-4 w-4 text-red-500" />
                                </Button>
                              </div>
                            </div>
                          </div>
                        </div>

                        <!-- Progress Grid -->
                        <div class="p-4">
                          <div class="grid grid-cols-1 gap-6 lg:grid-cols-2">
                            <!-- Financial Progress -->
                            <div class="space-y-4 rounded-lg bg-gray-50 p-4 dark:bg-gray-800">
                              <div class="flex items-center justify-between">
                                <h6
                                  class="flex items-center gap-2 font-medium text-gray-700 dark:text-gray-300"
                                >
                                  <Icon icon="lucide:trending-up" class="h-4 w-4 text-blue-500" />
                                  المعلومات المالية
                                </h6>
                                <span class="text-sm text-gray-500"
                                  >{{ procedure.plannedFinancialProgress }}%</span
                                >
                              </div>

                              <!-- Progress Bars -->
                              <div class="space-y-3">
                                <div>
                                  <div class="mb-1 flex items-center justify-between text-xs">
                                    <span class="text-gray-500 dark:text-gray-400">
                                      نسبة الإنجاز المالي المخطط له
                                    </span>
                                    <span class="font-medium text-blue-600"
                                      >{{ procedure.plannedFinancialProgress }}%</span
                                    >
                                  </div>
                                  <div
                                    class="h-1.5 w-full overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700"
                                  >
                                    <div
                                      class="h-full rounded-full bg-blue-500 transition-all duration-300"
                                      :style="{ width: `${procedure.plannedFinancialProgress}%` }"
                                    ></div>
                                  </div>
                                </div>

                                <PremiumMask>
                                  <div>
                                    <div class="mb-1 flex items-center justify-between text-xs">
                                      <span class="text-gray-500 dark:text-gray-400">
                                        نسبة الإنجاز المالي الفعلي
                                      </span>
                                      <span
                                        class="font-medium"
                                        :class="{
                                          'text-green-600':
                                            procedure.actualFinancialProgress >=
                                            procedure.plannedFinancialProgress,
                                          'text-red-600':
                                            procedure.actualFinancialProgress <
                                            procedure.plannedFinancialProgress,
                                        }"
                                      >
                                        {{ procedure.actualFinancialProgress }}%
                                      </span>
                                    </div>
                                    <div
                                      class="h-1.5 w-full overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700"
                                    >
                                      <div
                                        class="h-full rounded-full transition-all duration-300"
                                        :class="{
                                          'bg-green-500':
                                            procedure.actualFinancialProgress >=
                                            procedure.plannedFinancialProgress,
                                          'bg-red-500':
                                            procedure.actualFinancialProgress <
                                            procedure.plannedFinancialProgress,
                                        }"
                                        :style="{ width: `${procedure.actualFinancialProgress}%` }"
                                      ></div>
                                    </div>
                                  </div>
                                </PremiumMask>
                              </div>
                            </div>

                            <!-- Technical Progress -->
                            <div class="space-y-4 rounded-lg bg-gray-50 p-4 dark:bg-gray-800">
                              <div class="flex items-center justify-between">
                                <h6
                                  class="flex items-center gap-2 font-medium text-gray-700 dark:text-gray-300"
                                >
                                  <Icon icon="lucide:settings" class="h-4 w-4 text-purple-500" />
                                  المعلومات الفنية
                                </h6>
                                <!-- <PremiumMask>
                                  <span
                                    class="flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium"
                                    :class="{
                                      'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400':
                                        procedure.technicalDeviation >= 0,
                                      'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400':
                                        procedure.technicalDeviation < 0,
                                    }"
                                  >
                                    <Icon
                                      :icon="
                                        procedure.technicalDeviation >= 0
                                          ? 'lucide:trending-up'
                                          : 'lucide:trending-down'
                                      "
                                      class="h-3 w-3"
                                    />
                                    {{ procedure.technicalDeviation >= 0 ? '+' : ''
                                    }}{{ procedure.technicalDeviation }}%
                                  </span>
                                </PremiumMask> -->
                              </div>

                              <!-- Progress Bars -->
                              <div class="space-y-3">
                                <div>
                                  <div class="mb-1 flex items-center justify-between text-xs">
                                    <span class="text-gray-500 dark:text-gray-400">
                                      نسبة الإنجاز الفني المخطط له
                                    </span>
                                    <span class="font-medium text-purple-600"
                                      >{{ procedure.plannedCompletionPercentage }}%</span
                                    >
                                  </div>
                                  <div
                                    class="h-1.5 w-full overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700"
                                  >
                                    <div
                                      class="h-full rounded-full bg-purple-500 transition-all duration-300"
                                      :style="{
                                        width: `${procedure.plannedCompletionPercentage}%`,
                                      }"
                                    ></div>
                                  </div>
                                </div>

                                <PremiumMask>
                                  <div>
                                    <div class="mb-1 flex items-center justify-between text-xs">
                                      <span class="text-gray-500 dark:text-gray-400">الفعلي</span>
                                      <span
                                        class="font-medium"
                                        :class="{
                                          'text-green-600':
                                            procedure.actualCompletionPercentage >=
                                            procedure.plannedCompletionPercentage,
                                          'text-red-600':
                                            procedure.actualCompletionPercentage <
                                            procedure.plannedCompletionPercentage,
                                        }"
                                      >
                                        {{ procedure.actualCompletionPercentage }}%
                                      </span>
                                    </div>
                                    <div
                                      class="h-1.5 w-full overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700"
                                    >
                                      <div
                                        class="h-full rounded-full transition-all duration-300"
                                        :class="{
                                          'bg-green-500':
                                            procedure.actualCompletionPercentage >=
                                            procedure.plannedCompletionPercentage,
                                          'bg-red-500':
                                            procedure.actualCompletionPercentage <
                                            procedure.plannedCompletionPercentage,
                                        }"
                                        :style="{
                                          width: `${procedure.actualCompletionPercentage}%`,
                                        }"
                                      ></div>
                                    </div>
                                    <div class="mt-4 flex items-center justify-between text-xs">
                                      <span class="text-gray-500 dark:text-gray-400">
                                        نسبة الإنحراف الفني
                                      </span>
                                      <span
                                        class="font-medium"
                                        :class="{
                                          'text-green-600': procedure.technicalDeviation >= 0,
                                          'text-red-600': procedure.technicalDeviation < 0,
                                        }"
                                      >
                                        {{ procedure.technicalDeviation >= 0 ? '+' : ''
                                        }}{{ procedure.technicalDeviation }}%
                                      </span>
                                    </div>
                                    <div
                                      class="h-1.5 w-full overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700"
                                    >
                                      <div
                                        class="h-full rounded-full transition-all duration-300"
                                        :class="{
                                          'bg-green-500':
                                            procedure.actualCompletionPercentage >=
                                            procedure.plannedCompletionPercentage,
                                          'bg-red-500':
                                            procedure.actualCompletionPercentage <
                                            procedure.plannedCompletionPercentage,
                                        }"
                                        :style="{
                                          width: `${procedure.actualCompletionPercentage}%`,
                                        }"
                                      ></div>
                                    </div>
                                  </div>
                                </PremiumMask>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div
                      v-else
                      class="flex flex-col items-center justify-center rounded-lg border border-dashed py-6 text-center dark:border-gray-700"
                    >
                      <div class="mb-3 rounded-full bg-gray-100 p-3 dark:bg-gray-800">
                        <Icon
                          icon="lucide:list-checks"
                          class="h-6 w-6 text-gray-400 dark:text-gray-500"
                        />
                      </div>
                      <h3 class="mb-1 text-sm font-medium text-gray-900 dark:text-gray-100">
                        لا توجد اجراءات تنفيذية
                      </h3>
                      <p class="mb-4 text-sm text-gray-500 dark:text-gray-400">
                        قم بإضافة اجراءات تنفيذية للعقد
                      </p>
                      <Button @click="handleAddProcedure(contract)" variant="outline" size="sm">
                        <Icon icon="lucide:plus" class="mr-2 h-4 w-4" />
                        إضافة اجراء
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
              <div
                v-else
                class="flex flex-col items-center justify-center rounded-lg border border-dashed py-8 text-center dark:border-gray-700"
              >
                <div class="mb-3 rounded-full bg-gray-100 p-3 dark:bg-gray-800">
                  <Icon icon="lucide:file-text" class="h-8 w-8 text-gray-400 dark:text-gray-500" />
                </div>
                <h3 class="mb-1 text-base font-medium text-gray-900 dark:text-gray-100">
                  لا توجد عقود
                </h3>
                <p class="mb-4 text-sm text-gray-500 dark:text-gray-400">
                  قم بإضافة عقود للمشروع
                </p>
                <Button variant="outline" size="sm" @click="handleAdd">
                  <Icon icon="lucide:plus" class="mr-2 h-4 w-4" />
                  إضافة عقد
                </Button>
              </div>
            </div>
          </div>
          <div class="flex justify-end">
            <div class="flex items-center gap-2">
              <Button variant="destructive" @click="showDeleteConfirmation">
                <Icon icon="material-symbols-light:delete-outline" class="mr-2 h-4 w-4" />
                حذف المشروع
              </Button>
            </div>
          </div>
        </template>
      </div>
    </div>
  </DefaultLayout>
  <AddContractModal
    v-model:open="isContractDialogOpen"
    :edit-data="selectedContract"
    @save="handleContractSubmit"
  />
  <EditProcedureModal
    v-model:isOpen="isProcedureModalOpen"
    :procedure="selectedProcedure"
    :isEdit="!!selectedProcedure"
    :contractInfo="{
      name: selectedContract?.name || '',
      project: project?.name || '',
    }"
    @save="handleProcedureSubmit"
  />
  <DeleteModal
    v-model:open="isDeleteContractModalOpen"
    title="حذف العقد"
    description="تأكيد حذف العقد"
    :message="
      selectedContract?.contractNumber
        ? 'هل أنت متأكد من حذف العقد رقم ' + selectedContract.contractNumber + '؟'
        : ''
    "
    :loading="isDeleting"
    @confirm="confirmDeleteContract"
    @cancel="cancelDeleteContract"
  />
  <DeleteModal
    v-model:open="isDeleteProcedureModalOpen"
    title="حذف الاجراء"
    description="تأكيد حذف الاجراء"
    :message="
      selectedProcedure?.name ? 'هل أنت متأكد من حذف الاجراء ' + selectedProcedure.name + '؟' : ''
    "
    :loading="isDeleting"
    @confirm="confirmDeleteProcedure"
    @cancel="cancelDeleteProcedure"
  />
  <DeleteModal
    v-model:open="showDeleteModal"
    title="حذف المشروع"
    description="تأكيد حذف المشروع"
    :message="`هل أنت متأكد من حذف المشروع '${project?.name}'؟ لا يمكن التراجع عن هذا الإجراء.`"
    :loading="isDeleting"
    @confirm="confirmDeleteProject"
    @cancel="() => (showDeleteModal = false)"
  />
</template>
<script setup>
  import AddContractModal from '@/components/AddContractModal.vue';
  import DeleteModal from '@/components/DeleteModal.vue';
  import EditProcedureModal from '@/components/EditProcedureModal.vue';
  import PremiumMask from '@/components/PremiumMask.vue';
  import RegionalProjectDetails from '@/components/regional-project/RegionalProjectDetails.vue';
  import Badge from '@/components/ui/badge/Badge.vue';
  import { Button } from '@/components/ui/button';
  import DefaultLayout from '@/layouts/DefaultLayout.vue';
  import axiosInstance from '@/plugins/axios';
  import { useRegionalProjectStore } from '@/stores/regionalProjectStore';
  import { Icon } from '@iconify/vue';
  import { computed, onMounted, ref } from 'vue';
  import { useRoute, useRouter } from 'vue-router';
  import { toast } from 'vue-sonner';

  const route = useRoute();
  const router = useRouter();
  const store = useRegionalProjectStore();
  const project = ref(null);
  const loading = ref(true);
  const error = ref(null);
  const contracts = ref([]);
  const isLoadingContracts = ref(false);
  const contractsCount = computed(() => store.contractsCount);
  const proceduresCount = computed(() => store.proceduresCount);
  const isSaving = ref(false);
  const showDeleteModal = ref(false);
  const isDeleting = ref(false);
  const isContractDialogOpen = ref(false);
  const selectedContract = ref(null);
  const isDeleteContractModalOpen = ref(false);
  const isProcedureModalOpen = ref(false);
  const selectedProcedure = ref(null);
  const isDeleteProcedureModalOpen = ref(false);

  const fetchContracts = async () => {
    if (!project.value?.id) return;

    try {
      isLoadingContracts.value = true;
      const response = await axiosInstance.get(
        `/api/RegionalProject/Contract/Project/${project.value.id}`
      );
      contracts.value = response.data;
    } catch (err) {
      console.error('Error fetching contracts:', err);
      toast.error('حدث خطأ في تحميل العقود');
    } finally {
      isLoadingContracts.value = false;
    }
  };

  const fetchProject = async () => {
    try {
      const projectId = parseInt(route.params.id);
      if (!projectId) {
        error.value = 'معرف المشروع غير صالح';
        return;
      }

      const response = await axiosInstance.get(`/api/RegionalProject/${projectId}`);
      project.value = response.data;

      if (!project.value) {
        error.value = 'المشروع غير موجود';
        return;
      }

      // Fetch contracts after project is loaded
      await fetchContracts();
    } catch (err) {
      console.error('Error fetching project:', err);
      error.value = err.message || 'حدث خطأ في تحميل بيانات المشروع';
    } finally {
      loading.value = false;
    }
  };

  onMounted(() => {
    fetchProject();
  });

  const handleSaveProject = async (updatedProject) => {
    isSaving.value = true;
    try {
      const projectData = {
        ...updatedProject,
        projectStatus: parseInt(updatedProject.projectStatus) || 1,
      };

      const response = await axiosInstance.put(
        `/api/RegionalProject/${project.value.id}`,
        projectData
      );
      project.value = { ...project.value, ...response.data };
      await fetchProject();
      toast.success('تم حفظ التغييرات بنجاح');
    } catch (error) {
      console.error('Error saving project details:', error);
      let errorMessage = 'حدث خطأ أثناء الحفظ';
      if (error.response?.data?.errors) {
        const errors = error.response.data.errors;
        const errorMessages = [];
        for (const key in errors) {
          errorMessages.push(...errors[key]);
        }
        errorMessage = errorMessages.join('\n');
      }
      toast.error(errorMessage);
    } finally {
      isSaving.value = false;
    }
  };

  const handleCancelEdit = () => {
    fetchProject();
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-IQ', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
      });
    } catch (error) {
      console.error('Error formatting date:', error);
      return dateString;
    }
  };

  const formatCurrency = (value) => {
    if (!value) return '0';
    const formattedNumber = new Intl.NumberFormat('ar-IQ', {
      style: 'decimal',
      maximumFractionDigits: 0,
    }).format(value);
    return `${formattedNumber} د.ع`;
  };

  const handleAdd = () => {
    selectedContract.value = null;
    isContractDialogOpen.value = true;
  };

  const handleEdit = (contract) => {
    selectedContract.value = { ...contract };
    isContractDialogOpen.value = true;
  };

  const handleView = (contract) => {
    router.push(`/contracts/${contract.id}`);
  };

  const handleContractSubmit = async (data) => {
    try {
      isSaving.value = true;
      const payload = {
        ...data,
        projectId: project.value.id,
      };

      if (selectedContract.value?.id) {
        // Edit existing contract
        await axiosInstance.put(
          `/api/RegionalProject/Contract/${selectedContract.value.id}`,
          payload
        );
        toast.success('تم تعديل العقد بنجاح');
      } else {
        // Create new contract
        await axiosInstance.post('/api/RegionalProject/Contract', payload);
        toast.success('تم اضافة العقد بنجاح');
      }

      closeContractDialog();
      await fetchContracts(); // Refresh contracts
    } catch (error) {
      console.error('Error in contract process:', error);
      toast.error('حدث خطأ أثناء معالجة العقد');
    } finally {
      isSaving.value = false;
    }
  };

  const closeContractDialog = () => {
    selectedContract.value = null;
    isContractDialogOpen.value = false;
  };

  const handleDelete = (contract) => {
    selectedContract.value = contract;
    isDeleteContractModalOpen.value = true;
  };

  const confirmDeleteContract = async () => {
    try {
      isDeleting.value = true;
      await axiosInstance.delete(`/api/RegionalProject/Contract/${selectedContract.value.id}`);
      await fetchContracts();
      toast.success('تم حذف العقد بنجاح');
    } catch (error) {
      console.error('Error deleting contract:', error);
      toast.error('حدث خطأ أثناء حذف العقد');
    } finally {
      isDeleting.value = false;
      isDeleteContractModalOpen.value = false;
      selectedContract.value = null;
    }
  };

  const cancelDeleteContract = () => {
    isDeleteContractModalOpen.value = false;
    selectedContract.value = null;
  };

  const showDeleteConfirmation = () => {
    if (!project.value) return;
    showDeleteModal.value = true;
  };

  const confirmDeleteProject = async () => {
    isDeleting.value = true;
    try {
      await axiosInstance.delete(`/api/RegionalProject/${project.value.id}`);
      toast.success('تم حذف المشروع بنجاح');
      router.push('/regional-projects');
    } catch (error) {
      console.error('Error deleting project:', error);
      toast.error('حدث خطأ أثناء حذف المشروع');
    } finally {
      isDeleting.value = false;
      showDeleteModal.value = false;
    }
  };

  const handleEditProcedure = (procedure, contract) => {
    selectedProcedure.value = { ...procedure };
    selectedContract.value = contract;
    isProcedureModalOpen.value = true;
  };

  const handleDeleteProcedure = (procedure) => {
    selectedProcedure.value = procedure;
    isDeleteProcedureModalOpen.value = true;
  };

  const handleProcedureSubmit = async (data) => {
    try {
      isSaving.value = true;
      const procedureData = {
        ...data,
        contractId: selectedContract.value.id,
      };

      if (selectedProcedure.value?.id) {
        // Edit existing procedure
        await store.updateProcedure(selectedProcedure.value.id, procedureData);
        toast.success('تم تعديل الاجراء بنجاح');
      } else {
        // Add new procedure
        await store.createProcedure(procedureData);
        toast.success('تم اضافة الاجراء بنجاح');
      }

      closeProcedureDialog();
      await fetchContracts(); // Refresh contracts to get updated procedures
    } catch (error) {
      console.error('Error in procedure process:', error);
      toast.error('حدث خطأ أثناء معالجة الاجراء');
    } finally {
      isSaving.value = false;
    }
  };

  const closeProcedureDialog = () => {
    selectedProcedure.value = null;
    selectedContract.value = null;
    isProcedureModalOpen.value = false;
  };

  const confirmDeleteProcedure = async () => {
    try {
      isDeleting.value = true;
      await store.deleteProcedure(selectedProcedure.value.id, selectedProcedure.value.contractId);
      await fetchContracts(); // Refresh contracts to get updated procedures
      toast.success('تم حذف الاجراء بنجاح');
    } catch (error) {
      console.error('Error deleting procedure:', error);
      toast.error('حدث خطأ أثناء حذف الاجراء');
    } finally {
      isDeleting.value = false;
      isDeleteProcedureModalOpen.value = false;
      selectedProcedure.value = null;
    }
  };

  const cancelDeleteProcedure = () => {
    isDeleteProcedureModalOpen.value = false;
    selectedProcedure.value = null;
  };

  const handleAddProcedure = (contract) => {
    selectedProcedure.value = null;
    selectedContract.value = contract;
    isProcedureModalOpen.value = true;
  };

  const projectStatuses = [
    { value: 1, label: 'قيد التنفيذ' },
    { value: 2, label: 'منجزة' },
    { value: 3, label: 'متلكئة' },
    { value: 0, label: 'ملغاة' },
  ];

  const getStatusLabel = (status) => {
    const statusObj = projectStatuses.find((s) => s.value === status);
    return statusObj ? statusObj.label : 'غير محدد';
  };

  const getStatusVariant = (status) => {
    switch (status) {
      case 1:
        return 'warning'; // قيد التنفيذ
      case 2:
        return 'success'; // منجزة
      case 3:
        return 'destructive'; // متلكئة
      case 0:
        return 'outline'; // ملغاة
      default:
        return 'secondary';
    }
  };

  const totalProcedures = computed(() => {
    return contracts.value.reduce((total, contract) => {
      return total + (contract.procedures?.length || 0);
    }, 0);
  });
</script>
<style scoped>
  .custom-scrollbar {
    scrollbar-width: thin;
    scrollbar-color: #94a3b8 #e2e8f0;
  }
  .custom-scrollbar::-webkit-scrollbar {
    height: 0.5rem;
    width: 0.5rem;
  }
  .custom-scrollbar::-webkit-scrollbar-track {
    @apply bg-gray-200 dark:bg-gray-700;
    border-radius: 0.25rem;
  }
  .custom-scrollbar::-webkit-scrollbar-thumb {
    @apply bg-gray-400 dark:bg-gray-500;
    border-radius: 0.25rem;
  }
  .custom-scrollbar::-webkit-scrollbar-thumb:hover {
    @apply bg-gray-500 dark:bg-gray-400;
  }
</style>
