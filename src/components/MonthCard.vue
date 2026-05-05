<script setup>
import { computed } from 'vue'
import { useEventsStore } from '../stores/events'

const props = defineProps({
  year: { type: Number, required: true },
  monthIndex: { type: Number, required: true }, // 0-based
})

const emit = defineEmits(['select-date'])

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
]
const DAY_NAMES = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

const ICONS = {
  heart: '❤️', star: '⭐', cake: '🎂',
  pencil: '✏️', cd: '💿', earth: '🌍',
}

const eventsStore = useEventsStore()

const today = new Date()
const todayStr = [
  today.getFullYear(),
  String(today.getMonth() + 1).padStart(2, '0'),
  String(today.getDate()).padStart(2, '0'),
].join('-')

const leadingBlanks = computed(() => {
  return new Date(props.year, props.monthIndex, 1).getDay()
})

const daysInMonth = computed(() => {
  return new Date(props.year, props.monthIndex + 1, 0).getDate()
})

function dateStr(day) {
  return `${props.year}-${String(props.monthIndex + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
}

function dayEvents(day) {
  return eventsStore.getEventsForDate(dateStr(day))
}

function isToday(day) {
  return dateStr(day) === todayStr
}
</script>

<template>
  <div class="month-card">
    <div class="month-header">{{ MONTH_NAMES[monthIndex] }}</div>

    <div class="days-header">
      <span v-for="name in DAY_NAMES" :key="name" class="day-name">{{ name }}</span>
    </div>

    <div class="days-grid">
      <div
        v-for="n in leadingBlanks"
        :key="`blank-${n}`"
        class="day-cell empty"
      />
      <div
        v-for="day in daysInMonth"
        :key="day"
        class="day-cell"
        :class="{
          today: isToday(day),
          'has-events': dayEvents(day).length > 0,
        }"
        @click="emit('select-date', dateStr(day))"
      >
        <span class="day-number">{{ day }}</span>
        <div v-if="dayEvents(day).length" class="event-icons">
          <span
            v-for="ev in dayEvents(day).slice(0, 3)"
            :key="ev.id"
          >{{ ICONS[ev.icon] || '📌' }}</span>
          <span v-if="dayEvents(day).length > 3">+</span>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.month-card {
  background: #fff;
  border-radius: 1rem;
  border: 1px solid #e2e8f0;
  box-shadow: 0 1px 3px rgba(0,0,0,.08);
  overflow: hidden;
}

.month-header {
  background: #4f46e5;
  color: #fff;
  text-align: center;
  padding: .6rem;
  font-weight: 700;
  font-size: .9rem;
  letter-spacing: .05em;
  text-transform: uppercase;
}

.days-header {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  background: #eef2ff;
}

.day-name {
  text-align: center;
  padding: .4rem 0;
  font-size: .65rem;
  font-weight: 700;
  color: #4f46e5;
  text-transform: uppercase;
}

.days-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 2px;
  padding: .4rem;
}

.day-cell {
  aspect-ratio: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border-radius: .375rem;
  font-size: .78rem;
  cursor: pointer;
  transition: background .12s;
  gap: 1px;
  user-select: none;
}

.day-cell:hover {
  background: #eef2ff;
}

.day-cell.empty {
  cursor: default;
}
.day-cell.empty:hover {
  background: transparent;
}

.day-cell.today {
  background: #fef3c7;
  border: 1.5px solid #f59e0b;
  font-weight: 700;
}

.day-cell.has-events .day-number {
  font-weight: 700;
  color: #4f46e5;
}

.event-icons {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 1px;
  font-size: .5rem;
  line-height: 1;
}
</style>
