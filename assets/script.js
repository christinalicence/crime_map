// Lat and long for Brighton
const BRIGHTON_LAT = 50.83;
const BRIGHTON_LNG = -0.15;

//Script to initialize the Leaflet map
var map = L.map('map').setView([BRIGHTON_LAT, BRIGHTON_LNG], 12.3);
L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);


// Function to get the last month date in YYYY-MM format
function LastMonthDate() {
    const date = new Date();
    date.setMonth(date.getMonth() - 1);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    return `${year}-${month}`;
}

// Fetch crime data
async function fetchCrimeData() {
    const lastMonth = await LastMonthDate(); 
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

fetchCrimeData();