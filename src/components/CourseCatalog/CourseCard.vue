<template>
  <!-- GRID VIEW CARD -->
  <div
    v-if="viewMode === 'grid'"
    class="group bg-surface-0 dark:bg-surface-800 rounded-2xl border border-surface-200/80 dark:border-surface-700/80 shadow-sm hover:shadow-xl hover:border-primary-400 dark:hover:border-primary-550 transition-all duration-300 flex flex-col overflow-hidden relative"
  >
    <!-- Card Thumbnail Container -->
    <div
      class="relative h-44 w-full overflow-hidden shrink-0 cursor-pointer"
      :class="getCategoryGradient(course.parentCategoryId || course.CategoryId)"
      @click="$emit('select', course)"
    >
      <!-- Background Thematic Large Watermark Icon -->
      <div class="absolute -right-3 -bottom-3 text-white/15 text-7xl font-bold select-none pointer-events-none group-hover:scale-110 group-hover:rotate-6 transition-transform duration-500">
        <i :class="getCategoryIcon(course.parentCategoryId || course.CategoryId)"></i>
      </div>

      <!-- Geometric Pattern Grid Overlay -->
      <div class="absolute inset-0 bg-[radial-gradient(#ffffff22_1px,transparent_1px)] bg-[size:14px_14px] pointer-events-none"></div>

      <!-- Course Image (Overlaid if successfully loaded) -->
      <img
        v-if="!imageLoadError && course.thumbnailUrl"
        :src="course.thumbnailUrl"
        :alt="course.CourseName"
        @error="imageLoadError = true"
        class="absolute inset-0 w-full h-full object-cover group-hover:scale-108 transition-transform duration-500 ease-out"
        loading="lazy"
      />

      <!-- Subtle Gradient Vignette Overlay -->
      <div class="absolute inset-0 bg-gradient-to-t from-surface-950/85 via-surface-950/25 to-surface-950/40 pointer-events-none"></div>

      <!-- Top Overlay Badges -->
      <div class="absolute top-3 inset-x-3 flex items-center justify-between gap-2 z-10 pointer-events-auto">
        <!-- Course Code Badge -->
        <span class="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-mono font-bold bg-surface-900/90 text-white backdrop-blur-md border border-white/20 shadow-sm">
          {{ course.CourseCode }}
        </span>

        <div class="flex items-center gap-1.5">
          <!-- Mandatory / Required Badge -->
          <span
            v-if="course.hasRequired"
            class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-red-500 text-white shadow-sm"
            title="Contains mandatory compliance or onboarding modules"
          >
            <i class="pi pi-lock text-[8px]"></i>
            Required
          </span>

          <!-- Bookmark Toggle -->
          <button
            @click.stop="$emit('toggle-bookmark', course.CourseId)"
            class="w-7 h-7 rounded-full bg-surface-900/70 hover:bg-surface-900 text-white flex items-center justify-center backdrop-blur-md border border-white/20 transition-transform active:scale-90 cursor-pointer"
            :title="isBookmarked ? 'Remove Bookmark' : 'Bookmark Course'"
          >
            <i
              class="pi text-xs"
              :class="isBookmarked ? 'pi-bookmark-fill text-amber-400' : 'pi-bookmark text-white/80'"
            ></i>
          </button>
        </div>
      </div>

      <!-- Bottom Overlay Badges -->
      <div class="absolute bottom-3 inset-x-3 flex items-center justify-between z-10 pointer-events-none">
        <!-- Category Pill -->
        <span class="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-surface-900/80 text-white backdrop-blur-md border border-white/20 shadow-xs">
          <i :class="getCategoryIcon(course.parentCategoryId || course.CategoryId)" class="text-[9px]"></i>
          {{ course.categoryName }}
        </span>

        <!-- Level Badge -->
        <span
          class="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold backdrop-blur-md border shadow-xs"
          :class="getLevelBadgeClasses(course.Level)"
        >
          {{ course.Level }}
        </span>
      </div>
    </div>

    <!-- Card Content Area -->
    <div class="p-4 flex-1 flex flex-col justify-between space-y-4">
      <div class="space-y-2">
        <!-- Title -->
        <h3
          @click="$emit('select', course)"
          class="text-sm font-bold text-surface-900 dark:text-surface-0 line-clamp-2 leading-snug group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors cursor-pointer m-0"
        >
          {{ course.CourseName }}
        </h3>

        <!-- Description -->
        <p class="text-xs text-surface-500 dark:text-surface-400 line-clamp-2 leading-relaxed m-0">
          {{ course.Description }}
        </p>
      </div>

      <!-- Metadata Attributes Bar -->
      <div class="space-y-3 pt-2 border-t border-surface-100 dark:border-surface-700/60">
        <div class="flex flex-wrap items-center justify-between text-xs text-surface-500 dark:text-surface-400 gap-2">
          <!-- Duration -->
          <div class="flex items-center gap-1.5" title="Total Duration">
            <i class="pi pi-clock text-primary-500 text-xs"></i>
            <span class="font-semibold text-surface-700 dark:text-surface-300">{{ course.formattedDuration }}</span>
          </div>

          <!-- Modules & Lessons Count -->
          <div class="flex items-center gap-1.5" title="Curriculum Breakdown">
            <i class="pi pi-list text-surface-400 text-xs"></i>
            <span>{{ course.sectionsCount }} modules • {{ course.lessonsCount }} lessons</span>
          </div>
        </div>

        <!-- Course Type & Version -->
        <div class="flex items-center justify-between text-[11px]">
          <span
            class="px-2 py-0.5 rounded-md font-semibold"
            :class="getCourseTypeClasses(course.CourseType)"
          >
            <i class="pi text-[9px] mr-1" :class="getCourseTypeIcon(course.CourseType)"></i>
            {{ course.CourseType }}
          </span>

          <span class="text-surface-400 font-mono text-[10px]">
            v{{ course.Version }}.0
          </span>
        </div>

        <!-- Instructor Info -->
        <div class="flex items-center gap-2 pt-1">
          <div class="w-6 h-6 rounded-full bg-primary-100 dark:bg-primary-950 text-primary-600 dark:text-primary-300 flex items-center justify-center font-bold text-[10px] shrink-0 border border-primary-200 dark:border-primary-800">
            {{ getInitials(course.instructorName) }}
          </div>
          <span class="text-xs text-surface-600 dark:text-surface-300 truncate font-medium">
            {{ course.instructorName || 'LSE Faculty' }}
          </span>
        </div>
      </div>

      <!-- Action Buttons Footer -->
      <div class="grid grid-cols-2 gap-2 pt-2 border-t border-surface-100 dark:border-surface-700/60">
        <Button
          label="Quick View"
          icon="pi pi-eye"
          outlined
          severity="secondary"
          class="w-full text-xs font-semibold py-2 rounded-xl"
          @click.stop="$emit('quick-view', course)"
        />
        <Button
          label="Curriculum"
          icon="pi pi-arrow-right"
          severity="primary"
          iconPos="right"
          class="w-full text-xs font-bold py-2 rounded-xl shadow-xs"
          @click.stop="$emit('select', course)"
        />
      </div>
    </div>
  </div>

  <!-- LIST VIEW CARD -->
  <div
    v-else
    class="group bg-surface-0 dark:bg-surface-800 rounded-2xl border border-surface-200/80 dark:border-surface-700/80 shadow-sm hover:shadow-xl hover:border-primary-400 dark:hover:border-primary-550 transition-all duration-300 flex flex-col md:flex-row overflow-hidden relative p-4 gap-4"
  >
    <!-- Left Thumbnail -->
    <div
      class="relative w-full md:w-56 h-36 md:h-auto rounded-xl overflow-hidden shrink-0 cursor-pointer"
      :class="getCategoryGradient(course.parentCategoryId || course.CategoryId)"
      @click="$emit('select', course)"
    >
      <div class="absolute -right-2 -bottom-2 text-white/15 text-6xl font-bold select-none pointer-events-none">
        <i :class="getCategoryIcon(course.parentCategoryId || course.CategoryId)"></i>
      </div>
      <div class="absolute inset-0 bg-[radial-gradient(#ffffff22_1px,transparent_1px)] bg-[size:12px_12px] pointer-events-none"></div>

      <img
        v-if="!imageLoadError && course.thumbnailUrl"
        :src="course.thumbnailUrl"
        :alt="course.CourseName"
        @error="imageLoadError = true"
        class="absolute inset-0 w-full h-full object-cover group-hover:scale-108 transition-transform duration-500"
        loading="lazy"
      />
      <div class="absolute inset-0 bg-gradient-to-t from-surface-950/80 via-transparent to-transparent pointer-events-none"></div>

      <!-- Top Code Badge -->
      <span class="absolute top-2 left-2 px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-surface-900/90 text-white backdrop-blur-md border border-white/20">
        {{ course.CourseCode }}
      </span>

      <!-- Bottom Category Pill -->
      <span class="absolute bottom-2 left-2 px-2 py-0.5 rounded-full text-[10px] font-bold bg-surface-900/80 text-white backdrop-blur-md border border-white/20">
        {{ course.categoryName }}
      </span>
    </div>

    <!-- Center Content Details -->
    <div class="flex-1 flex flex-col justify-between space-y-2">
      <div class="space-y-1.5">
        <div class="flex flex-wrap items-center gap-2">
          <!-- Level Badge -->
          <span
            class="px-2 py-0.5 rounded-full text-[10px] font-bold border"
            :class="getLevelBadgeClasses(course.Level)"
          >
            {{ course.Level }}
          </span>

          <!-- Course Type -->
          <span
            class="px-2 py-0.5 rounded-md text-[10px] font-semibold"
            :class="getCourseTypeClasses(course.CourseType)"
          >
            <i class="pi text-[8px] mr-1" :class="getCourseTypeIcon(course.CourseType)"></i>
            {{ course.CourseType }}
          </span>

          <!-- Required -->
          <span
            v-if="course.hasRequired"
            class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/20 flex items-center gap-1"
          >
            <i class="pi pi-lock text-[8px]"></i>
            Mandatory
          </span>
        </div>

        <h3
          @click="$emit('select', course)"
          class="text-base font-bold text-surface-900 dark:text-surface-0 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors cursor-pointer m-0"
        >
          {{ course.CourseName }}
        </h3>

        <p class="text-xs text-surface-500 dark:text-surface-400 line-clamp-2 leading-relaxed m-0">
          {{ course.Description }}
        </p>
      </div>

      <!-- Meta stats in list mode -->
      <div class="flex flex-wrap items-center gap-4 text-xs text-surface-500 dark:text-surface-400 pt-2 border-t border-surface-100 dark:border-surface-700/60">
        <div class="flex items-center gap-1">
          <i class="pi pi-clock text-primary-500"></i>
          <span class="font-bold text-surface-800 dark:text-surface-200">{{ course.formattedDuration }}</span>
        </div>
        <div class="flex items-center gap-1">
          <i class="pi pi-folder text-surface-400"></i>
          <span>{{ course.sectionsCount }} Modules</span>
        </div>
        <div class="flex items-center gap-1">
          <i class="pi pi-video text-blue-500"></i>
          <span>{{ course.videoCount }} Videos</span>
        </div>
        <div class="flex items-center gap-1">
          <i class="pi pi-file text-amber-500"></i>
          <span>{{ course.documentCount }} Docs</span>
        </div>
        <div class="flex items-center gap-1 text-surface-400">
          <i class="pi pi-user"></i>
          <span>{{ course.instructorName }}</span>
        </div>
      </div>
    </div>

    <!-- Right Action Column -->
    <div class="flex md:flex-col justify-end md:justify-center items-end md:items-stretch gap-2 shrink-0 md:w-36 md:border-l md:border-surface-200/60 md:dark:border-surface-700/60 md:pl-4">
      <Button
        label="Syllabus"
        icon="pi pi-list"
        severity="secondary"
        outlined
        class="w-full text-xs font-semibold rounded-xl"
        @click.stop="$emit('quick-view', course)"
      />
      <Button
        label="View Course"
        icon="pi pi-arrow-right"
        severity="primary"
        iconPos="right"
        class="w-full text-xs font-bold rounded-xl shadow-xs"
        @click.stop="$emit('select', course)"
      />
      <button
        @click.stop="$emit('toggle-bookmark', course.CourseId)"
        class="p-2 rounded-xl border border-surface-200 dark:border-surface-700 hover:bg-surface-100 dark:hover:bg-surface-700 text-surface-500 transition-colors cursor-pointer bg-transparent flex items-center justify-center"
        :title="isBookmarked ? 'Remove Bookmark' : 'Bookmark Course'"
      >
        <i :class="isBookmarked ? 'pi pi-bookmark-fill text-amber-500' : 'pi pi-bookmark text-surface-400'"></i>
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { Button } from 'primevue';

