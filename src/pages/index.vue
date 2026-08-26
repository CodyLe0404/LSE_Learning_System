<route>
{
  meta: {
    title: "E-Learning Dashboard",
    icon: "pi pi-home"
  }
}
</route>

<template>
  <div class="space-y-6">
    <!-- Custom Toast System Notifications -->
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
            'bg-amber-500/20 text-amber-650': toast.severity === 'warn',
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

    <!-- Header Section -->
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

    <!-- 1. KPI Summary Cards Grid -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <!-- 1a. Overall Progress Widget -->
      <Card class="border border-surface-200 dark:border-surface-700 shadow-sm relative overflow-hidden group">
        <template #content>
          <div class="flex items-center justify-between">
            <div class="space-y-1">
              <span class="text-xs font-semibold text-surface-400 dark:text-surface-500 uppercase tracking-wider">Overall Progress</span>
              <h2 class="text-3xl font-bold text-surface-900 dark:text-surface-0">{{ overallProgress }}%</h2>
              <p class="text-[11px] text-surface-500 dark:text-surface-400">Assigned Courses</p>
            </div>
            <!-- Interactive Circular Progress Ring -->
            <div class="relative w-16 h-16 flex items-center justify-center shrink-0">
              <svg class="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                <!-- BG Ring -->
                <circle cx="18" cy="18" r="15" fill="none" stroke="currentColor" class="text-surface-100 dark:text-surface-700" stroke-width="3" />
                <!-- Progress Ring -->
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
          <!-- Tiny bar indicator on hover -->
          <div class="absolute bottom-0 left-0 right-0 h-1 bg-primary-500 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></div>
        </template>
      </Card>

      <!-- 1b. Study Hours Card -->
      <Card class="border border-surface-200 dark:border-surface-700 shadow-sm relative overflow-hidden group">
        <template #content>
          <div class="flex items-center justify-between">
            <div class="space-y-1">
              <span class="text-xs font-semibold text-surface-400 dark:text-surface-500 uppercase tracking-wider">Study Time</span>
              <h2 class="text-3xl font-bold text-surface-900 dark:text-surface-0">{{ totalHours }} hrs</h2>
              <div class="flex items-center gap-1 text-[11px] text-green-500 font-semibold">
                <i class="pi pi-arrow-up text-[9px]"></i>
                <span>+{{ hoursAddedThisSession.toFixed(1) }}h added today</span>
              </div>
            </div>
            <div class="w-10 h-10 rounded-xl bg-blue-500/10 dark:bg-blue-500/20 text-blue-500 flex items-center justify-center text-lg shrink-0">
              <i class="pi pi-clock"></i>
            </div>
          </div>
          <div class="absolute bottom-0 left-0 right-0 h-1 bg-blue-500 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></div>
        </template>
      </Card>

      <!-- 1c. Streak Card -->
      <Card class="border border-surface-200 dark:border-surface-700 shadow-sm relative overflow-hidden group">
        <template #content>
          <div class="flex items-center justify-between">
            <div class="space-y-1">
              <span class="text-xs font-semibold text-surface-400 dark:text-surface-500 uppercase tracking-wider">Learning Streak</span>
              <h2 class="text-3xl font-bold text-surface-900 dark:text-surface-0">{{ streakDays }} Days</h2>
              <p class="text-[11px] text-orange-500 font-semibold animate-pulse flex items-center gap-1">
                <i class="pi pi-fire text-[10px]"></i> Active streak! Keep it up
              </p>
            </div>
            <div class="w-10 h-10 rounded-xl bg-orange-500/10 dark:bg-orange-500/20 text-orange-500 flex items-center justify-center text-lg shrink-0 cursor-pointer hover:scale-110 transition-transform" @click="incrementStreak">
              <i class="pi pi-fire"></i>
            </div>
          </div>
          <div class="absolute bottom-0 left-0 right-0 h-1 bg-orange-500 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></div>
        </template>
      </Card>

      <!-- 1d. Points Card -->
      <Card class="border border-surface-200 dark:border-surface-700 shadow-sm relative overflow-hidden group">
        <template #content>
          <div class="flex items-center justify-between">
            <div class="space-y-1">
              <span class="text-xs font-semibold text-surface-400 dark:text-surface-500 uppercase tracking-wider">Points Earned</span>
              <h2 class="text-3xl font-bold text-surface-900 dark:text-surface-0">{{ totalXP }} XP</h2>
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

    <!-- Main Content Section: Columns layout (Left main modules, Right sidebar modules) -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      
      <!-- Left Column (Dashboard main actions & courses) -->
      <div class="lg:col-span-2 space-y-6">

        <!-- 2. Course Status Metrics Breakdown & Visual Dashboard -->
        <Card class="border border-surface-200 dark:border-surface-700 shadow-sm">
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
                @click="statusFilter = 'All'" 
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
                    class="bg-amber-450 dark:bg-amber-500 transition-all duration-500" 
                    :style="{ width: (statsRequired / courses.length) * 100 + '%' }"
                  ></div>
                  <div 
                    class="bg-blue-500 dark:bg-blue-650 transition-all duration-500" 
                    :style="{ width: (statsInProgress / courses.length) * 100 + '%' }"
                  ></div>
                  <div 
                    class="bg-green-500 dark:bg-green-650 transition-all duration-500" 
                    :style="{ width: (statsCompleted / courses.length) * 100 + '%' }"
                  ></div>
                </div>

                <!-- Metrics breakdown cards (clickable filter toggles) -->
                <div class="grid grid-cols-3 gap-3">
                  <!-- Required -->
                  <div 
                    @click="toggleStatusFilter('Required')"
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
                    @click="toggleStatusFilter('In Progress')"
                    class="p-3 rounded-xl border text-center cursor-pointer transition-all duration-200 group select-none"
                    :class="[
                      statusFilter === 'In Progress' 
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
                    @click="toggleStatusFilter('Completed')"
                    class="p-3 rounded-xl border text-center cursor-pointer transition-all duration-200 group select-none"
                    :class="[
                      statusFilter === 'Completed' 
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
                <div class="text-[11px] font-semibold text-primary-500 hover:underline cursor-pointer flex items-center justify-center md:justify-start gap-1 pt-1" @click="addToast('Keep studying to earn the Golden Badge!', 'info')">
                  View Achievements <i class="pi pi-chevron-right text-[8px]"></i>
                </div>
              </div>
              
            </div>
          </template>
        </Card>

        <!-- 3. Course Matrix / List Section -->
        <div class="space-y-4">
          <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <!-- Custom Styled Premium Tabs -->
            <div class="bg-surface-100 dark:bg-surface-800 p-1 rounded-xl flex gap-1 border border-surface-200/50 dark:border-surface-700/50">
              <button 
                class="px-4 py-2 text-xs font-bold rounded-lg transition-all border-none bg-transparent cursor-pointer"
                :class="activeTab === 'assigned' ? 'bg-surface-0 dark:bg-surface-700 text-primary-500 shadow-sm' : 'text-surface-500 dark:text-surface-400 hover:text-surface-900 dark:hover:text-surface-100'"
                @click="activeTab = 'assigned'"
              >
                Assigned / Mandatory ({{ assignedCourses.length }})
              </button>
              <button 
                class="px-4 py-2 text-xs font-bold rounded-lg transition-all border-none bg-transparent cursor-pointer"
                :class="activeTab === 'elective' ? 'bg-surface-0 dark:bg-surface-700 text-primary-500 shadow-sm' : 'text-surface-500 dark:text-surface-400 hover:text-surface-900 dark:hover:text-surface-100'"
                @click="activeTab = 'elective'"
              >
                Self-Study / Elective ({{ electiveCourses.length }})
              </button>
            </div>

            <!-- Filters & Local search indicator -->
            <div class="flex flex-wrap items-center gap-2 w-full sm:w-auto">
              <!-- Category Filter Dropdown -->
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
              
              <!-- Search display badge -->
              <span v-if="searchQuery" class="px-2.5 py-1.5 text-xs bg-primary-500/10 text-primary-500 rounded-xl border border-primary-500/20 flex items-center gap-1.5">
                <span>"{{ searchQuery }}"</span>
                <i class="pi pi-times text-[9px] cursor-pointer hover:scale-120" @click="searchQuery = ''"></i>
              </span>
            </div>
          </div>

          <!-- Courses Grid -->
          <div v-if="filteredCourses.length > 0" class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div 
              v-for="course in filteredCourses" 
              :key="course.id"
              class="bg-surface-0 dark:bg-surface-800 border border-surface-200 dark:border-surface-700 rounded-2xl shadow-sm hover:shadow-md hover:border-primary-300 dark:hover:border-primary-750 transition-all duration-300 overflow-hidden flex flex-col group"
            >
              <!-- Course Card Thumbnail -->
              <div class="h-28 relative overflow-hidden shrink-0" :class="course.thumbnail">
                <div class="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors"></div>
                <!-- Gradient Overlay Pattern -->
                <div class="absolute inset-0 bg-radial-gradient from-transparent to-black/30 pointer-events-none"></div>
                <div class="absolute top-3 left-3">
                  <span class="px-2.5 py-1 text-[9px] font-extrabold uppercase tracking-wider rounded-full bg-white/95 text-surface-800 shadow-sm border border-white/20">
                    {{ course.category }}
                  </span>
                </div>
                <!-- Deadline/Required indicator -->
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
                  <div class="flex items-center gap-1.5 text-xs text-surface-400 dark:text-surface-500">
                    <i class="pi pi-user text-[10px]"></i>
                    <span class="truncate">{{ course.instructor }}</span>
                  </div>
                </div>

                <!-- Progress Details -->
                <div class="space-y-2">
                  <!-- Progress bar for started courses -->
                  <div v-if="course.status !== 'Not Enrolled' && course.status !== 'Not Started'" class="space-y-1">
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
                  
                  <!-- Status tags for static states -->
                  <div v-else class="flex items-center gap-1.5 text-[11px] font-semibold">
                    <span class="w-2 h-2 rounded-full" :class="course.status === 'Not Enrolled' ? 'bg-surface-300 dark:bg-surface-600' : 'bg-amber-400'"></span>
                    <span class="text-surface-400">{{ course.status }}</span>
                  </div>
                  
                  <!-- Target Deadline -->
                  <div v-if="course.required && course.status !== 'Completed' && course.deadline" class="text-[10px] text-red-400 flex items-center gap-1">
                    <i class="pi pi-calendar-times"></i>
                    <span>Due by: {{ course.deadline }}</span>
                  </div>
                  <div v-else-if="course.status === 'Completed'" class="text-[10px] text-green-500 flex items-center gap-1 font-semibold">
                    <i class="pi pi-check-circle"></i>
                    <span>Completed!</span>
                  </div>
                </div>

                <!-- Actions -->
                <div class="pt-2 border-t border-surface-100 dark:border-surface-700/50 flex justify-between items-center gap-2">
                  <span class="text-[10px] text-surface-400 dark:text-surface-500">
                    <span v-if="course.hoursSpent > 0"><i class="pi pi-clock mr-1 text-[8px]"></i>{{ course.hoursSpent.toFixed(1) }} hrs</span>
                    <span v-else>No study log</span>
                  </span>
                  
                  <!-- Button triggers based on status -->
                  <Button 
                    v-if="course.status === 'Not Enrolled'"
                    label="Enroll" 
                    icon="pi pi-plus" 
                    size="small" 
                    class="text-xs" 
                    outlined
                    @click="enrollCourse(course)"
                  />
                  <Button 
                    v-else-if="course.status === 'Not Started'"
                    label="Start" 
                    icon="pi pi-play" 
                    size="small" 
                    class="text-xs"
                    @click="studyAction(course)"
                  />
                  <Button 
                    v-else-if="course.status === 'In Progress'"
                    label="Continue" 
                    icon="pi pi-angle-double-right" 
                    size="small" 
                    severity="primary"
                    class="text-xs"
                    @click="studyAction(course)"
                  />
                  <Button 
                    v-else-if="course.status === 'Completed'"
                    label="Review" 
                    icon="pi pi-undo" 
                    size="small" 
                    severity="success" 
                    outlined
                    class="text-xs"
                    @click="studyAction(course)"
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
            <Button label="Reset Filters" icon="pi pi-filter-slash" text size="small" @click="resetFilters" />
          </div>
        </div>

      </div>

      <!-- Right Column (Sidebar timeline & training calendar) -->
      <div class="space-y-6">

        <!-- 4. Learning Pathway & Targets Timeline -->
        <Card class="border border-surface-200 dark:border-surface-700 shadow-sm">
          <template #title>
            <div class="flex items-center gap-2 px-2 py-1">
              <div class="w-2 h-5 bg-primary-500 rounded-sm"></div>
              <span class="text-sm font-bold text-surface-850 dark:text-surface-0 uppercase tracking-wider block">Learning Plan</span>
            </div>
          </template>
          <template #content>
            <div class="space-y-4 bg-surface-0 dark:bg-surface-800">
              <!-- Weekly Goal Indicator -->
              <div class="p-3 bg-primary-500/5 dark:bg-primary-500/10 border border-primary-500/20 rounded-xl space-y-2">
                <div class="flex justify-between items-center text-xs">
                  <span class="font-bold text-surface-800 dark:text-surface-250">Weekly Study Target</span>
                  <span class="font-extrabold text-primary-500">6.2 / 8.0 hrs</span>
                </div>
                <div class="w-full bg-surface-100 dark:bg-surface-700 h-2 rounded-full overflow-hidden">
                  <div class="bg-gradient-to-r from-primary-500 to-indigo-500 h-full rounded-full transition-all duration-500" :style="{ width: (parseFloat(totalHours) > 8 ? 100 : (parseFloat(totalHours) / 8) * 100) + '%' }"></div>
                </div>
                <p class="text-[10px] text-surface-400 dark:text-surface-500">
                  Earn 200 bonus XP upon reaching your weekly goal. Target resets in 4 days.
                </p>
              </div>

              <!-- Pathway Timeline Nodes -->
              <div class="relative pl-6 space-y-5 before:content-[''] before:absolute before:left-2 before:top-2 before:bottom-2 before:w-[2px] before:bg-surface-200 dark:before:bg-surface-700">
                <!-- Node 1: Completed -->
                <div class="relative space-y-1">
                  <!-- Bullet -->
                  <div class="absolute -left-[22px] top-1 w-[10px] h-[10px] rounded-full border-2 border-surface-0 dark:border-surface-800 bg-green-500 z-10"></div>
                  <div class="flex items-center justify-between">
                    <span class="text-[11px] font-bold text-green-500">Completed Milestone</span>
                    <span class="text-[9px] text-surface-400">Aug 15</span>
                  </div>
                  <h5 class="text-xs font-bold text-surface-800 dark:text-surface-200">Corporate Code of Conduct</h5>
                  <p class="text-[10px] text-surface-400 dark:text-surface-500">Finished compliant verification and training test.</p>
                </div>

                <!-- Node 2: Next Deadline -->
                <div class="relative space-y-1">
                  <!-- Bullet -->
                  <div class="absolute -left-[22px] top-1 w-[10px] h-[10px] rounded-full border-2 border-surface-0 dark:border-surface-800 bg-amber-400 z-10"></div>
                  <div class="flex items-center justify-between">
                    <span class="text-[11px] font-bold text-amber-500">Upcoming Goal Target</span>
                    <span class="text-[9px] text-red-400 font-semibold">Aug 30</span>
                  </div>
                  <h5 class="text-xs font-bold text-surface-800 dark:text-surface-200">Vue 3 Composition API</h5>
                  <p class="text-[10px] text-surface-400 dark:text-surface-500">Mandatory path target. Current progress: 80%.</p>
                </div>

                <!-- Node 3: Compliance Milestone -->
                <div class="relative space-y-1">
                  <!-- Bullet -->
                  <div class="absolute -left-[22px] top-1 w-[10px] h-[10px] rounded-full border-2 border-surface-0 dark:border-surface-800 bg-red-500 z-10 animate-ping"></div>
                  <div class="absolute -left-[22px] top-1 w-[10px] h-[10px] rounded-full border-2 border-surface-0 dark:border-surface-800 bg-red-500 z-10"></div>
                  <div class="flex items-center justify-between">
                    <span class="text-[11px] font-bold text-red-500">Hard Compliance Deadline</span>
                    <span class="text-[9px] text-surface-400">Sep 05</span>
                  </div>
                  <h5 class="text-xs font-bold text-surface-800 dark:text-surface-200">Information Security & Privacy</h5>
                  <p class="text-[10px] text-surface-400 dark:text-surface-500">Critical privacy security training session. Hard stop lock if not finished.</p>
                </div>
              </div>
            </div>
          </template>
        </Card>

        <!-- 5. Training Calendar Widget -->
        <Card class="border border-surface-200 dark:border-surface-700 shadow-sm">
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
            <div class="space-y-4 bg-surface-0 dark:bg-surface-800">
              <!-- Event List -->
              <div class="flex flex-col gap-3">
                <div 
                  v-for="event in calendarEvents" 
                  :key="event.id"
                  class="p-3 border border-surface-200 dark:border-surface-700/60 rounded-xl hover:bg-surface-50 dark:hover:bg-surface-800/40 transition-all duration-200 flex gap-3 group relative overflow-hidden"
                >
                  <!-- Left: Date Box -->
                  <div class="w-12 h-14 bg-surface-100 dark:bg-surface-800 rounded-lg flex flex-col items-center justify-center border border-surface-200/50 dark:border-surface-700/50 shrink-0 text-center">
                    <span class="text-[10px] font-bold text-surface-450 dark:text-surface-500 uppercase">{{ event.date.split(',')[0].split(' ')[0] }}</span>
                    <span class="text-lg font-extrabold text-surface-800 dark:text-surface-100 leading-none mt-0.5">{{ event.date.split(',')[0].split(' ')[1] }}</span>
                  </div>

                  <!-- Right: Event Info -->
                  <div class="flex-1 min-w-0 space-y-1">
                    <div class="flex justify-between items-start gap-1">
                      <h5 class="text-xs font-bold text-surface-850 dark:text-surface-200 truncate leading-snug group-hover:text-primary-500 transition-colors">
                        {{ event.title }}
                      </h5>
                    </div>
                    
                    <p class="text-[10px] text-surface-450 dark:text-surface-500 flex items-center gap-1 font-medium">
                      <i class="pi pi-clock text-[9px]"></i> {{ event.time }}
                    </p>
                    <p class="text-[10px] text-surface-400 dark:text-surface-550 flex items-center gap-1 truncate">
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
                          @click="rsvpConfirm(event)"
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

      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { Card, Button, Tag } from 'primevue';
