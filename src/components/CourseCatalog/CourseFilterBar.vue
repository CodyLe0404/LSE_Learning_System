<template>
  <div class="space-y-4">
    <!-- Primary Category & View Tabs Bar -->
    <div class="bg-surface-0 dark:bg-surface-800 p-2 rounded-2xl border border-surface-200/80 dark:border-surface-700/80 shadow-sm flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
      <!-- Tabs Group -->
      <div class="flex items-center gap-1.5 overflow-x-auto no-scrollbar p-1 bg-surface-100/80 dark:bg-surface-900/80 rounded-xl">
        <button
          v-for="tab in tabs"
          :key="tab.id"
          @click="selectTab(tab.id)"
          class="flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-bold transition-all whitespace-nowrap border-none cursor-pointer"
          :class="activeTab === tab.id
            ? 'bg-surface-0 dark:bg-surface-800 text-primary-600 dark:text-primary-400 shadow-sm'
            : 'text-surface-600 dark:text-surface-400 hover:text-surface-900 dark:hover:text-surface-100 bg-transparent'"
        >
          <i :class="tab.icon" class="text-xs"></i>
          <span>{{ tab.label }}</span>
          <span
            class="px-1.5 py-0.5 rounded-full text-[10px] font-extrabold"
            :class="activeTab === tab.id
              ? 'bg-primary-100 dark:bg-primary-950 text-primary-700 dark:text-primary-300'
              : 'bg-surface-200 dark:bg-surface-800 text-surface-500'"
          >
            {{ tab.count }}
          </span>
        </button>
      </div>

      <!-- Right Action Controls: View Switcher (Grid/List) & Result Count -->
      <div class="flex items-center justify-between md:justify-end gap-3 px-2">
        <div class="text-xs font-semibold text-surface-500 dark:text-surface-400">
          Showing <span class="text-surface-900 dark:text-surface-0 font-bold">{{ totalResults }}</span> courses
        </div>

        <!-- Grid / List View Toggle -->
        <div class="flex items-center bg-surface-100 dark:bg-surface-900 p-0.5 rounded-lg border border-surface-200/60 dark:border-surface-700/60">
          <button
            @click="$emit('update:viewMode', 'grid')"
            class="p-1.5 rounded-md border-none cursor-pointer transition-all flex items-center justify-center"
            :class="viewMode === 'grid'
              ? 'bg-surface-0 dark:bg-surface-800 text-primary-500 shadow-sm'
              : 'text-surface-400 hover:text-surface-700 dark:hover:text-surface-200 bg-transparent'"
            title="Grid View"
          >
            <i class="pi pi-th-large text-xs"></i>
          </button>
          <button
            @click="$emit('update:viewMode', 'list')"
            class="p-1.5 rounded-md border-none cursor-pointer transition-all flex items-center justify-center"
            :class="viewMode === 'list'
              ? 'bg-surface-0 dark:bg-surface-800 text-primary-500 shadow-sm'
              : 'text-surface-400 hover:text-surface-700 dark:hover:text-surface-200 bg-transparent'"
            title="List View"
          >
            <i class="pi pi-bars text-xs"></i>
          </button>
        </div>
      </div>
    </div>

    <!-- Department Hierarchical Filter Strip (When "By Department" is active) -->
    <div
      v-if="activeTab === 'department'"
      class="bg-gradient-to-r from-primary-500/5 via-indigo-500/5 to-transparent p-4 rounded-2xl border border-primary-500/20 space-y-3 animate-fadeIn"
    >
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-2">
          <i class="pi pi-sitemap text-primary-500 text-sm"></i>
          <h3 class="text-xs font-bold text-surface-900 dark:text-surface-0 uppercase tracking-wider m-0">
            Select Department / Technical Discipline:
          </h3>
        </div>
        <button
          v-if="selectedCategoryId"
          @click="selectCategory(null)"
          class="text-xs text-primary-500 hover:text-primary-600 font-semibold bg-transparent border-none cursor-pointer"
        >
          View All Departments
        </button>
      </div>

      <!-- Department Parent-Child Tree Navigator -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        <div
          v-for="parent in departmentTrees"
          :key="parent.CategoryId"
          class="bg-surface-0 dark:bg-surface-800 p-3 rounded-xl border border-surface-200/80 dark:border-surface-700/80 hover:border-primary-400 dark:hover:border-primary-600 transition-all cursor-pointer shadow-xs"
          :class="{ 'ring-2 ring-primary-500 border-transparent': selectedCategoryId === parent.CategoryId }"
          @click="selectCategory(parent.CategoryId)"
        >
          <div class="flex items-center justify-between mb-2">
            <span class="text-xs font-bold text-surface-900 dark:text-surface-0 flex items-center gap-1.5">
              <i class="pi pi-folder text-primary-500 text-xs"></i>
              {{ parent.CategoryName }}
            </span>
            <span class="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-surface-100 dark:bg-surface-700 text-surface-600 dark:text-surface-300">
              {{ parent.totalCourses }} courses
            </span>
          </div>

          <!-- Child Categories Pills -->
          <div class="flex flex-wrap gap-1.5 pt-1">
            <button
              v-for="child in parent.children"
              :key="child.CategoryId"
              @click.stop="selectCategory(child.CategoryId)"
              class="px-2 py-1 rounded-md text-[11px] font-medium transition-all border cursor-pointer"
              :class="selectedCategoryId === child.CategoryId
                ? 'bg-primary-500 text-white border-primary-500 font-bold shadow-xs'
                : 'bg-surface-50 dark:bg-surface-900 text-surface-600 dark:text-surface-400 border-surface-200 dark:border-surface-700 hover:border-primary-400'"
            >
              {{ child.CategoryName }} ({{ child.courseCount }})
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Secondary Filter Toolbar (Level, Type, Status, Sort, Quick Reset) -->
    <div class="bg-surface-0 dark:bg-surface-800 p-3 rounded-2xl border border-surface-200/80 dark:border-surface-700/80 shadow-xs flex flex-wrap items-center justify-between gap-3">
      <!-- Filter Selectors -->
      <div class="flex flex-wrap items-center gap-2.5">
        <!-- Level Filter -->
        <div class="flex items-center gap-1.5">
          <label class="text-[11px] font-bold text-surface-400 uppercase tracking-wider">Level:</label>
          <select
            v-model="filters.level"
            @change="emitFilterChange"
            class="px-2.5 py-1.5 text-xs bg-surface-50 dark:bg-surface-900 border border-surface-200 dark:border-surface-700 rounded-lg focus:outline-none focus:ring-1 focus:ring-primary-500 text-surface-800 dark:text-surface-100 cursor-pointer"
          >
            <option value="all">All Levels</option>
            <option value="Beginner">Beginner</option>
            <option value="Intermediate">Intermediate</option>
            <option value="Advanced">Advanced</option>
          </select>
        </div>

        <!-- Course Type Filter -->
        <div class="flex items-center gap-1.5">
          <label class="text-[11px] font-bold text-surface-400 uppercase tracking-wider">Type:</label>
          <select
            v-model="filters.courseType"
            @change="emitFilterChange"
            class="px-2.5 py-1.5 text-xs bg-surface-50 dark:bg-surface-900 border border-surface-200 dark:border-surface-700 rounded-lg focus:outline-none focus:ring-1 focus:ring-primary-500 text-surface-800 dark:text-surface-100 cursor-pointer"
          >
            <option value="all">All Formats</option>
            <option value="Online">Online Self-Paced</option>
            <option value="Offline">Offline / Classroom</option>
            <option value="Blended">Blended Learning</option>
          </select>
        </div>

        <!-- Status Filter -->
        <div class="flex items-center gap-1.5">
          <label class="text-[11px] font-bold text-surface-400 uppercase tracking-wider">Status:</label>
          <select
            v-model="filters.status"
            @change="emitFilterChange"
            class="px-2.5 py-1.5 text-xs bg-surface-50 dark:bg-surface-900 border border-surface-200 dark:border-surface-700 rounded-lg focus:outline-none focus:ring-1 focus:ring-primary-500 text-surface-800 dark:text-surface-100 cursor-pointer"
          >
            <option value="all">All Statuses</option>
            <option value="Published">Published</option>
            <option value="Draft">Drafts</option>
          </select>
        </div>
      </div>

      <!-- Sort Option Dropdown -->
      <div class="flex items-center gap-2">
        <label class="text-[11px] font-bold text-surface-400 uppercase tracking-wider flex items-center gap-1">
          <i class="pi pi-sort-alt text-[10px]"></i>
          Sort By:
        </label>
        <select
          v-model="filters.sort"
          @change="emitFilterChange"
          class="px-3 py-1.5 text-xs font-semibold bg-surface-50 dark:bg-surface-900 border border-surface-200 dark:border-surface-700 rounded-lg focus:outline-none focus:ring-1 focus:ring-primary-500 text-surface-800 dark:text-surface-100 cursor-pointer"
        >
          <option value="newest">Newest Releases</option>
          <option value="popular">Most Popular</option>
          <option value="duration_asc">Duration: Short to Long</option>
          <option value="duration_desc">Duration: Long to Short</option>
          <option value="level">Level (Beginner → Advanced)</option>
          <option value="title_asc">Title (A - Z)</option>
        </select>
      </div>
    </div>

    <!-- Active Filter Badges Bar (Shows when filters or search applied) -->
    <div
      v-if="hasActiveFilters"
      class="flex flex-wrap items-center gap-2 px-1 text-xs"
    >
      <span class="text-surface-400 font-semibold text-[11px] uppercase tracking-wider">Active Filters:</span>

      <!-- Search Tag -->
      <span
        v-if="searchQuery"
        class="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-primary-50 dark:bg-primary-950 text-primary-700 dark:text-primary-300 border border-primary-200 dark:border-primary-800"
      >
        <span>Search: "{{ searchQuery }}"</span>
        <i class="pi pi-times text-[9px] cursor-pointer hover:opacity-75" @click="$emit('clear-search')"></i>
      </span>

      <!-- Category Tag -->
      <span
        v-if="selectedCategoryName"
        class="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800"
      >
        <span>Category: {{ selectedCategoryName }}</span>
        <i class="pi pi-times text-[9px] cursor-pointer hover:opacity-75" @click="selectCategory(null)"></i>
      </span>

      <!-- Level Tag -->
      <span
        v-if="filters.level !== 'all'"
        class="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800"
      >
        <span>Level: {{ filters.level }}</span>
        <i class="pi pi-times text-[9px] cursor-pointer hover:opacity-75" @click="resetFilter('level')"></i>
      </span>

      <!-- Type Tag -->
      <span
        v-if="filters.courseType !== 'all'"
        class="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-50 dark:bg-amber-950 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800"
      >
        <span>Type: {{ filters.courseType }}</span>
        <i class="pi pi-times text-[9px] cursor-pointer hover:opacity-75" @click="resetFilter('courseType')"></i>
      </span>

      <!-- Status Tag -->
      <span
        v-if="filters.status !== 'all'"
        class="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-purple-50 dark:bg-purple-950 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800"
      >
        <span>Status: {{ filters.status }}</span>
        <i class="pi pi-times text-[9px] cursor-pointer hover:opacity-75" @click="resetFilter('status')"></i>
      </span>

      <!-- Clear All Button -->
      <button
        @click="resetAllFilters"
        class="text-xs font-bold text-red-500 hover:text-red-600 hover:underline bg-transparent border-none cursor-pointer ml-1"
      >
        Clear All
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { getCategoryTree, COURSE_CATEGORIES } from '../../services/courseCatalogService';

