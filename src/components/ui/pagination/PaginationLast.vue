<script setup>
  import { cn } from '@/lib/utils';
  import { ChevronsRight } from 'lucide-vue-next';
  import { PaginationLast } from 'radix-vue';

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
  <PaginationLast v-bind="delegatedProps">
    <Button :class="cn('h-10 w-10 p-0', props.class)" variant="outline">
      <slot>
        <ChevronsRight class="h-4 w-4" />
      </slot>
    </Button>
  </PaginationLast>
</template>
