<template>
  <div class="flex" dir="rtl">
    <Sidebar />

    <main class="mr-[60px] flex-1 bg-gray-200 dark:bg-darkmode">
      <Header />

      <div class="mt-[6%] p-6">
        <h1 class="mb-4 text-right text-2xl font-bold text-gray-900 dark:text-white"> المشاريع </h1>
        <!-- Stats Cards -->
        <div class="mb-8 grid grid-cols-4 gap-4">
          <ProjectStatCard title="كل المشاريع" :count="1582" icon="lucide:folder" color="blue" />
          <ProjectStatCard title="المنجزة" :count="982" icon="lucide:folder-check" color="green" />
          <ProjectStatCard
            title="قيد التنفيذ"
            :count="382"
            icon="lucide:folder-symlink"
            color="yellow"
          />
          <ProjectStatCard title="المتلكئة" :count="245" icon="lucide:folder-x" color="red" />
        </div>
        <h1 class="mb-4 text-right text-2xl font-bold"> الاختصارات </h1>
        <!-- Shortcuts Cards -->
        <div class="mb-8 grid grid-cols-4 gap-4">
          <ShortcutCard title="البرنامج الحكومي" icon="lucide:users" color="sky" />

          <ShortcutCard title="المشاريع" icon="lucide:users" to="/projects" color="sky" />

          <ShortcutCard title="تقرير رئاسة الوزراء" icon="lucide:line-chart" color="green" />

          <ShortcutCard title="بيانات على الخارطة" icon="lucide:map-pin" to="/map" color="yellow" />
        </div>

        <!-- Chart Section -->
        <div
          class="w-full rounded-lg border border-gray-100 bg-white p-6 shadow dark:border-gray-700/50 dark:bg-gray-800/95 dark:shadow-gray-900/50"
        >
          <div class="mb-4 flex items-center justify-between">
            <div class="flex items-center gap-2">
              <CustomSelect
                v-model="selectedYear"
                :options="[
                  { value: '2024 - 2025', label: '2024 - 2025' },
                  { value: '2023 - 2024', label: '2023 - 2024' },
                  { value: '2022 - 2023', label: '2022 - 2023' },
                ]"
                label="السنة"
                class="w-[140px]"
              />
            </div>
          </div>
          <div class="w-full">
            <ProjectsChart :selected-year="selectedYear" />
          </div>
        </div>

        <div class="mt-8">
          <Tabs default-value="projects" class="w-full">
            <TabsList
              class="w-full justify-end rounded-none border-b border-gray-200 bg-transparent p-0 dark:border-gray-700"
            >
              <TabsTrigger
                value="users"
                class="rounded-none border-b-2 border-transparent text-gray-600 hover:text-gray-900 data-[state=active]:border-primary data-[state=active]:bg-transparent dark:text-gray-300 dark:hover:text-white"
              >
                المستخدمين
              </TabsTrigger>
              <TabsTrigger
                value="projects"
                class="rounded-none border-b-2 border-transparent text-gray-600 hover:text-gray-900 data-[state=active]:border-primary data-[state=active]:bg-transparent dark:text-gray-300 dark:hover:text-white"
              >
                كل المشاريع
              </TabsTrigger>
            </TabsList>
            <TabsContent dir="rtl" value="projects" class="mt-4">
              <ProjectsList :projects="allProjects" />
            </TabsContent>
            <TabsContent value="users" class="mt-4">
              <UsersList :users="mockUsers" />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
  import CustomSelect from '@/components/CustomSelect.vue';
  import Header from '@/components/Header.vue';
  import ProjectsChart from '@/components/ProjectsChart.vue';
  import ProjectsList from '@/components/ProjectsList.vue';
  import ProjectStatCard from '@/components/ProjectStatCard.vue';
  import ShortcutCard from '@/components/ShortcutCard.vue';
  import Sidebar from '@/components/Sidebar.vue';
  import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
  import UsersList from '@/components/UsersList.vue';
  import { computed, ref } from 'vue';
  const selectedYear = ref('2024 - 2025');
  const router = useRouter();
  const mockProjects = [
    {
      id: 1,
      title: 'مشروع تجهيز محطات التحسس الاني لمراقبة المياه',
      department: 'مديرية بيئة بغداد',
      startDate: '15.01.2025',
      endDate: '22.12.205',
      status: 'منجز',
      statusVariant: 'success',
    },
    {
      id: 2,
      title: 'مشروع تجهيز محطات التحسس الاني لمراقبة المياه',
      department: 'مديرية بيئة بغداد',
      startDate: '15.01.2025',
      endDate: '22.12.205',
      status: 'قيد الانجاز',
      statusVariant: 'warning',
    },
    {
      id: 3,
      title: 'مشروع تجهيز محطات التحسس الاني لمراقبة المياه',
      department: 'مديرية بيئة بغداد',
      startDate: '15.01.2025',
      endDate: '22.12.205',
      status: 'متلكئ',
      statusVariant: 'destructive',
    },
    {
      id: 4,
      title: 'مشروع تجهيز محطات التحسس الاني لمراقبة المياه',
      department: 'مديرية بيئة بغداد',
      startDate: '15.01.2025',
      endDate: '22.12.205',
      status: 'منجز',
      statusVariant: 'success',
    },
    {
      id: 5,
      title: 'مشروع تجهيز محطات التحسس الاني لمراقبة المياه',
      department: 'مديرية بيئة بغداد',
      startDate: '15.01.2025',
      endDate: '22.12.205',
      status: 'قيد الانجاز',
      statusVariant: 'warning',
    },
    {
      id: 6,
      title: 'مشروع تجهيز محطات التحسس الاني لمراقبة المياه',
      department: 'مديرية بيئة بغداد',
      startDate: '15.01.2025',
      endDate: '22.12.205',
      status: 'متلكئ',
      statusVariant: 'destructive',
    },
    {
      id: 7,
      title: 'مشروع تجهيز محطات التحسس الاني لمراقبة المياه',
      department: 'مديرية بيئة بغداد',
      startDate: '15.01.2025',
      endDate: '22.12.205',
      status: 'منجز',
      statusVariant: 'success',
    },
    {
      id: 8,
      title: 'مشروع تجهيز محطات التحسس الاني لمراقبة المياه',
      department: 'مديرية بيئة بغداد',
      startDate: '15.01.2025',
      endDate: '22.12.205',
      status: 'قيد الانجاز',
      statusVariant: 'warning',
    },
  ];

  const allProjects = ref(mockProjects);
  const completedProjects = computed(() => mockProjects.filter((p) => p.status === 'منجز'));
  const inProgressProjects = computed(() => mockProjects.filter((p) => p.status === 'قيد الانجاز'));
  const delayedProjects = computed(() => mockProjects.filter((p) => p.status === 'متلكئ'));

  const mockUsers = [
    {
      id: 1,
      name: 'أ. دعاء الشيخلي',
      title: ' دائرة التخطيط - قسم المشاريع',
      avatar: '/img/avatar.png',
      isActive: true,
    },
    {
      id: 2,
      name: 'أ.  محمد علي',
      title: ' دائرة التخطيط - قسم المشاريع',
      avatar: '/img/avatar-2.png',
      isActive: true,
    },
    {
      id: 1,
      name: 'أ. دعاء الشيخلي',
      title: ' دائرة التخطيط - قسم المشاريع',
      avatar: '/img/avatar.png',
      isActive: true,
    },
    {
      id: 2,
      name: 'أ.  محمد علي',
      title: ' دائرة التخطيط - قسم المشاريع',
      avatar: '/img/avatar-2.png',
      isActive: true,
    },
    {
      id: 1,
      name: 'أ. دعاء الشيخلي',
      title: ' دائرة التخطيط - قسم المشاريع',
      avatar: '/img/avatar.png',
      isActive: true,
    },
    {
      id: 2,
      name: 'أ.  محمد علي',
      title: ' دائرة التخطيط - قسم المشاريع',
      avatar: '/img/avatar-2.png',
      isActive: true,
    },
    {
      id: 1,
      name: 'أ. دعاء الشيخلي',
      title: ' دائرة التخطيط - قسم المشاريع',
      avatar: '/img/avatar.png',
      isActive: true,
    },
    {
      id: 2,
      name: 'أ.  محمد علي',
      title: ' دائرة التخطيط - قسم المشاريع',
      avatar: '/img/avatar-2.png',
      isActive: true,
    },
  ];

  const userInfo = ref(null);


  onMounted(async () => {
    const response = await axiosInstance.get('/me');
    console.log(response);
    userInfo.value = response.data;
  });
</script>

<style>
  /* Add any custom styles here */
</style>
