<template>
  <DefaultLayout>
    <div class="min-h-screen bg-gray-100 p-6 dark:bg-gray-900">
      <div class="mx-auto w-full max-w-6xl space-y-8">
        <div class="rounded-xl border bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
          <h1 class="text-2xl font-bold text-gray-900 dark:text-gray-100"> اضافة مشروع - ممول </h1>
        </div>

        <div class="space-y-8">
          <ProjectDetails />
          <ProjectDuration />
          <ProjectLocation />
          <ProjectComponents />
          <ProjectPreview />
        </div>

        <div class="sticky bottom-6 left-0 right-0">
          <div class="rounded-xl border bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
            <Button
              @click="saveProject"
              class="h-12 w-full bg-slate-700 text-lg hover:bg-slate-800 dark:bg-slate-600 dark:text-white dark:hover:bg-slate-700"
              :disabled="store.isSaving"
            >
              <Icon
                v-if="store.isSaving"
                icon="lucide:loader-2"
                class="ml-2 h-4 w-4 animate-spin"
              />
              <Icon v-else icon="lucide:plus" class="ml-2 h-4 w-4" />
              {{ store.isSaving ? 'جاري الحفظ...' : 'اضافة المشروع' }}
            </Button>
          </div>
        </div>
      </div>
    </div>
  </DefaultLayout>
</template>

<script setup>
  import ProjectComponents from '@/components/funded-project/ProjectComponents.vue';
  import ProjectDetails from '@/components/funded-project/ProjectDetails.vue';
  import ProjectDuration from '@/components/funded-project/ProjectDuration.vue';
  import ProjectLocation from '@/components/funded-project/ProjectLocation.vue';
  import ProjectPreview from '@/components/funded-project/ProjectPreview.vue';
  import DefaultLayout from '@/layouts/DefaultLayout.vue';
  import { useFundedProjectStore } from '@/stores/fundedProject';
  import { Icon } from '@iconify/vue';
  import { computed, onMounted, onUnmounted } from 'vue';
  import { toast } from 'vue-sonner';
  const store = useFundedProjectStore();
  const router = useRouter();

  // Ensure beneficiaryEntities is always an array
  if (!Array.isArray(store.form.beneficiaryEntities)) {
    store.form.beneficiaryEntities = store.form.beneficiaryEntities ? [store.form.beneficiaryEntities] : [''];
  }

  onMounted(() => {
    store.form = {
      name: '',
      executingDepartment: '',
      implementingEntity: '',
      beneficiaryEntities: [''],
      grantingEntity: '',
      fundingType: 1,
      cost: null,
      projectObjectives: '',
      duration: 0,
      periodType: 1,
      durationType: 'weeks',
      actualStartDate: null,
      components: [],
      latitude: '',
      longitude: '',
      isSaving: false,
      hasUnsavedChanges: false,
    };
    localStorage.removeItem('fundedProject');
    sessionStorage.removeItem('fundedProject');
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
    if (!store.form.name) {
      toast.error('يرجى ادخال اسم المشروع');
      return;
    }
    if (!store.form.executingDepartment) {
      toast.error('يرجى اختيار الدائرة المنفذة');
      return;
    }
    if (!store.form.implementingEntity) {
      toast.error('يرجى ادخال الجهة المنفذة');
      return;
    }
    if (!store.form.grantingEntity) {
      toast.error('يرجى ادخال الجهة المانحة');
      return;
    }
    if (!store.form.cost) {
      toast.error('يرجى ادخال كلفة المشروع');
      return;
    }
    if (!store.form.duration) {
      toast.error('يرجى تحديد مدة المشروع');
      return;
    }
    if (!store.form.actualStartDate) {
      toast.error('يرجى تحديد تاريخ بدء المشروع');
      return;
    }
    if (!store.form.latitude || !store.form.longitude) {
      toast.error('يرجى تحديد موقع المشروع على الخريطة');
      return;
    }

    try {
      // Ensure data types are correct before saving
      if (store.form.cost) {
        store.form.cost = parseFloat(store.form.cost);
      }
      
      if (store.form.duration) {
        store.form.duration = parseInt(store.form.duration);
      }
      
      if (store.form.latitude) {
        store.form.latitude = parseFloat(store.form.latitude);
      }
      
      if (store.form.longitude) {
        store.form.longitude = parseFloat(store.form.longitude);
      }
      
      // Convert date to ISO format if it's a Date object
      if (store.form.actualStartDate instanceof Date) {
        store.form.actualStartDate = store.form.actualStartDate.toISOString();
      }
      
      console.log('Saving project with data:', store.form);
      
      const response = await store.saveProject();
      if (response.success) {
        router.push({
          name: 'done',
          params: {
            id: response.data.id,
            name: store.form.name,
          },
        });
      }
    } catch (error) {
      console.error('API Error:', error);
      let errorMessage = 'يرجى المحاولة مرة أخرى';
      
      if (error.response) {
        console.error('Error status:', error.response.status);
        console.error('Error data:', error.response.data);
        
        // Handle specific error codes
        if (error.response.status === 400) {
          errorMessage = 'بيانات غير صحيحة، يرجى التحقق من المدخلات';
        } else if (error.response.status === 401) {
          errorMessage = 'غير مصرح لك بإضافة مشروع';
        } else if (error.response.status === 500) {
          errorMessage = 'خطأ في الخادم، يرجى المحاولة لاحقاً';
        }
      }
      
      toast.error('حدث خطأ أثناء الحفظ', {
        description: error.response?.data?.message || errorMessage,
      });
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('ar-EG', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const calculateEndDate = (startDateString, duration, durationType) => {
    if (!startDateString || !duration) return '';
    const start = new Date(startDateString);
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
