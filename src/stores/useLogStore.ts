import { fetchLogs as fetchLogsService, processLogForDisplay } from '@/services/logService';
import type { Log, LogTableItem } from '@/types/logs';
import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useLogStore = defineStore('log', () => {
  const logs = ref<LogTableItem[]>([]);
  const selectedLog = ref<Log | null>(null);
  const isLoading = ref(false);

  const fetchLogs = async () => {
    try {
      isLoading.value = true;
      logs.value = await fetchLogsService();
    } catch (error) {
      console.error('Error fetching logs:', error);
      throw error;
    } finally {
      isLoading.value = false;
    }
  };

  const setSelectedLog = (log: Log) => {
    selectedLog.value = processLogForDisplay(log);
  };

  return {
    logs,
    selectedLog,
    isLoading,
    fetchLogs,
    setSelectedLog,
  };
});
