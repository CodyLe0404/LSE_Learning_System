<route>
{
  meta: {
    title: "E-Learning Dashboard",
    icon: "pi pi-home",
    hidden: "true"
  }
}
</route>

<template>
  <div class="space-y-6">
    <!-- Custom Toast Notification Alerts overlay -->
    <div class="fixed top-20 right-6 z-50 flex flex-col gap-2 pointer-events-none">
      <TransitionGroup name="toast">
        <div 
          v-for="toast in toasts" 
          :key="toast.id"
          class="pointer-events-auto p-4 rounded-xl shadow-xl flex items-center gap-3 min-w-[280px] max-w-sm border backdrop-blur-md transition-all duration-300"
          :class="{
            'bg-green-500/10 border-green-500/20 text-green-700 dark:text-green-300': toast.severity === 'success',
            'bg-blue-500/10 border-blue-500/20 text-blue-700 dark:text-blue-300': toast.severity === 'info',
            'bg-amber-500/10 border-amber-500/20 text-amber-700 dark:text-amber-300': toast.severity === 'warn',
          }"
        >
          <div class="w-6 h-6 rounded-full flex items-center justify-center shrink-0" :class="{
            'bg-green-500/20 text-green-600': toast.severity === 'success',
            'bg-blue-500/20 text-blue-600': toast.severity === 'info',
            'bg-amber-500/20 text-amber-600': toast.severity === 'warn',
          }">
            <i class="pi text-xs" :class="{
              'pi-check': toast.severity === 'success',
              'pi-info': toast.severity === 'info',
              'pi-exclamation-triangle': toast.severity === 'warn',
            }"></i>
          </div>
          <div class="flex-1 text-xs font-semibold leading-snug">{{ toast.message }}</div>
          <button @click="removeToast(toast.id)" class="text-current opacity-60 hover:opacity-100 bg-transparent border-none cursor-pointer flex items-center">
            <i class="pi pi-times text-[10px]"></i>
          </button>
        </div>
      </TransitionGroup>
    </div>

    <!-- Page Header Hero Panel -->
    <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-primary-500/10 via-indigo-500/5 to-transparent p-6 rounded-2xl border border-surface-200/50 dark:border-surface-700/50 backdrop-blur-sm">
      <div>
        <h1 class="text-2xl md:text-3xl font-extrabold text-surface-900 dark:text-surface-0 flex items-center gap-2">
          Welcome back, {{ authStore.user?.displayName || 'Developer' }}! <span class="animate-bounce">👋</span>
        </h1>
        <p class="text-surface-500 dark:text-surface-400 mt-1">
          You have <strong class="text-primary-500">{{ statsRequired }}</strong> mandatory courses remaining. Keep up the great progress!
        </p>
      </div>
      <div class="flex flex-wrap gap-2 shrink-0">
        <Button 
          label="Simulate Study" 
          icon="pi pi-bolt" 
          severity="primary" 
          class="shadow-md hover:scale-102 transition-transform text-xs"
          @click="simulateStudySession"
          v-tooltip.bottom="'Simulate studying your active course'"
        />
        <Button 
          label="Reset Progress" 
          icon="pi pi-refresh" 
          severity="secondary" 
          outlined 
          class="text-xs"
          @click="resetProgress" 
        />
      </div>
    </div>

    <!-- 1. Overall Status Summary Progress Card Grid -->
    <SummaryProgressCard 
      :overallProgress="overallProgress"
      :totalHours="totalHours"
      :streakDays="streakDays"
      :totalXP="totalXP"
      :hoursAddedToday="hoursAddedToday"
      @increment-streak="handleIncrementStreak"
    />

    <!-- Dashboard Main Column Structure -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      
      <!-- Left Column (Metrics and Course Matrix) -->
      <div class="lg:col-span-2 space-y-6">
        
        <!-- 2. Course Status Counters Metrics component -->
        <CourseMetrics 
          :courses="courses"
          :statusFilter="statusFilter"
          @filter-status="handleFilterStatus"
          @toast-message="handleToastMessage"
        />

        <!-- 3. Course Tabbed / Filtered matrix list component -->
        <CourseList 
          :courses="courses"
          :statusFilter="statusFilter"
          :searchQuery="searchQuery"
          @enroll="handleEnroll"
          @study="handleStudy"
          @reset-filters="handleResetFilters"
        />
      </div>

      <!-- Right Column (Learning Plan timeline & Calendar) -->
      <div class="space-y-6">
        
        <!-- 4. Personal pathway OKR and timeline milestones -->
        <LearningPlan 
          :totalHours="totalHours"
          :pathwayNodes="pathwayNodes"
        />

        <!-- 5. Interactive Blended Calendar schedules list -->
        <TrainingCalendar 
          :events="calendarEvents"
          @rsvp="handleRsvp"
        />
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { Button } from 'primevue';
import { useAuthStore } from '../stores/auth';

// Component Imports
import SummaryProgressCard from '../components/Dashboard/SummaryProgressCard.vue';
import CourseMetrics from '../components/Dashboard/CourseMetrics.vue';
import LearningPlan from '../components/Dashboard/LearningPlan.vue';
import CourseList from '../components/Dashboard/CourseList.vue';
import TrainingCalendar from '../components/Dashboard/TrainingCalendar.vue';

// Mock Data Imports
import { initialCourses, initialEvents, initialPathway } from '../components/Dashboard/mockData.js';

const authStore = useAuthStore();

// Copy mock data arrays to prevent direct modifications to static initial module exports
const courses = ref(JSON.parse(JSON.stringify(initialCourses)));
const calendarEvents = ref(JSON.parse(JSON.stringify(initialEvents)));
const pathwayNodes = ref(JSON.parse(JSON.stringify(initialPathway)));

