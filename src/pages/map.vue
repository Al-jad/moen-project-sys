<script setup>
  import BackToMainButton from '@/components/BackToMainButton.vue';
  import Map from '@/components/Map.vue';
  import PrimaryButton from '@/components/PrimaryButton.vue';
  import { useToast } from '@/composables/useToast';
  import DefaultLayout from '@/layouts/DefaultLayout.vue';
  import { useProjectStore } from '@/stores/projectStore';
  import { Icon } from '@iconify/vue';
  import { computed, onMounted, ref } from 'vue';

  const selected = ref('all');
  const loading = ref(true);
  const error = ref(null);
  const projectStore = useProjectStore();

  // Computed property to get all projects from store
  const projects = computed(() => {
    // Filter out projects without coordinates
    return projectStore.projects.filter((project) => project.lat && project.lng);
  });

  const { showSuccess, showError } = useToast();

  onMounted(async () => {
    try {
      loading.value = true;
      // Ensure projects are fetched if not already present
      if (projectStore.projects.length === 0) {
        await projectStore.fetchAllProjects();
      }

      // Check if there are any projects with coordinates after fetching
      if (projects.value.length === 0 && !projectStore.error) {
        error.value = 'لم يتم العثور على مشاريع تحتوي على إحداثيات.';
        showError(
          'لا توجد بيانات',
          'لم يتم العثور على مشاريع تحتوي على إحداثيات لعرضها على الخارطة.'
        );
      } else if (projectStore.error) {
        // Handle potential errors from the store fetch
        error.value = projectStore.error;
        showError('فشل تحميل المشاريع', projectStore.error);
      }
    } catch (err) {
      console.error('Error in map component mount:', err);
      // Catch any unexpected errors during the mount process
      error.value = 'حدث خطأ غير متوقع أثناء تحميل بيانات الخارطة.';
      showError('خطأ غير متوقع', 'حدث خطأ أثناء تحميل بيانات الخارطة.');
    } finally {
      loading.value = false;
    }
  });

  const statusCounts = computed(() => {
    return {
      completed: projects.value.filter((p) => p.projectStatus === 2).length,
      inProgress: projects.value.filter((p) => p.projectStatus === 1).length,
      delayed: projects.value.filter((p) => p.projectStatus === 3).length,
      cancelled: projects.value.filter((p) => p.projectStatus === 0).length,
    };
  });

  const getStatusLabel = (status) => {
    switch (status) {
      case 'all':
        return 'عرض الكل';
      case 'completed':
        return 'المنجزة';
      case 'inProgress':
        return 'قيد التنفيذ';
      case 'delayed':
        return 'المتلكئة';
      case 'cancelled':
        return 'الملغاة';
      default:
        return '';
    }
  };

  const handleStatusChange = (newStatus) => {
    selected.value = newStatus;
    showSuccess('تم تغيير حالة العرض', `تم عرض المشاريع ${getStatusLabel(newStatus)}`);
  };

  // Expose the function to the template
  defineExpose({
    handleStatusChange,
  });
