<template>
  <form @submit.prevent="handleSubmit" class="article-form">
    
    <div class="form-group">
      <label>Заголовок *</label>
      <input v-model="localData.title" required />
    </div>

    <div class="form-group">
      <label>Краткое описание *</label>
      <textarea v-model="localData.excerpt" required rows="3"></textarea>
    </div>

    <div class="form-group">
      <label>Контент *</label>
      <textarea v-model="localData.content" required rows="10"></textarea>
    </div>

    <div class="form-group">
      <label>URL изображения</label>
      <input v-model="localData.image" placeholder="https://..." />
    </div>


    
    <div class="form-group">
      <label>Автор</label>
      <div class="author-selector">
        <select v-model="selectedAuthorId" @change="selectExistingAuthor">
          <option value="">— Выберите существующего автора —</option>
          <option v-for="author in authors" :key="author.id" :value="author.id">
            {{ author.name }}
          </option>
        </select>
        <span class="separator">или</span>
        <input 
          v-model="newAuthorName" 
          placeholder="Введите имя нового автора"
          @input="handleNewAuthorInput"
        />
      </div>
    </div>
    <div class="form-group ai-generate">
      <label>⚡ Генерация через AI</label>
      <div class="ai-controls">
        <button 
          type="button" 
          @click="generateNews" 
          :disabled="generating || !selectedCategory || !localData.author"
          class="ai-button"
        >
          {{ generating ? 'Генерация...' : 'Сгенерировать новость' }}
        </button>
        <span v-if="generating" class="spinner">⏳</span>
      </div>
      <small class="hint">Выберите автора и категорию, затем нажмите кнопку. Поля заполнятся автоматически.</small>
    </div>

    
    <div class="form-row">
      <div class="form-group">
        <label>Категория</label>
        <select v-model="selectedCategory">
          <option v-for="cat in categories" :key="cat.id" :value="cat">
            {{ cat.name }}
          </option>
        </select>
      </div>

      <div class="form-group">
        <label>Теги (через запятую)</label>
        <input v-model="tagsInput" placeholder="" />
      </div>
    </div>

    <div class="form-group checkbox">
      <label>
        <input type="checkbox" v-model="localData.isFeatured" />
        Рекомендованная (featured)
      </label>
    </div>
     
    <div class="form-group checkbox">
      <label>
        <input type="checkbox" v-model="localData.publishToTelegram" />
        Опубликовать в Telegram
      </label>
    </div> 
      
  <div class="form-group">
    <label>Поиск фото на Pexels</label>
    <div class="pexels-search">
      <input 
        v-model="searchQuery" 
        @keyup.enter="searchPexels"
        placeholder="Введите запрос (например, название игры)"
        class="pexels-input"
      />
      <button 
        type="button" 
        @click="searchUnsplash" 
        :disabled="searchingImages"
        class="btn-secondary"
      >
        {{ searchingImages ? 'Поиск...' : 'Найти' }}
      </button>
    </div>

    
    <div v-if="imagesResults.length" class="pexels-results">
      <div 
        v-for="img in imagesResults" 
        :key="img.id"
        class="pexels-thumb"
        @click="selectPexelsImage(img.url)"
      >
        <img :src="img.thumbnail" :alt="img.photographer" />
        <div class="pexels-credit">© {{ img.photographer }}</div>
      </div>
    </div>
    
    
    <div v-if="localData.image" class="image-preview">
      <p>Выбранное изображение:</p>
      <img :src="localData.image" class="preview-img" />
    </div>
  </div>
  <div class="form-group">
      <label>Текст для Яндекс.Новостей (сухой, фактологичный)</label>
      <textarea v-model="localData.yandex_news" rows="4" placeholder="Автоматически заполнится при генерации"></textarea>
    </div>

    <div class="form-group">
      <label>Текст для Google News (сухой, фактологичный)</label>
      <textarea v-model="localData.google_news" rows="4" placeholder="Автоматически заполнится при генерации"></textarea>
    </div>

    <button type="submit" :disabled="saving">
      {{ saving ? 'Сохранение...' : 'Сохранить' }}
    </button>

  </form>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
const props = defineProps({
  initialData: { type: Object, required: true }
})
const emit = defineEmits(['submit'])
const config = useRuntimeConfig();
const generating = ref(false);
const categories = [
  { id: 1, name: 'Звёзды', slug: 'stars' },
  { id: 2, name: 'Слухи', slug: 'gossip' },
  { id: 3, name: 'Скандалы', slug: 'scandals' },
  { id: 4, name: 'Мода', slug: 'fashion' },
  { id: 5, name: 'Пары', slug: 'couples' },
  { id: 6, name: 'Дети', slug: 'babies' }
]