import { useAuthStore } from '../stores/auth';

const authStore = useAuthStore();

// Custom Toast States
const toasts = ref([]);
function addToast(message, severity = 'success') {
  const id = Date.now();
  toasts.value.push({ id, message, severity });
  // Auto remove after 3.5s
  setTimeout(() => {
    removeToast(id);
  }, 3500);
}
function removeToast(id) {
  toasts.value = toasts.value.filter(t => t.id !== id);
}

// Stats & Motivational States
const streakDays = ref(12);
const totalXP = ref(2450);
const hoursAddedThisSession = ref(0.0);

function incrementStreak() {
  streakDays.value++;
  totalXP.value += 100;
  addToast('Daily Streak extended! +100 XP earned 🔥', 'success');
}

// Course Matrix mock data
const courses = ref([
  {
    id: 1,
    title: 'Information Security & Privacy Compliance 2026',
    instructor: 'Security Compliance Team',
    thumbnail: 'bg-gradient-to-br from-red-500 to-rose-600',
    thumbnailIcon: 'pi pi-shield',
    category: 'Compliance',
    required: true,
    progress: 40,
    status: 'In Progress',
    hoursSpent: 2.5,
    deadline: '2026-09-05',
  },
  {
    id: 2,
    title: 'Introduction to Vue 3 Composition API & Pinia',
    instructor: 'Alex Rivera (Senior Web Developer)',
    thumbnail: 'bg-gradient-to-br from-emerald-400 to-teal-600',
    thumbnailIcon: 'pi pi-code',
    category: 'Development',
    required: true,
    progress: 80,
    status: 'In Progress',
    hoursSpent: 8.2,
    deadline: '2026-08-30',
  },
  {
    id: 3,
    title: 'LSE Corporation Code of Conduct',
    instructor: 'HR Operations Group',
    thumbnail: 'bg-gradient-to-br from-blue-500 to-indigo-600',
    thumbnailIcon: 'pi pi-id-card',
    category: 'Compliance',
    required: true,
    progress: 100,
    status: 'Completed',
    hoursSpent: 2.0,
    deadline: '2026-08-15',
  },
  {
    id: 4,
    title: 'Advanced Web Accessibility (WCAG 2.2)',
    instructor: 'Sarah Jenkins (UX Specialist)',
    thumbnail: 'bg-gradient-to-br from-amber-400 to-orange-600',
    thumbnailIcon: 'pi pi-eye',
    category: 'Design',
    required: true,
    progress: 0,
    status: 'Not Started',
    hoursSpent: 0,
    deadline: '2026-09-15',
  },
  {
    id: 5,
    title: 'Agile Project Management Fundamentals',
    instructor: 'Marcus Vance (Agile Coach)',
    thumbnail: 'bg-gradient-to-br from-purple-500 to-indigo-650',
    thumbnailIcon: 'pi pi-sliders-h',
    category: 'Management',
    required: true,
    progress: 0,
    status: 'Not Started',
    hoursSpent: 0,
    deadline: '2026-09-20',
  },
  // Optional / Elective Courses
  {
    id: 6,
    title: 'Figma Prototyping & Design Systems',
    instructor: 'Sarah Jenkins (UX Specialist)',
    thumbnail: 'bg-gradient-to-br from-fuchsia-500 to-purple-600',
    thumbnailIcon: 'pi pi-palette',
    category: 'Design',
    required: false,
    progress: 0,
    status: 'Not Enrolled',
    hoursSpent: 0,
  },
  {
    id: 7,
    title: 'Node.js Microservices Architecture',
    instructor: 'Dave Miller (Backend Lead)',
    thumbnail: 'bg-gradient-to-br from-cyan-400 to-blue-650',
    thumbnailIcon: 'pi pi-server',
    category: 'Development',
    required: false,
    progress: 15,
    status: 'In Progress',
    hoursSpent: 3.5,
  },
  {
    id: 8,
    title: 'Public Speaking & Executive Presence',
    instructor: 'Elena Rostova (Communication Coach)',
    thumbnail: 'bg-gradient-to-br from-yellow-400 to-amber-600',
    thumbnailIcon: 'pi pi-volume-up',
    category: 'Soft Skills',
    required: false,
    progress: 100,
    status: 'Completed',
    hoursSpent: 6.0,
  },
  {
    id: 9,
    title: 'Introduction to Generative AI & Prompt Engineering',
    instructor: 'AI Research Group',
    thumbnail: 'bg-gradient-to-br from-violet-500 to-purple-800',
    thumbnailIcon: 'pi pi-sparkles',
    category: 'Development',
    required: false,
    progress: 0,
    status: 'Not Enrolled',
    hoursSpent: 0,
  }
]);

