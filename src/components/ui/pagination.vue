<template>
  <nav role="navigation" aria-label="pagination" class="mx-auto flex w-full justify-center">
    <slot />
  </nav>
</template>

<script lang="ts">
  import { defineComponent, h } from 'vue';

  // Define and export the main Pagination component
  export const Pagination = defineComponent({
    name: 'Pagination',
    props: {
      class: {
        type: String,
        default: '',
      },
    },
    setup(props, { slots }) {
      return () =>
        h(
          'nav',
          {
            role: 'navigation',
            'aria-label': 'pagination',
            class: ['mx-auto flex w-full justify-center', props.class],
          },
          slots.default?.()
        );
    },
  });

  // Export sub-components
  export const PaginationContent = defineComponent({
    name: 'PaginationContent',
    setup(_, { slots }) {
      return () => h('div', { class: 'flex flex-row items-center gap-1' }, slots.default?.());
    },
  });

  export const PaginationItem = defineComponent({
    name: 'PaginationItem',
    setup(_, { slots }) {
      return () => h('div', null, slots.default?.());
    },
  });

  export const PaginationLink = defineComponent({
    name: 'PaginationLink',
    props: {
      isActive: {
        type: Boolean,
        default: false,
      },
    },
    setup(props, { slots }) {
      return () =>
        h(
          'button',
          {
            class: [
              'inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground h-9 w-9',
              props.isActive ? 'bg-accent text-accent-foreground' : '',
            ],
          },
          slots.default?.()
        );
    },
  });

  export const PaginationPrevious = defineComponent({
    name: 'PaginationPrevious',
    props: {
      disabled: Boolean,
    },
    setup(props) {
      return () =>
        h(
          'button',
          {
            disabled: props.disabled,
            class:
              'inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground h-9 px-4',
          },
          'السابق'
        );
    },
  });

  export const PaginationNext = defineComponent({
    name: 'PaginationNext',
    props: {
      disabled: Boolean,
    },
    setup(props) {
      return () =>
        h(
          'button',
          {
            disabled: props.disabled,
            class:
              'inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground h-9 px-4',
          },
          'التالي'
        );
    },
  });

  // Set default export
  export default Pagination;
</script>
