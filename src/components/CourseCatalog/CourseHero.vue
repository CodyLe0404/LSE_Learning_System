<template>
  <div class="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary-950 via-surface-900 to-indigo-950 text-white p-6 sm:p-8 lg:p-10 shadow-2xl border border-primary-500/20">
    <!-- Background Ambient Glow & Decorative Grid -->
    <div class="absolute -top-24 -right-24 w-96 h-96 bg-primary-500/20 rounded-full blur-3xl pointer-events-none"></div>
    <div class="absolute -bottom-24 -left-24 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none"></div>
    <div class="absolute inset-0 bg-[linear-gradient(to_right,#ffffff0a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff0a_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none opacity-40"></div>

    <div class="relative z-10 space-y-6">
      <!-- Top Badges & System Tag -->
      <div class="flex flex-wrap items-center justify-between gap-3">
        <div class="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold bg-primary-500/20 text-primary-300 border border-primary-400/30 backdrop-blur-md">
          <i class="pi pi-sparkles text-amber-400 text-xs animate-pulse"></i>
          <span>LSE Enterprise Learning Management</span>
          <span class="w-1 h-1 rounded-full bg-primary-400"></span>
          <span>Catalog & Discovery 2026</span>
        </div>

        <div class="hidden sm:flex items-center gap-2 text-xs text-surface-300">
          <i class="pi pi-shield-check text-emerald-400"></i>
          <span>ISO 27001 & SCORM/xAPI Compliant</span>
        </div>
      </div>

      <!-- Main Headline & Subtitle -->
      <div class="max-w-3xl space-y-3">
        <h1 class="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-surface-100 to-primary-200">
          Explore Courses, Accelerate Your Professional Growth
        </h1>
        <p class="text-sm sm:text-base text-surface-300 max-w-2xl leading-relaxed">
          Discover mandatory compliance modules, cutting-edge software engineering curricula, leadership academies, and executive soft skills tailored for LSE teams.
        </p>
      </div>

      <!-- Global Autocomplete Search Bar -->
      <div class="relative max-w-2xl">
        <div class="relative flex items-center">
          <div class="absolute left-4 text-surface-400 pointer-events-none flex items-center">
            <i class="pi pi-search text-base text-primary-400"></i>
          </div>

          <input
            ref="searchInputRef"
            type="text"
            v-model="internalSearch"
            @input="onSearchInput"
            @focus="showSuggestions = true"
            @keydown.down.prevent="navigateSuggestions(1)"
            @keydown.up.prevent="navigateSuggestions(-1)"
            @keydown.enter.prevent="selectHighlightedSuggestion"
            @keydown.esc="closeSuggestions"
            placeholder="Search by Course Name, Course Code (e.g. ENG-CS-101), or Category..."
            class="w-full pl-12 pr-28 py-3.5 text-sm sm:text-base bg-surface-900/80 backdrop-blur-md border border-surface-700/80 rounded-2xl text-white placeholder-surface-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent shadow-inner transition-all"
          />

          <!-- Quick Clear & Hotkey Indicator -->
          <div class="absolute right-3 flex items-center gap-1.5">
            <button
              v-if="internalSearch"
              @click="clearSearch"
              class="p-1 rounded-lg hover:bg-surface-800 text-surface-400 hover:text-white transition-colors bg-transparent border-none cursor-pointer flex items-center"
              title="Clear search"
            >
              <i class="pi pi-times text-xs"></i>
            </button>
            <kbd class="hidden md:inline-flex items-center gap-0.5 px-2 py-1 text-[10px] font-semibold text-surface-400 bg-surface-800/80 border border-surface-700 rounded-md">
              <span class="text-[9px]">⌘</span>K
            </kbd>
          </div>
        </div>

        <!-- Autocomplete Suggestions Dropdown -->
        <div
          v-if="showSuggestions && (suggestions.courses.length > 0 || suggestions.codes.length > 0 || suggestions.categories.length > 0)"
          class="absolute left-0 right-0 mt-2 bg-surface-900/95 backdrop-blur-xl border border-surface-700 rounded-2xl shadow-2xl z-50 overflow-hidden divide-y divide-surface-800/80 text-surface-200 animate-fadeIn"
        >
          <!-- Matching Courses -->
          <div v-if="suggestions.courses.length > 0" class="p-3">
            <div class="text-[11px] font-bold uppercase tracking-wider text-primary-400 px-3 py-1 flex items-center gap-1.5">
              <i class="pi pi-book text-[10px]"></i>
              <span>Matching Courses ({{ suggestions.courses.length }})</span>
            </div>
            <ul class="list-none p-0 m-0 space-y-1">
              <li
                v-for="(course, idx) in suggestions.courses"
                :key="course.CourseId"
                @click="onSelectCourse(course)"
                class="flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-surface-800 cursor-pointer transition-colors group"
                :class="{ 'bg-surface-800': highlightedIndex === idx }"
              >
                <div class="w-10 h-10 rounded-lg bg-gradient-to-br from-primary-600 to-indigo-800 flex items-center justify-center shrink-0 border border-surface-700 overflow-hidden relative">
                  <i class="pi pi-book text-white/70 text-xs"></i>
                  <img
                    :src="course.thumbnailUrl"
                    :alt="course.CourseName"
                    @error="e => e.target.style.display = 'none'"
                    class="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform"
                  />
                </div>
                <div class="flex-1 min-w-0">
                  <div class="flex items-center gap-2">
                    <span class="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-primary-500/20 text-primary-300 border border-primary-500/30">
                      {{ course.CourseCode }}
                    </span>
                    <span class="text-xs font-semibold text-white truncate group-hover:text-primary-300">
                      {{ course.CourseName }}
                    </span>
                  </div>
                  <div class="flex items-center gap-2 text-[11px] text-surface-400 mt-0.5">
                    <span>{{ course.categoryName }}</span>
                    <span>•</span>
                    <span>{{ course.formattedDuration }}</span>
                    <span>•</span>
                    <span :class="getLevelBadgeColor(course.Level)">{{ course.Level }}</span>
                  </div>
                </div>
                <i class="pi pi-arrow-right text-xs text-surface-500 group-hover:text-primary-400 group-hover:translate-x-1 transition-all"></i>
              </li>
            </ul>
          </div>

          <!-- Matching Course Codes -->
          <div v-if="suggestions.codes.length > 0" class="p-3 bg-surface-950/40">
            <div class="text-[11px] font-bold uppercase tracking-wider text-indigo-400 px-3 py-1 flex items-center gap-1.5">
              <i class="pi pi-hashtag text-[10px]"></i>
              <span>By Course Code</span>
            </div>
            <div class="flex flex-wrap gap-2 px-3 py-1">
              <button
                v-for="codeItem in suggestions.codes"
                :key="codeItem.code"
                @click="onSelectCode(codeItem.code)"
                class="px-2.5 py-1 rounded-lg text-xs font-mono font-bold bg-surface-800 hover:bg-primary-600 text-surface-200 hover:text-white border border-surface-700 transition-all cursor-pointer"
              >
                {{ codeItem.code }}
              </button>
            </div>
          </div>

          <!-- Matching Categories -->
          <div v-if="suggestions.categories.length > 0" class="p-3">
            <div class="text-[11px] font-bold uppercase tracking-wider text-emerald-400 px-3 py-1 flex items-center gap-1.5">
              <i class="pi pi-folder text-[10px]"></i>
              <span>Categories</span>
            </div>
            <div class="flex flex-wrap gap-2 px-3 py-1">
              <button
                v-for="cat in suggestions.categories"
                :key="cat.id"
                @click="onSelectCategory(cat.id)"
                class="px-3 py-1 rounded-full text-xs font-medium bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 transition-all cursor-pointer flex items-center gap-1.5"
              >
                <i class="pi pi-tag text-[9px]"></i>
                {{ cat.name }}
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Quick Search Filter Chips -->
      <div class="flex flex-wrap items-center gap-2 pt-1 text-xs">
        <span class="text-surface-400 font-medium flex items-center gap-1.5">
          <i class="pi pi-compass text-primary-400 text-xs"></i>
          Popular Tracks:
        </span>
        <button
          v-for="chip in quickChips"
          :key="chip.label"
          @click="applyQuickChip(chip.query)"
          class="px-3 py-1 rounded-full text-xs font-medium bg-surface-800/80 hover:bg-primary-500/30 text-surface-200 hover:text-white border border-surface-700/80 hover:border-primary-400/50 transition-all cursor-pointer backdrop-blur-sm"
        >
          {{ chip.label }}
        </button>
      </div>

      <!-- Hero Summary KPI Stat Badges -->
      <div class="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-surface-800/80">
        <div class="p-3 bg-surface-900/60 backdrop-blur-sm rounded-xl border border-surface-800 flex items-center gap-3">
          <div class="w-10 h-10 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center shrink-0">
            <i class="pi pi-book text-lg"></i>
          </div>
          <div>
            <div class="text-xl font-black text-white">14</div>
            <div class="text-[11px] text-surface-400 font-medium">Curated Courses</div>
          </div>
        </div>

        <div class="p-3 bg-surface-900/60 backdrop-blur-sm rounded-xl border border-surface-800 flex items-center gap-3">
          <div class="w-10 h-10 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center shrink-0">
            <i class="pi pi-clock text-lg"></i>
          </div>
          <div>
            <div class="text-xl font-black text-white">52+ hrs</div>
            <div class="text-[11px] text-surface-400 font-medium">Learning Content</div>
          </div>
        </div>

        <div class="p-3 bg-surface-900/60 backdrop-blur-sm rounded-xl border border-surface-800 flex items-center gap-3">
          <div class="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
            <i class="pi pi-verified text-lg"></i>
          </div>
          <div>
            <div class="text-xl font-black text-white">100%</div>
            <div class="text-[11px] text-surface-400 font-medium">Compliance Target</div>
          </div>
        </div>

        <div class="p-3 bg-surface-900/60 backdrop-blur-sm rounded-xl border border-surface-800 flex items-center gap-3">
          <div class="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0">
            <i class="pi pi-users text-lg"></i>
          </div>
          <div>
            <div class="text-xl font-black text-white">5 Tracks</div>
            <div class="text-[11px] text-surface-400 font-medium">Dept Categories</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, onMounted, onUnmounted } from 'vue';
