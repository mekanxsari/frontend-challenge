import { defineStore } from 'pinia'

export const useFavouritesStore = defineStore('favourites', {
    state: () => ({
        favourites: JSON.parse(localStorage.getItem('catFavourites') || '[]')
    }),

    actions: {
        addFavourite(imageId, imageUrl) {
            const newFavourite = {
                id: imageId,
                url: imageUrl,
                likedAt: new Date().toISOString()
            }
            this.favourites.push(newFavourite)
            this.saveToLocalStorage()
        },

        removeFavourite(imageId) {
            const index = this.favourites.findIndex(fav => fav.id === imageId)
            if (index !== -1) {
                this.favourites.splice(index, 1)
                this.saveToLocalStorage()
            }
        },

        isLiked(imageId) {
            return this.favourites.some(fav => fav.id === imageId)
        },

        getFavourite(imageId) {
            return this.favourites.find(fav => fav.id === imageId)
        },

        getAllFavourites() {
            return this.favourites
        },

        saveToLocalStorage() {
            localStorage.setItem('catFavourites', JSON.stringify(this.favourites))
        },

        loadFromLocalStorage() {
            const saved = localStorage.getItem('catFavourites')
            if (saved) {
                this.favourites = JSON.parse(saved)
            }
        }
    }
})