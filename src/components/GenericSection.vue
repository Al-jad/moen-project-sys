<template>
  <div
    class="rounded-xl border bg-background-surface transition-all duration-300 ease-in-out"
    :class="[
      containerClasses,
      {
        'hover:shadow-lg': hoverable,
        'opacity-75': disabled,
        'border-primary/50': variant === 'primary',
        'border-destructive/50': variant === 'destructive',
        'border-warning/50': variant === 'warning',
      },
    ]"
  >
    <div
      class="flex items-center justify-between border-b p-4 transition-colors"
      :class="[
        headerClasses,
        {
          'bg-primary/5': variant === 'primary',
          'bg-destructive/5': variant === 'destructive',
          'bg-warning/5': variant === 'warning',
        },
      ]"
    >
      <div class="flex items-center gap-3">
        <Icon :icon="icon" class="text-foreground-subheading h-6 w-6" />
        <h4 class="text-lg font-semibold text-foreground-heading">{{ title }}</h4>
      </div>
      <PrimaryButton
        v-if="editEnabled && hasEditableFields"
        @click="toggleEdit"
        :variant="!isEditing ? 'ghost' : 'destructive'"
        size="sm"
        :icon="!isEditing ? 'lucide:edit' : 'lucide:x'"
        :disabled="disabled"
      />
    </div>

    <div
      class="p-4 transition-all duration-300"
      :class="[
        computedContentClasses,
        {
          'pointer-events-none opacity-50': disabled,
        },
      ]"
    >
      <template v-if="!isEditing">
        <div
          v-for="(field, key) in viewFields"
          :key="key"
          class="mb-4 flex flex-col space-y-1 transition-all last:mb-0"
          :class="[
            viewFieldClasses,
            {
              'rounded-lg p-3 hover:bg-background-card/50': hoverable,
            },
          ]"
        >
          <div class="text-sm font-medium text-foreground-muted">{{ field.label }}</div>
          <div
            class="text-base font-semibold text-foreground-heading transition-colors"
            :class="{
              'text-primary': variant === 'primary',
              'text-destructive': variant === 'destructive',
              'text-warning': variant === 'warning',
            }"
          >
            {{ formatValue(data[key], field) }}
          </div>
        </div>
      </template>
      <template v-else>
        <div
          v-for="(field, key) in editFields"
          :key="key"
          class="mb-4 flex flex-col space-y-2 transition-all last:mb-0"
          :class="[
            editFieldClasses,
            {
              'opacity-70': field.editable === false,
              'cursor-not-allowed': field.editable === false,
            },
          ]"
        >
          <div class="flex items-center justify-between">
            <label
              class="flex-grow text-sm font-medium text-foreground-muted"
              :class="{ 'text-foreground-muted/50': field.editable === false }"
            >
              {{ field.label }}
              <span v-if="field.editable === false" class="ml-2 text-xs text-destructive">
                غير قابل للتعديل
              </span>
            </label>
            <span
              v-if="field.props?.description"
              class="text-foreground-subheading mr-2 text-left text-xs opacity-70"
            >
              {{ field.props.description }}
            </span>
          </div>
          <div class="w-full">
            <component
              :is="getInputComponent(field.type)"
              v-model="editedData[key]"
              v-bind="field.props || {}"
              :class="['w-full', field.props?.class || '', { 'opacity-50': disabled }]"
              :wrapperClass="[
                'w-full rounded-lg border border-transparent transition-all duration-300 hover:border-primary/30',
                field.props?.wrapperClass || '',
              ]"
              :disabled="field.editable === false || disabled"
            />
          </div>
        </div>
      </template>
    </div>

    <div
      v-if="isEditing && editEnabled && hasEditableFields"
      class="flex justify-end gap-3 border-t p-4 transition-all"
      :class="[
        footerClasses,
        {
          'bg-background-card/50': variant === 'primary',
          'pointer-events-none opacity-50': disabled,
        },
      ]"
    >
      <PrimaryButton
        variant="outline"
        @click="cancelEdit"
        :disabled="disabled"
        class="min-w-[100px]"
      >
        إلغاء
      </PrimaryButton>
      <PrimaryButton
        variant="primary"
        @click="saveChanges"
        :disabled="isSaving || disabled"
        :icon="isSaving ? 'lucide:loader-2' : 'lucide:save'"
        class="min-w-[120px]"
      >
        حفظ التغييرات
      </PrimaryButton>
    </div>
  </div>
</template>