import { getAutocompleteSuggestions } from '../../services/courseCatalogService';

const props = defineProps({
  searchQuery: {
    type: String,
    default: ''
  }
});

const emit = defineEmits(['search', 'select-course', 'select-category']);

const internalSearch = ref(props.searchQuery);
const searchInputRef = ref(null);
const showSuggestions = ref(false);
const highlightedIndex = ref(-1);

const suggestions = ref({
  courses: [],
  codes: [],
  categories: []
});

const quickChips = [
  { label: 'C# 12 & .NET 9', query: 'C#' },
  { label: 'Vue 3 & Pinia', query: 'Vue 3' },
  { label: 'InfoSec Compliance', query: 'Information Security' },
  { label: 'Agile & Scrum', query: 'Agile' },
  { label: 'Corporate Culture', query: 'Culture' }
];

watch(() => props.searchQuery, (newVal) => {
  internalSearch.value = newVal;
});

function onSearchInput() {
  emit('search', internalSearch.value);
  if (internalSearch.value.trim().length >= 2) {
    suggestions.value = getAutocompleteSuggestions(internalSearch.value);
    showSuggestions.value = true;
  } else {
    suggestions.value = { courses: [], codes: [], categories: [] };
    showSuggestions.value = false;
  }
}

function clearSearch() {
  internalSearch.value = '';
  emit('search', '');
  suggestions.value = { courses: [], codes: [], categories: [] };
  showSuggestions.value = false;
}

