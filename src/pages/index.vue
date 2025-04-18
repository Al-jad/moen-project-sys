<template>
  <div class="flex" dir="rtl">
    <Sidebar />

    <main class="mr-[60px] flex-1 bg-gray-200 dark:bg-darkmode">
      <Header />

      <div class="mt-[6%] p-6">
        <h1 class="mb-4 text-right text-2xl font-bold text-gray-900 dark:text-white"> المشاريع </h1>

        <!-- Loading State -->
        <div v-if="projectStore.loading" class="flex items-center justify-center py-8">
          <div class="flex flex-col items-center gap-4">
            <div
              class="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent"
            ></div>
            <p class="text-gray-600 dark:text-gray-300">جاري تحميل المشاريع...</p>
          </div>
        </div>

        <!-- Error State -->
        <div
          v-else-if="projectStore.error"
          class="rounded-lg bg-red-50 p-4 text-center dark:bg-red-900/20"
        >
          <p class="text-red-600 dark:text-red-400">{{ projectStore.error }}</p>
        </div>

        <!-- Content -->
        <template v-else>
          <!-- Stats Cards -->
          <div class="mb-8 grid grid-cols-5 gap-4">
            <ProjectStatCard
              title="كل المشاريع"
              :count="allProjects.length"
              icon="lucide:folder"
              color="blue"
              to="/projects"
            />
            <ProjectStatCard
              title="المنجزة"
              :count="completedProjects.length"
              icon="lucide:folder-check"
              color="green"
              to="/projects?status=2"
            />
            <ProjectStatCard
              title="قيد التنفيذ"
              :count="inProgressProjects.length"
              icon="lucide:folder-symlink"
              color="yellow"
              to="/projects?status=1"
            />
            <ProjectStatCard
              title="المتلكئة"
              :count="delayedProjects.length"
              icon="lucide:folder-x"
              color="red"
              to="/projects?status=3"
            />
            <ProjectStatCard
              title="الملغاة"
              :count="cancelledProjects.length"
              icon="lucide:folder-closed"
              color="gray"
              to="/projects?status=0"
            />
          </div>

          <h1 class="mb-4 text-right text-2xl font-bold"> الاختصارات </h1>
          <!-- Shortcuts Cards -->
          <div class="mb-8 grid grid-cols-4 gap-4">
            <ShortcutCard
              title="البرنامج الحكومي"
              icon="lucide:users"
              color="sky"
              to="/funded-projects?showGovernmentProjects=true"
            />

            <ShortcutCard
              title="الإجراءات الإدارية"
              icon="eos-icons:admin"
              to="/modifications"
              color="sky"
            />

            <ShortcutCard title="المهام" to="/tasks" icon="lucide:check-circle" color="green" />

            <ShortcutCard
              title="بيانات على الخارطة"
              icon="lucide:map-pin"
              to="/map"
              color="yellow"
            />
          </div>

          <!-- Chart Section -->
          <div
            class="relative w-full overflow-hidden rounded-lg border border-red-200 bg-white p-6 shadow dark:border-red-700/50 dark:bg-gray-800/95 dark:shadow-gray-900/50"
          >
            <!-- Demo Version Ribbon -->
            <div
              class="absolute right-[-3rem] top-[2rem] z-10 w-[12rem] rotate-45 bg-gradient-to-r from-red-600 to-red-500 py-1 text-center text-xs shadow-md"
            >
              <span class="text-xs font-semibold tracking-wide text-white"> DEMO VERSION </span>
            </div>

            <div class="mb-4 mr-20 flex items-center justify-between">
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
                <div v-if="isLoadingUsers" class="flex items-center justify-center py-8">
                  <div class="flex flex-col items-center gap-4">
                    <div
                      class="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent"
                    ></div>
                    <p class="text-gray-600 dark:text-gray-300">جاري تحميل المستخدمين...</p>
                  </div>
                </div>
                <div
                  v-else-if="userError"
                  class="rounded-lg bg-red-50 p-4 text-center dark:bg-red-900/20"
                >
                  <p class="text-red-600 dark:text-red-400">{{ userError }}</p>
                </div>
                <UsersList v-else :users="users" />
              </TabsContent>
            </Tabs>
          </div>
        </template>
      </div>
    </main>
  </div>
  <Toaster />
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
  import { useToast } from '@/composables/useToast';
  import axiosInstance from '@/plugins/axios';
  import { useAuthStore } from '@/stores/authStore';
  import { useProjectStore } from '@/stores/projectStore';
  import { computed, onMounted, ref } from 'vue';

  const selectedYear = ref('2024 - 2025');
  const router = useRouter();
  const users = ref([]);
  const isLoadingUsers = ref(true);
  const userError = ref(null);

  const projectStore = useProjectStore();

  // Computed properties for all projects (both funded and regional)
  const allProjects = computed(() => projectStore.projects);

  const completedProjects = computed(() => allProjects.value.filter((p) => p.projectStatus === 2));

  const inProgressProjects = computed(() => allProjects.value.filter((p) => p.projectStatus === 1));

  const delayedProjects = computed(() => allProjects.value.filter((p) => p.projectStatus === 3));

  const cancelledProjects = computed(() => allProjects.value.filter((p) => p.projectStatus === 0));

  const formatDate = (dateString) => {
    if (!dateString) return 'غير محدد';
    const date = new Date(dateString);
    return date.toLocaleDateString('ar-EG', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const fetchUsers = async () => {
    try {
      isLoadingUsers.value = true;
      const response = await axiosInstance.get('/api/auth/users');
      users.value = response.data.map((user) => ({
        id: user.id,
        name: user.name || user.email,
        title: user.role === 'ADMIN' ? 'مدير' : user.role === 'SUPERVISOR' ? 'مشرف' : 'مدخل بيانات',
        avatar: user.avatarUrl || '/img/avatar.png',
        isActive: true,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt,
      }));
    } catch (err) {
      console.error('Error fetching users:', err);
      userError.value = err.response?.data?.message || 'حدث خطأ في تحميل المستخدمين';
      // Fallback to mockup data if API fails
      users.value = mockUsers;
    } finally {
      isLoadingUsers.value = false;
    }
  };

  const authStore = useAuthStore();

  // Mockup users as fallback
  const mockUsers = [
    {
      id: 1,
      name: 'أ. دعاء الشيخلي',
      title: 'مشرف',
      email: 'doaa@example.com',
      role: 'SUPERVISOR',
      avatar: '/img/avatar.png',
      isActive: true,
      createdAt: new Date().toISOString(),
    },
    {
      id: 2,
      name: 'أ. محمد علي',
      title: 'مدير',
      email: 'mohammed@example.com',
      role: 'ADMIN',
      avatar: '/img/avatar-2.png',
      isActive: true,
      createdAt: new Date().toISOString(),
    },
  ];

  const { showSuccess } = useToast();

  onMounted(async () => {
    await Promise.all([projectStore.fetchAllProjects(), fetchUsers()]);
    // Show welcome toast if user just logged in
    if (router.currentRoute.value.query.from === 'login') {
      showSuccess('تم تسجيل الدخول بنجاح');
      // Clear the query parameter after showing the toast
      router.replace({ query: {} });
    }
  });
</script>

<style>
  /* Add any custom styles here */
</style>
