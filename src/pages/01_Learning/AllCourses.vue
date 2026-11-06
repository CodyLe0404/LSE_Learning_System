<route>
{
  meta: {
    title: "All Courses",
    icon: "pi pi-book"
  }
}
</route>

<template>
  <div class="space-y-6 pb-16">
    <!-- 1. Floating Toast Feedback Notification System -->
    <div class="fixed top-20 right-6 z-50 flex flex-col gap-2 pointer-events-none">
      <TransitionGroup name="toast">
        <div 
          v-for="toast in toasts" 
          :key="toast.id"
          class="pointer-events-auto p-4 rounded-xl shadow-2xl flex items-center gap-3 min-w-[300px] max-w-md border backdrop-blur-md transition-all duration-300"
          :class="{
            'bg-green-500/10 border-green-500/30 text-green-700 dark:text-green-300': toast.severity === 'success',
            'bg-blue-500/10 border-blue-500/30 text-blue-700 dark:text-blue-300': toast.severity === 'info',
            'bg-amber-500/10 border-amber-500/30 text-amber-700 dark:text-amber-300': toast.severity === 'warn',
            'bg-red-500/10 border-red-500/30 text-red-700 dark:text-red-300': toast.severity === 'error'
          }"
        >
          <div class="w-8 h-8 rounded-full flex items-center justify-center shrink-0 shadow-sm" :class="{
            'bg-green-500/20 text-green-600 dark:text-green-300': toast.severity === 'success',
            'bg-blue-500/20 text-blue-600 dark:text-blue-300': toast.severity === 'info',
            'bg-amber-500/20 text-amber-600 dark:text-amber-300': toast.severity === 'warn',
            'bg-red-500/20 text-red-600 dark:text-red-300': toast.severity === 'error'
          }">
            <i class="pi text-sm" :class="{
              'pi-check': toast.severity === 'success',
              'pi-info': toast.severity === 'info',
              'pi-exclamation-triangle': toast.severity === 'warn',
              'pi-times-circle': toast.severity === 'error'
            }"></i>
          </div>
          <div class="flex-1 min-w-0">
            <p class="text-xs font-bold leading-tight m-0">{{ toast.title || 'Notification' }}</p>
            <p class="text-[11px] opacity-90 mt-0.5 leading-snug m-0">{{ toast.message }}</p>
          </div>
          <button 
            @click="removeToast(toast.id)" 
            class="text-current opacity-60 hover:opacity-100 bg-transparent border-none cursor-pointer p-1 rounded-md"
          >
            <i class="pi pi-times text-xs"></i>
          </button>
        </div>
      </TransitionGroup>
    </div>

    <!-- 2. Hero Banner & Global Autocomplete Search Section -->
    <CourseHero
      :searchQuery="searchQuery"
      @search="handleSearchQuery"
      @select-course="handleSelectCourseFromHero"
      @select-category="handleSelectCategoryFromHero"
    />

    <!-- 3. Smart Tabbed & Categorized Views + Secondary Filter Toolbar -->
    <CourseFilterBar
      v-model:activeTab="activeTab"
      v-model:selectedCategoryId="selectedCategoryId"
      v-model:viewMode="viewMode"
      :searchQuery="searchQuery"
      :totalResults="queryResult.total"
      :tabCounts="tabCounts"
      @filter-change="handleFilterChange"
      @clear-search="handleSearchQuery('')"
      @reset-all="handleResetAll"
    />

    <!-- 4. Course Catalog Grid / List View -->
    <div v-if="queryResult.items.length > 0" class="space-y-6">
      <div
        :class="viewMode === 'grid'
          ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5'
          : 'space-y-4'"
      >
        <CourseCard
          v-for="course in queryResult.items"
          :key="course.CourseId"
          :course="course"
          :viewMode="viewMode"
          :isBookmarked="bookmarkedIds.includes(course.CourseId)"
          :isEnrolled="enrolledIds.includes(course.CourseId)"
          @select="openCourseDrawer(course.CourseId)"
          @quick-view="openCourseDrawer(course.CourseId)"
          @toggle-bookmark="handleToggleBookmark(course.CourseId)"
        />
      </div>

      <!-- Pagination Bar -->
      <div
        v-if="queryResult.totalPages > 1"
        class="bg-surface-0 dark:bg-surface-800 p-4 rounded-2xl border border-surface-200/80 dark:border-surface-700/80 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4"
      >
        <div class="text-xs text-surface-500">
          Showing <span class="font-bold text-surface-800 dark:text-surface-200">{{ ((currentPage - 1) * pageSize) + 1 }}</span>
          to <span class="font-bold text-surface-800 dark:text-surface-200">{{ Math.min(currentPage * pageSize, queryResult.total) }}</span>
          of <span class="font-bold text-surface-800 dark:text-surface-200">{{ queryResult.total }}</span> courses
        </div>

        <div class="flex items-center gap-1.5">
          <Button
            icon="pi pi-chevron-left"
            text
            size="small"
            :disabled="currentPage === 1"
            @click="changePage(currentPage - 1)"
            class="w-8 h-8 rounded-lg"
          />

          <button
            v-for="pageNum in queryResult.totalPages"
            :key="pageNum"
            @click="changePage(pageNum)"
            class="w-8 h-8 rounded-lg text-xs font-bold transition-all border-none cursor-pointer flex items-center justify-center"
            :class="currentPage === pageNum
              ? 'bg-primary-500 text-white shadow-sm'
              : 'bg-surface-100 dark:bg-surface-700 text-surface-600 dark:text-surface-300 hover:bg-surface-200 dark:hover:bg-surface-600'"
          >
            {{ pageNum }}
          </button>

          <Button
            icon="pi pi-chevron-right"
            text
            size="small"
            :disabled="currentPage === queryResult.totalPages"
            @click="changePage(currentPage + 1)"
            class="w-8 h-8 rounded-lg"
          />
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div
      v-else
      class="bg-surface-0 dark:bg-surface-800 rounded-3xl border border-surface-200/80 dark:border-surface-700/80 p-12 text-center max-w-xl mx-auto shadow-sm space-y-4"
    >
      <div class="w-16 h-16 rounded-2xl bg-primary-100 dark:bg-primary-950 text-primary-600 dark:text-primary-400 flex items-center justify-center text-2xl mx-auto shadow-inner">
        <i class="pi pi-search"></i>
      </div>
      <div class="space-y-1">
        <h3 class="text-base font-bold text-surface-900 dark:text-surface-0 m-0">No Matching Courses Found</h3>
        <p class="text-xs text-surface-500 dark:text-surface-400 m-0">
          We couldn't find any courses matching your current search query or filter criteria.
        </p>
      </div>
      <div class="pt-2">
        <Button
          label="Reset All Filters"
          icon="pi pi-refresh"
          severity="primary"
          size="small"
          class="rounded-xl text-xs font-bold"
          @click="handleResetAll"
        />
      </div>
    </div>

    <!-- 5. Interactive Course Detail Drill-Down Drawer / Modal -->
    <CourseDetailDrawer
      v-model:visible="drawerVisible"
      :courseDetails="selectedCourseDetails"
      :isBookmarked="selectedCourseDetails ? bookmarkedIds.includes(selectedCourseDetails.CourseId) : false"
      :isEnrolled="selectedCourseDetails ? enrolledIds.includes(selectedCourseDetails.CourseId) : false"
      @enroll="handleEnrollCourse"
      @toggle-bookmark="handleToggleBookmark"
      @toast="showToast($event.message, $event.title, $event.severity)"
    />
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, onUnmounted } from 'vue';
import { Button } from 'primevue';
import CourseHero from '../../components/CourseCatalog/CourseHero.vue';
import CourseFilterBar from '../../components/CourseCatalog/CourseFilterBar.vue';
import CourseCard from '../../components/CourseCatalog/CourseCard.vue';
import CourseDetailDrawer from '../../components/CourseCatalog/CourseDetailDrawer.vue';
import {
  getCatalogCourses,
  getCourseDetails,
  getEnrolledCourseIds,
  enrollCourse,
  getBookmarkedCourseIds,
  toggleBookmarkCourse,
  COURSES
} from '../../services/courseCatalogService';

