<template>
  <DropdownMenu>
    <DropdownMenuTrigger :asChild="asChild">
      <slot name="trigger">
        <PrimaryButton :variant="variant" :class="['flex items-center gap-2', triggerClass]">
          <Icon v-if="icon" :icon="icon" class="h-4 w-4" />
          {{ label }}
          <Icon
            :icon="'lucide:chevron-down'"
            class="h-4 w-4 transition-transform duration-200"
            :class="{ 'rotate-180': open }"
          />
        </PrimaryButton>
      </slot>
    </DropdownMenuTrigger>

    <DropdownMenuContent
      :class="[
        'w-[var(--radix-dropdown-menu-trigger-width)] border-border bg-background-surface',
        contentClass,
      ]"
    >
      <slot>
        <DropdownMenuItem
          v-for="(item, index) in items"
          :key="index"
          :disabled="item.disabled"
          :class="[
            'flex items-center justify-end gap-2 transition-colors duration-200',
            'hover:bg-background-hover hover:!text-foreground focus:bg-background-hover',
            item.class,
          ]"
          @click="handleItemClick(item)"
        >
          {{ item.label }}
          <Icon v-if="item.icon" :icon="item.icon" class="h-4 w-4" />
        </DropdownMenuItem>
      </slot>
    </DropdownMenuContent>
  </DropdownMenu>
</template>

<script setup>
  import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
  } from '@/components/ui/dropdown-menu';
  import { Icon } from '@iconify/vue';
  import { ref } from 'vue';

  const props = defineProps({
    items: {
      type: Array,
      default: () => [],
    },
    label: {
      type: String,
      default: '',
    },
    icon: {
      type: String,
      default: '',
    },
    variant: {
      type: String,
      default: 'outline',
    },
    asChild: {
      type: Boolean,
      default: false,
    },
    triggerClass: {
      type: String,
      default: '',
    },
    contentClass: {
      type: String,
      default: '',
    },
  });

  const emit = defineEmits(['select']);
  const open = ref(false);

  const handleItemClick = (item) => {
    if (!item.disabled) {
      emit('select', item);
      if (item.onClick) {
        item.onClick();
      }
    }
  };
</script>
