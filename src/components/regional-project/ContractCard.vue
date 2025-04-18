<template>
  <div
    class="overflow-hidden rounded-lg border bg-white transition-all duration-300 dark:border-gray-700 dark:bg-gray-800"
  >
    <div class="border-b p-4 dark:border-gray-700">
      <div class="mb-4 flex items-center justify-between">
        <div class="flex items-center gap-3">
          <div class="rounded-lg bg-blue-500/10 p-2 dark:bg-blue-500/20">
            <span class="text-lg font-bold text-blue-600 dark:text-blue-400">{{
              contract.contractNumber
            }}</span>
          </div>
          <div>
            <h3 class="text-lg font-medium text-gray-900 dark:text-gray-100">{{
              contract.name
            }}</h3>
            <p class="text-sm text-gray-500 dark:text-gray-400">
              الجهة المنفذة: {{ contract.executingDepartment }}
            </p>
          </div>
        </div>
        <div class="flex items-center gap-2">
          <Button @click="$emit('edit', contract)" variant="ghost" size="sm">
            <Icon icon="lucide:edit" class="h-4 w-4" />
          </Button>
          <Button @click="$emit('delete', contract)" variant="ghost" size="sm">
            <Icon icon="lucide:trash" class="h-4 w-4 text-red-500" />
          </Button>
          <Button @click="$emit('view', contract)" variant="ghost" size="sm">
            <Icon icon="lucide:eye" class="h-4 w-4" />
          </Button>
        </div>
      </div>
      <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div class="flex items-center gap-2">
          <div class="rounded-lg bg-gray-100 p-2 dark:bg-gray-700">
            <Icon icon="lucide:calendar" class="h-4 w-4 text-gray-500" />
          </div>
          <div>
            <p class="text-xs text-gray-500 dark:text-gray-400">تاريخ التوقيع</p>
            <p class="text-sm font-medium text-gray-900 dark:text-gray-100">
              {{ formatDate(contract.signingDate) }}
            </p>
          </div>
        </div>
        <div class="flex items-center gap-2">
          <div class="rounded-lg bg-gray-100 p-2 dark:bg-gray-700">
            <Icon icon="lucide:calendar-check" class="h-4 w-4 text-gray-500" />
          </div>
          <div>
            <p class="text-xs text-gray-500 dark:text-gray-400">تاريخ الإحالة</p>
            <p class="text-sm font-medium text-gray-900 dark:text-gray-100">
              {{ formatDate(contract.referralDate) }}
            </p>
          </div>
        </div>
        <div class="flex items-center gap-2">
          <div class="rounded-lg bg-gray-100 p-2 dark:bg-gray-700">
            <Icon icon="lucide:wallet" class="h-4 w-4 text-gray-500" />
          </div>
          <div>
            <p class="text-xs text-gray-500 dark:text-gray-400">الكلفة</p>
            <p class="text-sm font-medium text-gray-900 dark:text-gray-100">
              {{ formatCurrency(contract.cost) }}
            </p>
          </div>
        </div>
        <div class="flex items-center gap-2">
          <div class="rounded-lg bg-gray-100 p-2 dark:bg-gray-700">
            <Icon icon="lucide:list-checks" class="h-4 w-4 text-gray-500" />
          </div>
          <div>
            <p class="text-xs text-gray-500 dark:text-gray-400">عدد الاجراءات</p>
            <p class="text-sm font-medium text-gray-900 dark:text-gray-100">
              {{ contract.procedures?.length || 0 }}
            </p>
          </div>
        </div>
      </div>
    </div>
    <div class="p-4">
      <div class="mb-4 flex items-center justify-between">
        <h4 class="font-medium text-gray-900 dark:text-gray-100">الاجراءات التنفيذية</h4>
        <Button @click="$emit('addProcedure', contract)" size="sm">
          <Icon icon="lucide:plus" class="h-4 w-4" />
          اضافة اجراء
        </Button>
      </div>
      <div v-if="contract.procedures && contract.procedures.length > 0" class="space-y-4">
        <ProcedureCard
          v-for="procedure in contract.procedures"
          :key="procedure.id"
          :procedure="procedure"
          @edit="(p) => $emit('editProcedure', p, contract)"
          @delete="(p) => $emit('deleteProcedure', p)"
        />
      </div>
      <div
        v-else
        class="flex flex-col items-center justify-center rounded-lg border border-dashed py-6 text-center dark:border-gray-700"
      >
        <div class="mb-3 rounded-full bg-gray-100 p-3 dark:bg-gray-800">
          <Icon icon="lucide:list-checks" class="h-6 w-6 text-gray-400 dark:text-gray-500" />
        </div>
        <h3 class="mb-1 text-sm font-medium text-gray-900 dark:text-gray-100">
          لا توجد اجراءات تنفيذية
        </h3>
        <p class="mb-4 text-sm text-gray-500 dark:text-gray-400">قم بإضافة اجراءات تنفيذية للعقد</p>
        <Button @click="$emit('addProcedure', contract)" variant="outline" size="sm">
          <Icon icon="lucide:plus" class="mr-2 h-4 w-4" />
          إضافة اجراء
        </Button>
      </div>
    </div>
  </div>
</template>

<script setup>
  import { Button } from '@/components/ui/button';
  import { Icon } from '@iconify/vue';
  import ProcedureCard from './ProcedureCard.vue';

  const props = defineProps({
    contract: {
      type: Object,
      required: true,
    },
  });

  defineEmits(['edit', 'delete', 'view', 'addProcedure', 'editProcedure', 'deleteProcedure']);

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
</script>
