<template>
  <div class="w-full overflow-hidden transition-shadow bg-white border border-dashed rounded-lg hover:shadow-md">
    <div class="relative mt-4 w-[80%] mx-auto rounded-xl aspect-[4/3]">
      <img 
        :src="imageUrl || defaultImage" 
        :alt="title"
        class="object-cover w-full h-full m-auto rounded-xl"
      />
      <div class="absolute inset-0 bg-black/5"></div>
    </div>
    <div class="p-3">
      <h3 class="text-sm text-center text-gray-600 line-clamp-2">{{ title }}</h3>
    </div>
  </div>
</template>

<script setup>
const defaultImage = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgdmlld0JveD0iMCAwIDQwMCAzMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI0MDAiIGhlaWdodD0iMzAwIiBmaWxsPSIjRjFGNUY5Ii8+CjxwYXRoIGQ9Ik0xMjAgODBIMjgwVjIyMEgxMjBWODBaIiBmaWxsPSJ3aGl0ZSIgc3Ryb2tlPSIjQ0JENUUxIiBzdHJva2Utd2lkdGg9IjIiLz4KPHBhdGggZD0iTTEzNSAxMDBIMjY1VjExNUgxMzVWMTAwWiIgZmlsbD0iI0NCRDVFMSIvPgo8cGF0aCBkPSJNMTM1IDEzMEgyNjVWMTQ1SDEzNVYxMzBaIiBmaWxsPSIjQ0JENUUxIi8+CjxwYXRoIGQ9Ik0xMzUgMTYwSDI2NVYxNzVIMTM1VjE2MFoiIGZpbGw9IiNDQkQ1RTEiLz4KPHBhdGggZD0iTTEzNSAxOTBIMjY1VjIwNUgxMzVWMTkwWiIgZmlsbD0iI0NCRDVFMSIvPgo8L3N2Zz4K";

defineProps({
  imageUrl: {
    type: String,
    default: ''
  },
  title: {
    type: String,
    required: true
  }
});
</script> 