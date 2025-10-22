// ===================================
// Video Storage Module using IndexedDB
// ===================================
const videoStorage = {
    dbName: 'PeliculaMentalDB',
    dbVersion: 1,
    storeName: 'videos',
    db: null,

    // ===================================
    // Initialize IndexedDB
    // ===================================
    async init() {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open(this.dbName, this.dbVersion);

            request.onerror = () => {
                console.error('Error opening IndexedDB:', request.error);
                reject(request.error);
            };

            request.onsuccess = () => {
                this.db = request.result;
                console.log('IndexedDB initialized successfully');
                resolve(this.db);
            };

            request.onupgradeneeded = (event) => {
                const db = event.target.result;
                
                // Create object store if it doesn't exist
                if (!db.objectStoreNames.contains(this.storeName)) {
                    const objectStore = db.createObjectStore(this.storeName, { 
                        keyPath: 'id', 
                        autoIncrement: true 
                    });
                    
                    // Create indexes
                    objectStore.createIndex('category', 'category', { unique: false });
                    objectStore.createIndex('timestamp', 'timestamp', { unique: false });
                    objectStore.createIndex('title', 'title', { unique: false });
                    
                    console.log('Object store created successfully');
                }
            };
        });
    },

    // ===================================
    // Save Video
    // ===================================
    async saveVideo(videoData) {
        if (!this.db) {
            await this.init();
        }

        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction([this.storeName], 'readwrite');
            const objectStore = transaction.objectStore(this.storeName);

            const video = {
                title: videoData.title || `Video ${new Date().toLocaleDateString()}`,
                category: videoData.category || 'custom',
                blob: videoData.blob,
                duration: videoData.duration || 30,
                timestamp: Date.now(),
                thumbnail: videoData.thumbnail || null,
                musicName: videoData.musicName || 'Sin música'
            };

            const request = objectStore.add(video);

            request.onsuccess = () => {
                console.log('Video saved with ID:', request.result);
                resolve(request.result);
            };

            request.onerror = () => {
                console.error('Error saving video:', request.error);
                reject(request.error);
            };
        });
    },

    // ===================================
    // Get All Videos
    // ===================================
    async getAllVideos() {
        if (!this.db) {
            await this.init();
        }

        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction([this.storeName], 'readonly');
            const objectStore = transaction.objectStore(this.storeName);
            const request = objectStore.getAll();

            request.onsuccess = () => {
                // Sort by timestamp descending (newest first)
                const videos = request.result.sort((a, b) => b.timestamp - a.timestamp);
                resolve(videos);
            };

            request.onerror = () => {
                console.error('Error getting videos:', request.error);
                reject(request.error);
            };
        });
    },

    // ===================================
    // Get Video by ID
    // ===================================
    async getVideo(id) {
        if (!this.db) {
            await this.init();
        }

        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction([this.storeName], 'readonly');
            const objectStore = transaction.objectStore(this.storeName);
            const request = objectStore.get(id);

            request.onsuccess = () => {
                resolve(request.result);
            };

            request.onerror = () => {
                console.error('Error getting video:', request.error);
                reject(request.error);
            };
        });
    },

    // ===================================
    // Delete Video
    // ===================================
    async deleteVideo(id) {
        if (!this.db) {
            await this.init();
        }

        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction([this.storeName], 'readwrite');
            const objectStore = transaction.objectStore(this.storeName);
            const request = objectStore.delete(id);

            request.onsuccess = () => {
                console.log('Video deleted:', id);
                resolve(true);
            };

            request.onerror = () => {
                console.error('Error deleting video:', request.error);
                reject(request.error);
            };
        });
    },

    // ===================================
    // Get Videos by Category
    // ===================================
    async getVideosByCategory(category) {
        if (!this.db) {
            await this.init();
        }

        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction([this.storeName], 'readonly');
            const objectStore = transaction.objectStore(this.storeName);
            const index = objectStore.index('category');
            const request = index.getAll(category);

            request.onsuccess = () => {
                const videos = request.result.sort((a, b) => b.timestamp - a.timestamp);
                resolve(videos);
            };

            request.onerror = () => {
                console.error('Error getting videos by category:', request.error);
                reject(request.error);
            };
        });
    },

    // ===================================
    // Clear All Videos
    // ===================================
    async clearAll() {
        if (!this.db) {
            await this.init();
        }

        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction([this.storeName], 'readwrite');
            const objectStore = transaction.objectStore(this.storeName);
            const request = objectStore.clear();

            request.onsuccess = () => {
                console.log('All videos cleared');
                resolve(true);
            };

            request.onerror = () => {
                console.error('Error clearing videos:', request.error);
                reject(request.error);
            };
        });
    },

    // ===================================
    // Generate Thumbnail from Blob
    // ===================================
    async generateThumbnail(blob) {
        return new Promise((resolve) => {
            try {
                const video = document.createElement('video');
                video.src = URL.createObjectURL(blob);
                video.muted = true;
                video.crossOrigin = 'anonymous';

                video.addEventListener('loadeddata', () => {
                    // Seek to 1 second into the video
                    video.currentTime = 1;
                });

                video.addEventListener('seeked', () => {
                    const canvas = document.createElement('canvas');
                    canvas.width = 320;
                    canvas.height = 180;
                    const ctx = canvas.getContext('2d');

                    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

                    canvas.toBlob((thumbnailBlob) => {
                        URL.revokeObjectURL(video.src);
                        resolve(thumbnailBlob);
                    }, 'image/jpeg', 0.7);
                });

                video.addEventListener('error', () => {
                    console.error('Error generating thumbnail');
                    URL.revokeObjectURL(video.src);
                    resolve(null);
                });
            } catch (error) {
                console.error('Error in generateThumbnail:', error);
                resolve(null);
            }
        });
    }
};

// Initialize IndexedDB on load
videoStorage.init().catch(error => {
    console.error('Failed to initialize IndexedDB:', error);
});

// Make videoStorage globally available
window.videoStorage = videoStorage;