// Toast Notification State Manager
const toasts = ref([]);
function handleToastMessage(message, severity = 'success') {
  const id = Date.now();
  toasts.value.push({ id, message, severity });
  setTimeout(() => {
    removeToast(id);
  }, 3500);
}
function removeToast(id) {
  toasts.value = toasts.value.filter(t => t.id !== id);
}

// Stats & Motivational Metrics states
const streakDays = ref(12);
const totalXP = ref(2450);
const hoursAddedToday = ref(0.0);

// Global filter states
const statusFilter = ref('All');
const searchQuery = ref('');

// Computed Metrics derived from courses array state
const totalHours = computed(() => {
  const sum = courses.value.reduce((sum, c) => sum + c.hoursSpent, 0);
  return sum.toFixed(1);
});

const statsRequired = computed(() => {
  return courses.value.filter(c => c.required && c.status !== 'completed').length;
});

// Overall completion percentage calculated strictly across assigned mandatory courses
const overallProgress = computed(() => {
  const assigned = courses.value.filter(c => c.required);
  if (assigned.length === 0) return 0;
  const sum = assigned.reduce((sum, c) => sum + c.progress, 0);
  return Math.round(sum / assigned.length);
});

// Event handlers
function handleIncrementStreak() {
  streakDays.value++;
  totalXP.value += 100;
  handleToastMessage('Daily Streak extended! +100 XP earned 🔥', 'success');
}

function handleFilterStatus(status) {
  if (statusFilter.value === status) {
    statusFilter.value = 'All';
  } else {
    statusFilter.value = status;
    handleToastMessage(`Filtering list by: ${formatStatusName(status)}`, 'info');
  }
}

function formatStatusName(status) {
  if (status === 'Required') return 'Mandatory Remaining';
  if (status === 'in_progress') return 'In Progress';
  if (status === 'completed') return 'Completed';
  return status;
}

function handleEnroll(course) {
  // Update state to in_progress (0% progress)
  const target = courses.value.find(c => c.id === course.id);
  if (target) {
    target.status = 'in_progress';
    target.progress = 0;
    target.hoursSpent = 0.0;
    totalXP.value += 150;
    handleToastMessage(`Enrolled in "${course.title}"! +150 XP`, 'success');
  }
}

function handleStudy(course) {
  const target = courses.value.find(c => c.id === course.id);
  if (!target) return;

  if (target.status === 'required_not_started') {
    target.status = 'in_progress';
    target.progress = 20;
    target.hoursSpent += 0.5;
    hoursAddedToday.value += 0.5;
    totalXP.value += 100;
    handleToastMessage(`Started learning "${target.title}"! +100 XP`, 'success');
  } else if (target.status === 'in_progress') {
    if (target.progress < 100) {
      target.progress += 20;
      target.hoursSpent += 1.0;
      hoursAddedToday.value += 1.0;
      totalXP.value += 100;

      if (target.progress >= 100) {
        target.progress = 100;
        target.status = 'completed';
        totalXP.value += 300;
        handleToastMessage(`Congratulations! Completed "${target.title}"! +300 XP 🎉`, 'success');
      } else {
        handleToastMessage(`Studied "${target.title}"! Progress is now ${target.progress}%. +100 XP`, 'success');
      }
    }
  } else if (target.status === 'completed') {
    target.hoursSpent += 0.5;
    hoursAddedToday.value += 0.5;
    totalXP.value += 50;
    handleToastMessage(`Reviewed completed course "${target.title}". +50 XP`, 'success');
  }
}

function handleRsvp(event) {
  const target = calendarEvents.value.find(e => e.id === event.id);
  if (target) {
    target.status = 'Confirmed';
    totalXP.value += 100;
    handleToastMessage(`RSVP Confirmed for "${target.title}"! +100 XP`, 'success');
  }
}

function handleResetFilters() {
  searchQuery.value = '';
  statusFilter.value = 'All';
  handleToastMessage('Filters cleared', 'info');
}

// Global simulation actions
function simulateStudySession() {
  // Find first course currently in progress
  const active = courses.value.find(c => c.status === 'in_progress');
  if (active) {
    handleStudy(active);
  } else {
    // Start the first non-completed required course
    const unstarted = courses.value.find(c => c.required && c.status === 'required_not_started');
    if (unstarted) {
      handleStudy(unstarted);
    } else {
      handleToastMessage('All required courses are completed! Enroll in self-study elective courses.', 'warn');
    }
  }
}

function resetProgress() {
  courses.value = JSON.parse(JSON.stringify(initialCourses));
  calendarEvents.value = JSON.parse(JSON.stringify(initialEvents));
  pathwayNodes.value = JSON.parse(JSON.stringify(initialPathway));
  
  streakDays.value = 12;
  totalXP.value = 2450;
  hoursAddedToday.value = 0.0;
  statusFilter.value = 'All';
  searchQuery.value = '';
  
  handleToastMessage('Dashboard state reset successfully.', 'info');
}

// Global topbar search bindings
const handleGlobalSearch = (e) => {
  searchQuery.value = e.detail || '';
};

onMounted(() => {
  window.addEventListener('global-search', handleGlobalSearch);
});

onUnmounted(() => {
  window.removeEventListener('global-search', handleGlobalSearch);
});
</script>

<style scoped>
.toast-enter-active,
.toast-leave-active {
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}

.toast-enter-from {
  opacity: 0;
  transform: translateY(-10px) scale(0.95);
}

.toast-leave-to {
  opacity: 0;
  transform: translateY(-20px) scale(0.9);
}

.toast-move {
  transition: transform 0.3s ease;
}
</style>