const authors = [
  { id: 1, name: 'Роберта «Naughty» Шутер', bio: 'Королева сплетен и инсайдов. Знает всё о звёздах, но никогда не называет источники.' },
  { id: 2, name: 'Римма «GuyWithACamera» Фельдман', bio: 'Папарацци с 20-летним стажем. Ловит звёзд в самых неожиданных местах. Её фото — всегда эксклюзив.' },
  { id: 3, name: 'Лидия «MyLifeInMovies» Маркс', bio: 'Звёздный интервьюер. Берёт интервью у голливудской элиты на красных дорожках и премьерах.' },
  { id: 4, name: 'Пелагея «Perez» Хилтон', bio: 'Скандальный обозреватель. Не боится называть вещи своими именами. Острый язык и ещё более острые комментарии.' },
  { id: 5, name: 'Дарья «JustJared» Джерард', bio: 'Фотограф и репортёр. Её камера всегда наготове. Только проверенные факты и лучшие фото.' }
]


const localData = ref({ ...props.initialData })
const tagsInput = ref(localData.value.tags?.join(', ') || '')
const selectedCategory = ref(localData.value.category || categories[0])
const selectedAuthorId = ref(localData.value.author?.id || '')
const newAuthorName = ref('')
const saving = ref(false)
const searchQuery = ref('')
// const pexelsImages = ref([])
const imagesResults = ref([])
// const searchingPexels = ref(false)
const searchingImages = ref(false)


const generateNews = async () => {
  if (!selectedCategory.value || !localData.value.author) {
    alert('Сначала выберите автора и категорию');
    return;
  }

  generating.value = true;
  try {
    const token = localStorage.getItem('token');
    const response = await $fetch(`${config.public.apiBaseUrl}/ai/generate-news`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body: {
        authorId: localData.value.author.id,
        category: selectedCategory.value.name
      }
    });
    if (response.error) {
     alert(`Ошибка: ${response.error}. Попробуйте другую категорию.`);
    return;
    }
    
    if (response.title) localData.value.title = response.title;
    if (response.excerpt) localData.value.excerpt = response.excerpt;
    if (response.content) localData.value.content = response.content;
    if (response.image) localData.value.image = response.image;

    
    if (response.tags) {
      if (Array.isArray(response.tags)) {
        localData.value.tags = response.tags;
        tagsInput.value = response.tags.join(', ');
      } else if (typeof response.tags === 'string') {
        // Если пришла строка, разбиваем по запятой
        const tagsArray = response.tags.split(',').map(t => t.trim()).filter(Boolean);
        localData.value.tags = tagsArray;
        tagsInput.value = tagsArray.join(', ');
      }
    }
    if (response.yandex_news) localData.value.yandex_news = response.yandex_news;
    if (response.google_news) localData.value.google_news = response.google_news;

  } catch (err) {
    alert('Ошибка при генерации новости');
    console.error(err);
  } finally {
    generating.value = false;
  }
};


onMounted(() => {
  if (localData.value.author) {
    const existing = authors.find(a => a.id === localData.value.author.id)
    if (existing) {
      selectedAuthorId.value = existing.id
    } else {
      newAuthorName.value = localData.value.author.name
    }
  }
})

watch(selectedCategory, (val) => {
  localData.value.category = val
})


const selectExistingAuthor = () => {
  if (selectedAuthorId.value) {
    const author = authors.find(a => a.id === parseInt(selectedAuthorId.value))
    if (author) {
      localData.value.author = author
      newAuthorName.value = '' 
    }
  } else {
    
  }
}


const handleNewAuthorInput = () => {
  if (newAuthorName.value.trim()) {
    selectedAuthorId.value = '' 

    localData.value.author = {
      id: Date.now(), // 
      name: newAuthorName.value.trim(),
      avatar: ''
    }
  }
}






const processImage = async (url) => {
  
  if (url && url.includes('cloudinary.com')) {
    return url;
  }
  
  try {
    const token = process.client ? localStorage.getItem('token') : null;
    const response = await $fetch(`${config.public.apiBaseUrl}/upload/from-url`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body: { imageUrl: url }
    });
    return response.url;
  } catch (err) {
    console.error('Ошибка загрузки изображения:', err);
    return url;
  }
};


const handleSubmit = async () => {
  saving.value = true;
    saving.value = true;
  

  if (localData.value.image && localData.value.image.trim() && 
      !localData.value.image.includes('cloudinary.com')) {
    const processedUrl = await processImage(localData.value.image);
    localData.value.image = processedUrl;
  }

  localData.value.tags = tagsInput.value.split(',').map(t => t.trim()).filter(Boolean);
  if (!localData.value.author) {
    localData.value.author = { id: 1, name: 'GameNews', avatar: '' };
  }
  
  await emit('submit', localData.value);
  saving.value = false;
};

