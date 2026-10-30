<route>
{
  meta: {
    title: "User Permission",
    icon: "pi pi-shield",
    permission: ['HR_LMS_UA'],
  }
}
</route>

<template>
  <div class="space-y-6 pb-16">
    <!-- 1. Floating Toast Feedback System -->
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
            'bg-red-500/10 border-red-500/30 text-red-700 dark:text-red-300': toast.severity === 'error',
          }"
        >
          <div class="w-8 h-8 rounded-full flex items-center justify-center shrink-0 shadow-sm" :class="{
            'bg-green-500/20 text-green-600 dark:text-green-300': toast.severity === 'success',
            'bg-blue-500/20 text-blue-600 dark:text-blue-300': toast.severity === 'info',
            'bg-amber-500/20 text-amber-600 dark:text-amber-300': toast.severity === 'warn',
            'bg-red-500/20 text-red-600 dark:text-red-300': toast.severity === 'error',
          }">
            <i class="pi text-sm" :class="{
              'pi-check': toast.severity === 'success',
              'pi-info': toast.severity === 'info',
              'pi-exclamation-triangle': toast.severity === 'warn',
              'pi-times-circle': toast.severity === 'error',
            }"></i>
          </div>
          <div class="flex-1 min-w-0">
            <p class="text-xs font-bold leading-tight">{{ toast.title || 'Notification' }}</p>
            <p class="text-[11px] opacity-90 mt-0.5 leading-snug">{{ toast.message }}</p>
          </div>
          <button 
            @click="removeToast(toast.id)" 
            class="text-current opacity-60 hover:opacity-100 bg-transparent border-none cursor-pointer p-1 rounded-md hover:bg-black/5 dark:hover:bg-white/5"
          >
            <i class="pi pi-times text-xs"></i>
          </button>
        </div>
      </TransitionGroup>
    </div>

    <!-- 2. Page Header & Stats Banner -->
    <div class="bg-surface-0 dark:bg-surface-800 rounded-2xl border border-surface-200/80 dark:border-surface-700/80 p-6 shadow-sm">
      <div class="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div class="space-y-1.5">
          <div class="flex items-center gap-2">
            <span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-primary-50 dark:bg-primary-950/60 text-primary-600 dark:text-primary-400 border border-primary-200 dark:border-primary-800/50">
              <i class="pi pi-shield text-[10px]"></i>
              System Security & RBAC
            </span>
            <span v-if="hasUnsavedChanges" class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400 border border-amber-300 dark:border-amber-700 animate-pulse">
              <i class="pi pi-exclamation-circle text-[9px]"></i>
              Unsaved Changes
            </span>
          </div>
          <h1 class="text-2xl font-black text-surface-900 dark:text-surface-0 tracking-tight flex items-center gap-2.5">
            User Permission Management
          </h1>
          <p class="text-xs text-surface-500 dark:text-surface-400 max-w-2xl leading-relaxed">
            Grant or revoke granular system permissions, assign functional access rights, and apply role-based access templates across employees.
          </p>
        </div>

        <!-- Quick Summary Stats Chips -->
        <div class="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div class="px-4 py-3 bg-surface-50 dark:bg-surface-750/50 rounded-xl border border-surface-200/60 dark:border-surface-700/60">
            <span class="text-[10px] font-semibold text-surface-400 uppercase tracking-wider block">Total Users</span>
            <span class="text-xl font-black text-surface-900 dark:text-surface-0">{{ users.length }}</span>
          </div>
          <div class="px-4 py-3 bg-surface-50 dark:bg-surface-750/50 rounded-xl border border-surface-200/60 dark:border-surface-700/60">
            <span class="text-[10px] font-semibold text-surface-400 uppercase tracking-wider block">Available Codes</span>
            <span class="text-xl font-black text-primary-600 dark:text-primary-400">{{ catalogPermission.length }}</span>
          </div>
          <div class="px-4 py-3 bg-surface-50 dark:bg-surface-750/50 rounded-xl border border-surface-200/60 dark:border-surface-700/60">
            <span class="text-[10px] font-semibold text-surface-400 uppercase tracking-wider block">Active User</span>
            <span class="text-xl font-black text-emerald-600 dark:text-emerald-400 truncate block max-w-[140px]">
              {{ selectedUser?.displayName.split(' ').at(-1) || 'None' }}
            </span>
          </div>
          <div class="px-4 py-3 bg-surface-50 dark:bg-surface-750/50 rounded-xl border border-surface-200/60 dark:border-surface-700/60">
            <span class="text-[10px] font-semibold text-surface-400 uppercase tracking-wider block">Assigned Codes</span>
            <span class="text-xl font-black text-indigo-600 dark:text-indigo-400">
              {{ selectedPermissions.length }}
              <span class="text-xs font-normal text-surface-400">/{{ catalogPermission.length }}</span>
            </span>
          </div>
        </div>
      </div>
    </div>

    <!-- 3. Main Workspace Grid: Master-Detail Layout -->
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
      
      <!-- LEFT COLUMN: User Directory & Selector (4 Cols on LG) -->
      <div class="lg:col-span-4 space-y-4">
        
        <!-- User Selection Box -->
        <div class="bg-surface-0 dark:bg-surface-800 rounded-2xl border border-surface-200/80 dark:border-surface-700/80 shadow-sm overflow-hidden">
          <div class="p-4 border-b border-surface-200 dark:border-surface-700 flex items-center justify-between">
            <div class="flex items-center gap-2">
              <i class="pi pi-users text-primary-500 text-sm"></i>
              <h2 class="text-sm font-bold text-surface-900 dark:text-surface-0 m-0">Select Target User</h2>
            </div>
            <span class="text-[11px] font-medium text-surface-400 bg-surface-100 dark:bg-surface-700 px-2 py-0.5 rounded-full">
              {{ filteredUsers.length }} users
            </span>
          </div>

          <!-- Quick Dropdown (Mobile / Rapid Access) -->
          <div class="p-4 pb-2 bg-surface-50/50 dark:bg-surface-850/50 border-b border-surface-200/60 dark:border-surface-700/60">
            <label class="block text-[11px] font-bold text-surface-500 uppercase tracking-wider mb-1.5">
              Quick Searchable Selector
            </label>
            <div class="relative">
              <Select 
                v-model="selectedUserId" 
                :options="users" 
                optionLabel="displayName" 
                optionValue="userId" 
                filter 
                placeholder="Choose or search user..." 
                class="w-full text-xs"
                @change="handleUserChange"
              >
                <template #value="slotProps">
                  <div v-if="slotProps.value" class="flex items-center gap-2">
                    <span class="w-6 h-6 rounded-full bg-primary-100 dark:bg-primary-900 text-primary-600 dark:text-primary-300 flex items-center justify-center font-bold text-[10px]">
                      {{ getUserInitials(users.find(u => u.userId === slotProps.value)?.displayName) }}
                    </span>
                    <span class="font-medium text-xs">{{ users.find(u => u.userId === slotProps.value)?.displayName }}</span>
                    <span class="text-[10px] text-surface-400">({{ users.find(u => u.userId === slotProps.value)?.department }})</span>
                  </div>
                  <span v-else class="text-surface-400 text-xs">{{ slotProps.placeholder }}</span>
                </template>
                <template #option="slotProps">
                  <div class="flex items-center justify-between w-full py-1">
                    <div class="flex items-center gap-2">
                      <span class="w-6 h-6 rounded-full bg-primary-100 dark:bg-primary-900 text-primary-600 dark:text-primary-300 flex items-center justify-center font-bold text-[10px]">
                        {{ getUserInitials(slotProps.option.displayName) }}
                      </span>
                      <div>
                        <p class="text-xs font-semibold m-0 leading-tight text-surface-800 dark:text-surface-100">{{ slotProps.option.displayName }}</p>
                        <p class="text-[10px] text-surface-400 m-0">{{ slotProps.option.department }} • {{ slotProps.option.employeeId }}</p>
                      </div>
                    </div>
                    <span class="text-[10px] font-bold px-1.5 py-0.5 rounded bg-surface-100 dark:bg-surface-700 text-surface-600 dark:text-surface-300">
                      {{ slotProps.option.userConfig?.length || 0 }} codes
                    </span>
                  </div>
                </template>
              </Select>
            </div>
          </div>

          <!-- User Directory List Filter -->
          <div class="p-3 border-b border-surface-200/60 dark:border-surface-700/60 space-y-2">
            <!-- Search input -->
            <div class="relative">
              <i class="pi pi-search absolute left-3 top-1/2 -translate-y-1/2 text-surface-400 text-xs"></i>
              <input 
                v-model="userSearchQuery" 
                type="text" 
                placeholder="Filter by name, ID, or email..." 
                class="w-full pl-8 pr-3 py-1.5 text-xs bg-surface-50 dark:bg-surface-750 border border-surface-200 dark:border-surface-700 rounded-lg focus:outline-none focus:ring-1 focus:ring-primary-500 placeholder:text-surface-400 text-surface-800 dark:text-surface-100"
              />
            </div>

            <!-- Department Filter Chips -->
            <div class="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-[11px]">
              <button 
                v-for="dept in departments" 
                :key="dept"
                @click="selectedDepartment = dept"
                class="px-2.5 py-1 rounded-md font-semibold shrink-0 transition-colors border cursor-pointer text-[10px]"
                :class="selectedDepartment === dept 
                  ? 'bg-primary-500 text-white border-primary-500 shadow-xs' 
                  : 'bg-surface-100 dark:bg-surface-700 text-surface-600 dark:text-surface-300 border-transparent hover:bg-surface-200 dark:hover:bg-surface-650'"
              >
                {{ dept }}
              </button>
            </div>
          </div>

          <!-- Scrollable User Cards List -->
          <div class="max-h-[420px] overflow-y-auto divide-y divide-surface-100 dark:divide-surface-700/50 p-1">
            <div v-if="isLoading" class="p-8 text-center text-surface-400">
              <i class="pi pi-spin pi-spinner text-xl mb-2 block"></i>
              <p class="text-xs font-medium">Loading users...</p>
            </div>
            <div v-else-if="errorMessage" class="p-4 text-center text-red-500">
              <p class="text-xs font-medium">{{ errorMessage }}</p>
            </div>
            <div 
              v-else
              v-for="u in filteredUsers" 
              :key="u.userId"
              @click="switchUser(u.userId)"
              class="p-3 rounded-xl cursor-pointer transition-all duration-200 flex items-center justify-between gap-3 group"
              :class="selectedUserId === u.userId 
                ? 'bg-primary-500/10 dark:bg-primary-500/15 border border-primary-500/30 dark:border-primary-500/40 shadow-xs' 
                : 'hover:bg-surface-50 dark:hover:bg-surface-750/70 border border-transparent'"
            >
              <div class="flex items-center gap-3 min-w-0">
                <!-- Avatar -->
                <div class="relative shrink-0">
                  <div 
                    class="w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs shadow-xs"
                    :class="selectedUserId === u.userId 
                      ? 'bg-primary-500 text-white shadow-primary-500/30' 
                      : 'bg-surface-100 dark:bg-surface-700 text-surface-700 dark:text-surface-200'"
                  >
                    {{ getUserInitials(u.displayName) }}
                  </div>
                  <span 
                    class="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border-2 border-surface-0 dark:border-surface-800"
                    :class="u.status === 'active' ? 'bg-emerald-500' : 'bg-surface-400'"
                  ></span>
                </div>

                <!-- Text info -->
                <div class="min-w-0 flex-1">
                  <div class="flex items-center gap-1.5">
                    <p class="text-xs font-bold text-surface-900 dark:text-surface-0 truncate leading-snug">
                      {{ u.displayName }}
                    </p>
                    <span 
                      v-if="userHasPendingModifications(u.userId)" 
                      class="w-2 h-2 rounded-full bg-amber-500 shrink-0" 
                      title="Pending unsaved changes"
                    ></span>
                  </div>
                  <p class="text-[10px] text-surface-400 dark:text-surface-400 truncate">
                    {{ u.roleTitle }} • {{ u.department }}
                  </p>
                  <p class="text-[9px] text-surface-400 dark:text-surface-500 font-mono">
                    ID: {{ u.employeeId }}
                  </p>
                </div>
              </div>

              <!-- Permission count pill -->
              <div class="text-right shrink-0">
                <span 
                  class="px-2 py-0.5 rounded-full text-[10px] font-bold"
                  :class="selectedUserId === u.userId 
                    ? 'bg-primary-500 text-white' 
                    : 'bg-surface-100 dark:bg-surface-700 text-surface-600 dark:text-surface-300'"
                >
                  {{ (u.userId === selectedUserId ? selectedPermissions.length : (u.userConfig?.length || 0)) }} codes
                </span>
              </div>
            </div>

            <!-- Empty User List State -->
            <div v-if="!isLoading && !errorMessage && filteredUsers.length === 0" class="p-8 text-center text-surface-400">
              <i class="pi pi-user-times text-2xl mb-2 opacity-50 block"></i>
              <p class="text-xs font-medium">No users match your filter criteria.</p>
            </div>
          </div>
        </div>

        <!-- Selected User Profile Card -->
        <div v-if="selectedUser" class="bg-surface-0 dark:bg-surface-800 rounded-2xl border border-surface-200/80 dark:border-surface-700/80 p-4 shadow-sm space-y-3">
          <div class="flex items-center justify-between border-b border-surface-100 dark:border-surface-700 pb-2.5">
            <span class="text-[11px] font-bold uppercase tracking-wider text-surface-400">Profile Details</span>
            <span 
              class="px-2 py-0.5 text-[9px] font-extrabold uppercase rounded-full"
              :class="selectedUser.status === 'active' 
                ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400' 
                : 'bg-surface-100 text-surface-600 dark:bg-surface-700 dark:text-surface-400'"
            >
              {{ selectedUser.status }}
            </span>
          </div>

          <div class="flex items-center gap-3">
            <div class="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-500 to-indigo-600 text-white flex items-center justify-center font-bold text-base shadow-md shadow-primary-500/20">
              {{ getUserInitials(selectedUser.displayName) }}
            </div>
            <div class="min-w-0 flex-1">
              <h3 class="text-sm font-extrabold text-surface-900 dark:text-surface-0 truncate leading-snug">
                {{ selectedUser.displayName }}
              </h3>
              <p class="text-xs text-surface-500 dark:text-surface-400 truncate">
                {{ selectedUser.email }}
              </p>
              <div class="flex items-center gap-1.5 mt-1">
                <span class="px-1.5 py-0.5 text-[9px] font-bold bg-surface-100 dark:bg-surface-700 text-surface-700 dark:text-surface-300 rounded font-mono">
                  {{ selectedUser.userId }}
                </span>
                <span class="text-[10px] text-surface-400">• {{ selectedUser.department }}</span>
              </div>
            </div>
          </div>

          <!-- Attributes Grid -->
          <div class="grid grid-cols-2 gap-2 text-xs pt-1">
            <div class="p-2 bg-surface-50 dark:bg-surface-750 rounded-lg">
              <span class="text-[9px] uppercase tracking-wider text-surface-400 font-semibold block">Employee ID</span>
              <span class="font-mono text-surface-800 dark:text-surface-200 font-bold text-[11px]">{{ selectedUser.employeeId }}</span>
            </div>
          </div>
        </div>

      </div>

      <!-- RIGHT COLUMN: Permissions Granting Matrix (8 Cols on LG) -->
      <div class="lg:col-span-8 space-y-4">
        
        <!-- Role Presets Fast-Action Ribbon -->
        <div class="bg-surface-0 dark:bg-surface-800 rounded-2xl border border-surface-200/80 dark:border-surface-700/80 p-4 shadow-sm space-y-2.5">
          <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div class="flex items-center gap-2">
              <i class="pi pi-bolt text-amber-500 text-sm"></i>
              <h2 class="text-xs font-extrabold uppercase tracking-wider text-surface-700 dark:text-surface-300 m-0">
                Quick Role Presets
              </h2>
            </div>
            <span class="text-[11px] text-surface-400">
              One-click standard templates for fast administrator configuration
            </span>
          </div>

          <div class="flex flex-wrap gap-2">
            <button 
              v-for="preset in presetRole" 
              :key="preset.id"
              @click="applyRolePreset(preset)"
              class="px-3 py-1.5 rounded-xl text-xs font-bold border transition-all duration-200 flex items-center gap-1.5 cursor-pointer hover:scale-102 active:scale-98"
              :class="preset.buttonStyle"
            >
              <i :class="preset.icon" class="text-xs"></i>
              <span>{{ preset.label }}</span>
              <span class="text-[9px] opacity-75 font-mono">({{ preset.codes.length }})</span>
            </button>
          </div>
        </div>

        <!-- Permission Search & Filter Toolbar -->
        <div class="bg-surface-0 dark:bg-surface-800 rounded-2xl border border-surface-200/80 dark:border-surface-700/80 p-4 shadow-sm space-y-3">
          
          <div class="flex flex-col md:flex-row md:items-center justify-between gap-3">
            <!-- Search bar -->
            <div class="relative flex-1">
              <i class="pi pi-search absolute left-3 top-1/2 -translate-y-1/2 text-surface-400 text-xs"></i>
              <input 
                v-model="permissionSearchQuery" 
                type="text" 
                placeholder="Search permission by code, name, or description (e.g. Read Courses, Edit Courses)..." 
                class="w-full pl-9 pr-8 py-2 text-xs bg-surface-50 dark:bg-surface-750 border border-surface-200 dark:border-surface-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 placeholder:text-surface-400 text-surface-800 dark:text-surface-100"
              />
              <button 
                v-if="permissionSearchQuery" 
                @click="permissionSearchQuery = ''"
                class="absolute right-2.5 top-1/2 -translate-y-1/2 text-surface-400 hover:text-surface-600 dark:hover:text-surface-200 border-none bg-transparent cursor-pointer p-0"
              >
                <i class="pi pi-times-circle text-xs"></i>
              </button>
            </div>

            <!-- Scope filter selector (All / Assigned / Unassigned) -->
            <div class="flex items-center gap-1 bg-surface-100 dark:bg-surface-750 p-1 rounded-xl shrink-0">
              <button 
                class="px-2.5 py-1 text-xs font-bold rounded-lg transition-all border-none bg-transparent cursor-pointer"
                :class="scopeFilter === 'all' ? 'bg-surface-0 dark:bg-surface-700 text-primary-500 shadow-xs' : 'text-surface-500 hover:text-surface-900 dark:text-surface-400 dark:hover:text-surface-100'"
                @click="scopeFilter = 'all'"
              >
                All ({{ catalogPermission.length }})
              </button>
              <button 
                class="px-2.5 py-1 text-xs font-bold rounded-lg transition-all border-none bg-transparent cursor-pointer"
                :class="scopeFilter === 'assigned' ? 'bg-surface-0 dark:bg-surface-700 text-emerald-600 dark:text-emerald-400 shadow-xs' : 'text-surface-500 hover:text-surface-900 dark:text-surface-400 dark:hover:text-surface-100'"
                @click="scopeFilter = 'assigned'"
              >
                Granted ({{ selectedPermissions.length }})
              </button>
              <button 
                class="px-2.5 py-1 text-xs font-bold rounded-lg transition-all border-none bg-transparent cursor-pointer"
                :class="scopeFilter === 'unassigned' ? 'bg-surface-0 dark:bg-surface-700 text-amber-600 dark:text-amber-400 shadow-xs' : 'text-surface-500 hover:text-surface-900 dark:text-surface-400 dark:hover:text-surface-100'"
                @click="scopeFilter = 'unassigned'"
              >
                Available ({{ catalogPermission.length - selectedPermissions.length }})
              </button>
            </div>
          </div>

          <!-- Category Pill Badges -->
          <div class="flex items-center justify-between gap-2 pt-1 border-t border-surface-100 dark:border-surface-700/60 overflow-x-auto scrollbar-none">
            <!-- Global Select All / Clear All Filtered -->
            <div class="flex items-center gap-1.5 shrink-0">
              <Button 
                label="Select All" 
                icon="pi pi-check-square" 
                size="small" 
                text 
                class="text-xs font-bold" 
                @click="selectAllVisible" 
              />
              <Button 
                label="Clear All" 
                icon="pi pi-times" 
                size="small" 
                text 
                severity="danger" 
                class="text-xs font-bold" 
                @click="clearAllVisible" 
              />
            </div>
          </div>
        </div>

        <!-- Permissions List / Grouped by Category -->
        <div class="space-y-4">
          <!-- Khung lớn chứa tất cả permission items chung một frame -->
          <div class="bg-surface-0 dark:bg-surface-800 rounded-2xl border border-surface-200/80 dark:border-surface-700/80 shadow-sm overflow-hidden p-4">
            
            <!-- Permission Items Matrix Grid -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
              
              <!-- Lặp qua từng nhóm, rồi lặp qua từng permission (hoặc nếu mảng của bạn là một danh sách phẳng, hãy dùng v-for trực tiếp trên mảng permissions) -->
              <template v-for="group in filteredPermissionGroups" :key="group.category">
                <div 
                  v-for="perm in group.permissions" 
                  :key="perm.code"
                  @click="togglePermission(perm.code)"
                  class="p-3.5 rounded-xl border transition-all duration-200 cursor-pointer relative flex items-start gap-3 select-none group"
                  :class="[
                    selectedPermissions.includes(perm.code)
                      ? 'bg-primary-50/40 dark:bg-primary-950/20 border-primary-400/60 dark:border-primary-700/60 shadow-xs'
                      : 'bg-surface-0 dark:bg-surface-800 border-surface-200/60 dark:border-surface-700/60 hover:border-surface-300 dark:hover:border-surface-600 hover:bg-surface-50/50 dark:hover:bg-surface-750/30'
                  ]"
                >
                  <!-- Checkbox -->
                  <div class="pt-0.5 shrink-0" @click.stop>
                    <Checkbox 
                      :modelValue="selectedPermissions.includes(perm.code)" 
                      :binary="true"
                      :inputId="perm.code"
                      @update:modelValue="() => togglePermission(perm.code)"
                    />
                  </div>

                  <!-- Info Block -->
                  <div class="flex-1 min-w-0 space-y-1">
                    <div class="flex items-center justify-between gap-2">
                      <label :for="perm.code" class="text-xs font-bold text-surface-900 dark:text-surface-0 cursor-pointer group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                        {{ perm.name }}
                      </label>
                    </div>

                    <!-- Code Badge -->
                    <div class="flex items-center gap-1.5 flex-wrap">
                      <span class="font-mono text-[10px] font-semibold text-primary-700 dark:text-primary-300 bg-primary-100/70 dark:bg-primary-900/40 px-1.5 py-0.5 rounded border border-primary-200/50 dark:border-primary-800/30">
                        {{ perm.code }}
                      </span>

                      <!-- Diff State Indicators -->
                      <span 
                        v-if="isNewlyAdded(perm.code)" 
                        class="text-[9px] font-extrabold text-emerald-600 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-950/70 px-1.5 py-0.5 rounded-full flex items-center gap-0.5"
                      >
                        <i class="pi pi-plus text-[7px]"></i> Added
                      </span>
                      <span 
                        v-else-if="isNewlyRemoved(perm.code)" 
                        class="text-[9px] font-extrabold text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-950/70 px-1.5 py-0.5 rounded-full flex items-center gap-0.5"
                      >
                        <i class="pi pi-minus text-[7px]"></i> Revoked
                      </span>
                    </div>

                    <!-- Description -->
                    <p class="text-[11px] text-surface-500 dark:text-surface-400 leading-normal pt-0.5 m-0">
                      {{ perm.description }}
                    </p>
                  </div>
                </div>
              </template>
            </div>
          </div>

          <!-- Empty Permissions Search Result -->
          <div v-if="filteredPermissionGroups.length === 0" class="p-12 text-center bg-surface-0 dark:bg-surface-800 rounded-2xl border border-surface-200/80 dark:border-surface-700/80">
            <i class="pi pi-search-minus text-3xl text-surface-400 mb-2 block"></i>
            <h4 class="text-sm font-bold text-surface-800 dark:text-surface-100 mb-1">No permissions found</h4>
            <p class="text-xs text-surface-400 max-w-sm mx-auto mb-4">
              We couldn't find any permission codes matching "{{ permissionSearchQuery }}". Try refining your search query or reset filters.
            </p>
            <Button 
              label="Reset Search Filters" 
              icon="pi pi-refresh" 
              size="small" 
              outlined 
              @click="resetPermissionFilters" 
            />
          </div>
        </div>

        <!-- Selected Permissions Live Preview Drawer / Panel -->
        <div class="bg-surface-0 dark:bg-surface-800 rounded-2xl border border-surface-200/80 dark:border-surface-700/80 p-5 shadow-sm space-y-4">
          <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-surface-100 dark:border-surface-700 pb-3">
            <div>
              <h3 class="text-sm font-bold text-surface-900 dark:text-surface-0 m-0 flex items-center gap-2">
                <span>Selected Permissions Preview</span>
                <span class="text-xs px-2 py-0.5 rounded-full bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300 font-extrabold">
                  {{ selectedPermissions.length }} Total
                </span>
              </h3>
              <p class="text-[11px] text-surface-400 mt-0.5 m-0">
                Live inspection of all permission codes assigned to {{ selectedUser?.displayName || 'the selected user' }}
              </p>
            </div>

            <!-- Diff summary badges -->
            <div class="flex items-center gap-2 text-xs">
              <span v-if="addedCodesCount > 0" class="px-2 py-1 bg-emerald-100 dark:bg-emerald-950/70 text-emerald-700 dark:text-emerald-400 rounded-lg font-bold flex items-center gap-1">
                <i class="pi pi-plus-circle text-[10px]"></i> {{ addedCodesCount }} to grant
              </span>
              <span v-if="removedCodesCount > 0" class="px-2 py-1 bg-red-100 dark:bg-red-950/70 text-red-700 dark:text-red-400 rounded-lg font-bold flex items-center gap-1">
                <i class="pi pi-minus-circle text-[10px]"></i> {{ removedCodesCount }} to revoke
              </span>
              <span v-if="!hasUnsavedChanges" class="text-surface-400 text-xs italic">
                No pending changes
              </span>
            </div>
          </div>

          <!-- Selected Chips Cloud -->
          <div v-if="selectedPermissions.length > 0" class="flex flex-wrap gap-2 max-h-48 overflow-y-auto p-1">
            <span 
              v-for="code in selectedPermissions" 
              :key="code"
              class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-mono font-medium transition-all group"
              :class="[
                isNewlyAdded(code)
                  ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700'
                  : 'bg-surface-100 dark:bg-surface-700 text-surface-700 dark:text-surface-200 border border-surface-200 dark:border-surface-600'
              ]"
            >
              <i class="pi pi-key text-[9px] text-surface-400"></i>
              <span>{{ code }}</span>
              <button 
                @click="removePermissionCode(code)" 
                class="text-surface-400 hover:text-red-500 bg-transparent border-none cursor-pointer p-0 ml-1 flex items-center"
                title="Revoke permission"
              >
                <i class="pi pi-times text-[9px]"></i>
              </button>
            </span>
          </div>

          <div v-else class="p-6 text-center text-surface-400 border border-dashed border-surface-200 dark:border-surface-700 rounded-xl">
            <i class="pi pi-shield text-2xl opacity-40 mb-1 block"></i>
            <p class="text-xs">No permissions currently assigned to this user.</p>
          </div>

          <!-- Bottom Action Buttons Toolbar -->
          <div class="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-surface-100 dark:border-surface-700">
            <div class="flex items-center gap-2 w-full sm:w-auto">
              <Button 
                label="Discard Changes" 
                icon="pi pi-undo" 
                severity="secondary" 
                outlined 
                size="small"
                :disabled="!hasUnsavedChanges || isSaving" 
                class="w-full sm:w-auto text-xs font-bold" 
                @click="revertChanges" 
              />
              <Button 
                label="Clear All Codes" 
                icon="pi pi-trash" 
                severity="danger" 
                text 
                size="small"
                :disabled="selectedPermissions.length === 0 || isSaving" 
                class="w-full sm:w-auto text-xs font-bold" 
                @click="promptClearAll" 
              />
            </div>

            <div class="flex items-center gap-2 w-full sm:w-auto justify-end">
              <Button 
                label="Save & Grant Permissions" 
                icon="pi pi-check-circle" 
                severity="primary" 
                size="small"
                :loading="isSaving" 
                :disabled="!hasUnsavedChanges && !isSaving"
                class="w-full sm:w-auto text-xs font-bold shadow-md shadow-primary-500/20" 
                @click="handleSavePermissions" 
              />
            </div>
          </div>
        </div>

      </div>

    </div>

    <!-- 4. Sticky Floating Change-Alert Bar (When Unsaved Changes Exist) -->
    <transition name="slide-up">
      <div 
        v-if="hasUnsavedChanges" 
        class="fixed bottom-4 inset-x-4 max-w-4xl mx-auto z-40 bg-surface-900/90 dark:bg-surface-0/90 text-surface-0 dark:text-surface-900 backdrop-blur-md px-6 py-3.5 rounded-2xl shadow-2xl flex flex-col sm:flex-row items-center justify-between gap-3 border border-surface-700 dark:border-surface-200"
      >
        <div class="flex items-center gap-3">
          <div class="w-8 h-8 rounded-full bg-amber-500/20 text-amber-400 dark:text-amber-600 flex items-center justify-center font-bold shrink-0">
            <i class="pi pi-exclamation-circle text-base"></i>
          </div>
          <div>
            <p class="text-xs font-bold leading-tight m-0">
              Unsaved Permission Modifications for {{ selectedUser?.displayName }}
            </p>
            <p class="text-[11px] opacity-80 leading-tight m-0 mt-0.5">
              <span class="text-emerald-400 dark:text-emerald-600 font-bold">+{{ addedCodesCount }} granted</span>, 
              <span class="text-red-400 dark:text-red-600 font-bold">-{{ removedCodesCount }} revoked</span>
            </p>
          </div>
        </div>

        <div class="flex items-center gap-2 w-full sm:w-auto justify-end">
          <button 
            @click="revertChanges" 
            :disabled="isSaving"
            class="px-3 py-1.5 rounded-xl text-xs font-bold text-surface-200 dark:text-surface-700 hover:text-white dark:hover:text-black bg-transparent border-none cursor-pointer"
          >
            Discard
          </button>
          <button 
            @click="handleSavePermissions" 
            :disabled="isSaving"
            class="px-4 py-2 rounded-xl text-xs font-extrabold bg-primary-500 hover:bg-primary-600 text-white shadow-lg shadow-primary-500/30 border-none cursor-pointer flex items-center gap-1.5 transition-all"
          >
            <i v-if="isSaving" class="pi pi-spin pi-spinner text-xs"></i>
            <i v-else class="pi pi-check text-xs"></i>
            <span>Apply & Save</span>
          </button>
        </div>
      </div>
    </transition>

    <!-- 5. Security Confirmation Modal for High-Privilege Roles -->
    <Dialog 
      v-model:visible="confirmDialogVisible" 
      modal 
      header="Confirm Critical Permission Change" 
      :style="{ width: '480px', maxWidth: '95vw' }"
      class="rounded-2xl"
    >
      <div class="space-y-4 pt-1">
        <div class="flex items-start gap-3 p-3 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 rounded-xl text-amber-800 dark:text-amber-200">
          <i class="pi pi-shield text-xl text-amber-600 shrink-0 mt-0.5"></i>
          <div class="text-xs">
            <p class="font-bold mb-1">Elevated Privileges Warning</p>
            <p class="text-[11px] leading-relaxed opacity-90">
              You are about to assign or modify administrative permission codes (e.g. <code>admin</code>, <code>SYS_USER_MANAGE</code>, or <code>SYS_PERMISSION_GRANT</code>) to <strong>{{ selectedUser?.displayName }}</strong>.
            </p>
          </div>
        </div>

        <div class="space-y-1 text-xs text-surface-600 dark:text-surface-300">
          <p>Please verify that this employee is authorized to perform these high-level administrative tasks.</p>
        </div>

        <div class="flex justify-end gap-2 pt-2">
          <Button label="Cancel" text severity="secondary" @click="confirmDialogVisible = false" />
          <Button label="Confirm & Grant" severity="danger" icon="pi pi-check" :loading="isSaving" @click="executeSaveProcess" />
        </div>
      </div>
    </Dialog>

    <!-- 6. Raw JSON Export Modal -->
    <Dialog 
      v-model:visible="jsonDialogVisible" 
      modal 
      header="Export User Permissions" 
      :style="{ width: '560px', maxWidth: '95vw' }"
    >
      <div class="space-y-3 pt-1">
        <p class="text-xs text-surface-500">
          Formatted JSON representation of permissions for <strong>{{ selectedUser?.displayName }}</strong> (<code>{{ selectedUser?.userId }}</code>):
        </p>
        <pre class="bg-surface-900 text-surface-100 p-4 rounded-xl text-xs font-mono overflow-auto max-h-64">{{ JSON.stringify({ userId: selectedUser?.userId, userConfig: selectedPermissions }, null, 2) }}</pre>
        <div class="flex justify-end gap-2">
          <Button label="Close" text @click="jsonDialogVisible = false" />
          <Button label="Copy JSON" icon="pi pi-copy" severity="primary" @click="copyRawJsonText" />
        </div>
      </div>
    </Dialog>

  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue';
