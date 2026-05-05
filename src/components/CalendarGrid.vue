<script setup>
import MonthCard from './MonthCard.vue'

defineProps({
  year: { type: Number, required: true },
})

const emit = defineEmits(['select-date'])
</script>

<template>
  <div class="calendar-grid">
    <MonthCard
      v-for="monthIndex in 12"
      :key="monthIndex"
      :year="year"
      :month-index="monthIndex - 1"
      @select-date="emit('select-date', $event)"
    />
  </div>
</template>

<style scoped>
.calendar-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1.25rem;
}
</style>
