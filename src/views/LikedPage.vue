<template>
    <div v-if="initialLoading" class="loading-text">
        ... загружаем котиков ...
    </div>
    
    <div v-else>
        <ul class="cats-list">
            <li v-for="(cat, index) in cats" :key="cat.id">
                <img :src="cat.image">
                <Heart :size="40" color="#F24E1E" :fill="'#FF3A00'"
                    stroke-width="1" class="heart-icon" @click="toggleLike(cat, index)" />
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

const favouritesStore = useFavouritesStore()

const cats = ref([])
let loadingMore = ref(false)
let initialLoading = ref(true)
let observer = null
let hasMore = ref(true)

const loadFavourites = () => {
    const allFavourites = favouritesStore.getAllFavourites()
    cats.value = allFavourites.map(fav => ({
        id: fav.id,
        image: fav.url,
        isLiked: true
    }))
    
    if (cats.value.length === 0) {
        hasMore.value = false
    }
    
    initialLoading.value = false
}

const toggleLike = (cat, index) => {
    favouritesStore.removeFavourite(cat.id)
    cats.value.splice(index, 1)
    
    if (cats.value.length === 0) {
        hasMore.value = false
    }
}

const setupObserver = () => {
    observer = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && !loadingMore.value && hasMore.value) {
            loadingMore.value = true
            setTimeout(() => {
                loadingMore.value = false
                hasMore.value = false
            }, 500)
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
    loadFavourites()
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