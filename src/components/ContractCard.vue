<template>
  <Card class="p-6 transition-all">
    <div class="grid grid-cols-3 gap-6">
      <div class="text-right">
        <p class="mb-2 text-sm text-muted-foreground">رقم العقد</p>
        <p class="text-xl font-medium">{{ contract.number }}</p>
      </div>

      <div class="text-center">
        <p class="mb-2 text-sm text-muted-foreground">الشركة المنفذة</p>
        <p class="text-xl font-medium">{{ contract.company }}</p>
      </div>

      <div class="text-left">
        <p class="mb-2 text-sm text-muted-foreground">المبلغ العقد</p>
        <p class="text-xl font-medium">{{ formatAmount(contract.amount) }}</p>
      </div>

      <div>
        <div class="flex items-center justify-start gap-4 text-center">
        <p class="mb-2 text-sm text-muted-foreground">تاريخ التوقيع</p>
        <p class="text-lg font-medium">{{ contract.signDate }}</p>
      </div>

      <div class="flex items-center justify-start gap-4 text-center">
        <p class="mb-2 text-sm text-muted-foreground">تاريخ الاحالة</p>
        <p class="text-lg font-medium">{{ contract.referralDate }}</p>
      </div>
      </div>

      <div class="flex items-center justify-center gap-4 text-center">
        <p class="mb-2 text-sm text-muted-foreground">عدد الاوامر التغييرية</p>
        <p class="text-lg font-medium">({{ contract.changeOrders }})</p>
      </div>

      <div class="flex items-center justify-end gap-4 text-center">
        <p class="mb-2 text-sm text-blue-500 cursor-pointer hover:underline" @click="router.push(`/contracts/${contract.id}`)">
          عرض التفاصيل
        </p>
      </div>
    </div>
  </Card>
</template>

<script setup lang="ts">
import { Card } from '@/components/ui/card'
import { useRouter } from 'vue-router'
const router = useRouter()
interface Contract {
  id: number
  number: string
  company: string
  amount: number
  signDate: string
  referralDate: string
  changeOrders: number
  projectId?: string
}

defineProps<{
  contract: Contract
}>()

const formatAmount = (amount: number) => amount.toLocaleString()
</script> 