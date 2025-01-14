<template>
  <div class="min-h-[500px] w-full">
    <div class="flex items-center justify-between my-6">
      <div class="flex items-center gap-8">
        <div class="relative h-[400px] w-full">
          <Line :data="chartData" :options="chartOptions" style="width: 100%; height: 100%" />
        </div>
        <div class="flex flex-col items-start gap-12">       
          <div class="flex flex-col items-start">
          <span class="text-3xl font-bold">40.00k</span>
          <div class="flex items-center gap-2">
            <span class="text-sm text-green-500">+2.45%</span>
            <span class="text-sm text-gray-500">المنجز</span>
          </div>
        </div>

        <div class="flex flex-col items-start">
          <span class="text-3xl font-bold">37.5K</span>
          <div class="flex items-center gap-2">
            <span class="text-sm text-green-500">+2.45%</span>
            <span class="text-sm text-gray-500">قيد الانجاز</span>
          </div>
        </div>

        <div class="flex flex-col items-start">
          <span class="text-3xl font-bold">100</span>
          <div class="flex items-center gap-2">
            <span class="text-sm text-red-500">-2.45%</span>
            <span class="text-sm text-gray-500">متلكئ</span>
          </div>
        </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
  import { ref, computed, watch } from 'vue';
  import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
  } from 'chart.js';
  import { Line } from 'vue-chartjs';

  ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

  const props = defineProps({
    selectedYear: {
      type: String,
      required: true,
    },
  });

  const months = [
    'يناير',
    'فبراير',
    'مارس',
    'ابريل',
    'مايو',
    'يونيو',
    'يوليو',
    'اغسطس',
    'سبتمبر',
    'اكتوبر',
    'نوفمبر',
    'ديسمبر',
  ];

  const yearData = {
    '2024 - 2025': [
      {
        label: 'المنجز',
        data: [40000, 39000, 38000, 37000, 39500, 40000, 38500, 37000, 36000, 37500, 38000, 39000],
        borderColor: '#22c55e',
        backgroundColor: 'transparent',
        tension: 0.4,
        fill: false,
        borderWidth: 2,
      },
      {
        label: 'قيد الانجاز',
        data: [37500, 36800, 35500, 35000, 36500, 37000, 35500, 34000, 33500, 34500, 35000, 36000],
        borderColor: '#eab308',
        backgroundColor: 'transparent',
        tension: 0.4,
        fill: false,
        borderWidth: 2,
      },
      {
        label: 'متلكئ',
        data: [100, 95, 90, 85, 95, 100, 90, 85, 80, 85, 90, 95],
        borderColor: '#ef4444',
        backgroundColor: 'transparent',
        tension: 0.4,
        fill: false,
        borderWidth: 2,
      },
    ],
    '2023 - 2024': [
      {
        label: 'المنجز',
        data: [38000, 37000, 36000, 35000, 37500, 38000, 36500, 35000, 34000, 35500, 36000, 37000],
        borderColor: '#22c55e',
        backgroundColor: 'transparent',
        tension: 0.4,
        fill: false,
        borderWidth: 2,
      },
      {
        label: 'قيد الانجاز',
        data: [35500, 34800, 33500, 33000, 34500, 35000, 33500, 32000, 31500, 32500, 33000, 34000],
        borderColor: '#eab308',
        backgroundColor: 'transparent',
        tension: 0.4,
        fill: false,
        borderWidth: 2,
      },
      {
        label: 'متلكئ',
        data: [90, 85, 80, 75, 85, 90, 80, 75, 70, 75, 80, 85],
        borderColor: '#ef4444',
        backgroundColor: 'transparent',
        tension: 0.4,
        fill: false,
        borderWidth: 2,
      },
    ],
  };

  const chartData = computed(() => ({
    labels: months,
    datasets: yearData[props.selectedYear],
  }));

  const chartOptions = ref({
    responsive: true,
    maintainAspectRatio: false,
    layout: {
      padding: {
        left: 10,
        right: 10,
        top: 10,
        bottom: 10,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        border: {
          display: false,
        },
        grid: {
          color: '#e2e8f0',
          drawBorder: false,
        },
        ticks: {
          color: '#64748b',
          font: {
            size: 12,
            family: 'inherit',
          },
          padding: 8,
          callback: (value) => {
            if (value >= 1000) {
              return `${(value / 1000).toFixed(2)}k`;
            }
            return value;
          },
        },
      },
      x: {
        border: {
          display: false,
        },
        grid: {
          display: false,
        },
        ticks: {
          color: '#64748b',
          font: {
            size: 12,
            family: 'inherit',
          },
          padding: 8,
        },
      },
    },
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: 'white',
        titleColor: '#1e293b',
        bodyColor: '#1e293b',
        borderColor: '#e2e8f0',
        borderWidth: 1,
        padding: 12,
        rtl: true,
        titleAlign: 'right',
        bodyAlign: 'right',
        displayColors: false,
        callbacks: {
          label: (context) => {
            let value = context.raw;
            if (value >= 1000) {
              return `${(value / 1000).toFixed(2)}k`;
            }
            return value;
          },
        },
      },
    },
    interaction: {
      intersect: false,
      mode: 'index',
    },
  });
</script>

<style scoped>
  :deep(canvas) {
    width: 100% !important;
    height: 100% !important;
  }
</style>
