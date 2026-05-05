<script setup>
import { ref } from 'vue'
import { useAuthStore } from '../stores/auth'

defineProps({ show: { type: Boolean, default: false } })
const emit = defineEmits(['close'])

const authStore = useAuthStore()

const username = ref('')
const password = ref('')
const error = ref(false)

function handleLogin() {
  error.value = false
  const ok = authStore.login(username.value.trim(), password.value)
  if (ok) {
    username.value = ''
    password.value = ''
    emit('close')
  } else {
    error.value = true
  }
}

function handleClose() {
  username.value = ''
  password.value = ''
  error.value = false
  emit('close')
}
</script>

<template>
  <Teleport to="body">
    <div v-if="show" class="overlay" @click.self="handleClose">
      <div class="modal" role="dialog" aria-modal="true" aria-labelledby="login-title">
        <div class="modal-header">
          <h2 id="login-title">Admin Login</h2>
          <button class="close-btn" @click="handleClose" aria-label="Close">✕</button>
        </div>

        <div class="modal-body">
          <div class="form-group">
            <label for="login-user">Username</label>
            <input
              id="login-user"
              v-model="username"
              type="text"
              placeholder="Enter username"
              autocomplete="username"
              @keydown.enter="handleLogin"
            />
          </div>
          <div class="form-group">
            <label for="login-pass">Password</label>
            <input
              id="login-pass"
              v-model="password"
              type="password"
              placeholder="Enter password"
              autocomplete="current-password"
              @keydown.enter="handleLogin"
            />
            <p v-if="error" class="error-msg">Invalid username or password.</p>
          </div>
        </div>

        <div class="modal-footer">
          <button class="btn btn-secondary" @click="handleClose">Cancel</button>
          <button class="btn btn-primary" @click="handleLogin">Login</button>
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
  z-index: 300;
  padding: 1rem;
  backdrop-filter: blur(2px);
}

.modal {
  background: #fff;
  border-radius: 1rem;
  width: 100%;
  max-width: 400px;
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
  gap: 1rem;
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

input {
  padding: .6rem .75rem;
  border: 1.5px solid #e2e8f0;
  border-radius: .5rem;
  font-size: .875rem;
  outline: none;
  transition: border-color .12s, box-shadow .12s;
}
input:focus {
  border-color: #4f46e5;
  box-shadow: 0 0 0 3px rgba(79,70,229,.12);
}

.error-msg {
  font-size: .75rem;
  color: #ef4444;
  margin-top: .2rem;
}

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

.btn-secondary { background: #f1f5f9; color: #1e293b; }
.btn-secondary:hover { background: #e2e8f0; }

.btn-primary { background: #4f46e5; color: #fff; }
.btn-primary:hover { background: #4338ca; }
</style>
