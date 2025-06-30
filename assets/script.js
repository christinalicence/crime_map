document.addEventListener('DOMContentLoaded', function() {

// Lat and long for Brighton
const BRIGHTON_LAT = 50.86;
const BRIGHTON_LNG = -0.16;

//Script to initialize the Leaflet map
var map = L.map('map').setView([BRIGHTON_LAT, BRIGHTON_LNG], 13);
L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);


// Function to get the last month date in YYYY-MM format
function LastMonthDate() {
    const date = new Date();
    date.setMonth(date.getMonth() - 2);//set to 2 months to get more data, data seems to be delayed (so in June, it will fetch April)
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    return `${year}-${month}`;
}

// Fetch crime data
async function fetchCrimeData() {
    const lastMonth = LastMonthDate(); 
    const url = `https://data.police.uk/api/crimes-street/all-crime?lat=${BRIGHTON_LAT}&lng=${BRIGHTON_LNG}&date=${lastMonth}`;
    
    try {
        const response = await fetch(url);
        const data = await response.json();
        console.log(`Found ${data.length} crimes`);
        return data;
    } catch (error) {
        console.error('Error fetching data:', error);
        return null;
    }
}

// Function to add markers to the map
function addCrimeMarkers(crimes) {
    crimes.forEach(crime => {
        const lat = parseFloat(crime.location.latitude);
        const lng = parseFloat(crime.location.longitude);
        
        if (lat && lng) {
            L.marker([lat, lng])
                .addTo(map)
                .bindPopup(`<b>${crime.category}</b><br>${crime.location.street.name}`);
        }
        });
    }

    // Load and display crimes
async function loadCrimes() {
    const crimes = await fetchCrimeData();
    if (crimes) {
        addCrimeMarkers(crimes);
    }
}

// Call the function to load crimes
loadCrimes();

console.log (LastMonthDate());console.log (LastMonthDate());

});