const props = defineProps({
  course: {
    type: Object,
    required: true
  },
  viewMode: {
    type: String,
    default: 'grid'
  },
  isBookmarked: {
    type: Boolean,
    default: false
  },
  isEnrolled: {
    type: Boolean,
    default: false
  }
});

defineEmits(['select', 'quick-view', 'toggle-bookmark']);

const imageLoadError = ref(false);

function getCategoryGradient(parentId) {
  switch (parentId) {
    case 1:
      return 'bg-gradient-to-br from-blue-700 via-indigo-800 to-slate-900';
    case 2:
      return 'bg-gradient-to-br from-purple-700 via-indigo-900 to-slate-900';
    case 3:
      return 'bg-gradient-to-br from-rose-700 via-red-900 to-slate-900';
    case 4:
      return 'bg-gradient-to-br from-emerald-700 via-teal-900 to-slate-900';
    case 5:
      return 'bg-gradient-to-br from-amber-700 via-orange-900 to-slate-900';
    default:
      return 'bg-gradient-to-br from-primary-700 via-indigo-900 to-slate-900';
  }
}

function getCategoryIcon(parentId) {
  switch (parentId) {
    case 1: return 'pi pi-code';
    case 2: return 'pi pi-sliders-h';
    case 3: return 'pi pi-shield';
    case 4: return 'pi pi-comments';
    case 5: return 'pi pi-compass';
    default: return 'pi pi-book';
  }
}

