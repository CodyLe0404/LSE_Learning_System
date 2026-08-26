<template>
  <Card class="border border-surface-200 dark:border-surface-700 shadow-sm bg-surface-0 dark:bg-surface-800">
    <template #title>
      <div class="flex justify-between items-center px-2 py-1">
        <div>
          <span class="text-sm font-bold text-surface-800 dark:text-surface-0 uppercase tracking-wider block">Course Status Metrics</span>
          <span class="text-xs text-surface-400 font-normal">Click a segment card below to filter the Course Matrix instantly</span>
        </div>
        <Button 
          v-if="statusFilter !== 'All'" 
          label="Clear Filter" 
          icon="pi pi-filter-slash" 
          text 
          severity="primary" 
          size="small" 
          class="text-xs"
          @click="$emit('filter-status', 'All')" 
        />
      </div>
    </template>
    <template #content>
      <div class="flex flex-col md:flex-row gap-6 items-center">
        
        <!-- Left: Clean visual metrics bar & details -->
        <div class="flex-1 w-full space-y-4">
          <!-- Color segment progress bar -->
          <div class="w-full h-4 bg-surface-100 dark:bg-surface-700 rounded-full flex overflow-hidden">
            <div 
              class="bg-amber-400 dark:bg-amber-500 transition-all duration-500" 
              :style="{ width: (statsRequired / courses.length) * 100 + '%' }"
              v-tooltip="'Required: ' + statsRequired"
            ></div>
            <div 
              class="bg-blue-550 dark:bg-blue-600 transition-all duration-500" 
              :style="{ width: (statsInProgress / courses.length) * 100 + '%' }"
              v-tooltip="'In Progress: ' + statsInProgress"
            ></div>
            <div 
              class="bg-green-500 dark:bg-green-600 transition-all duration-500" 
              :style="{ width: (statsCompleted / courses.length) * 100 + '%' }"
              v-tooltip="'Completed: ' + statsCompleted"
            ></div>
          </div>

          <!-- Metrics breakdown cards (clickable filter toggles) -->
          <div class="grid grid-cols-3 gap-3">
            <!-- Required -->
            <div 
              @click="$emit('filter-status', 'Required')"
              class="p-3 rounded-xl border text-center cursor-pointer transition-all duration-200 group select-none"
              :class="[
                statusFilter === 'Required' 
                  ? 'border-amber-500 bg-amber-500/5 dark:bg-amber-500/10 shadow-sm scale-[1.02]' 
                  : 'border-surface-200 dark:border-surface-700 hover:border-amber-300 dark:hover:border-amber-500 hover:bg-surface-50 dark:hover:bg-surface-800'
              ]"
            >
              <div class="text-xs font-semibold text-surface-500 dark:text-surface-400 group-hover:text-amber-500 dark:group-hover:text-amber-400 transition-colors">Required</div>
              <div class="text-2xl font-bold text-amber-500 mt-1">{{ statsRequired }}</div>
              <div class="text-[10px] text-surface-400 dark:text-surface-500 mt-0.5 font-medium">To Learn</div>
            </div>
            <!-- In Progress -->
            <div 
              @click="$emit('filter-status', 'in_progress')"
              class="p-3 rounded-xl border text-center cursor-pointer transition-all duration-200 group select-none"
              :class="[
                statusFilter === 'in_progress' 
                  ? 'border-blue-500 bg-blue-500/5 dark:bg-blue-500/10 shadow-sm scale-[1.02]' 
                  : 'border-surface-200 dark:border-surface-700 hover:border-blue-300 dark:hover:border-blue-500 hover:bg-surface-50 dark:hover:bg-surface-800'
              ]"
            >
              <div class="text-xs font-semibold text-surface-500 dark:text-surface-400 group-hover:text-blue-500 dark:group-hover:text-blue-400 transition-colors">In Progress</div>
              <div class="text-2xl font-bold text-blue-500 mt-1">{{ statsInProgress }}</div>
              <div class="text-[10px] text-surface-400 dark:text-surface-500 mt-0.5 font-medium">On-going</div>
            </div>
            <!-- Completed -->
            <div 
              @click="$emit('filter-status', 'completed')"
              class="p-3 rounded-xl border text-center cursor-pointer transition-all duration-200 group select-none"
              :class="[
                statusFilter === 'completed' 
                  ? 'border-green-500 bg-green-500/5 dark:bg-green-500/10 shadow-sm scale-[1.02]' 
                  : 'border-surface-200 dark:border-surface-700 hover:border-green-300 dark:hover:border-green-500 hover:bg-surface-50 dark:hover:bg-surface-800'
              ]"
            >
              <div class="text-xs font-semibold text-surface-500 dark:text-surface-400 group-hover:text-green-500 dark:group-hover:text-green-400 transition-colors">Completed</div>
              <div class="text-2xl font-bold text-green-500 mt-1">{{ statsCompleted }}</div>
              <div class="text-[10px] text-surface-400 dark:text-surface-500 mt-0.5 font-medium">Finished</div>
            </div>
          </div>
        </div>

        <!-- Right: Detailed legend ring or motivational tip -->
        <div class="w-full md:w-56 p-4 rounded-xl bg-surface-50 dark:bg-surface-800/40 border border-surface-200/60 dark:border-surface-700/60 text-center md:text-left space-y-2">
          <span class="text-xs font-bold text-surface-700 dark:text-surface-200"><i class="pi pi-sparkles text-amber-500 mr-1"></i> Quick Tips</span>
          <p class="text-[11px] text-surface-500 dark:text-surface-400 leading-relaxed">
            Completing your <strong>Compliance</strong> courses before the deadline prevents ID lockout. Click "Simulate Study" to advance your progress quickly.
          </p>
          <div class="text-[11px] font-semibold text-primary-500 hover:underline cursor-pointer flex items-center justify-center md:justify-start gap-1 pt-1" @click="$emit('toast-message', 'Keep studying to earn the Golden Badge!', 'info')">
            View Achievements <i class="pi pi-chevron-right text-[8px]"></i>
          </div>
        </div>
        
      </div>
    </template>
  </Card>
</template>

<script setup>
import { computed } from 'vue';
import { Card, Button } from 'primevue';

const props = defineProps({
  courses: {
    type: Array,
    required: true
  },
  statusFilter: {
    type: String,
    required: true
  }
});

defineEmits(['filter-status', 'toast-message']);

const statsRequired = computed(() => {
  return props.courses.filter(c => c.required && c.status !== 'completed').length;
});

const statsInProgress = computed(() => {
  return props.courses.filter(c => c.status === 'in_progress').length;
});

const statsCompleted = computed(() => {
  return props.courses.filter(c => c.status === 'completed').length;
});
</script>