import { Button, Checkbox, Select, Dialog } from 'primevue';
import { useAuthStore } from '../stores/auth';
import { getCommonData } from '../services/projectService';


const authStore = useAuthStore();

// ============================================================================
// 2. COMPONENT REACTIVE STATE
// ============================================================================

const users = ref([]);
const presetRole = ref([]);
const catalogPermission = ref([])
const isLoading = ref(false);
const errorMessage = ref('');
const selectedUserId = ref('');
const selectedPermissions = ref([]);
const originalPermissions = ref([]);

// Filter & Search states
const userSearchQuery = ref('');
const selectedDepartment = ref('All');
const permissionSearchQuery = ref('');
const categoryFilter = ref('All');
const scopeFilter = ref('all'); // 'all' | 'assigned' | 'unassigned'

// UI & Modal states
const isSaving = ref(false);
const confirmDialogVisible = ref(false);
const jsonDialogVisible = ref(false);

// Toast Feedback System
const toasts = ref([]);

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
// 3. COMPUTED PROPERTIES
// ============================================================================

// Currently selected user object
const selectedUser = computed(() => {
  return users.value.find(u => u.userId === selectedUserId.value) || users.value[0];
});

// Check if selected user is the one currently logged in
const isCurrentSessionUser = computed(() => {
  return authStore.user?.userId === selectedUserId.value;
});

