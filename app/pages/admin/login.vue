<template>
  <div class="login-container">
    <form @submit.prevent="handleLogin" class="login-form">
      <h1>Вход в админ-панель</h1>
      
      <div class="form-group">
        <label>Логин</label>
        <input 
          v-model="form.username" 
          type="text" 
          required 
          placeholder="admin"
        />
      </div>

      <div class="form-group">
        <label>Пароль</label>
        <input 
          v-model="form.password" 
          type="password" 
          required 
          placeholder="••••••••"
        />
      </div>

      <button type="submit" :disabled="loading">
        {{ loading ? 'Вход...' : 'Войти' }}
      </button>

      <p v-if="error" class="error">{{ error }}</p>
    </form>
  </div>
</template>

<script setup>
const config = useRuntimeConfig()
const router = useRouter()
const loading = ref(false)
const error = ref('')
const form = ref({ username: '', password: '' })

const handleLogin = async () => {
  loading.value = true
  error.value = ''
  try {
    const { data } = await useFetch(`${config.public.apiBaseUrl}/auth/login`, {
      method: 'POST',
      body: form.value
    })
    if (data.value?.token) {
      localStorage.setItem('token', data.value.token)
      localStorage.setItem('user', JSON.stringify(data.value))
      router.push('/admin/dashboard')
    }
  } catch (err) {
    error.value = 'Ошибка входа'
  } finally {
    loading.value = false
  }
}
</script>
<style scoped lang="scss">
@use '~/assets/scss/variables' as *;

.login-container {
  min-height: 60vh;
  display: flex;
  justify-content: center;
  align-items: center;
}

.login-form {
  background: rgba($primary, 0.05);
  padding: 2rem;
  border-radius: $border-radius-lg;
  width: 100%;
  max-width: 400px;
  border: 1px solid rgba($primary, 0.2);

  h1 {
    text-align: center;
    margin-bottom: 2rem;
    color: $primary;
  }

  .form-group {
    margin-bottom: 1.5rem;

    label {
      display: block;
      margin-bottom: 0.5rem;
      color: $text-secondary;
    }

    input {
      width: 100%;
      padding: 0.75rem;
      border: 1px solid rgba($primary, 0.2);
      border-radius: $border-radius;
      background: $secondary;
      color: $text-primary;

      &:focus {
        outline: none;
        border-color: $primary;
      }
    }
  }

  button {
    width: 100%;
    padding: 0.75rem;
    background: $primary;
    color: white;
    border: none;
    border-radius: $border-radius;
    font-weight: bold;
    cursor: pointer;
    transition: background 0.3s ease;

    &:hover:not(:disabled) {
      background: color-mix(in srgb, $primary, white 10%);
    }

    &:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
  }

  .error {
    color: $primary;
    margin-top: 1rem;
    text-align: center;
  }
}
</style>