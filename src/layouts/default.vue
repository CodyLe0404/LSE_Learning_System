<template>
  <div class="flex min-h-screen bg-surface-50 dark:bg-surface-900">
    <!-- Sidebar -->
    <aside 
        class="bg-surface-0 dark:bg-surface-800 border-r border-surface-200 dark:border-surface-700 flex flex-col fixed inset-y-0 left-0 z-50 transition-transform duration-300 transform" 
        :class="{ 
            '-translate-x-full': !sidebarOpenMobile, 
            'translate-x-0': sidebarOpenMobile, 
            'lg:translate-x-0': sidebarOpenDesktop, 
            'lg:-translate-x-full': !sidebarOpenDesktop,
            'w-72': true 
        }"
    >

        <div class="p-6 h-16 flex items-center justify-between border-b border-surface-200 dark:border-surface-700">
            <span class="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary-500 to-indigo-500 flex items-center gap-2">
                <!-- Use i tag with PrimeIcons class -->
                <i class="pi pi-graduation-cap text-primary-500 text-2xl"></i>
                LSE-Learning
            </span>

            <Button icon="pi pi-bars" text rounded @click="toggleSidebar" />
        </div>
        
        <div class="flex-1 overflow-y-auto py-4 px-3">
            <PanelMenu :model="items" class="w-full border-none" />
        </div>

        <!-- User Profile & Logout -->
        <div class="p-4 border-t border-surface-200 dark:border-surface-700 bg-surface-50 dark:bg-surface-800/50">
            <div class="flex items-center gap-3 mb-3">
                <div class="w-10 h-10 rounded-full bg-primary-100 dark:bg-primary-900 flex items-center justify-center text-primary-600 dark:text-primary-300 font-bold">
                    {{ userInitials }}
                </div>
                <div class="flex-1 min-w-0">
                    <p class="text-sm font-medium text-surface-900 dark:text-surface-0 truncate">
                        {{ authStore.user?.displayName || 'User' }}
                    </p>
                    <p class="text-xs text-surface-500 dark:text-surface-400 truncate">
                        ID: {{ authStore.user?.employeeId || 'N/A' }}
                    </p>
                </div>
            </div>
            <Button label="Logout" icon="pi pi-sign-out" severity="danger" outlined class="w-full" @click="confirmLogout" />
        </div>
    </aside>

    <!-- Content -->
    <main 
        class="flex-1 transition-all duration-300 overflow-y-auto"
        :class="{ 'lg:ml-72': sidebarOpenDesktop, 'lg:ml-0': !sidebarOpenDesktop }"
    >
        <!-- Topbar -->
        <header class="h-16 bg-surface-0/80 backdrop-blur-md border-b border-surface-200 dark:border-surface-700 sticky top-0 z-40 px-6 flex items-center justify-between gap-4">
            <div class="flex items-center gap-4 flex-1">
                <!-- Toggle Button (Outside) - Hidden on Desktop if Sidebar is Open -->
                <div :class="{ 'lg:hidden': sidebarOpenDesktop }">
                    <Button 
                        icon="pi pi-bars" 
                        text 
                        @click="toggleSidebar" 
                    />
                </div>
                
                <!-- Search Bar -->
                <div class="relative max-w-md w-full hidden md:block">
                    <i class="pi pi-search absolute left-3 top-1/2 -translate-y-1/2 text-surface-400"></i>
                    <input 
                        type="text" 
                        placeholder="Search for courses, plans, calendar events..." 
                        class="w-full pl-10 pr-4 py-2 text-sm bg-surface-50 dark:bg-surface-800 border border-surface-250 dark:border-surface-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all placeholder:text-surface-400 text-surface-800 dark:text-surface-100"
                        v-model="searchQuery"
                        @input="onSearch"
                    />
                </div>
            </div>
            
            <!-- Right Actions: Notifications & Profile -->
            <div class="flex items-center gap-4">
                <!-- Mobile Search Button (shows notification context as placeholder for responsiveness) -->
                <Button icon="pi pi-search" text rounded class="md:hidden" />
                
                <!-- Notification Bell -->
                <div class="relative">
                    <Button 
                        icon="pi pi-bell" 
                        text 
                        rounded 
                        @click="toggleNotifications" 
                        class="relative text-surface-600 dark:text-surface-300"
                    />
                    <!-- Badge -->
                    <span class="absolute top-1 right-1 flex h-2 w-2">
                        <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                        <span class="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                    </span>
                    
                    <!-- Notifications Dropdown -->
                    <div 
                        v-if="notificationsOpen"
                        class="absolute right-5 mt-2 w-80 bg-surface-0 dark:bg-surface-800 border border-surface-200 dark:border-surface-700 rounded-xl shadow-xl z-50 overflow-hidden py-1"
                    >
                        <div class="px-4 py-2 border-b border-surface-100 dark:border-surface-700 flex justify-between items-center bg-surface-50/50 dark:bg-surface-800/50">
                            <span class="font-semibold text-sm">Notifications</span>
                            <span class="text-xs text-primary-500 cursor-pointer hover:underline">Mark all as read</span>
                        </div>
                        <ul class="max-h-64 overflow-y-auto list-none p-0 m-0">
                            <li v-for="notif in notifications" :key="notif.id" class="px-4 py-3 hover:bg-surface-50 dark:hover:bg-surface-700/50 border-b border-surface-100 dark:border-surface-700 last:border-0 cursor-pointer">
                                <div class="flex gap-3">
                                    <div class="w-8 h-8 rounded-full flex items-center justify-center text-xs shrink-0" :class="notif.iconBg">
                                        <i :class="notif.icon"></i>
                                    </div>
                                    <div class="flex-1 min-w-0">
                                        <p class="text-xs font-semibold text-surface-800 dark:text-surface-100 leading-normal">{{ notif.title }}</p>
                                        <p class="text-[11px] text-surface-400 mt-0.5">{{ notif.time }}</p>
                                    </div>
                                </div>
                            </li>
                        </ul>
                        <div class="px-4 py-2 border-t border-surface-100 dark:border-surface-700 text-center">
                            <span class="text-xs text-primary-500 cursor-pointer hover:underline font-medium">View all notifications</span>
                        </div>
                    </div>
                </div>
                
                <!-- Profile Dropdown -->
                <div class="relative">
                    <button 
                        @click="toggleProfile" 
                        class="flex items-center gap-2 p-1 rounded-full hover:bg-surface-100 dark:hover:bg-surface-700 transition-colors focus:outline-none bg-transparent border-none cursor-pointer"
                    >
                        <div class="w-8 h-8 rounded-full bg-primary-100 dark:bg-primary-900 flex items-center justify-center text-primary-600 dark:text-primary-300 font-bold text-sm">
                            {{ userInitials }}
                        </div>
                        <i class="pi pi-chevron-down text-xs text-surface-500 hidden sm:inline"></i>
                    </button>
                    
                    <!-- Dropdown Menu -->
                    <div 
                        v-if="profileOpen"
                        class="absolute right-0 mt-2 w-56 bg-surface-0 dark:bg-surface-800 border border-surface-200 dark:border-surface-700 rounded-xl shadow-xl z-50 overflow-hidden py-1"
                    >
                        <div class="px-4 py-3 border-b border-surface-100 dark:border-surface-700 bg-surface-50/50 dark:bg-surface-800/50">
                            <p class="text-sm font-semibold text-surface-900 dark:text-surface-0 truncate">
                                {{ authStore.user?.displayName || 'User' }}
                            </p>
                            <p class="text-xs text-surface-400 truncate mt-0.5">
                                {{ authStore.user?.email || 'user@company.com' }}
                            </p>
                            <div class="mt-2 flex items-center gap-1.5">
                                <span class="px-2 py-0.5 text-[10px] font-semibold bg-primary-100 dark:bg-primary-900 text-primary-600 dark:text-primary-300 rounded-full">
                                    Learner
                                </span>
                                <span class="text-xs text-surface-400 font-medium">ID: {{ authStore.user?.userId || 'N/A' }}</span>
                            </div>
                        </div>
                        <ul class="list-none p-0 m-0">
                            <li>
                                <a href="#" class="flex items-center gap-3 px-4 py-2 text-sm hover:bg-surface-50 dark:hover:bg-surface-750 no-underline text-surface-700 dark:text-surface-300">
                                    <i class="pi pi-user text-surface-400"></i>
                                    My Profile
                                </a>
                            </li>
                            <li>
                                <a href="#" class="flex items-center gap-3 px-4 py-2 text-sm hover:bg-surface-50 dark:hover:bg-surface-750 no-underline text-surface-700 dark:text-surface-300">
                                    <i class="pi pi-cog text-surface-400"></i>
                                    Account Settings
                                </a>
                            </li>
                            <li>
                                <a href="#" class="flex items-center gap-3 px-4 py-2 text-sm hover:bg-surface-50 dark:hover:bg-surface-750 no-underline text-surface-700 dark:text-surface-300">
                                    <i class="pi pi-question-circle text-surface-400"></i>
                                    Help & Support
                                </a>
                            </li>
                        </ul>
                        <div class="border-t border-surface-100 dark:border-surface-700 mt-1">
                            <button 
                                @click="confirmLogout" 
                                class="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/10 text-left border-none bg-transparent cursor-pointer"
                            >
                                <i class="pi pi-sign-out text-red-500"></i>
                                Sign Out
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </header>

        <div class="p-4 w-full">
            <router-view v-slot="{ Component }">
                <transition name="fade" mode="out-in">
                    <component :is="Component" />
                </transition>
            </router-view>
        </div>
    </main>
    
    <ConfirmDialog />
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { PanelMenu, Button, ConfirmDialog } from 'primevue';
import { useConfirm } from 'primevue/useconfirm';
import { getMenuItems } from '../utils/menu';
import generatedRoutes from 'virtual:generated-pages';
import { useAuthStore } from '../stores/auth';