// const searchPexels = async () => {
//   if (!searchQuery.value.trim()) return
//   searchingPexels.value = true
//   try {
//     const token = localStorage.getItem('token')
//     console.log(token)
//     const response = await $fetch(`${config.public.apiBaseUrl}/pexels/search`, {
//       query: { query: searchQuery.value },
//       headers: { Authorization: `Bearer ${token}` }
//     })
//     pexelsImages.value = response
//   } catch (err) {
//      console.log('sdsddd')
//     alert('Ошибка поиска изображений')
//     console.error(err)
//   } finally {
//     searchingPexels.value = false
//   }
// }
const searchUnsplash = async () => {
  if (!searchQuery.value.trim()) return;
  searchingImages.value = true;
  try {
    if (process.client) {
      const token = localStorage.getItem('token');
      const response = await $fetch(`${config.public.apiBaseUrl}/unsplash/search`, {
        query: { query: searchQuery.value },
        headers: { Authorization: `Bearer ${token}` }
      });
      imagesResults.value = Array.isArray(response) ? response : [];
      console.log('Найдено изображений:', imagesResults.value.length);
    }
  } catch (err) {
    console.error('Ошибка поиска изображений:', err);
    alert('Ошибка поиска изображений');
  } finally {
    searchingImages.value = false;
  }
};

const selectPexelsImage = (url) => {
  localData.value.image = url
  imagesResults.value = [] 
}
</script>

<style scoped lang="scss">
@use '~/assets/scss/variables' as *;

.article-form {
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
  background: rgba($primary, 0.05);
  border-radius: $border-radius-lg;
}

.form-group {
  margin-bottom: 1.5rem;

  label {
    display: block;
    margin-bottom: 0.5rem;
    color: $text-secondary;
  }

  input, textarea, select {
    width: 100%;
    padding: 0.75rem;
    border: 1px solid rgba($primary, 0.2);
    border-radius: $border-radius;
    background: $secondary;
    color: $text-primary;
    font-family: inherit;

    &:focus {
      outline: none;
      border-color: $primary;
    }
  }

  textarea {
    resize: vertical;
  }
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

.author-selector {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  
  @media (min-width: 768px) {
    flex-direction: row;
    align-items: center;
  }
  
  select, input {
    flex: 1;
  }
  
  .separator {
    text-align: center;
    color: $text-muted;
    font-size: 0.9rem;
  }
}

.checkbox {
  display: flex;
  align-items: center;
  label {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    cursor: pointer;
  }
  input {
    width: auto;
  }
}

button {
  background: $primary;
  color: white;
  border: none;
  padding: 0.75rem 2rem;
  border-radius: $border-radius;
  font-weight: bold;
  cursor: pointer;
  transition: background 0.3s;

  &:hover:not(:disabled) {
    background: color-mix(in srgb, $primary, white 10%);
  }
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
}
.ai-generate {
  border-top: 1px dashed rgba($primary, 0.3);
  padding-top: 1.5rem;
  margin-top: 1.5rem;
}

.ai-controls {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.ai-button {
  background: $primary;
  color: white;
  border: none;
  padding: 0.6rem 1.2rem;
  border-radius: $border-radius;
  font-weight: bold;
  cursor: pointer;
  transition: background 0.3s;

  &:hover:not(:disabled) {
    background: color-mix(in srgb, $primary, white 10%);
  }
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
}

.spinner {
  font-size: 1.2rem;
}

.hint {
  display: block;
  color: $text-muted;
  font-size: 0.85rem;
  margin-top: 0.5rem;
}
.pexels-search {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.pexels-input {
  flex: 1;
  padding: 0.5rem;
  border: 1px solid rgba($primary, 0.3);
  border-radius: $border-radius;
  background: $secondary;
  color: $text-primary;
}

.btn-secondary {
  background: rgba($primary, 0.2);
  border: none;
  padding: 0.5rem 1rem;
  border-radius: $border-radius;
  cursor: pointer;
  transition: 0.3s;

  &:hover:not(:disabled) {
    background: rgba($primary, 0.4);
  }
  &:disabled {
    opacity: 0.5;
  }
}

.pexels-results {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  gap: 0.75rem;
  margin: 1rem 0;
  max-height: 300px;
  overflow-y: auto;
  padding: 0.5rem;
  border: 1px solid rgba($primary, 0.2);
  border-radius: $border-radius;
}

.pexels-thumb {
  position: relative;
  cursor: pointer;
  transition: transform 0.2s;

  &:hover {
    transform: scale(1.02);
  }

  img {
    width: 100%;
    height: 100px;
    object-fit: cover;
    border-radius: 4px;
  }

  .pexels-credit {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    background: rgba(0,0,0,0.6);
    color: white;
    font-size: 10px;
    padding: 2px 4px;
    text-align: center;
    border-bottom-left-radius: 4px;
    border-bottom-right-radius: 4px;
  }
}

.image-preview {
  margin-top: 1rem;
  .preview-img {
    max-width: 100%;
    max-height: 200px;
    border-radius: $border-radius;
    border: 1px solid rgba($primary, 0.3);
  }
}
</style>
