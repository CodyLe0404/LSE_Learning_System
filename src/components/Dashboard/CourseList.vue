<template>
  <div class="space-y-4">
    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
      <!-- Custom Styled Premium Tabs -->
      <div class="bg-surface-100 dark:bg-surface-800 p-1 rounded-xl flex gap-1 border border-surface-200/50 dark:border-surface-700/50">
        <button 
          class="px-4 py-2 text-xs font-bold rounded-lg transition-all border-none bg-transparent cursor-pointer"
          :class="activeTab === 'assigned' ? 'bg-surface-0 dark:bg-surface-700 text-primary-500 shadow-sm' : 'text-surface-500 dark:text-surface-400 hover:text-surface-900 dark:hover:text-surface-100'"
          @click="activeTab = 'assigned'"
        >
          Assigned / Mandatory ({{ assignedCount }})
        </button>
        <button 
          class="px-4 py-2 text-xs font-bold rounded-lg transition-all border-none bg-transparent cursor-pointer"
          :class="activeTab === 'elective' ? 'bg-surface-0 dark:bg-surface-700 text-primary-500 shadow-sm' : 'text-surface-500 dark:text-surface-400 hover:text-surface-900 dark:hover:text-surface-100'"
          @click="activeTab = 'elective'"
        >
          Self-Study / Elective ({{ electiveCount }})
        </button>
      </div>

      <!-- Filters & Search display badges -->
      <div class="flex flex-wrap items-center gap-2 w-full sm:w-auto">
        <!-- Category Filter Selector -->
        <select 
          v-model="categoryFilter" 
          class="px-3 py-2 text-xs bg-surface-0 dark:bg-surface-800 border border-surface-200 dark:border-surface-700 rounded-xl focus:outline-none text-surface-800 dark:text-surface-100 cursor-pointer"
        >
          <option value="All">All Categories</option>
          <option value="Compliance">Compliance</option>
          <option value="Development">Development</option>
          <option value="Design">Design</option>
          <option value="Management">Management</option>
          <option value="Soft Skills">Soft Skills</option>
        </select>
        
        <!-- Search query display badge -->
        <span v-if="searchQuery" class="px-2.5 py-1.5 text-xs bg-primary-500/10 text-primary-500 rounded-xl border border-primary-500/20 flex items-center gap-1.5">
          <span>"{{ searchQuery }}"</span>
          <i class="pi pi-times text-[9px] cursor-pointer hover:scale-120" @click="$emit('reset-filters')"></i>
        </span>
      </div>
    </div>

    <!-- Courses Grid -->
    <div v-if="paginatedCourses.length > 0" class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div 
        v-for="course in paginatedCourses" 
        :key="course.id"
        class="bg-surface-0 dark:bg-surface-800 border border-surface-200 dark:border-surface-700 rounded-2xl shadow-sm hover:shadow-md hover:border-primary-300 dark:hover:border-primary-750 transition-all duration-300 overflow-hidden flex flex-col group"
      >
        <!-- Course Card Thumbnail -->
        <div class="h-28 relative overflow-hidden shrink-0" :class="course.thumbnail">
          <div class="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors"></div>
          <div class="absolute inset-0 bg-radial-gradient from-transparent to-black/30 pointer-events-none"></div>
          <div class="absolute top-3 left-3">
            <span class="px-2.5 py-1 text-[9px] font-extrabold uppercase tracking-wider rounded-full bg-white/95 text-surface-800 shadow-sm border border-white/20">
              {{ course.category }}
            </span>
          </div>
          
          <div class="absolute top-3 right-3 flex gap-1">
            <span v-if="course.required" class="px-2.5 py-1 text-[9px] font-extrabold uppercase tracking-wider rounded-full bg-red-500 text-white shadow-sm flex items-center gap-1">
              <i class="pi pi-lock text-[8px]"></i> Required
            </span>
          </div>
          <div class="absolute bottom-3 left-3 text-white text-3xl font-bold opacity-80 group-hover:scale-110 transition-transform origin-bottom-left">
            <i :class="course.thumbnailIcon"></i>
          </div>
        </div>

        <!-- Course Details -->
        <div class="p-4 flex-1 flex flex-col justify-between space-y-4 bg-surface-0 dark:bg-surface-800">
          <div class="space-y-1.5">
            <h4 class="font-bold text-sm text-surface-900 dark:text-surface-0 line-clamp-2 leading-snug group-hover:text-primary-500 transition-colors">
              {{ course.title }}
            </h4>
            <div class="text-[11px] text-surface-500 dark:text-surface-400 line-clamp-2 leading-normal">
              {{ course.description }}
            </div>
            <div class="flex items-center gap-1.5 text-xs text-surface-400 dark:text-surface-500 pt-1">
              <i class="pi pi-user text-[10px]"></i>
              <span class="truncate">{{ course.instructor }}</span>
            </div>
          </div>

          <!-- Progress Details -->
          <div class="space-y-2">
            <div v-if="course.status !== 'optional' && course.status !== 'required_not_started'" class="space-y-1">
              <div class="flex justify-between items-center text-[10px] font-semibold">
                <span class="text-surface-400">Progress</span>
                <span class="text-primary-500">{{ course.progress }}%</span>
              </div>
              <div class="w-full bg-surface-100 dark:bg-surface-700 h-1.5 rounded-full overflow-hidden">
                <div 
                  class="bg-gradient-to-r from-primary-500 to-indigo-500 h-full transition-all duration-300"
                  :style="{ width: course.progress + '%' }"
                ></div>
              </div>
            </div>
            
            <div v-else class="flex items-center gap-1.5 text-[11px] font-semibold">
              <span class="w-2 h-2 rounded-full" :class="course.status === 'optional' ? 'bg-surface-300 dark:bg-surface-600' : 'bg-amber-400'"></span>
              <span class="text-surface-400">{{ formatStatusText(course.status) }}</span>
            </div>
            
            <!-- Target Deadline -->
            <div v-if="course.required && course.status !== 'completed' && course.targetDate" class="text-[10px] text-red-400 flex items-center gap-1">
              <i class="pi pi-calendar-times"></i>
              <span>Due by: {{ course.targetDate }}</span>
            </div>
            <div v-else-if="course.status === 'completed'" class="text-[10px] text-green-500 flex items-center gap-1 font-semibold">
              <i class="pi pi-check-circle"></i>
              <span>Completed!</span>
            </div>
          </div>

          <!-- Actions -->
          <div class="pt-2 border-t border-surface-100 dark:border-surface-700/50 flex justify-between items-center gap-2">
            <span class="text-[10px] text-surface-400 dark:text-surface-500 font-medium">
              <i class="pi pi-clock mr-1 text-[8px]"></i>{{ course.duration }}
            </span>
            
            <!-- Button triggers based on status -->
            <Button 
              v-if="course.status === 'optional'"
              label="Enroll" 
              icon="pi pi-plus" 
              size="small" 
              class="text-xs" 
              outlined
              @click="$emit('enroll', course)"
            />
            <Button 
              v-else-if="course.status === 'required_not_started'"
              label="Start" 
              icon="pi pi-play" 
              size="small" 
              class="text-xs"
              @click="$emit('study', course)"
            />
            <Button 
              v-else-if="course.status === 'in_progress'"
              label="Continue" 
              icon="pi pi-angle-double-right" 
              size="small" 
              severity="primary"
              class="text-xs"
              @click="$emit('study', course)"
            />
            <Button 
              v-else-if="course.status === 'completed'"
              label="Review" 
              icon="pi pi-undo" 
              size="small" 
              severity="success" 
              outlined
              class="text-xs"
              @click="$emit('study', course)"
            />
          </div>
        </div>
      </div>
    </div>
    
    <!-- Empty State -->
    <div v-else class="py-12 border border-dashed border-surface-200 dark:border-surface-700 rounded-2xl text-center space-y-3 bg-surface-0 dark:bg-surface-800/20">
      <div class="w-12 h-12 rounded-full bg-surface-100 dark:bg-surface-800 flex items-center justify-center mx-auto text-surface-400">
        <i class="pi pi-search"></i>
      </div>
      <div class="space-y-1">
        <h5 class="font-bold text-sm text-surface-800 dark:text-surface-200">No courses match filters</h5>
        <p class="text-xs text-surface-400 max-w-xs mx-auto">
          Try adjusting your search keywords, category filters, or selected status metric card.
        </p>
      </div>
      <Button label="Reset Filters" icon="pi pi-filter-slash" text size="small" @click="$emit('reset-filters')" />
    </div>

    <!-- Pagination Controls -->
    <div v-if="totalPages > 1" class="flex justify-center items-center gap-2 pt-4">
      <Button 
        icon="pi pi-chevron-left" 
        severity="secondary" 
        outlined 
        size="small" 
        class="text-xs"
        :disabled="currentPage === 1" 
        @click="currentPage--" 
      />
      <span class="text-xs font-semibold text-surface-600 dark:text-surface-400 select-none">
        Page {{ currentPage }} of {{ totalPages }} ({{ filteredCourses.length }} total)
      </span>
      <Button 
        icon="pi pi-chevron-right" 
        severity="secondary" 
        outlined 
        size="small" 
        class="text-xs"
        :disabled="currentPage === totalPages" 
        @click="currentPage++" 
      />
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue';
import { Button } from 'primevue';

