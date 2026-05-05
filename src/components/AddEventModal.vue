<script setup>
import { ref, watch } from 'vue'
import { useEventsStore } from '../stores/events'

const props = defineProps({
  date: { type: String, default: null }, // pre-filled date 'YYYY-MM-DD'
  show: { type: Boolean, default: false },
})

const emit = defineEmits(['close'])

const eventsStore = useEventsStore()

const ICON_OPTIONS = [
  { key: 'heart',  emoji: '❤️' },
  { key: 'star',   emoji: '⭐' },
  { key: 'cake',   emoji: '🎂' },
  { key: 'pencil', emoji: '✏️' },
  { key: 'cd',     emoji: '💿' },
  { key: 'earth',  emoji: '🌍' },
]

const selectedDate = ref('')
const eventText = ref('')
const recurring = ref(false)
const selectedIcon = ref('star')
const textError = ref(false)
const saving = ref(false)

// Pre-fill date whenever the modal opens
watch(() => props.show, (val) => {
  if (val) {
    selectedDate.value = props.date || ''
    eventText.value = ''
    recurring.value = false
    selectedIcon.value = 'star'
    textError.value = false
  }
})

async function handleSave() {
  textError.value = false
  if (!eventText.value.trim()) {
    textError.value = true
    return
  }

  saving.value = true
  try {
    await eventsStore.addEvent({
      date: selectedDate.value,
      text: eventText.value.trim(),
      recurring: recurring.value,
      icon: selectedIcon.value,
    })
    emit('close')
  } finally {
    saving.value = false
  }
}

function handleClose() {
  emit('close')
}
</script>

<template>
  <Teleport to="body">
    <div v-if="show" class="overlay" @click.self="handleClose">
      <div class="modal" role="dialog" aria-modal="true" aria-labelledby="add-event-title">
        <div class="modal-header">
          <h2 id="add-event-title">Add Event</h2>
          <button class="close-btn" @click="handleClose" aria-label="Close">✕</button>
        </div>

        <div class="modal-body">
          <!-- Date -->
          <div class="form-group">
            <label for="ev-date">Date</label>
            <input id="ev-date" v-model="selectedDate" type="date" />
          </div>

          <!-- Event text -->
          <div class="form-group">
            <label for="ev-text">Event Description</label>
            <input
              id="ev-text"
              v-model="eventText"
              type="text"
              placeholder="Enter event description"
              @keydown.enter="handleSave"
            />
            <p v-if="textError" class="error-msg">Please enter an event description.</p>
          </div>

          <!-- Icon picker -->
          <div class="form-group">
            <label>Icon</label>
            <div class="icon-picker">
              <button
                v-for="opt in ICON_OPTIONS"
                :key="opt.key"
                class="icon-option"
                :class="{ selected: selectedIcon === opt.key }"
                type="button"
                :aria-label="opt.key"
                @click="selectedIcon = opt.key"
              >{{ opt.emoji }}</button>
            </div>
          </div>

          <!-- Recurring -->
          <div class="form-group">
            <label class="checkbox-label">
              <input v-model="recurring" type="checkbox" />
              <span>Recurring event <span class="hint">(repeats annually on same date)</span></span>
            </label>
          </div>
        </div>

        <div class="modal-footer">
          <button class="btn btn-secondary" @click="handleClose">Cancel</button>
          <button class="btn btn-primary" :disabled="saving" @click="handleSave">
            {{ saving ? 'Saving…' : 'Save Event' }}
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
  z-index: 400;
  padding: 1rem;
  backdrop-filter: blur(2px);
}

.modal {
  background: #fff;
  border-radius: 1rem;
  width: 100%;
  max-width: 460px;
  max-height: 90vh;
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
.modal-header h2 { font-size: 1.05rem; font-weight: 700; color: #1e293b; }

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
  padding: 1.4rem;
  display: flex;
  flex-direction: column;
  gap: 1.1rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: .35rem;
}

label {
  font-size: .85rem;
  font-weight: 600;
  color: #374151;
}

input[type="text"],
input[type="date"] {
  padding: .6rem .75rem;
  border: 1.5px solid #e2e8f0;
  border-radius: .5rem;
  font-size: .875rem;
  outline: none;
  transition: border-color .12s, box-shadow .12s;
  font-family: inherit;
  color: #1e293b;
  background: #fff;
}
input:focus {
  border-color: #4f46e5;
  box-shadow: 0 0 0 3px rgba(79,70,229,.12);
}

.error-msg { font-size: .75rem; color: #ef4444; }

.icon-picker {
  display: flex;
  gap: .5rem;
  flex-wrap: wrap;
}

.icon-option {
  width: 2.6rem;
  height: 2.6rem;
  border-radius: .5rem;
  border: 2px solid #e2e8f0;
  background: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.25rem;
  cursor: pointer;
  transition: border-color .12s, background .12s;
}
.icon-option:hover { border-color: #4f46e5; background: #eef2ff; }
.icon-option.selected {
  border-color: #4f46e5;
  background: #eef2ff;
  box-shadow: 0 0 0 3px rgba(79,70,229,.15);
}

.checkbox-label {
  display: flex;
  align-items: center;
  gap: .5rem;
  cursor: pointer;
  font-weight: 500;
}
.checkbox-label input[type="checkbox"] {
  width: 1rem;
  height: 1rem;
  accent-color: #4f46e5;
  cursor: pointer;
}
.hint { font-size: .75rem; color: #94a3b8; font-weight: 400; }

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: .75rem;
  padding: 1rem 1.4rem;
  border-top: 1px solid #e2e8f0;
}

.btn {
  padding: .5rem 1.1rem;
  border-radius: .5rem;
  font-size: .875rem;
  font-weight: 600;
  cursor: pointer;
  border: none;
  transition: background .12s;
}
.btn:disabled { opacity: .6; cursor: not-allowed; }
.btn-secondary { background: #f1f5f9; color: #1e293b; }
.btn-secondary:hover:not(:disabled) { background: #e2e8f0; }
.btn-primary { background: #4f46e5; color: #fff; }
.btn-primary:hover:not(:disabled) { background: #4338ca; }
</style>