// Departments list
const departments = computed(() => {
  const depts = new Set(users.value.map(u => u.department));
  return ['All', ...Array.from(depts)];
});

// Filtered user list
const filteredUsers = computed(() => {
  let list = users.value;
  if (selectedDepartment.value !== 'All') {
    list = list.filter(u => u.department === selectedDepartment.value);
  }
  if (userSearchQuery.value.trim()) {
    const q = userSearchQuery.value.toLowerCase().trim();
    list = list.filter(u => 
      u.displayName.toLowerCase().includes(q) ||
      u.userId.toLowerCase().includes(q) ||
      u.email.toLowerCase().includes(q) ||
      u.employeeId.toLowerCase().includes(q) ||
      u.department.toLowerCase().includes(q)
    );
  }
  return list;
});

// Diff tracking
const hasUnsavedChanges = computed(() => {
  if (selectedPermissions.value.length !== originalPermissions.value.length) return true;
  const currentSet = new Set(selectedPermissions.value);
  return originalPermissions.value.some(code => !currentSet.has(code));
});

const addedCodesCount = computed(() => {
  const origSet = new Set(originalPermissions.value);
  return selectedPermissions.value.filter(code => !origSet.has(code)).length;
});

const removedCodesCount = computed(() => {
  const currSet = new Set(selectedPermissions.value);
  return originalPermissions.value.filter(code => !currSet.has(code)).length;
});