// Training Calendar mock data
const calendarEvents = ref([
  {
    id: 1,
    title: 'UI/UX Design Alignment Workshop',
    type: 'Offline Session',
    date: 'Aug 27, 2026',
    time: '13:00 - 15:00',
    location: 'Conference Room B (Building 3)',
    instructor: 'Sarah Jenkins',
    status: 'Pending',
  },
  {
    id: 2,
    title: 'Vue 3 Composition API & Pinia Q&A',
    type: 'Live Stream',
    date: 'Aug 29, 2026',
    time: '10:00 - 11:30',
    location: 'Microsoft Teams Call Link',
    instructor: 'Alex Rivera',
    status: 'Confirmed',
  },
  {
    id: 3,
    title: 'Fire Safety & First Aid Training',
    type: 'Offline Session',
    date: 'Sep 01, 2026',
    time: '09:00 - 12:00',
    location: 'Main Auditorium (Building 1)',
    instructor: 'HR Operations Group',
    status: 'Pending',
  },
  {
    id: 4,
    title: 'Security Compliance Briefing',
    type: 'Offline Session',
    date: 'Aug 25, 2026',
    time: '14:00 - 15:30',
    location: 'Conference Room A (Building 2)',
    instructor: 'Compliance Security Team',
    status: 'Attended',
  }
]);

