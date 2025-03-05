<template>
  <a
    :href="url"
    target="_blank"
    class="group relative block overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm transition-all duration-300 hover:scale-[1.02] hover:shadow-lg dark:border-gray-700/50 dark:bg-gray-800/95 dark:shadow-gray-900/50"
  >
    <!-- Top accent bar with hover effect -->
    <div
      class="absolute inset-x-0 top-0 h-1 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
      :class="fileTypeColor.gradient"
    ></div>

    <div class="p-5">
      <!-- Icon Header -->
      <div class="mb-4 flex items-center justify-between">
        <div class="flex items-center gap-3">
          <div
            class="flex h-10 w-10 items-center justify-center rounded-lg transition-colors"
            :class="fileTypeColor.bg"
          >
            <Icon :icon="fileTypeIcon" class="h-5 w-5" :class="fileTypeColor.text" />
          </div>
          <div v-if="projectName" class="flex items-center gap-2">
            <Icon icon="lucide:folder" class="h-4 w-4 text-gray-400" />
            <span class="text-sm font-medium text-gray-600 dark:text-gray-300">{{
              projectName
            }}</span>
          </div>
        </div>
        <div
          class="flex h-8 w-8 items-center justify-center rounded-full bg-gray-50 transition-colors group-hover:bg-blue-50 dark:bg-gray-700/50 dark:group-hover:bg-blue-500/10"
        >
          <Icon
            icon="lucide:external-link"
            class="h-4 w-4 text-gray-400 transition-colors group-hover:text-blue-500 dark:text-gray-400 dark:group-hover:text-blue-400"
          />
        </div>
      </div>

      <!-- Content -->
      <div class="space-y-3">
        <h3 class="line-clamp-2 text-lg font-semibold leading-tight text-gray-900 dark:text-white">
          {{ title }}
        </h3>
        <p class="line-clamp-2 text-sm leading-relaxed text-gray-500 dark:text-gray-400">
          {{ description }}
        </p>
      </div>

      <!-- Footer -->
      <div class="mt-4 flex items-center justify-between border-t pt-4 dark:border-gray-700">
        <div class="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
          <Icon icon="lucide:calendar" class="h-4 w-4" />
          <span>{{ date }}</span>
        </div>
        <div class="flex items-center gap-1">
          <div class="rounded-md px-2 py-1 text-xs font-medium" :class="fileTypeColor.badge">
            {{ fileExtension.toUpperCase() }}
          </div>
        </div>
      </div>
    </div>
  </a>
</template>

<script setup>
  import { Icon } from '@iconify/vue';
  import { computed } from 'vue';

  const props = defineProps({
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      default: '',
    },
    date: {
      type: String,
      default: '',
    },
    url: {
      type: String,
      required: true,
    },
    projectName: {
      type: String,
      default: '',
    },
  });

  // Get file extension from URL
  const fileExtension = computed(() => {
    const extension = props.url.split('.').pop()?.toLowerCase() || '';
    return extension;
  });

  // File type configurations
  const fileTypes = {
    pdf: {
      icon: 'lucide:file-text',
      colors: {
        gradient: 'bg-gradient-to-r from-red-500 to-red-600',
        bg: 'bg-red-50 dark:bg-red-500/10',
        text: 'text-red-500 dark:text-red-400',
        badge: 'bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-400',
      },
    },
    doc: {
      icon: 'lucide:file-text',
      colors: {
        gradient: 'bg-gradient-to-r from-blue-500 to-blue-600',
        bg: 'bg-blue-50 dark:bg-blue-500/10',
        text: 'text-blue-500 dark:text-blue-400',
        badge: 'bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400',
      },
    },
    docx: {
      icon: 'lucide:file-text',
      colors: {
        gradient: 'bg-gradient-to-r from-blue-500 to-blue-600',
        bg: 'bg-blue-50 dark:bg-blue-500/10',
        text: 'text-blue-500 dark:text-blue-400',
        badge: 'bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400',
      },
    },
    xls: {
      icon: 'lucide:table',
      colors: {
        gradient: 'bg-gradient-to-r from-green-500 to-green-600',
        bg: 'bg-green-50 dark:bg-green-500/10',
        text: 'text-green-500 dark:text-green-400',
        badge: 'bg-green-50 text-green-600 dark:bg-green-500/10 dark:text-green-400',
      },
    },
    xlsx: {
      icon: 'lucide:table',
      colors: {
        gradient: 'bg-gradient-to-r from-green-500 to-green-600',
        bg: 'bg-green-50 dark:bg-green-500/10',
        text: 'text-green-500 dark:text-green-400',
        badge: 'bg-green-50 text-green-600 dark:bg-green-500/10 dark:text-green-400',
      },
    },
    jpg: {
      icon: 'lucide:image',
      colors: {
        gradient: 'bg-gradient-to-r from-purple-500 to-purple-600',
        bg: 'bg-purple-50 dark:bg-purple-500/10',
        text: 'text-purple-500 dark:text-purple-400',
        badge: 'bg-purple-50 text-purple-600 dark:bg-purple-500/10 dark:text-purple-400',
      },
    },
    jpeg: {
      icon: 'lucide:image',
      colors: {
        gradient: 'bg-gradient-to-r from-purple-500 to-purple-600',
        bg: 'bg-purple-50 dark:bg-purple-500/10',
        text: 'text-purple-500 dark:text-purple-400',
        badge: 'bg-purple-50 text-purple-600 dark:bg-purple-500/10 dark:text-purple-400',
      },
    },
    png: {
      icon: 'lucide:image',
      colors: {
        gradient: 'bg-gradient-to-r from-purple-500 to-purple-600',
        bg: 'bg-purple-50 dark:bg-purple-500/10',
        text: 'text-purple-500 dark:text-purple-400',
        badge: 'bg-purple-50 text-purple-600 dark:bg-purple-500/10 dark:text-purple-400',
      },
    },
    // Default file type
    default: {
      icon: 'lucide:file',
      colors: {
        gradient: 'bg-gradient-to-r from-gray-500 to-gray-600',
        bg: 'bg-gray-50 dark:bg-gray-500/10',
        text: 'text-gray-500 dark:text-gray-400',
        badge: 'bg-gray-50 text-gray-600 dark:bg-gray-500/10 dark:text-gray-400',
      },
    },
  };

  // Get file type icon and colors based on extension
  const fileTypeIcon = computed(() => {
    return fileTypes[fileExtension.value]?.icon || fileTypes.default.icon;
  });

  const fileTypeColor = computed(() => {
    return fileTypes[fileExtension.value]?.colors || fileTypes.default.colors;
  });
</script>
