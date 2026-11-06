<template>
  <Drawer
    :visible="visible"
    @update:visible="$emit('update:visible', $event)"
    position="right"
    :style="{ width: '820px', maxWidth: '100vw' }"
    class="p-0 overflow-hidden"
    :dismissable="true"
  >
    <!-- Custom Drawer Header -->
    <template #header>
      <div class="flex items-center justify-between w-full pr-4">
        <div class="flex items-center gap-2">
          <span class="px-2.5 py-1 rounded-md text-xs font-mono font-bold bg-primary-50 dark:bg-primary-950 text-primary-600 dark:text-primary-400 border border-primary-200 dark:border-primary-800">
            {{ courseDetails?.CourseCode || 'COURSE' }}
          </span>
          <span
            class="px-2.5 py-0.5 rounded-full text-xs font-bold border"
            :class="getLevelBadgeClasses(courseDetails?.Level)"
          >
            {{ courseDetails?.Level }}
          </span>
          <span class="text-xs text-surface-400 font-mono">
            v{{ courseDetails?.Version || 1 }}.0
          </span>
        </div>

        <span
          class="px-2.5 py-1 rounded-full text-[11px] font-bold"
          :class="courseDetails?.Status === 'Published' ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20' : 'bg-surface-100 text-surface-600'"
        >
          {{ courseDetails?.Status }}
        </span>
      </div>
    </template>

    <div v-if="courseDetails" class="space-y-6 pb-24">
      <!-- Course Hero Top Banner -->
      <div class="relative rounded-2xl overflow-hidden bg-surface-900 border border-surface-700/80 shadow-md">
        <img
          :src="courseDetails.thumbnailUrl"
          :alt="courseDetails.CourseName"
          class="w-full h-52 object-cover opacity-50"
        />
        <div class="absolute inset-0 bg-gradient-to-t from-surface-950 via-surface-950/60 to-transparent"></div>

        <div class="absolute inset-x-0 bottom-0 p-5 space-y-2 text-white">
          <div class="flex items-center gap-2 text-xs text-primary-300 font-semibold">
            <span>{{ courseDetails.parentCategoryName }}</span>
            <i class="pi pi-angle-right text-[10px]"></i>
            <span>{{ courseDetails.categoryName }}</span>
          </div>

          <h2 class="text-xl sm:text-2xl font-black text-white leading-snug m-0">
            {{ courseDetails.CourseName }}
          </h2>

          <div class="flex flex-wrap items-center gap-4 text-xs text-surface-300 pt-1">
            <span class="flex items-center gap-1.5">
              <i class="pi pi-user text-primary-400"></i>
              {{ courseDetails.instructorName }}
            </span>
            <span>•</span>
            <span class="flex items-center gap-1.5">
              <i class="pi pi-star-fill text-amber-400"></i>
              {{ courseDetails.rating || 4.9 }} ({{ courseDetails.enrollmentCount || 1200 }} learners)
            </span>
            <span>•</span>
            <span class="flex items-center gap-1.5">
              <i class="pi pi-desktop text-indigo-400"></i>
              {{ courseDetails.CourseType }} Mode
            </span>
          </div>
        </div>
      </div>

      <!-- Quick Metrics Ribbon -->
      <div class="grid grid-cols-2 sm:grid-cols-5 gap-2 p-3 bg-surface-50 dark:bg-surface-850 rounded-2xl border border-surface-200/80 dark:border-surface-700/80 text-center">
        <div class="p-2">
          <span class="text-[10px] uppercase font-bold text-surface-400 block">Total Duration</span>
          <span class="text-sm font-black text-primary-600 dark:text-primary-400">{{ courseDetails.formattedDuration }}</span>
        </div>
        <div class="p-2">
          <span class="text-[10px] uppercase font-bold text-surface-400 block">Modules</span>
          <span class="text-sm font-black text-surface-800 dark:text-surface-100">{{ courseDetails.sections?.length || 0 }}</span>
        </div>
        <div class="p-2">
          <span class="text-[10px] uppercase font-bold text-surface-400 block">Videos</span>
          <span class="text-sm font-black text-blue-600 dark:text-blue-400">{{ courseDetails.videoCount }}</span>
        </div>
        <div class="p-2">
          <span class="text-[10px] uppercase font-bold text-surface-400 block">Documents</span>
          <span class="text-sm font-black text-amber-600 dark:text-amber-400">{{ courseDetails.documentCount }}</span>
        </div>
        <div class="p-2 col-span-2 sm:col-span-1">
          <span class="text-[10px] uppercase font-bold text-surface-400 block">Mandatory</span>
          <span class="text-sm font-black text-red-600 dark:text-red-400">{{ courseDetails.totalRequiredCount || 0 }} Items</span>
        </div>
      </div>

      <!-- Tab Switcher: Syllabus vs Overview -->
      <div class="flex items-center gap-2 border-b border-surface-200 dark:border-surface-700 pb-2">
        <button
          @click="activeDrawerTab = 'syllabus'"
          class="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all border-none cursor-pointer"
          :class="activeDrawerTab === 'syllabus'
            ? 'bg-primary-500 text-white shadow-md'
            : 'bg-surface-100 dark:bg-surface-800 text-surface-600 dark:text-surface-400 hover:text-surface-900'"
        >
          <i class="pi pi-list"></i>
          <span>Curriculum & Syllabus ({{ courseDetails.sections?.length }} Sections)</span>
        </button>

        <button
          @click="activeDrawerTab = 'overview'"
          class="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all border-none cursor-pointer"
          :class="activeDrawerTab === 'overview'
            ? 'bg-primary-500 text-white shadow-md'
            : 'bg-surface-100 dark:bg-surface-800 text-surface-600 dark:text-surface-400 hover:text-surface-900'"
        >
          <i class="pi pi-info-circle"></i>
          <span>Overview & Objectives</span>
        </button>
      </div>

      <!-- TAB 1: CURRICULUM ACCORDION -->
      <div v-show="activeDrawerTab === 'syllabus'" class="space-y-4">
        <div class="flex items-center justify-between">
          <p class="text-xs text-surface-500 dark:text-surface-400 m-0">
            Sections and lectures ordered by <code class="text-primary-500 font-mono font-bold">DisplayOrder</code> from database schema:
          </p>
          <button
            @click="toggleAllSections"
            class="text-xs text-primary-500 hover:text-primary-600 font-semibold bg-transparent border-none cursor-pointer"
          >
            {{ allExpanded ? 'Collapse All' : 'Expand All' }}
          </button>
        </div>

        <!-- Custom Accordion for COURSE_SECTIONS -->
        <div class="space-y-3">
          <div
            v-for="(section, sIndex) in courseDetails.sections"
            :key="section.SectionId"
            class="bg-surface-0 dark:bg-surface-800 rounded-2xl border border-surface-200/80 dark:border-surface-700/80 shadow-xs overflow-hidden transition-all"
          >
            <!-- Section Header (Click to toggle) -->
            <button
              @click="toggleSection(section.SectionId)"
              class="w-full p-4 flex items-center justify-between text-left bg-surface-50/50 dark:bg-surface-850/50 hover:bg-surface-100/60 dark:hover:bg-surface-750 transition-colors border-none cursor-pointer"
            >
              <div class="flex items-start gap-3 min-w-0 pr-2">
                <div class="w-7 h-7 rounded-lg bg-primary-100 dark:bg-primary-950 text-primary-700 dark:text-primary-300 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5 border border-primary-200 dark:border-primary-800">
                  {{ section.DisplayOrder }}
                </div>
                <div>
                  <h4 class="text-sm font-bold text-surface-900 dark:text-surface-0 m-0">
                    {{ section.Title }}
                  </h4>
                  <p class="text-xs text-surface-500 dark:text-surface-400 mt-0.5 m-0 leading-normal">
                    {{ section.Description }}
                  </p>
                </div>
              </div>

              <div class="flex items-center gap-3 shrink-0">
                <div class="text-right hidden sm:block">
                  <span class="text-xs font-semibold text-surface-800 dark:text-surface-200 block">
                    {{ section.totalItems }} lessons
                  </span>
                  <span class="text-[11px] text-surface-400 block">
                    {{ section.formattedDuration }}
                  </span>
                </div>
                <i
                  class="pi text-xs text-surface-400 transition-transform duration-200"
                  :class="isSectionOpen(section.SectionId) ? 'pi-chevron-up text-primary-500' : 'pi-chevron-down'"
                ></i>
              </div>
            </button>

            <!-- Section Content Items (COURSE_CONTENTS) -->
            <div
              v-show="isSectionOpen(section.SectionId)"
              class="border-t border-surface-200/80 dark:border-surface-700/80 divide-y divide-surface-100 dark:divide-surface-750"
            >
              <div
                v-for="content in section.contents"
                :key="content.ContentId"
                class="p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-surface-50/80 dark:hover:bg-surface-750/50 transition-colors group"
              >
                <!-- Left: Content Type Icon, Title & Flags -->
                <div class="flex items-start gap-3 min-w-0">
                  <!-- Type Icon -->
                  <div
                    class="w-8 h-8 rounded-xl flex items-center justify-center shrink-0 mt-0.5 shadow-xs"
                    :class="content.ContentType === 'Video'
                      ? 'bg-blue-100 text-blue-600 dark:bg-blue-950 dark:text-blue-400 border border-blue-200 dark:border-blue-900'
                      : 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-400 border border-amber-200 dark:border-amber-900'"
                  >
                    <i
                      class="pi text-xs"
                      :class="content.ContentType === 'Video' ? 'pi-video' : 'pi-file-pdf'"
                    ></i>
                  </div>

                  <!-- Details -->
                  <div class="space-y-1 min-w-0">
                    <div class="flex flex-wrap items-center gap-2">
                      <span class="text-xs font-semibold text-surface-900 dark:text-surface-100">
                        {{ content.DisplayOrder }}. {{ content.Title }}
                      </span>

                      <!-- IsRequired Badge -->
                      <span
                        v-if="content.IsRequired"
                        class="px-2 py-0.2 rounded text-[10px] font-bold bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/20"
                      >
                        Mandatory
                      </span>
                      <span
                        v-else
                        class="px-2 py-0.2 rounded text-[10px] font-medium bg-surface-100 dark:bg-surface-700 text-surface-500"
                      >
                        Elective
                      </span>
                    </div>

                    <!-- Underling Resource Metadata Pill -->
                    <div class="flex flex-wrap items-center gap-2 text-[11px] text-surface-400">
                      <!-- Video resource details -->
                      <template v-if="content.ContentType === 'Video' && content.video">
                        <span class="font-mono text-surface-500 truncate max-w-[200px]">
                          {{ content.video.FileName }}
                        </span>
                        <span>•</span>
                        <span class="text-blue-600 dark:text-blue-400 font-semibold">{{ content.video.formattedSize }}</span>
                        <span>•</span>
                        <span>{{ content.video.formattedDuration }}</span>
                      </template>

                      <!-- Document resource details -->
                      <template v-else-if="content.ContentType === 'Document' && content.document">
                        <span class="font-mono text-surface-500 truncate max-w-[200px]">
                          {{ content.document.FileName }}
                        </span>
                        <span>•</span>
                        <span class="text-amber-600 dark:text-amber-400 font-bold uppercase">{{ content.document.FileType }}</span>
                        <span>•</span>
                        <span>{{ content.document.formattedSize }}</span>
                        <span>•</span>
                        <span>v{{ content.document.Version }}.0</span>
                      </template>
                    </div>
                  </div>
                </div>

                <!-- Right: Action Trigger to Preview Resource -->
                <div class="flex items-center gap-2 self-end sm:self-center shrink-0">
                  <span class="text-xs font-mono text-surface-500 font-semibold hidden sm:inline">
                    {{ content.Duration }}m
                  </span>
                  <Button
                    :label="content.ContentType === 'Video' ? 'Watch' : 'Read'"
                    :icon="content.ContentType === 'Video' ? 'pi pi-play' : 'pi pi-eye'"
                    size="small"
                    outlined
                    severity="secondary"
                    class="text-xs font-semibold rounded-lg hover:border-primary-500 hover:text-primary-600"
                    @click.stop="openPreview(content)"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- TAB 2: OVERVIEW & OBJECTIVES -->
      <div v-show="activeDrawerTab === 'overview'" class="space-y-6">
        <!-- Full Description -->
        <div class="space-y-2">
          <h4 class="text-xs font-bold uppercase tracking-wider text-surface-400 m-0">About This Course</h4>
          <p class="text-sm text-surface-700 dark:text-surface-300 leading-relaxed m-0">
            {{ courseDetails.Description }}
          </p>
        </div>

        <!-- Learning Objectives Checklist -->
        <div class="bg-surface-50 dark:bg-surface-850 p-5 rounded-2xl border border-surface-200/80 dark:border-surface-700/80 space-y-3">
          <h4 class="text-xs font-bold uppercase tracking-wider text-surface-900 dark:text-surface-0 m-0 flex items-center gap-2">
            <i class="pi pi-check-circle text-emerald-500"></i>
            Key Competencies & Learning Outcomes
          </h4>
          <ul class="list-none p-0 m-0 space-y-2 text-xs text-surface-600 dark:text-surface-300">
            <li class="flex items-start gap-2">
              <i class="pi pi-check text-emerald-500 text-xs mt-0.5"></i>
              <span>Demonstrate functional mastery of all required industry and organizational standards.</span>
            </li>
            <li class="flex items-start gap-2">
              <i class="pi pi-check text-emerald-500 text-xs mt-0.5"></i>
              <span>Complete all {{ courseDetails.totalRequiredCount }} mandatory interactive assessments with a passing score of 80%+.</span>
            </li>
            <li class="flex items-start gap-2">
              <i class="pi pi-check text-emerald-500 text-xs mt-0.5"></i>
              <span>Apply clean architecture principles, security checklists, and collaborative protocols to production projects.</span>
            </li>
          </ul>
        </div>

        <!-- Instructor Profile Card -->
        <div class="bg-surface-0 dark:bg-surface-800 p-4 rounded-2xl border border-surface-200/80 dark:border-surface-700/80 flex items-center gap-4">
          <div class="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary-500 to-indigo-600 text-white flex items-center justify-center font-bold text-base shadow-md shrink-0">
            {{ getInitials(courseDetails.instructorName) }}
          </div>
          <div class="flex-1 min-w-0">
            <h4 class="text-sm font-bold text-surface-900 dark:text-surface-0 m-0">
              {{ courseDetails.instructorName }}
            </h4>
            <p class="text-xs text-surface-500 dark:text-surface-400 mt-0.5 m-0">
              {{ courseDetails.instructorTitle || 'Principal Subject Matter Expert' }}
            </p>
            <p class="text-[11px] text-primary-500 font-semibold mt-1 m-0">
              Department: {{ courseDetails.parentCategoryName }}
            </p>
          </div>
        </div>

        <!-- Schema Relational Audit Info -->
        <div class="bg-surface-50 dark:bg-surface-850 p-4 rounded-xl border border-surface-200 dark:border-surface-700 text-xs space-y-2">
          <div class="flex items-center justify-between text-surface-400 font-mono text-[11px]">
            <span>[COURSES] Schema Audit Record</span>
            <span>CourseId: #{{ courseDetails.CourseId }}</span>
          </div>
          <div class="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 font-mono text-[11px]">
            <div>
              <span class="text-surface-400 block text-[9px]">CategoryId (FK)</span>
              <span>#{{ courseDetails.CategoryId }}</span>
            </div>
            <div>
              <span class="text-surface-400 block text-[9px]">CreatedBy (FK)</span>
              <span>#{{ courseDetails.CreatedBy }}</span>
            </div>
            <div>
              <span class="text-surface-400 block text-[9px]">CreatedAt</span>
              <span class="truncate block">{{ courseDetails.CreatedAt }}</span>
            </div>
            <div>
              <span class="text-surface-400 block text-[9px]">UpdatedAt</span>
              <span class="truncate block">{{ courseDetails.UpdatedAt }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Sticky Bottom CTA Action Bar -->
    <template #footer>
      <div class="flex flex-col sm:flex-row items-center justify-between gap-3 p-4 bg-surface-0 dark:bg-surface-800 border-t border-surface-200 dark:border-surface-700">
        <div class="flex items-center gap-2">
          <button
            @click="$emit('toggle-bookmark', courseDetails?.CourseId)"
            class="px-3 py-2 rounded-xl border border-surface-200 dark:border-surface-700 text-xs font-semibold flex items-center gap-1.5 hover:bg-surface-100 dark:hover:bg-surface-700 transition-colors cursor-pointer bg-transparent"
          >
            <i :class="isBookmarked ? 'pi pi-bookmark-fill text-amber-500' : 'pi pi-bookmark text-surface-500'"></i>
            <span>{{ isBookmarked ? 'Bookmarked' : 'Bookmark' }}</span>
          </button>
        </div>

        <div class="flex items-center gap-2 w-full sm:w-auto justify-end">
          <Button
            :label="isEnrolled ? 'Continue Course' : 'Enroll & Start Learning'"
            :icon="isEnrolled ? 'pi pi-play' : 'pi pi-check-circle'"
            severity="primary"
            class="w-full sm:w-auto text-xs font-bold shadow-md shadow-primary-500/20"
            @click="$emit('enroll', courseDetails)"
          />
        </div>
      </div>
    </template>
  </Drawer>

  <!-- Nested Media Preview Modal for Videos and Documents -->
  <MediaPreviewModal
    v-model:visible="previewModalVisible"
    :content="selectedPreviewContent"
    @download="handleDocumentDownload"
  />
</template>

<script setup>
import { ref, computed, watch } from 'vue';
import { Drawer, Button } from 'primevue';
import MediaPreviewModal from './MediaPreviewModal.vue';

const props = defineProps({
  visible: {
    type: Boolean,
    default: false
  },
  courseDetails: {
    type: Object,
    default: null
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

const emit = defineEmits(['update:visible', 'enroll', 'toggle-bookmark', 'toast']);

const activeDrawerTab = ref('syllabus'); // 'syllabus' | 'overview'
const openSectionIds = ref([]);

// Preview Modal state
const previewModalVisible = ref(false);
const selectedPreviewContent = ref(null);

watch(() => props.courseDetails, (newCourse) => {
  if (newCourse && newCourse.sections && newCourse.sections.length > 0) {
    // Open first section by default
    openSectionIds.value = [newCourse.sections[0].SectionId];
  } else {
    openSectionIds.value = [];
  }
}, { immediate: true });

const allExpanded = computed(() => {
  if (!props.courseDetails?.sections) return false;
  return openSectionIds.value.length === props.courseDetails.sections.length;
});

function isSectionOpen(sectionId) {
  return openSectionIds.value.includes(sectionId);
}

function toggleSection(sectionId) {
  if (openSectionIds.value.includes(sectionId)) {
    openSectionIds.value = openSectionIds.value.filter(id => id !== sectionId);
  } else {
    openSectionIds.value.push(sectionId);
  }
}

function toggleAllSections() {
  if (!props.courseDetails?.sections) return;
  if (allExpanded.value) {
    openSectionIds.value = [];
  } else {
    openSectionIds.value = props.courseDetails.sections.map(s => s.SectionId);
  }
}

function openPreview(content) {
  selectedPreviewContent.value = content;
  previewModalVisible.value = true;
}

function handleDocumentDownload(fileName) {
  emit('toast', {
    title: 'Download Initiated',
    message: `Downloading ${fileName}...`,
    severity: 'info'
  });
}

function getLevelBadgeClasses(level) {
  switch (level?.toLowerCase()) {
    case 'beginner':
      return 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20';
    case 'intermediate':
      return 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20';
    case 'advanced':
      return 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20';
    default:
      return 'bg-surface-100 text-surface-600 border-surface-200';
  }
}

function getInitials(name) {
  if (!name) return 'LSE';
  const parts = name.trim().split(' ');
  if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}
</script>
