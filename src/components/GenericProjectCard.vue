<template>
  <div
    @click="!disabled && router.push(`/projects/${project.id}`)"
    class="group relative overflow-hidden rounded-lg border bg-white transition-all duration-300 dark:border-gray-700 dark:bg-gray-800"
    :class="[
      disabled
        ? 'cursor-not-allowed opacity-70'
        : 'hover:cursor-pointer hover:border-blue-500/20 hover:shadow-lg',
    ]"
  >
    <template v-if="isLoading">
      <div class="border-b border-gray-200 p-6 dark:border-gray-700">
        <!-- Title Skeleton -->
        <div class="mb-4 space-y-3">
          <div class="flex items-start justify-between">
            <div class="h-7 w-48 animate-pulse rounded-md bg-gray-200 dark:bg-gray-700"></div>
            <div class="h-6 w-24 animate-pulse rounded-full bg-gray-200 dark:bg-gray-700"></div>
          </div>
          <!-- Badges Skeleton -->
          <div class="flex flex-wrap items-center gap-2">
            <div class="h-6 w-32 animate-pulse rounded-full bg-gray-200 dark:bg-gray-700"></div>
            <div class="h-6 w-36 animate-pulse rounded-full bg-gray-200 dark:bg-gray-700"></div>
          </div>
        </div>
        <hr class="mb-6 w-full border-gray-200 dark:border-gray-700" />
        <!-- Info Grid Skeleton -->
        <div class="flex flex-wrap gap-6 pt-6 dark:border-gray-700">
          <div
            v-for="i in 4"
            :key="i"
            class="flex min-w-[12rem] flex-1 items-center justify-between gap-3 border-r border-gray-200 pr-6 last:border-r-0 dark:border-gray-700"
          >
            <div class="flex items-center gap-2">
              <div class="h-8 w-8 animate-pulse rounded-full bg-gray-200 dark:bg-gray-700"></div>
              <div class="flex flex-col gap-2">
                <div class="h-4 w-20 animate-pulse rounded bg-gray-200 dark:bg-gray-700"></div>
                <div class="h-4 w-24 animate-pulse rounded bg-gray-200 dark:bg-gray-700"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </template>
    <template v-else>
      <div class="border-b border-gray-200 p-6 dark:border-gray-700">
        <div class="mb-4 space-y-3">
          <div class="flex items-start justify-between">
            <h3
              class="_font-semibold text-lg text-gray-900 transition-colors dark:text-gray-100"
              :class="[disabled ? '' : 'group-hover:text-blue-600 dark:group-hover:text-blue-400']"
            >
              {{ project.name || 'لا يوجد اسم' }}
            </h3>
            <div
              v-if="project.projectStatus !== undefined"
              :class="getStatusBadgeClass(project.projectStatus)"
              class="rounded-full px-3 py-1 text-xs font-medium dark:bg-opacity-20"
            >
              {{ getStatusText(project.projectStatus) }}
            </div>
          </div>
          <div class="flex flex-wrap items-center gap-2">
            <div
              :class="[getFundingTypeClass()]"
              class="rounded-full px-3 py-1 text-xs font-medium"
            >
              {{ getFundingTypeText() }}
            </div>
            <div
              v-if="isFundedProject && project.isGovernment"
              class="rounded-full bg-blue-500/10 px-3 py-1 text-xs font-medium text-blue-600 dark:bg-blue-500/20 dark:text-blue-300"
            >
              ضمن البرنامج الحكومي
            </div>
          </div>
        </div>
        <hr class="mb-6 w-full border-gray-200 dark:border-gray-700" />
        <div class="flex flex-wrap gap-6 pt-4 dark:border-gray-700">
          <div
            class="flex min-w-[12rem] flex-1 items-center justify-between gap-3 border-r border-gray-200 pr-6 last:border-r-0 dark:border-gray-700"
          >
            <div class="flex items-center gap-2">
              <div class="rounded-full bg-gray-50 p-2 dark:bg-gray-500/10">
                <Icon
                  icon="lucide:calendar-days"
                  class="h-4 w-4 text-gray-600 dark:text-gray-100"
                />
              </div>
              <div class="flex flex-col">
                <h3 class="text-sm font-medium text-gray-900 dark:text-gray-100">تاريخ البدء</h3>
                <p class="text-sm font-semibold text-gray-600 dark:text-gray-100">
                  {{ formatDate(project.actualStartDate) }}
                </p>
              </div>
            </div>
          </div>
          <div
            class="flex min-w-[12rem] flex-1 items-center justify-between gap-3 border-r border-gray-200 pr-6 last:border-r-0 dark:border-gray-700"
          >
            <div class="flex items-center gap-2">
              <div class="rounded-full bg-gray-50 p-2 dark:bg-gray-500/10">
                <Icon icon="formkit:datetime" class="h-4 w-4 text-gray-600 dark:text-gray-100" />
              </div>
              <div class="flex flex-col">
                <h3 class="text-sm font-medium text-gray-900 dark:text-gray-100">فترة التنفيذ</h3>
                <p class="text-sm font-semibold text-gray-600 dark:text-gray-100">
                  {{ project.duration }} {{ getPeriodTypeText(project.periodType) }}
                </p>
              </div>
            </div>
          </div>

          <div
            class="flex min-w-[12rem] flex-1 items-center justify-between gap-3 border-r border-gray-200 pr-6 last:border-r-0 dark:border-gray-700"
          >
            <div class="flex items-center gap-2">
              <div class="rounded-full bg-gray-50 p-2 dark:bg-gray-500/10">
                <Icon
                  icon="fluent:money-calculator-24-regular"
                  class="h-4 w-4 text-gray-600 dark:text-gray-100"
                />
              </div>
              <div class="flex flex-col">
                <h3 class="text-sm font-medium text-gray-900 dark:text-gray-100">
                  {{ isFundedProject ? 'الانجاز المالي' : 'التقدم المالي' }}
                </h3>
                <div class="flex items-center gap-2">
                  <div
                    class="relative h-1.5 w-16 overflow-hidden rounded-full bg-gray-100 dark:bg-gray-700"
                  >
                    <div
                      class="absolute inset-0 h-full bg-gradient-to-r from-blue-500 to-blue-600 transition-all duration-500 ease-out dark:from-blue-400 dark:to-blue-500"
                      :style="{
                        width: `${isFundedProject ? project.financialAchievement || 0 : project.cumulativeFinancialProgress || 0}%`,
                      }"
                    ></div>
                  </div>
                  <p class="text-sm font-semibold text-gray-600 dark:text-gray-100">
                    {{
                      isFundedProject
                        ? project.financialAchievement || 0
                        : project.cumulativeFinancialProgress || 0
                    }}%
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div
            class="flex min-w-[12rem] flex-1 items-center justify-between gap-3 border-x border-r border-gray-200 pr-6 dark:border-gray-700"
          >
            <div class="flex items-center gap-2">
              <div class="rounded-full bg-gray-50 p-2 dark:bg-gray-500/10">
                <Icon icon="lucide:wallet" class="h-4 w-4 text-gray-600 dark:text-gray-100" />
              </div>
              <div class="flex flex-col">
                <h3 class="text-sm font-medium text-gray-900 dark:text-gray-100">الكلفة</h3>
                <p class="text-sm font-semibold text-gray-600 dark:text-gray-100">
                  {{ formatCost(getProjectCost) }} د.ع
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>
<script setup>
  import {
    determineFundingType,
    getProjectTypeClass,
    getProjectTypeText,
    ProjectType,
  } from '@/services/projectTypeService';
  import { Icon } from '@iconify/vue';
  import { computed } from 'vue';
  import { useRouter } from 'vue-router';

  const router = useRouter();
  const props = defineProps({
    project: {
      type: Object,
      required: true,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    isLoading: {
      type: Boolean,
      default: false,
    },
  });

  // Compute the project type once
  const projectType = computed(() => {
    console.log('Project data:', props.project);
    const type = determineFundingType(props.project);
    console.log('Determined project type:', type);
    return type;
  });

  const isFundedProject = computed(() => {
    const isFunded = projectType.value === ProjectType.FUNDED;
    console.log('Is funded project?', isFunded);
    return isFunded;
  });

  const hasBeneficiaries = computed(() => {
    if (!props.project) return false;
    return (
      (Array.isArray(props.project.beneficiaries) && props.project.beneficiaries.length > 0) ||
      (Array.isArray(props.project.sustainableDevelopment) &&
        props.project.sustainableDevelopment.length > 0)
    );
  });
  const projectBeneficiaries = computed(() => {
    if (!props.project) return [];
    if (isFundedProject.value) {
      return props.project.beneficiaries || [];
    } else {
      return props.project.sustainableDevelopment || [];
    }
  });
  function getStatusBadgeClass(status) {
    const statusClasses = {
      0: 'bg-gray-500/10 text-gray-500 dark:bg-gray-500/20 dark:text-gray-300',
      1: 'bg-yellow-500/10 text-yellow-500 dark:bg-yellow-500/20 dark:text-yellow-300',
      2: 'bg-green-500/10 text-green-500 dark:bg-green-500/20 dark:text-green-300',
      3: 'bg-red-500/10 text-red-500 dark:bg-red-500/20 dark:text-red-300',
    };
    return statusClasses[status] || '';
  }
  function getStatusText(status) {
    const statusMap = {
      0: 'ملغاة',
      1: 'قيد التنفيذ',
      2: 'منجزة',
      3: 'متلكئة',
    };
    return statusMap[status] || 'غير معروف';
  }
  function getPeriodTypeText(periodType) {
    if (!periodType) return '';
    return periodType === 1 ? 'أسبوع' : 'شهر';
  }
  function formatDate(dateString) {
    if (!dateString) return 'غير محدد';
    return new Date(dateString).toLocaleDateString('ar-EG', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  }
  const getProjectCost = computed(() => {
    if (!props.project) return 0;
    return props.project.cost || 0;
  });
  function formatCost(value) {
    if (!value) return '0';
    return value.toLocaleString('ar-IQ');
  }

  function getFundingTypeText() {
    const text = getProjectTypeText(projectType.value);
    console.log('Getting funding type text:', { type: projectType.value, text });
    return text;
  }

  function getFundingTypeClass() {
    const classes = getProjectTypeClass(projectType.value);
    console.log('Getting funding type class:', { type: projectType.value, classes });
    return classes;
  }
</script>
