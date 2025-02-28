<template>
  <DefaultLayout>
    <div class="min-h-screen bg-gray-100 p-6 dark:bg-gray-900">
      <div class="mx-auto w-full max-w-6xl space-y-8">
        <!-- Loading State -->
        <div v-if="isLoading" class="space-y-4">
          <div class="h-24 animate-pulse rounded-xl bg-gray-200 dark:bg-gray-800"></div>
          <div class="h-48 animate-pulse rounded-xl bg-gray-200 dark:bg-gray-800"></div>
          <div class="h-96 animate-pulse rounded-xl bg-gray-200 dark:bg-gray-800"></div>
        </div>

        <!-- Error State -->
        <div
          v-else-if="error"
          class="rounded-xl border border-red-200 bg-white p-6 text-center dark:border-red-800 dark:bg-gray-800"
        >
          <div class="mb-3 inline-block rounded-full bg-red-100 p-3 dark:bg-red-900/30">
            <AlertCircle class="h-6 w-6 text-red-600 dark:text-red-400" />
          </div>
          <h3 class="text-lg font-medium text-gray-900 dark:text-gray-100">
            حدث خطأ في تحميل المشروع
          </h3>
          <p class="mt-2 text-sm text-gray-500 dark:text-gray-400">
            {{ error }}
          </p>
          <Button @click="fetchProject" variant="outline" class="mt-4">
            <RefreshCw class="mr-2 h-4 w-4" />
            إعادة المحاولة
          </Button>
        </div>

        <!-- Content -->
        <template v-else-if="project">
          <!-- Header -->
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
                    {{ project?.executingDepartment }}
                  </p>
                </div>
              </div>
              <Badge :variant="project?.fundingType === 1 ? 'default' : 'outline'">
                {{ project?.fundingType === 1 ? 'ممول' : 'غير ممول' }}
              </Badge>
            </div>
          </div>

          <!-- Project Details -->
          <div class="rounded-xl border bg-white dark:border-gray-700 dark:bg-gray-800">
            <div class="border-b p-4 dark:border-gray-700">
              <div class="flex items-center gap-2">
                <Info class="h-5 w-5 text-gray-500 dark:text-gray-400" />
                <h4 class="font-medium text-gray-900 dark:text-gray-100">تفاصيل المشروع</h4>
              </div>
            </div>
            <div class="divide-y dark:divide-gray-700">
              <div class="grid grid-cols-1 gap-4 p-4 md:grid-cols-2">
                <div>
                  <div class="text-sm text-gray-500 dark:text-gray-400">الجهة المنفذة</div>
                  <div class="mt-1 text-sm font-medium text-gray-900 dark:text-gray-100">
                    {{ project?.implementingEntity }}
                  </div>
                </div>
                <div>
                  <div class="text-sm text-gray-500 dark:text-gray-400">الجهة المانحة</div>
                  <div class="mt-1 text-sm font-medium text-gray-900 dark:text-gray-100">
                    {{ project?.grantingEntity }}
                  </div>
                </div>
                <div>
                  <div class="text-sm text-gray-500 dark:text-gray-400">التكلفة</div>
                  <div class="mt-1 text-sm font-medium text-gray-900 dark:text-gray-100">
                    ${{ formatCost(project?.cost) }}
                  </div>
                </div>
                <div>
                  <div class="text-sm text-gray-500 dark:text-gray-400">تاريخ البدء</div>
                  <div class="mt-1 text-sm font-medium text-gray-900 dark:text-gray-100">
                    {{ formatDate(project?.actualStartDate) }}
                  </div>
                </div>
              </div>
              <div class="p-4">
                <div class="text-sm text-gray-500 dark:text-gray-400">الهدف من المشروع</div>
                <div class="mt-1 text-sm font-medium text-gray-900 dark:text-gray-100">
                  {{ project?.projectObjectives }}
                </div>
              </div>
            </div>
          </div>

          <!-- Components and Activities -->
          <div class="rounded-xl border bg-white dark:border-gray-700 dark:bg-gray-800">
            <div class="border-b p-4 dark:border-gray-700">
              <div class="flex items-center gap-2">
                <Target class="h-5 w-5 text-gray-500 dark:text-gray-400" />
                <h4 class="font-medium text-gray-900 dark:text-gray-100">المكونات والفعاليات</h4>
              </div>
            </div>
            <div class="divide-y dark:divide-gray-700">
              <template v-for="(component, index) in project?.components" :key="index">
                <div class="p-4">
                  <div class="mb-4 flex items-center gap-3">
                    <div
                      class="h-8 w-8 rounded-lg"
                      :style="{ backgroundColor: getComponentColor(index, true) }"
                    >
                      <div
                        class="flex h-full w-full items-center justify-center text-sm font-medium"
                        :style="{ color: getComponentColor(index) }"
                      >
                        {{ index + 1 }}
                      </div>
                    </div>
                    <div>
                      <h3 class="font-medium text-gray-900 dark:text-gray-100">
                        {{ component.name }}
                      </h3>
                      <p class="text-sm text-gray-500 dark:text-gray-400">
                        المستهدف: {{ component.targetPercentage }}%
                      </p>
                    </div>
                  </div>

                  <div class="space-y-3 pl-6">
                    <template
                      v-for="(activity, activityIndex) in component.activities"
                      :key="activityIndex"
                    >
                      <div class="rounded-lg bg-gray-50 p-3 dark:bg-gray-800/50">
                        <div class="mb-2 flex items-center justify-between">
                          <div class="flex items-center gap-2">
                            <div
                              class="h-2 w-2 rounded-full"
                              :style="{ backgroundColor: getComponentColor(index) }"
                            ></div>
                            <span class="font-medium text-gray-900 dark:text-gray-100">
                              {{ activity.name }}
                            </span>
                          </div>
                          <span class="text-sm text-gray-500 dark:text-gray-400">
                            المستهدف: {{ activity.targetPercentage }}%
                          </span>
                        </div>
                        <div
                          v-if="activity.notes"
                          class="mt-2 text-sm text-gray-500 dark:text-gray-400"
                        >
                          {{ activity.notes }}
                        </div>
                        <div class="mt-2">
                          <div class="text-xs text-gray-500 dark:text-gray-400"
                            >الفترات المحددة:</div
                          >
                          <div class="mt-1 flex flex-wrap gap-1">
                            <span
                              v-for="period in activity.selectedPeriods"
                              :key="period"
                              class="inline-flex h-6 items-center rounded-full bg-blue-500/10 px-2 text-xs font-medium text-blue-600 dark:bg-blue-500/20 dark:text-blue-400"
                            >
                              {{ project.periodType === 1 ? `اسبوع ${period}` : `شهر ${period}` }}
                            </span>
                          </div>
                        </div>
                      </div>
                    </template>
                  </div>
                </div>
              </template>
            </div>
          </div>
        </template>
      </div>
    </div>
  </DefaultLayout>
