<template>
  <div :class="['rounded-xl bg-white p-6 shadow-sm', containerClass]">
    <div :class="['flex flex-col gap-4', contentClass]">
      <div class="flex flex-col gap-2">
        <h3 :class="['line-clamp-2 text-right text-lg font-medium text-gray-900', titleClass]">{{
          title
        }}</h3>
      </div>
      <div class="flex flex-col gap-1 text-right">
        <p class="text-sm text-gray-500"> الجهة المستفيدة </p>
        <p class="text-sm text-gray-900">{{ department }}</p>
      </div>

      <div class="flex flex-col items-start gap-2 mb-2">
        <p class="text-sm text-gray-500"> حالة المشروع </p>
        <Badge :variant="statusVariant" class="px-3 py-1">{{ status }}</Badge>
      </div>

      <div class="flex flex-row-reverse items-center justify-between">
        <div class="flex flex-col gap-1">
          <span class="text-xs text-gray-500">تاريخ الانجاز</span>
          <span class="text-sm font-medium">{{ endDate }}</span>
        </div>
        <div>
          <span class="flex items-center 900"> - </span>
        </div>
        <div class="flex flex-col gap-1">
          <span class="text-xs text-gray-500">تاريخ المباشرة</span>
          <span class="text-sm font-medium">{{ startDate }}</span>
        </div>
      </div>
      <hr v-if="showActions" class="border-gray-200" />
      <div v-if="showActions" class="flex items-end justify-end">
        <div class="flex gap-4">
          <Button
            variant="primary"
            size="xl"
            class="font-medium text-gray-600 hover:text-gray-900"
            @click="viewProject"
          >
            عرض
          </Button>
          <Button variant="ghost" size="xl" class="font-bold text-gray-900 hover:text-gray-600">
            تعديل
          </Button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
  import { Badge } from '@/components/ui/badge';
  import { Button } from '@/components/ui/button';
  import { useRouter } from 'vue-router';

  const router = useRouter();
  const props = defineProps({
    id: {
      type: [String, Number],
      required: true,
    },
    title: String,
    department: String,
    startDate: String,
    endDate: String,
    status: String,
    statusVariant: {
      type: String,
      default: 'default',
    },
    containerClass: {
      type: String,
      default: '',
    },
    contentClass: {
      type: String,
      default: '',
    },
    titleClass: {
      type: String,
      default: '',
    },
    showActions: {
      type: Boolean,
      default: true,
    },
  });

  const viewProject = () => {
    router.push({
      name: 'project-details',
      params: { id: props.id.toString() },
    });
  };
</script>
