<template>
  <Card
    class="border border-border bg-background-surface p-6 shadow-sm transition-all duration-300 hover:scale-[1.01] hover:bg-background-hover hover:shadow-md"
  >
    <div class="grid grid-cols-3 gap-6">
      <div class="text-right">
        <p class="mb-2 text-sm text-foreground-muted">رقم العقد</p>
        <p class="text-xl font-medium text-foreground">{{ contract.contractNumber }}</p>
      </div>

      <div class="text-center">
        <p class="mb-2 text-sm text-foreground-muted">الشركة المنفذة</p>
        <p class="text-xl font-medium text-foreground">{{ contract.executingDepartment }}</p>
      </div>

      <div class="text-left">
        <p class="mb-2 text-sm text-foreground-muted">المبلغ العقد</p>
        <p class="text-xl font-medium text-foreground">{{
          formatAmount(contract.cost)
        }}</p>
      </div>

      <div>
        <div class="flex items-center justify-start gap-4 text-center">
          <p class="mb-2 text-sm text-foreground-muted">تاريخ التوقيع</p>
          <p class="text-lg font-medium text-foreground">{{ contract.signingDate }}</p>
        </div>

        <div class="flex items-center justify-start gap-4 text-center">
          <p class="mb-2 text-sm text-foreground-muted">تاريخ الاحالة</p>
          <p class="text-lg font-medium text-foreground">{{
            contract.referralDate
          }}</p>
        </div>
      </div>

      <div class="flex items-center justify-center gap-4 text-center">
        <p class="mb-2 text-sm text-foreground-muted">عدد الاجراءات</p>
        <p class="text-lg font-medium text-foreground"
          >({{ contract.procedures?.length || 0 }})</p
        >
      </div>

      <div class="flex items-center justify-end gap-4 text-center">
        <p
          class="mb-2 cursor-pointer text-sm text-primary hover:underline"
          @click="router.push(`/contracts/${contract.id}`)"
        >
          عرض التفاصيل
        </p>
      </div>
    </div>
  </Card>
</template>

<script setup lang="ts">
  import type { Contract } from '@/types/contract';
  const router = useRouter();

  const props = defineProps<{
    contract: Contract;
  }>();


  const formatAmount = (amount: number) => amount.toLocaleString();
</script>
