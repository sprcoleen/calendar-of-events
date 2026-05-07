<script setup>
import { computed, ref } from 'vue'
import { useEventsStore } from '../stores/events'
import { useAuthStore } from '../stores/auth'

const props = defineProps({
  date: { type: String, default: null }, // 'YYYY-MM-DD'
})

const emit = defineEmits(['close', 'add-event', 'edit-event'])

const eventsStore = useEventsStore()
const authStore = useAuthStore()

const ICONS = {
  heart: '❤️', star: '⭐', cake: '🎂',
  pencil: '✏️', cd: '💿', earth: '🌍',
}

const formattedDate = computed(() => {
  if (!props.date) return ''
  const [y, m, d] = props.date.split('-')
  return new Date(+y, +m - 1, +d).toLocaleDateString('en-US', {
    month: 'long', day: 'numeric', year: 'numeric',
  })
})

const dayEvents = computed(() =>
  props.date ? eventsStore.getEventsForDate(props.date) : []
)

const deletingId = ref(null)

async function handleDelete(id) {
  deletingId.value = id
  try {
    await eventsStore.deleteEvent(id)
  } finally {
    deletingId.value = null
  }
}
</script>

<template>
  <Teleport to="body">
    <div v-if="date" class="overlay" @click.self="emit('close')">
      <div class="modal" role="dialog" aria-modal="true">
        <div class="modal-header">
          <h2>{{ formattedDate }}</h2>
          <button class="close-btn" @click="emit('close')" aria-label="Close">✕</button>
        </div>

        <div class="modal-body">
          <ul v-if="dayEvents.length" class="event-list">
            <li v-for="ev in dayEvents" :key="ev.id" class="event-item">
              <span class="ev-icon">{{ ICONS[ev.icon] || '📌' }}</span>
              <span class="ev-text">{{ ev.text }}</span>
              <span v-if="ev.recurring" class="recurring-badge">↻ Recurring</span>
              <button
                v-if="authStore.isAdmin"
                class="edit-btn"
                @click="emit('edit-event', ev)"
                aria-label="Edit event"
              >✎</button>
              <button
                v-if="authStore.isAdmin"
                class="delete-btn"
                :disabled="deletingId === ev.id"
                @click="handleDelete(ev.id)"
                aria-label="Delete event"
              >✕</button>
            </li>
          </ul>
          <p v-else class="no-events">No events for this day.</p>

          <button
            v-if="authStore.isAdmin"
            class="add-btn"
            @click="emit('add-event', date)"
          >
            + Add Event
          </button>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<style scoped>
.overlay {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,.45);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 200;
  padding: 1rem;
  backdrop-filter: blur(2px);
}

.modal {
  background: #fff;
  border-radius: 1rem;
  width: 100%;
  max-width: 460px;
  max-height: 85vh;
  overflow-y: auto;
  box-shadow: 0 20px 40px rgba(0,0,0,.15);
  animation: pop .18s ease;
}

@keyframes pop {
  from { transform: scale(.95); opacity: 0; }
  to   { transform: scale(1);   opacity: 1; }
}

.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.1rem 1.4rem;
  border-bottom: 1px solid #e2e8f0;
}

.modal-header h2 {
  font-size: 1.05rem;
  font-weight: 700;
  color: #1e293b;
}

.close-btn {
  background: none;
  border: none;
  cursor: pointer;
  color: #94a3b8;
  font-size: 1rem;
  padding: .25rem .4rem;
  border-radius: .25rem;
  transition: background .12s;
}
.close-btn:hover { background: #f1f5f9; color: #1e293b; }

.modal-body {
  padding: 1.2rem 1.4rem;
  display: flex;
  flex-direction: column;
  gap: .75rem;
}

.event-list {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: .5rem;
}

.event-item {
  display: flex;
  align-items: center;
  gap: .65rem;
  padding: .7rem .9rem;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: .5rem;
}

.ev-icon { font-size: 1.2rem; flex-shrink: 0; }

.ev-text {
  flex: 1;
  font-size: .875rem;
  color: #1e293b;
}

.recurring-badge {
  font-size: .65rem;
  background: #eef2ff;
  color: #4f46e5;
  border-radius: 9999px;
  padding: .15rem .5rem;
  font-weight: 600;
  white-space: nowrap;
}

.edit-btn {
  background: none;
  border: none;
  cursor: pointer;
  color: #4f46e5;
  font-size: .9rem;
  padding: .25rem .4rem;
  border-radius: .25rem;
  opacity: .7;
  transition: opacity .12s;
}
.edit-btn:hover { opacity: 1; background: #eef2ff; }

.delete-btn {
  background: none;
  border: none;
  cursor: pointer;
  color: #ef4444;
  font-size: .75rem;
  padding: .25rem .4rem;
  border-radius: .25rem;
  opacity: .7;
  transition: opacity .12s;
}
.delete-btn:hover:not(:disabled) { opacity: 1; background: #fef2f2; }
.delete-btn:disabled { opacity: .35; cursor: not-allowed; }

.no-events {
  text-align: center;
  color: #94a3b8;
  font-size: .875rem;
  padding: 1rem 0;
}

.add-btn {
  width: 100%;
  padding: .6rem;
  background: #4f46e5;
  color: #fff;
  border: none;
  border-radius: .5rem;
  font-size: .875rem;
  font-weight: 600;
  cursor: pointer;
  transition: background .12s;
}
.add-btn:hover { background: #4338ca; }
</style>