// Grouped permissions with search & filters applied
const filteredPermissionGroups = computed(() => {
  const permissionCatalog = catalogPermission.value;
  if (!Array.isArray(permissionCatalog)) {
    throw new TypeError('Permission catalog state must be an array.');
  }
  let perms = permissionCatalog;

  // 1. Search Query Filter
  if (permissionSearchQuery.value.trim()) {
    const q = permissionSearchQuery.value.toLowerCase().trim();
    perms = perms.filter(p => [p.code, p.name, p.description, p.category]
      .some(value => String(value ?? '').toLowerCase().includes(q)));
  }

  // 2. Category Tab Filter
  if (categoryFilter.value !== 'All') {
    perms = perms.filter(p => String(p.category ?? '') === categoryFilter.value);
  }

  // 3. Scope Filter
  if (scopeFilter.value === 'assigned') {
    perms = perms.filter(p => selectedPermissions.value.includes(p.code));
  } else if (scopeFilter.value === 'unassigned') {
    perms = perms.filter(p => !selectedPermissions.value.includes(p.code));
  }

  // Group by category
  const grouped = {};
  perms.forEach(p => {
    const category = p.category ?? 'Uncategorized';
    if (!grouped[category]) {
      grouped[category] = [];
    }
    grouped[category].push(p);
  });

  return Object.keys(grouped).map(catName => ({
    category: catName,
    // icon: getCategoryIcon(catName),
    badgeColor: getCategoryBadgeColor(catName),
    permissions: grouped[catName]
  }));
});

