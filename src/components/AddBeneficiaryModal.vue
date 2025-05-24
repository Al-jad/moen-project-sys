<template>
  <Dialog :open="open" @update:open="$emit('update:open', $event)">
    <DialogContent class="sm:max-w-[500px]">
      <DialogHeader>
        <DialogTitle class="text-right text-xl font-semibold">
          {{ isEditing ? 'تعديل الجهة المستفيدة' : 'اضافة جهة مستفيدة' }}
        </DialogTitle>
      </DialogHeader>

      <form @submit.prevent="save" class="py-4">
        <div class="space-y-4">
          <!-- Entity Name -->
          <div class="space-y-2">
            <Label class="text-right">اسم الجهة</Label>
            <Input
              v-model="formData.name"
              dir="rtl"
              placeholder="مديرية بلدية بابل"
              class="border-border"
            />
          </div>

          <!-- Reference Entity -->
          <div class="space-y-2">
            <Label class="text-right">المرجعية</Label>
            <Input
              v-model="formData.referenceEntity"
              dir="rtl"
              placeholder="دائرة حماية وتحسين البيئة في منطقة الوسط"
              class="border-border"
            />
          </div>

          <!-- Location -->
          <div class="space-y-2">
            <Label class="text-right">العنوان</Label>
            <Input
              v-model="formData.location"
              dir="rtl"
              placeholder="الحلة شارع 0000"
              class="border-border"
            />
          </div>
        </div>

        <div class="mt-6 flex flex-row-reverse gap-2">
          <Button type="submit" class="w-2/4">
            <Icon icon="lucide:check" class="ml-2 h-4 w-4" />
            {{ isEditing ? 'حفظ التعديلات' : 'إضافة' }}
          </Button>
          <Button
            type="button"
            variant="outline"
            class="w-1/4"
            @click="$emit('update:open', false)"
          >
            <Icon icon="lucide:x" class="ml-2 h-4 w-4" />
            الغاء
          </Button>
        </div>
      </form>
    </DialogContent>
  </Dialog>
</template>

<script setup>
  import { Icon } from '@iconify/vue';

  const props = defineProps({
    open: {
      type: Boolean,
      required: true,
    },
    editData: {
      type: Object,
      default: null,
    },
  });

  const emit = defineEmits(['update:open', 'save']);

  const formData = ref({
    name: '',
    referenceEntity: '',
    location: '',
  });

  const isEditing = computed(() => !!props.editData);

  // Watch for editData changes to populate form
  watch(
    () => props.editData,
    (newData) => {
      if (newData) {
        formData.value = {
          name: newData.name || '',
          referenceEntity: newData.referenceEntity || '',
          location: newData.location || '',
        };
      } else {
        formData.value = {
          name: '',
          referenceEntity: '',
          location: '',
        };
      }
    },
    { immediate: true }
  );

  const save = () => {
    const dataToSave = {
      ...formData.value,
      id: props.editData?.id,
    };

    emit('save', dataToSave);
    emit('update:open', false);
    formData.value = {
      name: '',
      referenceEntity: '',
      location: '',
    };
  };
</script>