// ============================================================================
// STATE MANAGEMENT
// ============================================================================

const searchQuery = ref('');
const activeTab = ref('all'); // 'all' | 'department' | 'soft_skills' | 'onboarding'
const selectedCategoryId = ref(null);
const viewMode = ref('grid'); // 'grid' | 'list'
const currentPage = ref(1);
const pageSize = ref(8);

// Secondary filter states
const secondaryFilters = ref({
  level: 'all',
  courseType: 'all',
  status: 'all',
  sort: 'newest'
});

// User interactions state (Persisted in localStorage)
const enrolledIds = ref([]);
const bookmarkedIds = ref([]);

// Detail Drawer Modal state
const drawerVisible = ref(false);
const selectedCourseDetails = ref(null);

// Custom Toasts Feedback state
const toasts = ref([]);

// ============================================================================
// COMPUTED / DATA QUERY
// ============================================================================

const queryResult = computed(() => {
  return getCatalogCourses({
    search: searchQuery.value,
    tab: activeTab.value,
    categoryId: selectedCategoryId.value,
    level: secondaryFilters.value.level,
    courseType: secondaryFilters.value.courseType,
    status: secondaryFilters.value.status,
    sort: secondaryFilters.value.sort,
    page: currentPage.value,
    pageSize: pageSize.value
  });
});