const router = useRouter();
const authStore = useAuthStore();
const confirm = useConfirm();

// State for Mobile and Desktop sidebars
const sidebarOpenMobile = ref(false);
const sidebarOpenDesktop = ref(true);

// State for Dropdowns
const notificationsOpen = ref(false);
const profileOpen = ref(false);
const searchQuery = ref('');

const notifications = ref([
    { id: 1, title: 'Upcoming training session: Vue 3 Advanced on Aug 28', time: '10 mins ago', icon: 'pi pi-calendar', iconBg: 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-300' },
    { id: 2, title: 'Compliance learning deadline in 3 days!', time: '1 hour ago', icon: 'pi pi-exclamation-triangle', iconBg: 'bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-300' },
    { id: 3, title: 'Congratulations! You earned "Fast Learner" badge.', time: '1 day ago', icon: 'pi pi-id-card', iconBg: 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-300' }
]);

function toggleNotifications(event) {
    event.stopPropagation();
    notificationsOpen.value = !notificationsOpen.value;
    profileOpen.value = false;
}

function toggleProfile(event) {
    event.stopPropagation();
    profileOpen.value = !profileOpen.value;
    notificationsOpen.value = false;
}

function onSearch() {
    window.dispatchEvent(new CustomEvent('global-search', { detail: searchQuery.value }));
}

// Close dropdowns on click outside
if (typeof window !== 'undefined') {
    window.addEventListener('click', () => {
        notificationsOpen.value = false;
        profileOpen.value = false;
    });
}

function toggleSidebar() {
    if (window.innerWidth >= 1024) { // lg breakpoint
        sidebarOpenDesktop.value = !sidebarOpenDesktop.value;
    } else {
        sidebarOpenMobile.value = !sidebarOpenMobile.value;
    }
}

const userInitials = computed(() => {
    const name = authStore.user?.displayName || 'User';
    return name.substring(0, 2).toUpperCase();
});

// Generate menu items from routes (with permission check)
const items = computed(() => {
    const dynamicItems = getMenuItems(generatedRoutes, router.push, authStore.hasPermission);
    return [
        {
            label: 'Dashboard',
            icon: 'pi pi-home',
            command: () => router.push('/')
        },
        ...dynamicItems
    ];
});

function confirmLogout() {
  confirm.require({
      message: 'Are you sure you want to log out?',
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      rejectProps: {
          label: 'Cancel',
          severity: 'secondary',
          outlined: true
      },
      acceptProps: {
          label: 'Logout',
          severity: 'danger'
      },
      accept: () => {
          authStore.logout();
      }
  });
}
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
