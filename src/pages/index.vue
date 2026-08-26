<route>
{
  meta: {
    title: "E-Learning Dashboard",
    icon: "pi pi-home"
  }
}
</route>

<template>
  <Dashboard v-if="Dashboard" />
</template>

<script setup>
import { defineAsyncComponent } from 'vue';

const Dashboard = defineAsyncComponent(() => import('./Dashboard.vue'));
</script>
