<template>
    <div v-if="initialLoading" class="loading-text">
        ... загружаем котиков ...
    </div>

    <div v-else>
        <ul class="cats-list">
            <li v-for="(cat, index) in cats" :key="cat.id">
                <img :src="cat.image">
                <Heart :size="40" color="#F24E1E" :fill="cat.isLiked ? '#FF3A00' : 'none'"
                    :stroke-width="cat.isLiked ? 1 : 2" class="heart-icon" @click="toggleLike(cat, index)" />
            </li>
        </ul>
        <div v-if="loadingMore" class="loading-more-text">
            ... загружаем еще котиков ...
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, nextTick, watch } from 'vue'
import { Heart } from 'lucide-vue-next'
import { useFavouritesStore } from '@/stores/favourites'

const API_KEY = import.meta.env.VITE_API_KEY
const favouritesStore = useFavouritesStore()

const cats = ref([])
let currentPage = 0
const limit = 20
let loadingMore = ref(false)
let initialLoading = ref(true)
let observer = null
let hasMore = ref(true)

const fetchCats = async (isLoadMore = false) => {
    if (isLoadMore) {
        loadingMore.value = true
    }

    try {
        const response = await fetch(`https://api.thecatapi.com/v1/images/search?limit=${limit}&page=${currentPage}&size=small`, {
            headers: {
                'x-api-key': API_KEY
            }
        })

        const data = await response.json()

        if (data.length === 0) {
            hasMore.value = false
            return
        }

        const newCats = data.map(cat => ({
            id: cat.id,
            image: cat.url,
            isLiked: favouritesStore.isLiked(cat.id)
        }))

        if (isLoadMore) {
            cats.value = [...cats.value, ...newCats]
        } else {
            cats.value = newCats
        }

        currentPage++

    } catch (err) {
        console.error('Error:', err)
    } finally {
        if (isLoadMore) {
            loadingMore.value = false
        }
        initialLoading.value = false
    }
}

const toggleLike = (cat, index) => {
    if (!cat.isLiked) {
        favouritesStore.addFavourite(cat.id, cat.image)
        cats.value[index].isLiked = true
        console.log('Like eklendi:', cat.id)
    } else {
        favouritesStore.removeFavourite(cat.id)
        cats.value[index].isLiked = false
        console.log('Like kaldırıldı:', cat.id)
    }
}

const setupObserver = () => {
    observer = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && !loadingMore.value && hasMore.value) {
            fetchCats(true)
        }
    }, {
        threshold: 0.5
    })

    const observeLastLi = () => {
        const lastLi = document.querySelector('.cats-list li:last-child')
        if (lastLi) {
            observer.observe(lastLi)
        }
    }

    setTimeout(observeLastLi, 100)
}

const refreshObserver = () => {
    nextTick(() => {
        if (observer) {
            observer.disconnect()
            const lastLi = document.querySelector('.cats-list li:last-child')
            if (lastLi && hasMore.value) {
                observer.observe(lastLi)
            }
        }
    })
}

onMounted(() => {
    fetchCats(false)
    setupObserver()
})

watch(cats, () => {
    if (!initialLoading.value && hasMore.value) {
        refreshObserver()
    }
})

onBeforeUnmount(() => {
    if (observer) {
        observer.disconnect()
    }
})
</script>