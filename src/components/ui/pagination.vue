<script setup>
defineProps({
  class: {
    type: String,
    default: ''
  }
})
</script>

<template>
  <nav
    role="navigation"
    aria-label="pagination"
    class="mx-auto flex w-full justify-center"
  >
    <slot />
  </nav>
</template>

<script>
export const PaginationContent = {
  setup(_, { slots }) {
    return () => (
      <div class="flex flex-row items-center gap-1">
        {slots.default?.()}
      </div>
    )
  }
}

export const PaginationItem = {
  setup(_, { slots }) {
    return () => <div>{slots.default?.()}</div>
  }
}

export const PaginationLink = {
  props: {
    isActive: {
      type: Boolean,
      default: false
    }
  },
  setup(props, { slots }) {
    return () => (
      <button
        class={[
          'inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground h-9 w-9',
          props.isActive ? 'bg-accent text-accent-foreground' : ''
        ]}
      >
        {slots.default?.()}
      </button>
    )
  }
}

export const PaginationPrevious = {
  props: {
    disabled: Boolean
  },
  setup(props) {
    return () => (
      <button
        disabled={props.disabled}
        class="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground h-9 px-4"
      >
        السابق
      </button>
    )
  }
}

export const PaginationNext = {
  props: {
    disabled: Boolean
  },
  setup(props) {
    return () => (
      <button
        disabled={props.disabled}
        class="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground h-9 px-4"
      >
        التالي
      </button>
    )
  }
}
</script> 