// Filters State
const activeTab = ref('assigned');
const categoryFilter = ref('All');
const statusFilter = ref('All');
const searchQuery = ref('');

// Computed values linked to the course list
const totalHours = computed(() => {
  return courses.value.reduce((sum, c) => sum + c.hoursSpent, 0).toFixed(1);
});

const assignedCourses = computed(() => {
  return courses.value.filter(c => c.required);
});

const electiveCourses = computed(() => {
  return courses.value.filter(c => !c.required);
});

const statsRequired = computed(() => {
  return assignedCourses.value.filter(c => c.status !== 'Completed').length;
});

const statsInProgress = computed(() => {
  return courses.value.filter(c => c.status === 'In Progress').length;
});

const statsCompleted = computed(() => {
  return courses.value.filter(c => c.status === 'Completed').length;
});

// Calculate Overall Progress strictly from assigned mandatory courses
const overallProgress = computed(() => {
  const assigned = assignedCourses.value;
  if (assigned.length === 0) return 0;
  const sum = assigned.reduce((sum, c) => sum + c.progress, 0);
  return Math.round(sum / assigned.length);
});

// Dynamic course filtering list based on Tab, Category, Status metric click and Search
const filteredCourses = computed(() => {
  return courses.value.filter(c => {
    // 1. Tab check
    const tabMatch = activeTab.value === 'assigned' ? c.required : !c.required;
    if (!tabMatch) return false;

    // 2. Category Filter
    if (categoryFilter.value !== 'All' && c.category !== categoryFilter.value) {
      return false;
    }

    // 3. Status Filter (triggered by KPI breakdown clicks)
    if (statusFilter.value !== 'All') {
      if (statusFilter.value === 'Required') {
        if (!c.required || c.status === 'Completed') return false;
      } else if (c.status !== statusFilter.value) {
        return false;
      }
    }

    // 4. Search Filter
    if (searchQuery.value.trim() !== '') {
      const q = searchQuery.value.toLowerCase();
      const titleMatch = c.title.toLowerCase().includes(q);
      const instructorMatch = c.instructor.toLowerCase().includes(q);
      const catMatch = c.category.toLowerCase().includes(q);
      if (!titleMatch && !instructorMatch && !catMatch) return false;
    }

    return true;
  });
});