const props = defineProps({
  activeTab: {
    type: String,
    default: 'all'
  },
  selectedCategoryId: {
    type: [Number, String],
    default: null
  },
  searchQuery: {
    type: String,
    default: ''
  },
  viewMode: {
    type: String,
    default: 'grid'
  },
  totalResults: {
    type: Number,
    default: 0
  },
  tabCounts: {
    type: Object,
    default: () => ({ all: 14, department: 7, soft_skills: 2, onboarding: 3 })
  }
});

const emit = defineEmits([
  'update:activeTab',
  'update:selectedCategoryId',
  'update:viewMode',
  'filter-change',
  'clear-search',
  'reset-all'
]);

const filters = ref({
  level: 'all',
  courseType: 'all',
  status: 'all',
  sort: 'newest'
});

const departmentTrees = computed(() => {
  const tree = getCategoryTree();
  // Filter for Technical (1), Management (2), and Compliance (3) for department views
  return tree.filter(t => [1, 2, 3].includes(t.CategoryId));
});

const tabs = computed(() => [
  { id: 'all', label: 'All Courses', icon: 'pi pi-compass', count: props.tabCounts.all || 14 },
  { id: 'department', label: 'By Department', icon: 'pi pi-sitemap', count: props.tabCounts.department || 7 },
  { id: 'soft_skills', label: 'Soft Skills', icon: 'pi pi-comments', count: props.tabCounts.soft_skills || 2 },
  { id: 'onboarding', label: 'Common / Onboarding', icon: 'pi pi-shield', count: props.tabCounts.onboarding || 3 }
]);

