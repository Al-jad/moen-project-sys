<script setup>
  import { cn } from '@/lib/utils';
  import { ChevronLeft } from 'lucide-vue-next';
  import { PaginationPrev } from 'radix-vue';

  const props = defineProps({
    asChild: { type: Boolean, required: false, default: true },
    as: { type: null, required: false },
    class: { type: null, required: false },
  });

  const delegatedProps = computed(() => {
    const { class: _, ...delegated } = props;

    return delegated;
  });
</script>

<template>
  <PaginationPrev v-bind="delegatedProps">
    <Button :class="cn('h-10 w-10 p-0', props.class)" variant="outline">
      <slot>
        <ChevronLeft class="h-4 w-4" />
      </slot>
    </Button>
  </PaginationPrev>
</template>