const props = defineProps({
  courses: {
    type: Array,
    required: true
  },
  statusFilter: {
    type: String,
    required: true
  },
  searchQuery: {
    type: String,
    required: true
  }
});

defineEmits(['enroll', 'study', 'reset-filters']);

// Tabs selection state: 'assigned' vs 'elective'
const activeTab = ref('assigned');
const categoryFilter = ref('All');

// Pagination state
const currentPage = ref(1);
const itemsPerPage = 6;

const assignedCount = computed(() => {
  return props.courses.filter(c => c.required).length;
});

const electiveCount = computed(() => {
  return props.courses.filter(c => !c.required).length;
});

// Reset page index on filter updates
watch([() => props.statusFilter, () => props.searchQuery, categoryFilter, activeTab], () => {
  currentPage.value = 1;
});

const filteredCourses = computed(() => {
  return props.courses.filter(c => {
    // 1. Tab check
    const tabMatch = activeTab.value === 'assigned' ? c.required : !c.required;
    if (!tabMatch) return false;

    // 2. Category Filter
    if (categoryFilter.value !== 'All' && c.category !== categoryFilter.value) {
      return false;
    }

    // 3. Status Filter (triggered by KPI breakdown clicks)
    if (props.statusFilter !== 'All') {
      if (props.statusFilter === 'Required') {
        if (!c.required || c.status === 'completed') return false;
      } else if (c.status !== props.statusFilter) {
        return false;
      }
    }

    // 4. Search Filter
    if (props.searchQuery.trim() !== '') {
      const q = props.searchQuery.toLowerCase();
      const titleMatch = c.title.toLowerCase().includes(q);
      const descMatch = c.description.toLowerCase().includes(q);
      const instructorMatch = c.instructor.toLowerCase().includes(q);
      const catMatch = c.category.toLowerCase().includes(q);
      if (!titleMatch && !descMatch && !instructorMatch && !catMatch) return false;
    }

    return true;
  });
});

const paginatedCourses = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  return filteredCourses.value.slice(start, end);
});

const totalPages = computed(() => {
  return Math.ceil(filteredCourses.value.length / itemsPerPage) || 1;
});

function formatStatusText(status) {
  if (status === 'optional') return 'Not Enrolled';
  if (status === 'required_not_started') return 'Not Started';
  if (status === 'in_progress') return 'In Progress';
  if (status === 'completed') return 'Completed';
  return status;
}
</script>
