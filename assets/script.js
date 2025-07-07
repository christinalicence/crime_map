let map; // Declare map variable globally
let markers = []; // Declare markers array globally, filled as site runs
let allCrimes = []; // Declare allCrimes array globally, filled as site runs
let crimeIndex = {}; // stores all crimes by a unique id


document.addEventListener("DOMContentLoaded", function() {
   

// Lat and long for Brighton
const BRIGHTON_LAT = 50.86;
const BRIGHTON_LNG = -0.16;

//Script to initialize the Leaflet map
map = L.map("map").setView([BRIGHTON_LAT, BRIGHTON_LNG], 14);
L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);
// Set the map bounds to stop people scrolling away 
const tightBounds = L.latLngBounds(
    [50.82, -0.20],  
    [50.88, -0.10]   
);
map.setMaxBounds(tightBounds);
map.setMinZoom(13);  
map.setMaxZoom(18);  



// Function to get the last 3 months date in YYYY-MM format
function LastMonthDate() {
    const date = new Date();
    date.setMonth(date.getMonth() - 3);//set to 3 months to get more data, data seems to be delayed (so in June, it will fetch April)
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
        console.error("Error fetching data:", error);
    }
}

// Function to add markers to the map
function addCrimeMarkers(crimes) {
    crimes.forEach(crime => {
        const lat = parseFloat(crime.location.latitude);
        const lng = parseFloat(crime.location.longitude);
        
        if (lat && lng) {
            // Create a unique ID for each crime based on its category and location
            const crimeId = `${crime.category}-${lat}-${lng}`;

            // Store in the crimeIndex object
            crime.crimeId = crimeId; // Add the unique ID to the crime object
            crimeIndex[crimeId] = crime; // Store the crime in the index

            const marker = L.marker([lat, lng])
                .addTo(map)
                .bindPopup(`<b>${formatCrimeCategory(crime.category)}</b><br>${crime.location.street.name}`);
            
                marker.crimeId = crimeId; // Add the unique ID to the marker for later reference

                // Save marker in the crime object for linking later
                crime._marker = marker;

                markers.push(marker); 
        } else {
            console.error("Invalid coordinates for crime:", crime);
        }
    });
}

// Load and display crimes
async function loadCrimes() {
    const crimes = await fetchCrimeData();
    if (crimes) {
        allCrimes = crimes; 
        addCrimeMarkers(crimes);
         updateCrimeList(crimes);
    }
}

// Call the function to load crimes and display the last updated date
loadCrimes();
displayLastUpdatedDate();

console.log(LastMonthDate());

// Dropdown functionality

// Function to make the dropdown update the map markers
document.getElementById("crime-type").addEventListener("change", function() {
    const selectedCategory = this.value;
    console.log(`Selected category: ${selectedCategory}`);
    updateMarkersByCategory(selectedCategory);
});

// Function to filter crimes by category
function filterCrimesByCategory(category) {
    if (category === "all") {
        console.log(`Returning all ${allCrimes.length} crimes`);
        return allCrimes; // Return all crimes if 'all' is selected
    } else {
        return allCrimes.filter(crime => crime.category === category);
    }
}

// Function to clear existing markers from the map
function clearMarkers() {
    markers.forEach(marker => map.removeLayer(marker));
    markers = []; // Resets markers array
}

// Function to update markers by category
function updateMarkersByCategory(category) {
    clearMarkers();
    const filteredCrimes = filterCrimesByCategory(category);
    addCrimeMarkers(filteredCrimes);
    updateCrimeList(filteredCrimes); 
}


// Function to display most recent date for data in the info div
function displayLastUpdatedDate() {
    fetch("https://data.police.uk/api/crime-last-updated")
        .then(response => response.json())
        .then(data => {
            const lastUpdatedDate = new Date(data.date);
            const formattedDate = lastUpdatedDate.toLocaleDateString('en-GB');
            document.getElementById("last-date").textContent = formattedDate;
        });
}

// Function to generate info for the crime list div

function updateCrimeList(crimes) {
    const listContainer = document.querySelector(".crime-items");
    listContainer.innerHTML = ""; // Clear existing items

    // Convert the first letter of the string to lower case (used for location names)
    const lowerCaseFirstLetter = (str) => str.charAt(0).toLowerCase() + str.slice(1);

    if (crimes.length === 0) {
        listContainer.innerHTML = "<li>No crimes found for this category.</li>";
        return;
    }
    crimes.forEach(crime => {
        const listItem = document.createElement("li");
        const formattedStreetName = lowerCaseFirstLetter(crime.location.street.name);
        listItem.textContent = `${formatCrimeCategory(crime.category)} ${formattedStreetName}`;
        listContainer.appendChild(listItem);

        // Attach crime ID to the list item for later reference
        listItem.dataset.crimeId = crime.crimeId;

        // Save the crime ID in the crime object for linking later
        crime._listItem = listItem;

        // Add click event to the list item to focus on the marker
        listItem.addEventListener("click", function() {
            const crimeId = this.dataset.crimeId;
            const crimeData = crimeIndex[crimeId]; // Get the crime data from the index
            if (crimeData && crimeData._marker) {
                map.setView(crimeData._marker.getLatLng(), 15); // Zoom in on the marker
                crimeData._marker.openPopup(); // Open the popup for the marker
            }
        });
    });
}



// Function to format the crime category for display
function formatCrimeCategory(category) {
       const categoryNames = {
        "anti-social-behaviour": "Anti-social Behaviour",
        "bicycle-theft": "Bicycle Theft",
        "burglary": "Burglary",
        "criminal-damage-arson": "Criminal Damage & Arson",
        "drugs": "Drugs",
        "other-crime": "Other Crime",
        "other-theft": "Other Theft",
        "possession-of-weapons": "Possession of Weapons",
        "public-order": "Public Order",
        "robbery": "Robbery",
        "shoplifting": "Shoplifting",
        "theft-from-the-person": "Theft from the Person",
        "vehicle-crime": "Vehicle Crime",
        "violent-crime": "Violent Crime"
    };
    return categoryNames[category] || category.charAt(0).toUpperCase() + category.slice(1).replace(/-/g, ' ');
}

//end of document.addEventListener("DOMContentLoaded", function() {
});