<script setup>
  import CustomInput from '@/components/CustomInput.vue';
  import CustomMultiSelect from '@/components/CustomMultiSelect.vue';
  import CustomSwitch from '@/components/CustomSwitch.vue';
  import CustomTextArea from '@/components/CustomTextArea.vue';
  import DateInput from '@/components/DateInput.vue';
  import NumberInput from '@/components/NumberInput.vue';
  import PrimaryButton from '@/components/PrimaryButton.vue';
  import { Icon } from '@iconify/vue';
  import { computed, ref, watch } from 'vue';

  const props = defineProps({
    title: {
      type: String,
      required: true,
    },
    icon: {
      type: String,
      default: 'lucide:info',
    },
    data: {
      type: Object,
      required: true,
    },
    fields: {
      type: Object,
      required: true,
      validator: (value) => {
        // Validate that each field has at least a label
        return Object.values(value).every((field) => field.label);
      },
    },
    editEnabled: {
      type: Boolean,
      default: true,
    },
    isSaving: {
      type: Boolean,
      default: false,
    },
    // Enhanced customization props
    layout: {
      type: String,
      default: 'grid',
      validator: (value) => ['grid', 'stack', 'compact', 'fluid'].includes(value),
    },
    columns: {
      type: Number,
      default: 3,
      validator: (value) => value >= 1 && value <= 4,
    },
    variant: {
      type: String,
      default: 'default',
      validator: (value) => ['default', 'primary', 'destructive', 'warning'].includes(value),
    },
    hoverable: {
      type: Boolean,
      default: false,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    containerClasses: {
      type: [String, Array],
      default: () => [],
    },
    headerClasses: {
      type: [String, Array],
      default: () => [],
    },
    contentClasses: {
      type: [String, Array],
      default: () => [],
    },
    footerClasses: {
      type: [String, Array],
      default: () => [],
    },
    viewFieldClasses: {
      type: [String, Array],
      default: () => [],
    },
    editFieldClasses: {
      type: [String, Array],
      default: () => [],
    },
  });

  const emit = defineEmits(['save', 'cancel']);

  const isEditing = ref(false);
  const editedData = ref({ ...props.data });

  // Computed property to check if any fields are editable
  const hasEditableFields = computed(() => {
    return Object.values(props.fields).some((field) => field.editable !== false);
  });

  // Computed properties to separate view and edit fields
  const viewFields = computed(() => {
    return Object.entries(props.fields).reduce((acc, [key, field]) => {
      acc[key] = {
        label: field.label,
        formatter: field.formatter,
      };
      return acc;
    }, {});
  });

  const editFields = computed(() => {
    return Object.entries(props.fields).reduce((acc, [key, field]) => {
      // Include all fields, but mark non-editable ones
      acc[key] = {
        ...field,
        editable: field.editable !== false,
        type: field.type || 'text',
        props: field.props || {},
      };
      return acc;
    }, {});
  });

  // Watch for changes in the original data
  watch(
    () => props.data,
    (newData) => {
      // Create a new object with transformed values
      const transformedData = Object.entries(newData).reduce((acc, [key, value]) => {
        const field = props.fields[key] || {};
        acc[key] = transformInputValue(key, value, field);
        return acc;
      }, {});
      editedData.value = transformedData;
    },
    { deep: true }
  );

  const toggleEdit = () => {
    if (props.disabled) return;
    if (isEditing.value) {
      cancelEdit();
    } else {
      isEditing.value = true;
      // Create a new object with transformed values
      const transformedData = Object.entries(props.data).reduce((acc, [key, value]) => {
        const field = props.fields[key] || {};
        acc[key] = transformInputValue(key, value, field);
        return acc;
      }, {});
      editedData.value = transformedData;
    }
  };

  const cancelEdit = () => {
    isEditing.value = false;
    emit('cancel');
  };

  const saveChanges = () => {
    if (props.disabled) return;

    // Only save editable fields
    const editableData = Object.keys(props.fields)
      .filter((key) => props.fields[key].editable !== false)
      .reduce((acc, key) => {
        acc[key] = editedData.value[key];
        return acc;
      }, {});

    emit('save', editableData);
    isEditing.value = false;
  };

  const getInputComponent = (type) => {
    const componentMap = {
      text: CustomInput,
      number: NumberInput,
      switch: CustomSwitch,
      multiselect: CustomMultiSelect,
      textarea: CustomTextArea,
      date: DateInput,
    };
    return componentMap[type] || CustomInput;
  };

  // Add a new method to handle special transformations
  const transformInputValue = (key, value, field) => {
    // Special handling for multiselect fields
    if (field.type === 'multiselect') {
      // If the value is an array of objects, map to their IDs
      if (Array.isArray(value) && value.length > 0 && typeof value[0] === 'object') {
        return value.map((item) => item.id || item.value);
      }
    }
    return value;
  };

  const formatValue = (value, field) => {
    if (field.formatter) return field.formatter(value);
    if (value === undefined || value === null) return 'غير محدد';
    return value;
  };

  // Computed classes based on layout and columns
  const computedContentClasses = computed(() => {
    const baseClasses = 'p-4 space-y-4';
    const layoutClasses = {
      grid: `grid grid-cols-1
             ${props.columns >= 2 ? 'sm:grid-cols-2' : ''}
             ${props.columns >= 3 ? 'md:grid-cols-3' : ''}
             ${props.columns >= 4 ? 'lg:grid-cols-4' : ''}
             gap-6`,
      stack: 'flex flex-col space-y-4',
      compact: 'grid grid-cols-1 gap-3',
      fluid: 'grid grid-cols-1 gap-5 auto-rows-auto',
    };
    return [baseClasses, layoutClasses[props.layout] || layoutClasses.grid, props.contentClasses];
  });
</script>

<style scoped>
  .fade-enter-active,
  .fade-leave-active {
    transition: opacity 0.3s ease;
  }

  .fade-enter-from,
  .fade-leave-to {
    opacity: 0;
  }
</style>