function getCategoryBadgeColor(catName) {
  switch (catName) {
    case 'Learning & Courses':
      return 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300';
    case 'Department & Teams':
      return 'bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300';
    case 'Analytics & Performance':
      return 'bg-teal-100 text-teal-700 dark:bg-teal-900/40 dark:text-teal-300';
    case 'System Administration':
      return 'bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-300';
    case 'Content & Media Operations':
      return 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300';
    default:
      return 'bg-surface-100 text-surface-700 dark:bg-surface-700 dark:text-surface-300';
  }
}

function getBadgeStyleForLevel(level) {
  switch (level) {
    case 'Critical':
      return 'bg-red-100 text-red-700 dark:bg-red-950/70 dark:text-red-400 border border-red-200 dark:border-red-900';
    case 'Admin':
      return 'bg-purple-100 text-purple-700 dark:bg-purple-950/70 dark:text-purple-400 border border-purple-200 dark:border-purple-900';
    case 'Elevated':
      return 'bg-amber-100 text-amber-700 dark:bg-amber-950/70 dark:text-amber-400 border border-amber-200 dark:border-amber-900';
    default:
      return 'bg-surface-100 text-surface-600 dark:bg-surface-700 dark:text-surface-300';
  }
}

function getUserInitials(name) {
  if (!name) return 'U';
  return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
}

