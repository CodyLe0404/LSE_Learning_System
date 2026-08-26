<template>
  <Card class="border border-surface-200 dark:border-surface-700 shadow-sm bg-surface-0 dark:bg-surface-800">
    <template #title>
      <div class="flex justify-between items-center px-2 py-1">
        <div class="flex items-center gap-2">
          <div class="w-2 h-5 bg-indigo-500 rounded-sm"></div>
          <span class="text-sm font-bold text-surface-850 dark:text-surface-0 uppercase tracking-wider block">Training Calendar</span>
        </div>
        <span class="text-[10px] bg-indigo-500/10 text-indigo-500 border border-indigo-500/20 px-2 py-0.5 rounded-full font-bold">Blended</span>
      </div>
    </template>
    <template #content>
      <div class="space-y-4">
        <!-- Event List -->
        <div class="flex flex-col gap-3">
          <div 
            v-for="event in events" 
            :key="event.id"
            class="p-3 border border-surface-200 dark:border-surface-700/60 rounded-xl hover:bg-surface-50 dark:hover:bg-surface-800/40 transition-all duration-200 flex gap-3 group relative overflow-hidden bg-surface-0 dark:bg-surface-800"
          >
            <!-- Left: Date Box -->
            <div class="w-12 h-14 bg-surface-100 dark:bg-surface-700 rounded-lg flex flex-col items-center justify-center border border-surface-200/50 dark:border-surface-700/50 shrink-0 text-center">
              <span class="text-[10px] font-bold text-surface-450 dark:text-surface-400 uppercase leading-none">{{ getEventMonth(event.date) }}</span>
              <span class="text-lg font-extrabold text-surface-800 dark:text-surface-100 leading-none mt-1">{{ getEventDay(event.date) }}</span>
            </div>

            <!-- Right: Event Info -->
            <div class="flex-1 min-w-0 space-y-1 bg-surface-0 dark:bg-surface-800">
              <div class="flex justify-between items-start gap-1">
                <h5 class="text-xs font-bold text-surface-850 dark:text-surface-200 truncate leading-snug group-hover:text-primary-500 transition-colors">
                  {{ event.title }}
                </h5>
              </div>
              
              <p class="text-[10px] text-surface-450 dark:text-surface-450 flex items-center gap-1 font-medium">
                <i class="pi pi-clock text-[9px]"></i> {{ event.time }}
              </p>
              <p class="text-[10px] text-surface-400 dark:text-surface-500 flex items-center gap-1 truncate">
                <i class="pi pi-map-marker text-[9px] text-primary-500"></i> {{ event.location }}
              </p>

              <!-- Instructor + RSVP Status footer -->
              <div class="pt-2 flex items-center justify-between gap-2 border-t border-dashed border-surface-150 dark:border-surface-700/50 mt-2">
                <span class="text-[9px] text-surface-400 truncate">Coach: {{ event.instructor }}</span>
                
                <!-- RSVP Status badges & action -->
                <div class="flex items-center gap-1.5">
                  <Tag 
                    v-if="event.status === 'Confirmed'" 
                    value="Confirmed" 
                    severity="success" 
                    class="text-[9px] px-2 py-0.5 rounded-full" 
                  />
                  <Tag 
                    v-else-if="event.status === 'Attended'" 
                    value="Attended" 
                    severity="secondary" 
                    class="text-[9px] px-2 py-0.5 rounded-full" 
                  />
                  <button 
                    v-else-if="event.status === 'Pending'"
                    class="px-2.5 py-1 text-[9px] font-bold bg-primary-500 text-white rounded-full hover:bg-primary-600 transition-colors border-none cursor-pointer flex items-center gap-0.5 shadow-sm"
                    @click="$emit('rsvp', event)"
                  >
                    <i class="pi pi-check text-[7px]"></i> RSVP
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </template>
  </Card>
</template>

<script setup>
import { Card, Tag } from 'primevue';

defineProps({
  events: {
    type: Array,
    required: true
  }
});

defineEmits(['rsvp']);

// Date parsing helpers
function getEventMonth(dateStr) {
  // Expected input: "Aug 27, 2026" -> return "Aug"
  return dateStr.split(' ')[0];
}

function getEventDay(dateStr) {
  // Expected input: "Aug 27, 2026" -> return "27"
  return dateStr.split(' ')[1].replace(',', '');
}
</script>