// Interactive state functions
function toggleStatusFilter(status) {
  if (statusFilter.value === status) {
    statusFilter.value = 'All'; // Toggle off
  } else {
    statusFilter.value = status;
    addToast(`Filtering by course status: ${status}`, 'info');
  }
}

function enrollCourse(course) {
  course.status = 'In Progress';
  course.progress = 0;
  totalXP.value += 150;
  addToast(`Enrolled in "${course.title}" successfully! +150 XP`, 'success');
}

function studyAction(course) {
  if (course.status === 'Not Started') {
    course.status = 'In Progress';
    course.progress = 20;
    course.hoursSpent += 0.5;
    hoursAddedThisSession.value += 0.5;
    totalXP.value += 100;
    addToast(`Started learning "${course.title}"! +100 XP`, 'success');
  } else if (course.status === 'In Progress') {
    if (course.progress < 100) {
      course.progress += 20;
      course.hoursSpent += 1.0;
      hoursAddedThisSession.value += 1.0;
      totalXP.value += 100;
      
      if (course.progress >= 100) {
        course.progress = 100;
        course.status = 'Completed';
        totalXP.value += 300;
        addToast(`Congratulations! Completed "${course.title}"! +300 XP 🎉`, 'success');
      } else {
        addToast(`Studied "${course.title}"! Progress is now ${course.progress}%. +100 XP`, 'success');
      }
    }
  } else if (course.status === 'Completed') {
    // Review completed course
    course.hoursSpent += 0.5;
    hoursAddedThisSession.value += 0.5;
    totalXP.value += 50;
    addToast(`Reviewed completed course "${course.title}". +50 XP`, 'success');
  }
}