function isNewlyAdded(code) {
  return selectedPermissions.value.includes(code) && !originalPermissions.value.includes(code);
}

function isNewlyRemoved(code) {
  return !selectedPermissions.value.includes(code) && originalPermissions.value.includes(code);
}

function userHasPendingModifications(userId) {
  if (userId !== selectedUserId.value) return false;
  return hasUnsavedChanges.value;
}

// ============================================================================
// 4. INTERACTION METHODS
// ============================================================================

function switchUser(newUserId) {
  if (newUserId === selectedUserId.value) return;

  if (hasUnsavedChanges.value) {
    const proceed = window.confirm(
      `You have unsaved permission changes for ${selectedUser.value?.displayName}. Are you sure you want to switch users without saving?`
    );
    if (!proceed) return;
  }

  selectedUserId.value = newUserId;
  loadUserPermissions(newUserId);
}

function handleUserChange() {
  loadUserPermissions(selectedUserId.value);
}

function loadUserPermissions(userId) {
  const target = users.value.find(u => u.userId === userId);
  if (target) {
    selectedPermissions.value = [...(target.userConfig || [])];
    originalPermissions.value = [...(target.userConfig || [])];
  }
}

function togglePermission(code) {
  const idx = selectedPermissions.value.indexOf(code);
  if (idx > -1) {
    selectedPermissions.value.splice(idx, 1);
  } else {
    selectedPermissions.value.push(code);
  }
}

