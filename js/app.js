let map;
let userMarker;

// Initialize the app
document.addEventListener('DOMContentLoaded', function() {
    initMap();
    initServiceWorker();
    
    // Add click handler for locate button
    document.getElementById('locate-btn').addEventListener('click', getUserLocation);
});

function initMap() {
    // Initialize map centered on San Francisco
    map = L.map('map').setView([37.7749, -122.4194], 13);
    
    // Add tile layer (using free OpenStreetMap)
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
    }).addTo(map);
    
    // Try to get user location on startup
    getUserLocation();
}

function getUserLocation() {
    const loading = document.getElementById('loading');
    loading.classList.remove('hidden');
    
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const lat = position.coords.latitude;
                const lng = position.coords.longitude;
                
                // Center map on user location
                map.setView([lat, lng], 15);
                
                // Remove existing marker if any
                if (userMarker) {
                    map.removeLayer(userMarker);
                }
                
                // Add marker for user location
                userMarker = L.marker([lat, lng]).addTo(map)
                    .bindPopup('📍 You are here!')
                    .openPopup();
                
                loading.classList.add('hidden');
            },
            (error) => {
                console.error('Error getting location:', error);
                alert('Unable to get your location. Please check your permissions.');
                loading.classList.add('hidden');
            },
            {
                enableHighAccuracy: true,
                timeout: 10000,
                maximumAge: 0
            }
        );
    } else {
        alert('Geolocation is not supported by this browser.');
        loading.classList.add('hidden');
    }
}

// Register service worker for PWA functionality
function initServiceWorker() {
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('sw.js')
            .then((registration) => {
                console.log('Service Worker registered:', registration);
            })
            .catch((error) => {
                console.log('Service Worker registration failed:', error);
            });
    }
}
