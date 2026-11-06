<template>
  <Dialog
    :visible="visible"
    @update:visible="$emit('update:visible', $event)"
    modal
    :header="dialogTitle"
    :style="{ width: '820px', maxWidth: '96vw' }"
    class="rounded-2xl overflow-hidden"
    :dismissableMask="true"
  >
    <div v-if="content" class="space-y-4 pt-1">
      <!-- 1. VIDEO PREVIEW MODE -->
      <div v-if="content.ContentType === 'Video'" class="space-y-4">
        <!-- Simulated Video Player Box -->
        <div class="relative w-full aspect-video bg-black rounded-2xl overflow-hidden shadow-2xl flex flex-col justify-between group border border-surface-800">
          <!-- Video Screen Background -->
          <img
            :src="content.video?.ThumbnailPath || fallbackImage"
            :alt="content.Title"
            class="absolute inset-0 w-full h-full object-cover opacity-60"
          />
          <div class="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-black/60 pointer-events-none"></div>

          <!-- Video Top Header Overlay -->
          <div class="relative z-10 p-4 flex items-center justify-between text-white">
            <div class="flex items-center gap-2">
              <span class="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-blue-600 text-white">
                VIDEO LECTURE
              </span>
              <span class="text-xs font-semibold truncate max-w-md">{{ content.Title }}</span>
            </div>
            <span class="px-2 py-0.5 rounded text-[10px] font-bold bg-white/20 text-white backdrop-blur-md">
              1080p 60fps
            </span>
          </div>

          <!-- Center Play/Pause Trigger -->
          <div class="relative z-10 self-center">
            <button
              @click="togglePlay"
              class="w-16 h-16 rounded-full bg-primary-600/90 hover:bg-primary-500 text-white flex items-center justify-center shadow-2xl backdrop-blur-md transition-all hover:scale-110 active:scale-95 border-none cursor-pointer"
            >
              <i class="pi text-2xl" :class="isPlaying ? 'pi-pause' : 'pi-play ml-1'"></i>
            </button>
          </div>

          <!-- Video Bottom Controls Bar -->
          <div class="relative z-10 p-4 space-y-2 bg-gradient-to-t from-black to-transparent">
            <!-- Timeline Scrubber -->
            <div
              @click="seekVideo"
              class="w-full bg-white/20 hover:bg-white/30 h-1.5 rounded-full overflow-hidden cursor-pointer transition-all"
            >
              <div
                class="bg-primary-500 h-full rounded-full relative transition-all"
                :style="{ width: videoProgress + '%' }"
              ></div>
            </div>

            <!-- Controls row -->
            <div class="flex items-center justify-between text-white text-xs">
              <div class="flex items-center gap-3">
                <button
                  @click="togglePlay"
                  class="text-white hover:text-primary-400 bg-transparent border-none cursor-pointer"
                >
                  <i class="pi" :class="isPlaying ? 'pi-pause' : 'pi-play'"></i>
                </button>
                <div class="flex items-center gap-1.5 text-xs font-mono text-surface-300">
                  <span>{{ formatSeconds(currentTime) }}</span>
                  <span>/</span>
                  <span>{{ content.video?.formattedDuration || formatSeconds(content.Duration * 60) }}</span>
                </div>
              </div>

              <div class="flex items-center gap-3">
                <button
                  @click="toggleMute"
                  class="text-white hover:text-primary-400 bg-transparent border-none cursor-pointer"
                >
                  <i class="pi" :class="isMuted ? 'pi-volume-off text-red-400' : 'pi-volume-up'"></i>
                </button>
                <button
                  @click="toggleFullscreen"
                  class="text-white hover:text-primary-400 bg-transparent border-none cursor-pointer"
                >
                  <i class="pi pi-window-maximize"></i>
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Video Underlying Schema Metadata Card -->
        <div class="bg-surface-50 dark:bg-surface-850 p-4 rounded-xl border border-surface-200 dark:border-surface-700/80 space-y-2">
          <div class="flex items-center justify-between text-xs font-bold text-surface-900 dark:text-surface-0 border-b border-surface-200 dark:border-surface-700 pb-2">
            <span class="flex items-center gap-1.5 text-primary-600 dark:text-primary-400">
              <i class="pi pi-database text-xs"></i>
              Database Entity: [VIDEOS] Metadata Record
            </span>
            <span class="text-surface-400 font-mono text-[10px]">ContentId: #{{ content.ContentId }}</span>
          </div>

          <div class="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs pt-1">
            <div>
              <span class="text-surface-400 block text-[10px] uppercase font-bold">Video ID (PK)</span>
              <span class="font-mono font-bold text-surface-800 dark:text-surface-200">#{{ content.video?.VideoId || 'N/A' }}</span>
            </div>
            <div>
              <span class="text-surface-400 block text-[10px] uppercase font-bold">File Name</span>
              <span class="font-mono text-surface-800 dark:text-surface-200 truncate block" :title="content.video?.FileName">
                {{ content.video?.FileName || 'N/A' }}
              </span>
            </div>
            <div>
              <span class="text-surface-400 block text-[10px] uppercase font-bold">File Size</span>
              <span class="font-bold text-emerald-600 dark:text-emerald-400">{{ content.video?.formattedSize || 'N/A' }}</span>
            </div>
            <div>
              <span class="text-surface-400 block text-[10px] uppercase font-bold">Duration</span>
              <span class="font-bold text-surface-800 dark:text-surface-200">{{ content.video?.formattedDuration || 'N/A' }}</span>
            </div>
          </div>

          <div class="pt-1 text-[11px] text-surface-500 font-mono truncate">
            <span class="text-surface-400">FilePath: </span>{{ content.video?.FilePath }}
          </div>
        </div>
      </div>

      <!-- 2. DOCUMENT PREVIEW MODE -->
      <div v-else-if="content.ContentType === 'Document'" class="space-y-4">
        <!-- Simulated Document Toolbar -->
        <div class="bg-surface-100 dark:bg-surface-900 p-2.5 rounded-xl border border-surface-200 dark:border-surface-700 flex flex-wrap items-center justify-between gap-3 text-xs">
          <!-- Left: Page Navigator -->
          <div class="flex items-center gap-2">
            <span class="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-amber-500/20 text-amber-700 dark:text-amber-300 border border-amber-500/30">
              {{ content.document?.FileType?.toUpperCase() || 'PDF' }}
            </span>
            <div class="flex items-center gap-1 font-semibold text-surface-700 dark:text-surface-300">
              <button class="w-6 h-6 rounded hover:bg-surface-200 dark:hover:bg-surface-800 flex items-center justify-center border-none bg-transparent cursor-pointer">
                <i class="pi pi-chevron-left text-[10px]"></i>
              </button>
              <span>Page 1 of 8</span>
              <button class="w-6 h-6 rounded hover:bg-surface-200 dark:hover:bg-surface-800 flex items-center justify-center border-none bg-transparent cursor-pointer">
                <i class="pi pi-chevron-right text-[10px]"></i>
              </button>
            </div>
          </div>

          <!-- Center: Zoom Controls -->
          <div class="flex items-center gap-2">
            <button class="p-1 rounded hover:bg-surface-200 dark:hover:bg-surface-800 border-none bg-transparent cursor-pointer" title="Zoom Out">
              <i class="pi pi-search-minus text-xs"></i>
            </button>
            <span class="font-mono text-xs text-surface-600 dark:text-surface-400">100%</span>
            <button class="p-1 rounded hover:bg-surface-200 dark:hover:bg-surface-800 border-none bg-transparent cursor-pointer" title="Zoom In">
              <i class="pi pi-search-plus text-xs"></i>
            </button>
          </div>

          <!-- Right: Actions -->
          <div class="flex items-center gap-2">
            <Button
              label="Download File"
              icon="pi pi-download"
              size="small"
              severity="secondary"
              outlined
              class="text-xs"
              @click="simulateDownload"
            />
            <Button
              label="Print"
              icon="pi pi-print"
              size="small"
              severity="secondary"
              text
              class="text-xs hidden sm:inline-flex"
            />
          </div>
        </div>

        <!-- Simulated Document Paper Viewport -->
        <div class="bg-surface-50 dark:bg-surface-950 p-6 sm:p-8 rounded-2xl border border-surface-200 dark:border-surface-700/80 shadow-inner max-h-[460px] overflow-y-auto space-y-4">
          <div class="bg-surface-0 dark:bg-surface-800 p-6 sm:p-8 rounded-xl border border-surface-200/80 dark:border-surface-700 shadow-sm space-y-4 relative">
            <!-- Header Letterhead -->
            <div class="flex items-center justify-between border-b border-surface-200 dark:border-surface-700 pb-4">
              <div class="flex items-center gap-2">
                <i class="pi pi-graduation-cap text-primary-500 text-xl"></i>
                <span class="font-extrabold text-sm text-surface-900 dark:text-surface-0">LSE Corporate Learning</span>
              </div>
              <span class="text-[10px] text-surface-400 font-mono">DOC-REV-{{ content.document?.Version || 1 }}.0</span>
            </div>

            <!-- Document Title & Header -->
            <div class="space-y-1">
              <h2 class="text-lg font-bold text-surface-900 dark:text-surface-0 m-0">
                {{ content.Title }}
              </h2>
              <p class="text-xs text-surface-500 dark:text-surface-400">
                Official course reference documentation and implementation guidelines.
              </p>
            </div>

            <!-- Formatted Sample Paragraphs -->
            <div class="text-xs text-surface-700 dark:text-surface-300 space-y-3 leading-relaxed">
              <p>
                <strong>1. Executive Summary & Purpose:</strong> This curriculum resource provides standard operating procedures, architecture guidelines, and evaluation rubrics designed for engineering practitioners and corporate personnel at LSE Corporation.
              </p>
              <p>
                <strong>2. Core Principles:</strong> Adherence to compliance guidelines, clean code architecture, automated testing gates, and strict confidentiality protocols are mandatory across all team deployments.
              </p>
              <div class="p-3 bg-surface-100 dark:bg-surface-700/50 rounded-lg border-l-4 border-primary-500 text-[11px]">
                <strong>Important Note:</strong> Employees must complete the accompanying assessment quiz within 14 calendar days of reviewing this document.
              </div>
              <p>
                <strong>3. Sign-off & Audit Trail:</strong> All completion logs are automatically synchronized with the central HR Training Analytics database under compliance reference ISO-27001-A.8.
              </p>
            </div>
          </div>
        </div>

        <!-- Document Underlying Schema Metadata Card -->
        <div class="bg-surface-50 dark:bg-surface-850 p-4 rounded-xl border border-surface-200 dark:border-surface-700/80 space-y-2">
          <div class="flex items-center justify-between text-xs font-bold text-surface-900 dark:text-surface-0 border-b border-surface-200 dark:border-surface-700 pb-2">
            <span class="flex items-center gap-1.5 text-amber-600 dark:text-amber-400">
              <i class="pi pi-file text-xs"></i>
              Database Entity: [DOCUMENTS] Metadata Record
            </span>
            <span class="text-surface-400 font-mono text-[10px]">ContentId: #{{ content.ContentId }}</span>
          </div>

          <div class="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs pt-1">
            <div>
              <span class="text-surface-400 block text-[10px] uppercase font-bold">Document ID (PK)</span>
              <span class="font-mono font-bold text-surface-800 dark:text-surface-200">#{{ content.document?.DocumentId || 'N/A' }}</span>
            </div>
            <div>
              <span class="text-surface-400 block text-[10px] uppercase font-bold">File Name</span>
              <span class="font-mono text-surface-800 dark:text-surface-200 truncate block" :title="content.document?.FileName">
                {{ content.document?.FileName || 'N/A' }}
              </span>
            </div>
            <div>
              <span class="text-surface-400 block text-[10px] uppercase font-bold">File Size</span>
              <span class="font-bold text-emerald-600 dark:text-emerald-400">{{ content.document?.formattedSize || 'N/A' }}</span>
            </div>
            <div>
              <span class="text-surface-400 block text-[10px] uppercase font-bold">Doc Version</span>
              <span class="font-bold text-surface-800 dark:text-surface-200">v{{ content.document?.Version || 1 }}.0</span>
            </div>
          </div>

          <div class="pt-1 text-[11px] text-surface-500 font-mono truncate">
            <span class="text-surface-400">FilePath: </span>{{ content.document?.FilePath }}
          </div>
        </div>
      </div>
    </div>
  </Dialog>
