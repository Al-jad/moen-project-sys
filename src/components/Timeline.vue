<template>
  <div class="relative mt-6">
    <div class="absolute bottom-0 right-6 top-0 w-px bg-border dark:bg-gray-700"></div>
    <div class="space-y-6">
      <div v-for="(event, index) in events" :key="event.id" class="relative">
        <div class="absolute right-4 top-12 -translate-y-1/2">
          <div class="relative flex w-4 items-center justify-center">
            <div
              class="absolute h-4 w-4 rounded-full border-[1.5px] border-muted-foreground bg-background dark:border-gray-600 dark:bg-gray-800"
            ></div>
            <div v-if="index === 0" class="absolute h-2 w-2 rounded-full bg-primary"></div>
          </div>
        </div>
        <Card class="mr-12 border-border/50 dark:border-gray-700 dark:bg-gray-800">
          <CardHeader class="pb-3">
            <div class="flex flex-col space-y-1.5">
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-2">
                  <Icon
                    icon="lucide:calendar"
                    class="h-4 w-4 text-muted-foreground dark:text-gray-400"
                  />
                  <span class="text-sm font-medium dark:text-gray-200">{{ event.date }}</span>
                </div>
                <Badge
                  variant="outline"
                  class="h-6 bg-gray-100 text-gray-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-400"
                >
                  {{ event.time }}
                </Badge>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <p class="text-sm text-muted-foreground dark:text-gray-400">{{ event.description }}</p>
          </CardContent>
        </Card>
      </div>
    </div>
  </div>
</template>

<script setup>
  import { Badge } from '@/components/ui/badge';
  import { Card, CardContent, CardHeader } from '@/components/ui/card';
  import { Icon } from '@iconify/vue';
  defineProps({
    events: {
      type: Array,
      required: true,
      default: () => [],
    },
  });
</script>