function removePermissionCode(code) {
  const idx = selectedPermissions.value.indexOf(code);
  if (idx > -1) {
    selectedPermissions.value.splice(idx, 1);
  }
}

function selectAllVisible() {
  const visibleCodes = [];
  filteredPermissionGroups.value.forEach(g => {
    g.permissions.forEach(p => visibleCodes.push(p.code));
  });

  const merged = new Set([...selectedPermissions.value, ...visibleCodes]);
  selectedPermissions.value = Array.from(merged);
  showToast(`Selected ${visibleCodes.length} visible permission codes`, 'Selection Updated', 'info');
}

function clearAllVisible() {
  const visibleCodes = new Set();
  filteredPermissionGroups.value.forEach(g => {
    g.permissions.forEach(p => visibleCodes.add(p.code));
  });

  selectedPermissions.value = selectedPermissions.value.filter(c => !visibleCodes.has(c));
  showToast(`Cleared visible permission codes`, 'Selection Cleared', 'warn');
}

function applyRolePreset(preset) {
  selectedPermissions.value = [...preset.codes];
  showToast(
    `Applied "${preset.label}" template with ${preset.codes.length} permission codes.`,
    'Role Preset Applied',
    'info'
  );
}

function promptClearAll() {
  if (confirm(`Are you sure you want to revoke ALL permissions from ${selectedUser.value?.displayName}?`)) {
    selectedPermissions.value = [];
    showToast('All permissions revoked from current selection buffer.', 'Permissions Cleared', 'warn');
  }
}