function getLevelBadgeClasses(level) {
  switch (level?.toLowerCase()) {
    case 'beginner':
      return 'bg-emerald-500/20 text-emerald-300 border-emerald-400/30';
    case 'intermediate':
      return 'bg-amber-500/20 text-amber-300 border-amber-400/30';
    case 'advanced':
      return 'bg-purple-500/20 text-purple-300 border-purple-400/30';
    default:
      return 'bg-surface-800/80 text-surface-200 border-surface-600';
  }
}

function getCourseTypeClasses(type) {
  switch (type?.toLowerCase()) {
    case 'online':
      return 'bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-300 border border-blue-200 dark:border-blue-800';
    case 'offline':
      return 'bg-amber-50 dark:bg-amber-950 text-amber-600 dark:text-amber-300 border border-amber-200 dark:border-amber-800';
    case 'blended':
      return 'bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800';
    default:
      return 'bg-surface-100 dark:bg-surface-800 text-surface-600';
  }
}

function getCourseTypeIcon(type) {
  switch (type?.toLowerCase()) {
    case 'online': return 'pi-desktop';
    case 'offline': return 'pi-building';
    case 'blended': return 'pi-sync';
    default: return 'pi-compass';
  }
}

function getInitials(name) {
  if (!name) return 'LC';
  const parts = name.trim().split(' ');
  if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}
</script>
