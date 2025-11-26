<template>
  <div class="dashboard-shell">
    <aside class="dashboard-sidebar">
      <Sidebar />
    </aside>

    <main class="dashboard-main">
      <Topbar />

      <section class="dashboard-content">
        <router-view />
      </section>
    </main>
  </div>
</template>

<script setup>
import Sidebar from '../components/Sidebar.vue'
import Topbar from '../components/Topbar.vue'
</script>
