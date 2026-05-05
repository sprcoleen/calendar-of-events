import { defineStore } from 'pinia'
import { ref } from 'vue'
import { supabase } from '../lib/supabase'

export const useEventsStore = defineStore('events', () => {
  const events = ref([])
  const loading = ref(false)
  const error = ref(null)

  async function fetchEvents() {
    loading.value = true
    error.value = null
    const { data, error: err } = await supabase
      .from('events')
      .select('*')
      .order('date', { ascending: true })
    if (err) {
      error.value = err.message
    } else {
      events.value = data
    }
    loading.value = false
  }

  function getEventsForDate(dateStr) {
    const [, month, day] = dateStr.split('-')
    return events.value.filter(e => {
      if (e.recurring) {
        const [, em, ed] = e.date.split('-')
        return em === month && ed === day
      }
      return e.date === dateStr
    })
  }

  async function addEvent({ date, text, recurring, icon }) {
    const { data, error: err } = await supabase
      .from('events')
      .insert([{ date, text, recurring, icon }])
      .select()
      .single()
    if (err) throw new Error(err.message)
    events.value.push(data)
    return data
  }

  async function deleteEvent(id) {
    const { error: err } = await supabase
      .from('events')
      .delete()
      .eq('id', id)
    if (err) throw new Error(err.message)
    events.value = events.value.filter(e => e.id !== id)
  }

  return { events, loading, error, fetchEvents, getEventsForDate, addEvent, deleteEvent }
})
