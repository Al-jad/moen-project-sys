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

<script setup lang="ts">
  import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
  } from '@/components/ui/dropdown-menu';
  import { Icon } from '@iconify/vue';
  import { ref } from 'vue';

  interface DropdownItem {
    label: string;
    icon?: string;
    disabled?: boolean;
    class?: string;
    onClick?: () => void;
  }

  type ButtonVariant =
    | 'primary'
    | 'link'
    | 'default'
    | 'destructive'
    | 'outline'
    | 'secondary'
    | 'ghost';

  const props = withDefaults(
    defineProps<{
      items: DropdownItem[];
      label: string;
      icon?: string;
      variant?: ButtonVariant;
      asChild?: boolean;
      triggerClass?: string;
      contentClass?: string;
    }>(),
    {
      items: () => [],
      label: '',
      icon: '',
      variant: 'outline',
      asChild: false,
      triggerClass: '',
      contentClass: '',
    }
  );

  const emit = defineEmits<{
    select: [item: DropdownItem];
  }>();

  const open = ref(false);

  const handleItemClick = (item: DropdownItem): void => {
    if (!item.disabled) {
      emit('select', item);
      if (item.onClick) {
        item.onClick();
      }
    }
  };
</script>
