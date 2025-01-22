<template>
  <div class="relative mt-6">
    <div class="absolute top-0 bottom-0 w-px right-6 bg-border dark:bg-gray-700"></div>
    <div class="space-y-6">
      <div v-for="(event, index) in events" 
           :key="event.id" 
           class="relative"
      >
        <div class="absolute -translate-y-1/2 right-4 top-12">
          <div class="relative flex items-center justify-center w-4">
            <div class="absolute w-4 h-4 rounded-full bg-background dark:bg-gray-800 border-[1.5px] border-muted-foreground dark:border-gray-600"></div>
            <div v-if="index === 0" class="absolute w-2 h-2 rounded-full bg-primary"></div>
          </div>
        </div>
        <Card class="mr-12 border-border/50 dark:bg-gray-800 dark:border-gray-700">
          <CardHeader class="pb-3">
            <div class="flex flex-col space-y-1.5">
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-2">
                  <CalendarDays class="w-4 h-4 text-muted-foreground dark:text-gray-400" />
                  <span class="text-sm font-medium dark:text-gray-200">{{ event.date }}</span>
                </div>
                <Badge variant="outline" class="h-6 text-gray-500 bg-gray-100 dark:text-gray-400 dark:bg-gray-700 dark:border-gray-600">
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
import { CalendarDays } from 'lucide-vue-next';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

defineProps({
  events: {
    type: Array,
    required: true,
    default: () => []
  }
});
</script> 