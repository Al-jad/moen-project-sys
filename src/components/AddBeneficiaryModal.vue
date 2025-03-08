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
              class="border-gray-200"
            />
          </div>

          <!-- Reference -->
          <div class="space-y-2">
            <Label class="text-right">المرجعية</Label>
            <Input
              v-model="formData.reference"
              dir="rtl"
              placeholder="دائرة حماية وتحسين البيئة في منطقة الوسط"
              class="border-gray-200"
            />
          </div>

          <!-- Address -->
          <div class="space-y-2">
            <Label class="text-right">العنوان</Label>
            <Input
              v-model="formData.address"
              dir="rtl"
              placeholder="الحلة شارع 0000"
              class="border-gray-200"
            />
          </div>
        </div>

        <div class="mt-6 flex flex-row-reverse gap-2">
          <Button type="submit" class="w-2/4">
            <Icon icon="lucide:check" class="ml-2 h-4 w-4" />
            {{ isEditing ? 'حفظ التعديلات' : 'حفظ' }}
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
    reference: '',
    address: '',
  });

  const isEditing = computed(() => !!props.editData);

  // Watch for editData changes to populate form
  watch(
    () => props.editData,
    (newData) => {
      if (newData) {
        formData.value = { ...newData };
      } else {
        formData.value = {
          name: '',
          reference: '',
          address: '',
        };
      }
    },
    { immediate: true }
  );

  const save = () => {
    emit('save', {
      ...formData.value,
      id: props.editData?.id,
    });
    emit('update:open', false);
    formData.value = {
      name: '',
      reference: '',
      address: '',
    };
  };
</script>
