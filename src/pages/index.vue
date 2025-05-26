<template>
  <div class="flex" dir="rtl">
    <Sidebar />
    <main class="mr-[60px] flex-1 bg-background">
      <Header />
      <div class="mt-[6%] p-6">
        <h1 class="mb-4 text-2xl font-bold text-right text-foreground-heading">المشاريع</h1>
        <div v-if="projectStore.error" class="p-4 text-center rounded-lg bg-destructive/10">
          <p class="text-destructive">{{ projectStore.error }}</p>
        </div>
        <div>
          <div class="grid grid-cols-5 gap-4 mb-8">
            <ProjectStatCard
              title="كل المشاريع"
              :count="allProjects.length"
              icon="lucide:folder"
              color="blue"
              to="/projects"
              :loading="projectStore.loading"
            />
            <ProjectStatCard
              title="المنجزة"
              :count="completedProjects.length"
              icon="lucide:folder-check"
              color="green"
              to="/projects?status=2"
              :loading="projectStore.loading"
            />
            <ProjectStatCard
              title="قيد التنفيذ"
              :count="inProgressProjects.length"
              icon="lucide:folder-symlink"
              color="yellow"
              to="/projects?status=1"
              :loading="projectStore.loading"
            />
            <ProjectStatCard
              title="المتلكئة"
              :count="delayedProjects.length"
              icon="lucide:folder-x"
              color="red"
              to="/projects?status=3"
              :loading="projectStore.loading"
            />
            <ProjectStatCard
              title="الملغاة"
              :count="cancelledProjects.length"
              icon="lucide:folder-closed"
              color="gray"
              to="/projects?status=0"
              :loading="projectStore.loading"
            />
          </div>
          <h1 class="mb-4 text-2xl font-bold text-right text-foreground-heading"> الاختصارات </h1>
          <div class="grid grid-cols-4 gap-4 mb-8">
            <ShortcutCard
              title="البرنامج الحكومي"
              icon="lucide:users"
              color="sky"
              to="/funded-projects?showGovernmentProjects=true"
              :loading="projectStore.loading"
            />
            <ShortcutCard
              title="الإجراءات الإدارية"
              icon="eos-icons:admin"
              to="/modifications"
              color="sky"
              :loading="projectStore.loading"
            />
            <ShortcutCard
              title="المهام"
              to="/tasks"
              icon="lucide:check-circle"
              color="green"
              :loading="projectStore.loading"
            />
            <ShortcutCard
              title="بيانات على الخارطة"
              icon="lucide:map-pin"
              to="/map"
              color="yellow"
              :loading="projectStore.loading"
            />
          </div>
          <div
            class="relative w-full p-6 overflow-hidden border rounded-lg shadow border-destructive/20 bg-background-surface"
          >
            <div
              class="absolute right-[-3rem] top-[2rem] z-10 w-[12rem] rotate-45 bg-gradient-to-r from-destructive to-destructive/80 py-1 text-center text-xs shadow-md"
            >
              <span class="text-xs font-semibold tracking-wide text-destructive-foreground">
                DEMO VERSION
              </span>
            </div>
            <div class="flex items-center justify-between mb-4 mr-20">
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
              <ProjectsChart :selected-year="selectedYear" :loading="projectStore.loading" />
            </div>
          </div>
          <div class="mt-8">
            <CustomTab
              v-model="activeTab"
              :tabs="tabs"
              default-tab="projects"
              :loading="activeTab === 'projects' ? projectStore.loading : isLoadingUsers"
            >
              <template #projects>
                <ProjectsList :projects="allProjects" :loading="projectStore.loading" />
              </template>
              <template #users>
                <UsersList :users="users" :loading="isLoadingUsers" />
              </template>
            </CustomTab>
          </div>
        </div>
      </div>
    </main>
  </div>
  <Toaster />
</template>
<script setup>
  import CustomSelect from '@/components/CustomSelect.vue';
  import CustomTab from '@/components/CustomTab.vue';
  import Header from '@/components/Header.vue';
  import ProjectsChart from '@/components/ProjectsChart.vue';
  import ProjectsList from '@/components/ProjectsList.vue';
  import ProjectStatCard from '@/components/ProjectStatCard.vue';
  import ShortcutCard from '@/components/ShortcutCard.vue';
  import Sidebar from '@/components/Sidebar.vue';
  import UsersList from '@/components/UsersList.vue';
  import { useToast } from '@/composables/useToast';
  import axiosInstance from '@/plugins/axios';
  import { useAuthStore } from '@/stores/auth';
  import { useProjectStore } from '@/stores/projectStore';
  import { computed, onMounted, ref } from 'vue';
  const selectedYear = ref('2024 - 2025');
  const router = useRouter();
  const users = ref([]);
  const isLoadingUsers = ref(true);
  const userError = ref(null);
  const projectStore = useProjectStore();
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
      users.value = mockUsers;
    } finally {
      isLoadingUsers.value = false;
    }
  };
  const authStore = useAuthStore();
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
  const activeTab = ref('projects');
  const tabs = [
    {
      label: 'المستخدمين',
      value: 'users',
    },
    {
      label: 'كل المشاريع',
      value: 'projects',
    },
  ];
  onMounted(async () => {
    await Promise.all([projectStore.fetchAllProjects(), fetchUsers()]);
    if (router.currentRoute.value.query.from === 'login') {
      showSuccess('تم تسجيل الدخول بنجاح');
      router.replace({ query: {} });
    }
  });
</script>
<style></style>