</script>
<template>
  <DefaultLayout>
    <main class="min-h-screen bg-gray-200 p-4 dark:bg-darkmode">
      <div class="container mx-auto max-w-[90rem] p-4">
        <div
          class="mb-6 flex flex-col items-center justify-between space-y-4 md:flex-row md:space-y-0"
        >
          <div class="flex items-center gap-4">
            <BackToMainButton />
            <h1 class="text-right text-2xl font-bold text-gray-800 dark:text-white"
              >عرض المشاريع على الخارطة</h1
            >
          </div>
        </div>
        <div class="rounded-xl bg-white/50 p-6 shadow-lg backdrop-blur-sm dark:bg-gray-800/50">
          <div
            class="mb-6 flex flex-wrap items-center justify-center gap-4 rounded-lg bg-white/80 p-6 shadow-sm dark:bg-gray-900/80"
          >
            <PrimaryButton
              size="lg"
              :variant="selected === 'all' ? 'primary' : 'outline'"
              icon="lucide:layout-grid"
              class="group relative min-w-[10rem] transform-gpu overflow-hidden rounded-lg px-6 py-3 transition-all duration-300 hover:shadow-lg hover:shadow-primary/20"
              :class="{
                'ring-2 ring-primary ring-offset-2 ring-offset-white dark:ring-offset-gray-900':
                  selected === 'all',
              }"
              @click="
                () => {
                  selected = 'all';
                  showSuccess('تم تغيير حالة العرض', 'تم عرض كل المشاريع');
                }
              "
            >
              <span class="relative z-10 flex items-center justify-center gap-2">
                <Icon :name="'lucide:layout-grid'" class="h-5 w-5" />
                <span>عرض الكل ({{ projects.length }})</span>
              </span>
              <div
                class="absolute inset-0 -z-10 bg-primary/10 transition-transform duration-300 group-hover:scale-100"
                :class="selected === 'all' ? 'scale-100' : 'scale-0'"
              ></div>
            </PrimaryButton>
            <PrimaryButton
              size="lg"
              :variant="selected === 'completed' ? 'primary' : 'outline'"
              icon="lucide:check-circle"
              class="group relative min-w-[10rem] transform-gpu overflow-hidden rounded-lg px-6 py-3 transition-all duration-300 hover:shadow-lg hover:shadow-green-500/20"
              :class="{
                'ring-2 ring-green-500 ring-offset-2 ring-offset-white dark:ring-offset-gray-900':
                  selected === 'completed',
              }"
              @click="
                () => {
                  selected = 'completed';
                  showSuccess('تم تغيير حالة العرض', 'تم عرض المشاريع المنجزة');
                }
              "
            >
              <span class="relative z-10 flex items-center justify-center gap-2">
                <Icon :name="'lucide:check-circle'" class="h-5 w-5 text-green-500" />
                <span>المنجزة ({{ statusCounts.completed }})</span>
              </span>
              <div
                class="absolute inset-0 -z-10 bg-green-500/10 transition-transform duration-300 group-hover:scale-100"
                :class="selected === 'completed' ? 'scale-100' : 'scale-0'"
              ></div>
            </PrimaryButton>
            <PrimaryButton
              size="lg"
              :variant="selected === 'inProgress' ? 'primary' : 'outline'"
              icon="lucide:loader"
              class="group relative min-w-[10rem] transform-gpu overflow-hidden rounded-lg px-6 py-3 transition-all duration-300 hover:shadow-lg hover:shadow-yellow-500/20"
              :class="{
                'ring-2 ring-yellow-500 ring-offset-2 ring-offset-white dark:ring-offset-gray-900':
                  selected === 'inProgress',
              }"
              @click="
                () => {
                  selected = 'inProgress';
                  showSuccess('تم تغيير حالة العرض', 'تم عرض المشاريع قيد التنفيذ');
                }
              "
            >
              <span class="relative z-10 flex items-center justify-center gap-2">
                <Icon :name="'lucide:loader'" class="h-5 w-5 animate-spin text-yellow-500" />
                <span>قيد التنفيذ ({{ statusCounts.inProgress }})</span>
              </span>
              <div
                class="absolute inset-0 -z-10 bg-yellow-500/10 transition-transform duration-300 group-hover:scale-100"
                :class="selected === 'inProgress' ? 'scale-100' : 'scale-0'"
              ></div>
            </PrimaryButton>
            <PrimaryButton
              size="lg"
              :variant="selected === 'delayed' ? 'primary' : 'outline'"
              icon="lucide:alert-circle"
              class="group relative min-w-[10rem] transform-gpu overflow-hidden rounded-lg px-6 py-3 transition-all duration-300 hover:shadow-lg hover:shadow-red-500/20"
              :class="{
                'ring-2 ring-red-500 ring-offset-2 ring-offset-white dark:ring-offset-gray-900':
                  selected === 'delayed',
              }"
              @click="
                () => {
                  selected = 'delayed';
                  showSuccess('تم تغيير حالة العرض', 'تم عرض المشاريع المتلكئة');
                }
              "
            >
              <span class="relative z-10 flex items-center justify-center gap-2">
                <Icon :name="'lucide:alert-circle'" class="h-5 w-5 text-red-500" />
                <span>المتلكئة ({{ statusCounts.delayed }})</span>
              </span>
              <div
                class="absolute inset-0 -z-10 bg-red-500/10 transition-transform duration-300 group-hover:scale-100"
                :class="selected === 'delayed' ? 'scale-100' : 'scale-0'"
              ></div>
            </PrimaryButton>
            <PrimaryButton
              size="lg"
              :variant="selected === 'cancelled' ? 'primary' : 'outline'"
              icon="lucide:x-circle"
              class="group relative min-w-[10rem] transform-gpu overflow-hidden rounded-lg px-6 py-3 transition-all duration-300 hover:shadow-lg hover:shadow-gray-500/20"
              :class="{
                'ring-2 ring-gray-500 ring-offset-2 ring-offset-white dark:ring-offset-gray-900':
                  selected === 'cancelled',
              }"
              @click="
                () => {
                  selected = 'cancelled';
                  showSuccess('تم تغيير حالة العرض', 'تم عرض المشاريع الملغاة');
                }
              "
            >
              <span class="relative z-10 flex items-center justify-center gap-2">
                <Icon :name="'lucide:x-circle'" class="h-5 w-5 text-gray-500" />
                <span>الملغاة ({{ statusCounts.cancelled }})</span>
              </span>
              <div
                class="absolute inset-0 -z-10 bg-gray-500/10 transition-transform duration-300 group-hover:scale-100"
                :class="selected === 'cancelled' ? 'scale-100' : 'scale-0'"
              ></div>
            </PrimaryButton>
          </div>
          <div v-if="loading" class="flex h-[600px] items-center justify-center">
            <div class="flex flex-col items-center gap-4">
              <div
                class="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent"
              ></div>
              <p class="text-gray-600 dark:text-gray-300">جاري تحميل البيانات...</p>
            </div>
          </div>
          <div v-else-if="error" class="flex h-[600px] items-center justify-center">
            <div class="flex flex-col items-center gap-4 text-center">
              <div class="rounded-full bg-red-100 p-4 dark:bg-red-900/20">
                <Icon name="lucide:alert-circle" class="h-8 w-8 text-red-500" />
              </div>
              <p class="max-w-md text-red-500">{{ error }}</p>
            </div>
          </div>
          <Map
            v-else
            class="h-[600px] w-full overflow-hidden rounded-xl"
            :is-map-page="true"
            :projects="projects"
            :selectedStatus="selected"
          />
        </div>
      </div>
    </main>
  </DefaultLayout>
</template>
