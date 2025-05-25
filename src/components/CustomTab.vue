<template>
  <Tabs :default-value="defaultTab" class="w-full">
    <TabsList class="w-full justify-end rounded-none border-b border-border bg-transparent p-0">
      <template v-if="loading">
        <div v-for="i in 2" :key="i" class="animate-pulse">
          <div class="mx-4 h-8 w-24 rounded-full bg-border"></div>
        </div>
      </template>
      <template v-else>
        <TabsTrigger
          v-for="tab in tabs"
          :key="tab.value"
          :value="tab.value"
          class="rounded-none border-b-2 border-transparent text-foreground-muted hover:text-foreground data-[state=active]:border-primary data-[state=active]:bg-transparent"
        >
          {{ tab.label }}
        </TabsTrigger>
      </template>
    </TabsList>

    <TabsContent v-for="tab in tabs" :key="tab.value" :value="tab.value" class="mt-4" dir="rtl">
      <div v-if="loading && tab.value === modelValue" class="animate-pulse space-y-4">
        <div v-for="i in 3" :key="i" class="h-24 w-full rounded-lg bg-border"></div>
      </div>
      <div v-else>
        <slot :name="tab.value" :active="modelValue === tab.value"></slot>
      </div>
    </TabsContent>
  </Tabs>
</template>

<script setup>
  import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
  import { watch } from 'vue';

  const props = defineProps({
    modelValue: {
      type: String,
      required: true,
    },
    defaultTab: {
      type: String,
      required: true,
    },
    tabs: {
      type: Array,
      required: true,
      validator: (value) => {
        return value.every((tab) => typeof tab === 'object' && 'label' in tab && 'value' in tab);
      },
    },
    loading: {
      type: Boolean,
      default: false,
    },
  });

  const emit = defineEmits(['update:modelValue']);

  watch(
    () => props.modelValue,
    (newValue) => {
      emit('update:modelValue', newValue);
    }
  );
</script>