const tabCounts = computed(() => {
  return {
    all: COURSES.length,
    department: COURSES.filter(c => [101, 102, 103, 104, 105, 201, 202].includes(c.CategoryId)).length,
    soft_skills: COURSES.filter(c => [401, 403].includes(c.CategoryId)).length,
    onboarding: COURSES.filter(c => [501, 502, 503].includes(c.CategoryId)).length
  };
});

// Watch tab or filter changes to reset to page 1
watch([activeTab, selectedCategoryId, searchQuery, secondaryFilters], () => {
  currentPage.value = 1;
}, { deep: true });

// ============================================================================
// EVENT HANDLERS & ACTIONS
// ============================================================================

function handleSearchQuery(query) {
  searchQuery.value = query;
}

function handleFilterChange(newFilters) {
  secondaryFilters.value = { ...newFilters };
}

function handleSelectCourseFromHero(course) {
  openCourseDrawer(course.CourseId);
}

function handleSelectCategoryFromHero(catId) {
  activeTab.value = 'department';
  selectedCategoryId.value = catId;
}

function handleResetAll() {
  searchQuery.value = '';
  activeTab.value = 'all';
  selectedCategoryId.value = null;
  secondaryFilters.value = {
    level: 'all',
    courseType: 'all',
    status: 'all',
    sort: 'newest'
  };
  currentPage.value = 1;
  showToast('Filters reset to default view.', 'Filters Cleared', 'info');
}

function changePage(page) {
  currentPage.value = page;
  window.scrollTo({ top: 400, behavior: 'smooth' });
}

function openCourseDrawer(courseId) {
  const details = getCourseDetails(courseId);
  if (details) {
    selectedCourseDetails.value = details;
    drawerVisible.value = true;
  }
}

function handleEnrollCourse(course) {
  if (!course) return;
  enrollCourse(course.CourseId);
  enrolledIds.value = getEnrolledCourseIds();
  showToast(
    `Successfully enrolled in "${course.CourseName}". This has been added to your Active Learning Plan.`,
    'Enrollment Confirmed!',
    'success'
  );
}

function handleToggleBookmark(courseId) {
  toggleBookmarkCourse(courseId);
  bookmarkedIds.value = getBookmarkedCourseIds();
  const isNowBookmarked = bookmarkedIds.value.includes(courseId);
  showToast(
    isNowBookmarked ? 'Course saved to your bookmarks.' : 'Course removed from bookmarks.',
    'Bookmarks Updated',
    'info'
  );
}

// ============================================================================
// TOAST FEEDBACK NOTIFICATIONS
// ============================================================================

function showToast(message, title = 'Notification', severity = 'success') {
  const id = Date.now() + Math.random();
  toasts.value.push({ id, message, title, severity });
  setTimeout(() => {
    removeToast(id);
  }, 4000);
}

function removeToast(id) {
  toasts.value = toasts.value.filter(t => t.id !== id);
}

// ============================================================================
// GLOBAL SEARCH EVENT LISTENER (FROM DEFAULT LAYOUT TOPBAR)
// ============================================================================

function handleGlobalSearchEvent(e) {
  if (typeof e.detail === 'string') {
    searchQuery.value = e.detail;
  }
}

// ============================================================================
// LIFECYCLE
// ============================================================================

onMounted(() => {
  enrolledIds.value = getEnrolledCourseIds();
  bookmarkedIds.value = getBookmarkedCourseIds();
  window.addEventListener('global-search', handleGlobalSearchEvent);
});

onUnmounted(() => {
  window.removeEventListener('global-search', handleGlobalSearchEvent);
});
</script>

<style scoped>
.toast-enter-active,
.toast-leave-active {
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}

.toast-enter-from {
  opacity: 0;
  transform: translateX(30px) scale(0.95);
}

.toast-leave-to {
  opacity: 0;
  transform: translateX(40px) scale(0.9);
}
</style>