</template>

<script setup>
import { ref, computed, watch } from 'vue';
import { Dialog, Button } from 'primevue';

const props = defineProps({
  visible: {
    type: Boolean,
    default: false
  },
  content: {
    type: Object,
    default: null
  }
});

const emit = defineEmits(['update:visible', 'download']);

const fallbackImage = 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=800&q=80';

const isPlaying = ref(false);
const isMuted = ref(false);
const videoProgress = ref(25);
const currentTime = ref(375); // 6m 15s

const dialogTitle = computed(() => {
  if (!props.content) return 'Media Preview';
  return props.content.ContentType === 'Video' 
    ? `Video Lecture: ${props.content.Title}` 
    : `Document Viewer: ${props.content.Title}`;
});

watch(() => props.visible, (newVal) => {
  if (newVal) {
    isPlaying.value = false;
    videoProgress.value = 25;
    currentTime.value = Math.floor((props.content?.Duration || 20) * 60 * 0.25);
  } else {
    isPlaying.value = false;
  }
});

function togglePlay() {
  isPlaying.value = !isPlaying.value;
}

function toggleMute() {
  isMuted.value = !isMuted.value;
}

function toggleFullscreen() {
  // Simulated
}

function seekVideo(e) {
  const rect = e.currentTarget.getBoundingClientRect();
  const clickX = e.clientX - rect.left;
  const ratio = Math.max(0, Math.min(1, clickX / rect.width));
  videoProgress.value = Math.round(ratio * 100);
  const totalSeconds = (props.content?.Duration || 20) * 60;
  currentTime.value = Math.round(totalSeconds * ratio);
}

function formatSeconds(secs) {
  if (!secs) return '0:00';
  const m = Math.floor(secs / 60);
  const s = Math.floor(secs % 60);
  return `${m}:${s < 10 ? '0' : ''}${s}`;
}

function simulateDownload() {
  emit('download', props.content?.document?.FileName || 'document.pdf');
}
</script>