function revertChanges() {
  selectedPermissions.value = [...originalPermissions.value];
  showToast('Reverted all changes back to user original configuration.', 'Changes Discarded', 'info');
}

function resetPermissionFilters() {
  permissionSearchQuery.value = '';
  categoryFilter.value = 'All';
  scopeFilter.value = 'all';
}

// ============================================================================
// 5. SAVE / GRANT API INTEGRATION LOGIC
// ============================================================================

function handleSavePermissions() {

  executeSaveProcess();
}

/**
 * Simulated Async API Request to persist user permissions
 */
async function executeSaveProcess() {
  isSaving.value = true;
  confirmDialogVisible.value = false;

  try {
    // Simulate network delay (e.g., calling backend API endpoint)
    await new Promise(resolve => setTimeout(resolve, 650));

    // Update local user state
    const userToUpdate = users.value.find(u => u.userId === selectedUserId.value);
    if (userToUpdate) {
      userToUpdate.userConfig = [...selectedPermissions.value];
    }
    console.log('originalPermissions', originalPermissions)
    // Update baseline
    originalPermissions.value = [...selectedPermissions.value];
    
    console.log('selectedPermissions', selectedPermissions)
    console.log('isCurrentSessionUser', isCurrentSessionUser)

    // If currently logged in user is being modified, update authStore directly
    if (isCurrentSessionUser.value && authStore.user) {
      authStore.user.userConfig = [...selectedPermissions.value];
      // Sync back to local storage
      try {
        localStorage.setItem('user_data_last_sync', Date.now().toString());
      } catch (e) {
        console.warn(e);
      }
    }

    showToast(
      `Successfully granted ${selectedPermissions.value.length} permission codes to ${selectedUser.value?.displayName}.`,
      'Permissions Updated Successfully',
      'success'
    );
  } catch (error) {
    console.error('Failed to save permissions:', error);
    showToast(
      'An unexpected error occurred while saving permissions. Please retry.',
      'Save Failed',
      'error'
    );
  } finally {
    isSaving.value = false;
  }
}

function copyRawJsonText() {
  const jsonPayload = JSON.stringify(
    { userId: selectedUser.value?.userId, userConfig: selectedPermissions.value },
    null,
    2
  );
  navigator.clipboard.writeText(jsonPayload).then(() => {
    showToast('Permission JSON copied to clipboard!', 'Copied', 'info');
    jsonDialogVisible.value = false;
  });
}

// Load users when the permission management page is mounted.
onMounted(async () => {
  isLoading.value = true;
  errorMessage.value = '';

  try {
    const allUsers = await getCommonData({
      userId: authStore.user.displayName,
      condition: 'Permission_Access'
    });

    users.value = allUsers.map(user => ({
      id: user.userId,
      userId: user.userName || '',
      displayName: user.fullName || '',
      email: user.email || '',
      employeeId: user.employeeCode || '',
      department: user.departmentName ?? user.department ?? '',
      roleTitle: user.roleName || '',
      status: 'active',
      userConfig: Array.isArray(user.userConfig) ? user.userConfig : []
    }));

    const permissionData = await getCommonData({
      userId: authStore.user.displayName,
      condition: 'All_permission'
    });
    
    if (!permissionData || !Array.isArray(permissionData.permissionsCatalog)) {
      throw new TypeError('Invalid All_permission response: expected permissionsCatalog to be an array.');
    }

    const invalidPermissionIndex = permissionData.permissionsCatalog.findIndex(permission =>
      permission === null || typeof permission !== 'object' || Array.isArray(permission)
    );
    if (invalidPermissionIndex !== -1) {
      throw new TypeError(`Invalid All_permission response: permissionsCatalog[${invalidPermissionIndex}] must be an object.`);
    }

    presetRole.value = permissionData.rolePresets
    catalogPermission.value = permissionData.permissionsCatalog

    console.log('permissionData', presetRole)
    console.log('catalogPermission', catalogPermission)


    const currentUserId = authStore.user.userId;
    selectedUserId.value = users.value.some(user => user.userId === currentUserId) ? currentUserId : (users.value[0]?.userId || '');

    loadUserPermissions(selectedUserId.value);
  } catch (error) {
    console.error('Failed to load users:', error);
    errorMessage.value = error instanceof Error
      ? error.message
      : 'Failed to load users. Please try again.';
  } finally {
    isLoading.value = false;
  }
});
</script>

<style scoped>
/* Custom animations matching system design */
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

.slide-up-enter-active,
.slide-up-leave-active {
  transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
}

.slide-up-enter-from,
.slide-up-leave-to {
  opacity: 0;
  transform: translateY(20px);
}

/* Custom scrollbar minimization */
.scrollbar-none::-webkit-scrollbar {
  display: none;
}
.scrollbar-none {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>