const selectedCategoryName = computed(() => {
  if (!props.selectedCategoryId) return null;
  const cat = COURSE_CATEGORIES.find(c => c.CategoryId === Number(props.selectedCategoryId));
  return cat ? cat.CategoryName : null;
});

const hasActiveFilters = computed(() => {
  return !!props.searchQuery ||
    !!props.selectedCategoryId ||
    filters.value.level !== 'all' ||
    filters.value.courseType !== 'all' ||
    filters.value.status !== 'all';
});

function selectTab(tabId) {
  emit('update:activeTab', tabId);
  if (tabId !== 'department') {
    emit('update:selectedCategoryId', null);
  }
}

function selectCategory(catId) {
  emit('update:selectedCategoryId', catId);
}

function emitFilterChange() {
  emit('filter-change', { ...filters.value });
}

function resetFilter(key) {
  filters.value[key] = 'all';
  emitFilterChange();
}

function resetAllFilters() {
  filters.value = {
    level: 'all',
    courseType: 'all',
    status: 'all',
    sort: 'newest'
  };
  emit('reset-all');
}
</script>

<style scoped>
.no-scrollbar::-webkit-scrollbar {
  display: none;
}
.no-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(-4px); }
  to { opacity: 1; transform: translateY(0); }
}
.animate-fadeIn {
  animation: fadeIn 0.18s ease-out forwards;
}
</style>