function rsvpConfirm(event) {
  event.status = 'Confirmed';
  totalXP.value += 100;
  addToast(`RSVP Confirmed for "${event.title}"! Added to calendar. +100 XP`, 'success');
}

// Global "Simulate Study" helper which advances progress on the first active course
function simulateStudySession() {
  const activeCourse = courses.value.find(c => c.status === 'In Progress');
  if (activeCourse) {
    studyAction(activeCourse);
  } else {
    // If no course is active, start the first non-completed required course
    const unstarted = courses.value.find(c => c.required && c.status === 'Not Started');
    if (unstarted) {
      studyAction(unstarted);
    } else {
      addToast('All required courses are completed! Enroll in self-study courses below.', 'warn');
    }
  }
}

function resetProgress() {
  // Restore initial mock progress
  courses.value.forEach(c => {
    if (c.id === 1) { c.status = 'In Progress'; c.progress = 40; c.hoursSpent = 2.5; }
    else if (c.id === 2) { c.status = 'In Progress'; c.progress = 80; c.hoursSpent = 8.2; }
    else if (c.id === 3) { c.status = 'Completed'; c.progress = 100; c.hoursSpent = 2.0; }
    else if (c.id === 4) { c.status = 'Not Started'; c.progress = 0; c.hoursSpent = 0.0; }
    else if (c.id === 5) { c.status = 'Not Started'; c.progress = 0; c.hoursSpent = 0.0; }
    else if (c.id === 6) { c.status = 'Not Enrolled'; c.progress = 0; c.hoursSpent = 0.0; }
    else if (c.id === 7) { c.status = 'In Progress'; c.progress = 15; c.hoursSpent = 3.5; }
    else if (c.id === 8) { c.status = 'Completed'; c.progress = 100; c.hoursSpent = 6.0; }
    else if (c.id === 9) { c.status = 'Not Enrolled'; c.progress = 0; c.hoursSpent = 0.0; }
  });

  calendarEvents.value.forEach(e => {
    if (e.id === 1) e.status = 'Pending';
    else if (e.id === 2) e.status = 'Confirmed';
    else if (e.id === 3) e.status = 'Pending';
    else if (e.id === 4) e.status = 'Attended';
  });

  streakDays.value = 12;
  totalXP.value = 2450;
  hoursAddedThisSession.value = 0.0;
  statusFilter.value = 'All';
  categoryFilter.value = 'All';
  searchQuery.value = '';

  addToast('Dashboard simulator progress reset to default state.', 'info');
}

// Reset filters helper
function resetFilters() {
  searchQuery.value = '';
  categoryFilter.value = 'All';
  statusFilter.value = 'All';
  addToast('Filters reset.', 'info');
}

// Global search handler matching top bar
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
/* Custom Transition Animations for Toast List */
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
