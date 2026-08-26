<template>
  <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
    <!-- 1. Overall Completion Progress Circular Card -->
    <Card class="border border-surface-200 dark:border-surface-700 shadow-sm relative overflow-hidden group bg-surface-0 dark:bg-surface-800">
      <template #content>
        <div class="flex items-center justify-between">
          <div class="space-y-1">
            <span class="text-xs font-semibold text-surface-400 dark:text-surface-500 uppercase tracking-wider block">Overall Progress</span>
            <h2 class="text-3xl font-bold text-surface-900 dark:text-surface-0 leading-none">{{ overallProgress }}%</h2>
            <p class="text-[11px] text-surface-500 dark:text-surface-400">Assigned Courses</p>
          </div>
          <!-- Circular Progress Ring -->
          <div class="relative w-16 h-16 flex items-center justify-center shrink-0">
            <svg class="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
              <circle cx="18" cy="18" r="15" fill="none" stroke="currentColor" class="text-surface-100 dark:text-surface-700" stroke-width="3" />
              <circle 
                cx="18" cy="18" r="15" fill="none" stroke="currentColor" 
                class="text-primary-500 transition-all duration-700 ease-out" 
                stroke-width="3" 
                stroke-linecap="round"
                :stroke-dasharray="2 * Math.PI * 15"
                :stroke-dashoffset="(2 * Math.PI * 15) * (1 - overallProgress / 100)"
              />
            </svg>
            <span class="absolute text-xs font-bold text-primary-500">{{ overallProgress }}%</span>
          </div>
        </div>
        <div class="absolute bottom-0 left-0 right-0 h-1 bg-primary-500 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></div>
      </template>
    </Card>

    <!-- 2. Study Hours Spent Card -->
    <Card class="border border-surface-200 dark:border-surface-700 shadow-sm relative overflow-hidden group bg-surface-0 dark:bg-surface-800">
      <template #content>
        <div class="flex items-center justify-between">
          <div class="space-y-1">
            <span class="text-xs font-semibold text-surface-400 dark:text-surface-500 uppercase tracking-wider block">Study Time</span>
            <h2 class="text-3xl font-bold text-surface-900 dark:text-surface-0 leading-none">{{ totalHours }} hrs</h2>
            <div class="flex items-center gap-1 text-[11px] text-green-500 font-semibold">
              <i class="pi pi-arrow-up text-[9px]"></i>
              <span>+{{ hoursAddedToday.toFixed(1) }}h added today</span>
            </div>
          </div>
          <div class="w-10 h-10 rounded-xl bg-blue-500/10 dark:bg-blue-500/20 text-blue-500 flex items-center justify-center text-lg shrink-0">
            <i class="pi pi-clock"></i>
          </div>
        </div>
        <div class="absolute bottom-0 left-0 right-0 h-1 bg-blue-500 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></div>
      </template>
    </Card>

    <!-- 3. Learning Streak Card -->
    <Card class="border border-surface-200 dark:border-surface-700 shadow-sm relative overflow-hidden group bg-surface-0 dark:bg-surface-800">
      <template #content>
        <div class="flex items-center justify-between">
          <div class="space-y-1">
            <span class="text-xs font-semibold text-surface-400 dark:text-surface-500 uppercase tracking-wider block">Learning Streak</span>
            <h2 class="text-3xl font-bold text-surface-900 dark:text-surface-0 leading-none">{{ streakDays }} Days</h2>
            <p class="text-[11px] text-orange-500 font-semibold animate-pulse flex items-center gap-1">
              <i class="pi pi-fire text-[10px]"></i> Active streak! Keep it up
            </p>
          </div>
          <div 
            class="w-10 h-10 rounded-xl bg-orange-500/10 dark:bg-orange-500/20 text-orange-500 flex items-center justify-center text-lg shrink-0 cursor-pointer hover:scale-115 transition-transform" 
            @click="$emit('increment-streak')"
            v-tooltip.bottom="'Extend Streak +100 XP'"
          >
            <i class="pi pi-fire"></i>
          </div>
        </div>
        <div class="absolute bottom-0 left-0 right-0 h-1 bg-orange-500 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></div>
      </template>
    </Card>

    <!-- 4. XP / Points Card -->
    <Card class="border border-surface-200 dark:border-surface-700 shadow-sm relative overflow-hidden group bg-surface-0 dark:bg-surface-800">
      <template #content>
        <div class="flex items-center justify-between">
          <div class="space-y-1">
            <span class="text-xs font-semibold text-surface-400 dark:text-surface-500 uppercase tracking-wider block">Points Earned</span>
            <h2 class="text-3xl font-bold text-surface-900 dark:text-surface-0 leading-none">{{ totalXP }} XP</h2>
            <div class="w-24 bg-surface-100 dark:bg-surface-700 h-1.5 rounded-full overflow-hidden mt-1.5">
              <div class="bg-indigo-500 h-full transition-all duration-500" :style="{ width: (totalXP % 1000) / 10 + '%' }"></div>
            </div>
            <p class="text-[10px] text-surface-400 dark:text-surface-500 mt-1">Level {{ Math.floor(totalXP / 1000) + 1 }} Learner</p>
          </div>
          <div class="w-10 h-10 rounded-xl bg-indigo-500/10 dark:bg-indigo-500/20 text-indigo-500 flex items-center justify-center text-lg shrink-0">
            <i class="pi pi-award"></i>
          </div>
        </div>
        <div class="absolute bottom-0 left-0 right-0 h-1 bg-indigo-500 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></div>
      </template>
    </Card>
  </div>
</template>

<script setup>
import { Card } from 'primevue';

defineProps({
  overallProgress: {
    type: Number,
    required: true
  },
  totalHours: {
    type: [Number, String],
    required: true
  },
  streakDays: {
    type: Number,
    required: true
  },
  totalXP: {
    type: Number,
    required: true
  },
  hoursAddedToday: {
    type: Number,
    default: 0
  }
});

defineEmits(['increment-streak']);
</script>