</template>

<script setup>
  import { Badge } from '@/components/ui/badge';
  import { Button } from '@/components/ui/button';
  import DefaultLayout from '@/layouts/DefaultLayout.vue';
  import axiosInstance from '@/plugins/axios';
  import { AlertCircle, Info, RefreshCw, Target } from 'lucide-vue-next';
  import { onMounted, ref } from 'vue';
  import { useRoute } from 'vue-router';

  const route = useRoute();
  const project = ref(null);
  const isLoading = ref(true);
  const error = ref(null);

  const fetchProject = async () => {
    isLoading.value = true;
    error.value = null;

    try {
      console.log('Fetching project with ID:', route.params.id);
      const response = await axiosInstance.get(`/Project/${route.params.id}`);
      console.log('API Response:', response);
      project.value = response.data;
    } catch (err) {
      console.error('Error fetching project:', err);
      error.value = err.response?.data?.message || 'حدث خطأ في تحميل بيانات المشروع';
    } finally {
      isLoading.value = false;
    }
  };

  onMounted(() => {
    fetchProject();
  });

  const componentColors = [
    { base: '#3B82F6', light: '#EFF6FF' }, // Blue
    { base: '#10B981', light: '#ECFDF5' }, // Green
    { base: '#F59E0B', light: '#FFFBEB' }, // Yellow
    { base: '#8B5CF6', light: '#F5F3FF' }, // Purple
    { base: '#EC4899', light: '#FDF2F8' }, // Pink
  ];

  const getComponentColor = (index, isLight = false) => {
    const colorIndex = index % componentColors.length;
    return isLight ? componentColors[colorIndex].light : componentColors[colorIndex].base;
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'غير محدد';
    return new Date(dateString).toLocaleDateString('ar-EG', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatCost = (value) => {
    if (!value) return '0';
    return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  };
</script>
