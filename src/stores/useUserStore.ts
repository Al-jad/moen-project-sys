import { userService } from '@/services/userService';
import type { UpdateUserPayload, User } from '@/types/users';
import { defineStore } from 'pinia';
import { computed, ref } from 'vue';
import { toast } from 'vue-sonner';

export const useUserStore = defineStore('user', () => {
  // State
  const users = ref<User[]>([]);
  const isLoading = ref(false);
  const selectedUser = ref<User | null>(null);

  // Getters
  const getUserById = computed(() => {
    return (id: number) => users.value.find((user) => user.id === id);
  });

  const getUsersByRole = computed(() => {
    return (role: User['role']) => users.value.filter((user) => user.role === role);
  });

  // Actions
  const fetchUsers = async (showLoading = true) => {
    try {
      if (showLoading) isLoading.value = true;
      const response = await userService.getAllUsers();
      users.value = response.data;
    } catch (error) {
      console.error('Error fetching users:', error);
      toast.error('حدث خطأ أثناء جلب بيانات المستخدمين');
    } finally {
      if (showLoading) isLoading.value = false;
    }
  };

  const fetchUserById = async (id: number) => {
    try {
      const response = await userService.getUserById(id);
      selectedUser.value = response.data;
      return response.data;
    } catch (error) {
      console.error('Error fetching user:', error);
      toast.error('حدث خطأ أثناء جلب بيانات المستخدم');
      return null;
    }
  };

  const createUser = async (payload: Omit<User, 'id' | 'createdAt' | 'projectName'>) => {
    try {
      const response = await userService.createUser(payload);
      users.value.push(response.data);
      toast.success('تم إضافة المستخدم بنجاح');
      return response.data;
    } catch (error) {
      console.error('Error creating user:', error);
      toast.error('حدث خطأ أثناء إضافة المستخدم');
      return null;
    }
  };

  const updateUser = async (id: number, payload: UpdateUserPayload) => {
    try {
      const response = await userService.updateUser(id, payload);
      const index = users.value.findIndex((user) => user.id === id);
      if (index !== -1) {
        users.value[index] = response.data;
      }
      toast.success('تم تحديث بيانات المستخدم بنجاح');
      return response.data;
    } catch (error) {
      console.error('Error updating user:', error);
      toast.error('حدث خطأ أثناء تحديث بيانات المستخدم');
      return null;
    }
  };

  const deleteUser = async (id: number) => {
    try {
      await userService.deleteUser(id);
      users.value = users.value.filter((user) => user.id !== id);
      toast.success('تم حذف المستخدم بنجاح');
      return true;
    } catch (error) {
      console.error('Error deleting user:', error);
      toast.error('حدث خطأ أثناء حذف المستخدم');
      return false;
    }
  };

  return {
    // State
    users,
    isLoading,
    selectedUser,
    // Getters
    getUserById,
    getUsersByRole,
    // Actions
    fetchUsers,
    fetchUserById,
    createUser,
    updateUser,
    deleteUser,
  };
});