function applyQuickChip(query) {
  internalSearch.value = query;
  emit('search', query);
  showSuggestions.value = false;
}

function onSelectCourse(course) {
  showSuggestions.value = false;
  emit('select-course', course);
}

function onSelectCode(code) {
  internalSearch.value = code;
  emit('search', code);
  showSuggestions.value = false;
}

function onSelectCategory(categoryId) {
  showSuggestions.value = false;
  emit('select-category', categoryId);
}

function closeSuggestions() {
  showSuggestions.value = false;
}

function navigateSuggestions(delta) {
  const count = suggestions.value.courses.length;
  if (count === 0) return;
  highlightedIndex.value = (highlightedIndex.value + delta + count) % count;
}

function selectHighlightedSuggestion() {
  if (highlightedIndex.value >= 0 && highlightedIndex.value < suggestions.value.courses.length) {
    onSelectCourse(suggestions.value.courses[highlightedIndex.value]);
  } else {
    emit('search', internalSearch.value);
    showSuggestions.value = false;
  }
}

function getLevelBadgeColor(level) {
  switch (level?.toLowerCase()) {
    case 'beginner': return 'text-emerald-400 font-semibold';
    case 'intermediate': return 'text-amber-400 font-semibold';
    case 'advanced': return 'text-purple-400 font-semibold';
    default: return 'text-surface-400 font-semibold';
  }
}

// Global Hotkey (Cmd/Ctrl + K)
function handleGlobalKeydown(e) {
  if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
    e.preventDefault();
    searchInputRef.value?.focus();
  }
  if (e.key === 'Escape') {
    showSuggestions.value = false;
  }
}

// Click outside handler
function handleClickOutside(e) {
  if (searchInputRef.value && !searchInputRef.value.contains(e.target)) {
    showSuggestions.value = false;
  }
}

onMounted(() => {
  window.addEventListener('keydown', handleGlobalKeydown);
  document.addEventListener('click', handleClickOutside);
});

onUnmounted(() => {
  window.removeEventListener('keydown', handleGlobalKeydown);
  document.removeEventListener('click', handleClickOutside);
});
</script>

<style scoped>
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(-6px); }
  to { opacity: 1; transform: translateY(0); }
}
.animate-fadeIn {
  animation: fadeIn 0.18s ease-out forwards;
}
</style>
