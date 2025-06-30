let map, marker;
let mapInitialized = false;

// Show/Hide map on button click
function toggleMap() {
  const mapContainer = document.getElementById('mapContainer');
  mapContainer.style.display = mapContainer.style.display === 'none' ? 'block' : 'none';

  if (!mapInitialized) {
    map = L.map('map').setView([27.7172, 85.3240], 13); // Kathmandu

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors'
    }).addTo(map);

    map.on('click', async function (e) {
      const { lat, lng } = e.latlng;
      if (marker) {
        marker.setLatLng(e.latlng);
      } else {
        marker = L.marker(e.latlng).addTo(map);
      }

      try {
        const res = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`);
        const data = await res.json();
        document.getElementById('address').value = data.display_name || `${lat}, ${lng}`;
      } catch (err) {
        console.error("Geocoding error:", err);
      }
    });

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(pos => {
        const coords = [pos.coords.latitude, pos.coords.longitude];
        map.setView(coords, 15);
        marker = L.marker(coords).addTo(map);
      });
    }

    mapInitialized = true;
  }

  setTimeout(() => {
    map.invalidateSize();
  }, 100); // Fix map not showing properly after toggle
}

// Auto-fill address using geolocation on load
window.onload = function () {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(async function (position) {
      const { latitude, longitude } = position.coords;
      try {
        const response = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`);
        const data = await response.json();
        document.getElementById('address').value = data.display_name || `${latitude}, ${longitude}`;
      } catch (err) {
        console.error('Error fetching location info:', err);
      }
    });
  }
};

// Register button event
document.getElementById('registerForm').addEventListener('submit', function (e) {
  e.preventDefault();
  window.location.href = 'fmenu.html';
});

// Google login mockup
function loginWithGoogle() {
  alert('Redirecting to Google login (mockup). Use Firebase/Auth for real login.');
}
