<template>
  <Card
    class="border border-gray-100 bg-white p-6 shadow-sm transition-all duration-300 hover:scale-[1.01] hover:bg-gray-50 hover:shadow-md dark:border-gray-700/50 dark:bg-gray-800/95 dark:shadow-gray-900/50 dark:hover:bg-gray-800"
  >
    <div class="grid grid-cols-3 gap-6">
      <div class="text-right">
        <p class="mb-2 text-sm text-gray-500 dark:text-gray-400">رقم العقد</p>
        <p class="text-xl font-medium text-gray-900 dark:text-white">{{ contract.number }}</p>
      </div>

      <div class="text-center">
        <p class="mb-2 text-sm text-gray-500 dark:text-gray-400">الشركة المنفذة</p>
        <p class="text-xl font-medium text-gray-900 dark:text-white">{{ contract.company }}</p>
      </div>

      <div class="text-left">
        <p class="mb-2 text-sm text-gray-500 dark:text-gray-400">المبلغ العقد</p>
        <p class="text-xl font-medium text-gray-900 dark:text-white">{{
          formatAmount(contract.amount)
        }}</p>
      </div>

      <div>
        <div class="flex items-center justify-start gap-4 text-center">
          <p class="mb-2 text-sm text-gray-500 dark:text-gray-400">تاريخ التوقيع</p>
          <p class="text-lg font-medium text-gray-900 dark:text-white">{{ contract.signDate }}</p>
        </div>

        <div class="flex items-center justify-start gap-4 text-center">
          <p class="mb-2 text-sm text-gray-500 dark:text-gray-400">تاريخ الاحالة</p>
          <p class="text-lg font-medium text-gray-900 dark:text-white">{{
            contract.referralDate
          }}</p>
        </div>
      </div>

      <div class="flex items-center justify-center gap-4 text-center">
        <p class="mb-2 text-sm text-gray-500 dark:text-gray-400">عدد الاوامر التغييرية</p>
        <p class="text-lg font-medium text-gray-900 dark:text-white"
          >({{ contract.changeOrders }})</p
        >
      </div>

      <div class="flex items-center justify-end gap-4 text-center">
        <p
          class="mb-2 cursor-pointer text-sm text-blue-500 hover:underline dark:text-blue-400"
          @click="router.push(`/contracts/${contract.id}`)"
        >
          عرض التفاصيل
        </p>
      </div>
    </div>
  </Card>
</template>

<script setup lang="ts">
  const router = useRouter();
  interface Contract {
    id: number;
    number: string;
    company: string;
    amount: number;
    signDate: string;
    referralDate: string;
    changeOrders: number;
    projectId?: string;
  }

  defineProps<{
    contract: Contract;
  }>();

  const formatAmount = (amount: number) => amount.toLocaleString();
</script>
