import { useBeneficiaryStore } from '@/stores/beneficiary-store';
import type { Beneficiary } from '@/types';
import { computed, ref } from 'vue';

export function useBeneficiaries() {
  const beneficiaryStore = useBeneficiaryStore();
  const selectedBeneficiaries = ref<Record<string, boolean>>({ all: true });

  // Computed properties
  const beneficiaries = computed(() => beneficiaryStore.getAllBeneficiaries);
  const isLoading = computed(() => beneficiaryStore.isLoading);
  const error = computed(() => beneficiaryStore.getError);

  // Methods
  const fetchBeneficiaries = async (force = false) => {
    return await beneficiaryStore.fetchBeneficiaries(force);
  };

  const filterByBeneficiaries = <T extends { [key: string]: any }>(
    items: T[],
    selectedBeneficiariesState: Record<string, boolean>
  ): T[] => {
    if (selectedBeneficiariesState.all) {
      return items;
    }

    return items.filter((item) => {
      if (!item.beneficiaries?.length) return false;
      return item.beneficiaries.some(
        (beneficiary: any) => selectedBeneficiariesState[beneficiary.id]
      );
    });
  };

  const resetBeneficiarySelection = () => {
    selectedBeneficiaries.value = { all: true };
  };

  const addBeneficiary = async (beneficiaryData: Omit<Beneficiary, 'id'>) => {
    return await beneficiaryStore.addBeneficiary(beneficiaryData);
  };

  const updateBeneficiary = async (id: string, beneficiaryData: Partial<Beneficiary>) => {
    return await beneficiaryStore.updateBeneficiary(id, beneficiaryData);
  };

  const deleteBeneficiary = async (id: string) => {
    return await beneficiaryStore.deleteBeneficiary(id);
  };

  return {
    // State
    beneficiaries,
    selectedBeneficiaries,
    isLoading,
    error,
    // Methods
    fetchBeneficiaries,
    filterByBeneficiaries,
    resetBeneficiarySelection,
    addBeneficiary,
    updateBeneficiary,
    deleteBeneficiary,
  };
}
