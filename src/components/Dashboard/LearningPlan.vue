<template>
  <Card class="border border-surface-200 dark:border-surface-700 shadow-sm bg-surface-0 dark:bg-surface-800">
    <template #title>
      <div class="flex items-center gap-2 px-2 py-1">
        <div class="w-2 h-5 bg-primary-500 rounded-sm"></div>
        <span class="text-sm font-bold text-surface-850 dark:text-surface-0 uppercase tracking-wider block">Learning Plan</span>
      </div>
    </template>
    <template #content>
      <div class="space-y-4">
        <!-- Weekly Goal Indicator -->
        <div class="p-3 bg-primary-500/5 dark:bg-primary-500/10 border border-primary-500/20 rounded-xl space-y-2">
          <div class="flex justify-between items-center text-xs">
            <span class="font-bold text-surface-800 dark:text-surface-200">Weekly Study Target</span>
            <span class="font-extrabold text-primary-500">{{ totalHours }} / 8.0 hrs</span>
          </div>
          <div class="w-full bg-surface-100 dark:bg-surface-700 h-2 rounded-full overflow-hidden">
            <div class="bg-gradient-to-r from-primary-500 to-indigo-500 h-full rounded-full transition-all duration-500" :style="{ width: (parseFloat(totalHours) > 8 ? 100 : (parseFloat(totalHours) / 8) * 100) + '%' }"></div>
          </div>
          <p class="text-[10px] text-surface-400 dark:text-surface-500">
            Earn 200 bonus XP upon reaching your weekly goal. Target resets in 4 days.
          </p>
        </div>

        <!-- Pathway Timeline Nodes -->
        <div class="relative pl-6 space-y-5 before:content-[''] before:absolute before:left-2 before:top-2 before:bottom-2 before:w-[2px] before:bg-surface-200 dark:before:bg-surface-700">
          <div 
            v-for="node in pathwayNodes" 
            :key="node.id"
            class="relative space-y-1"
          >
            <!-- Bullet color mapping -->
            <div 
              class="absolute -left-[22px] top-1 w-[10px] h-[10px] rounded-full border-2 border-surface-0 dark:border-surface-800 z-10"
              :class="[
                node.type === 'completed' ? 'bg-green-500' : '',
                node.type === 'upcoming' ? 'bg-amber-450' : '',
                node.type === 'compliance_deadline' ? 'bg-red-500 animate-pulse shadow-sm' : ''
              ]"
            ></div>
            
            <div class="flex items-center justify-between">
              <span 
                class="text-[11px] font-bold"
                :class="[
                  node.type === 'completed' ? 'text-green-500' : '',
                  node.type === 'upcoming' ? 'text-amber-500' : '',
                  node.type === 'compliance_deadline' ? 'text-red-500' : ''
                ]"
              >
                {{ formatNodeType(node.type) }}
              </span>
              <span 
                class="text-[9px] font-semibold"
                :class="node.type === 'compliance_deadline' ? 'text-red-400' : 'text-surface-400'"
              >
                {{ node.date }}
              </span>
            </div>
            <h5 class="text-xs font-bold text-surface-800 dark:text-surface-200">{{ node.title }}</h5>
            <p class="text-[10px] text-surface-400 dark:text-surface-500 leading-relaxed">{{ node.detail }}</p>
          </div>
        </div>
      </div>
    </template>
  </Card>
</template>

<script setup>
import { Card } from 'primevue';

defineProps({
  totalHours: {
    type: [Number, String],
    required: true
  },
  pathwayNodes: {
    type: Array,
    required: true
  }
});

function formatNodeType(type) {
  if (type === 'completed') return 'Completed Milestone';
  if (type === 'upcoming') return 'Upcoming Goal Target';
  if (type === 'compliance_deadline') return 'Hard Compliance Deadline';
  return 'Milestone';
}
</script>
