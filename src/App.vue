<script setup>
import { ref, onMounted } from 'vue'
import { useEventsStore } from './stores/events'
import { useAuthStore } from './stores/auth'
import CalendarGrid from './components/CalendarGrid.vue'
import EventsModal from './components/EventsModal.vue'
import AdminLoginModal from './components/AdminLoginModal.vue'
import AddEventModal from './components/AddEventModal.vue'

const YEAR = 2026

const eventsStore = useEventsStore()
const authStore = useAuthStore()

const selectedDate = ref(null)
const showLoginModal = ref(false)
const showAddModal = ref(false)
const addEventDate = ref(null)

onMounted(() => eventsStore.fetchEvents())

function openEventsModal(date) {
  selectedDate.value = date
}

function closeEventsModal() {
  selectedDate.value = null
}

function openAddEvent(date) {
  addEventDate.value = date
  showAddModal.value = true
}

function closeAddModal() {
  showAddModal.value = false
  addEventDate.value = null
}
</script>

<template>
  <div class="app">
    <header class="site-header">
      <div class="header-left">
        <span class="logo">📅</span>
        <div>
          <h1 class="site-title">Calendar of Events</h1>
          <p class="site-sub">{{ YEAR }}</p>
        </div>
      </div>
      <div class="header-right">
        <template v-if="authStore.isAdmin">
          <span class="admin-badge">👤 Admin</span>
          <button class="btn btn-outline" @click="authStore.logout()">Logout</button>
        </template>
        <button v-else class="btn btn-outline" @click="showLoginModal = true">
          Admin Login
        </button>
      </div>
    </header>

    <main>
      <h2 class="year-label">{{ YEAR }}</h2>

      <div v-if="eventsStore.loading" class="loading">Loading events…</div>
      <div v-else-if="eventsStore.error" class="load-error">
        Could not load events: {{ eventsStore.error }}
      </div>
      <CalendarGrid v-else :year="YEAR" @select-date="openEventsModal" />
    </main>

    <EventsModal
      :date="selectedDate"
      @close="closeEventsModal"
      @add-event="openAddEvent"
    />

    <AdminLoginModal
      :show="showLoginModal"
      @close="showLoginModal = false"
    />

    <AddEventModal
      :show="showAddModal"
      :date="addEventDate"
      @close="closeAddModal"
    />
  </div>
</template>

<style scoped>
.app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.site-header {
  position: sticky;
  top: 0;
  z-index: 100;
  background: #4f46e5;
  color: #fff;
  padding: .9rem 2rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-shadow: 0 2px 8px rgba(0,0,0,.15);
}

.header-left {
  display: flex;
  align-items: center;
  gap: .75rem;
}

.logo { font-size: 1.6rem; line-height: 1; }

.site-title {
  font-size: 1.25rem;
  font-weight: 800;
  letter-spacing: -.02em;
  line-height: 1;
}

.site-sub {
  font-size: .75rem;
  opacity: .75;
  margin-top: 2px;
}

.header-right {
  display: flex;
  align-items: center;
  gap: .75rem;
}

.admin-badge {
  background: rgba(255,255,255,.2);
  border-radius: 9999px;
  padding: .25rem .75rem;
  font-size: .75rem;
  font-weight: 600;
}

.btn {
  padding: .45rem 1rem;
  border-radius: .5rem;
  font-size: .85rem;
  font-weight: 600;
  cursor: pointer;
  border: none;
  transition: background .12s;
}

.btn-outline {
  background: transparent;
  border: 1.5px solid rgba(255,255,255,.6);
  color: #fff;
}
.btn-outline:hover { background: rgba(255,255,255,.15); }

main {
  flex: 1;
  max-width: 1400px;
  margin: 0 auto;
  padding: 2rem 1.5rem;
  width: 100%;
}

.year-label {
  text-align: center;
  font-size: 2rem;
  font-weight: 800;
  letter-spacing: -.04em;
  color: #1e293b;
  margin-bottom: 1.75rem;
}

.loading,
.load-error {
  text-align: center;
  padding: 3rem;
  color: #64748b;
  font-size: .95rem;
}
.load-error { color: #ef4444; }
</style>
