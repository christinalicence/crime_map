
/**
 * @jest-environment jsdom
 */


beforeEach(() => {
  // Set up required DOM nodes
  document.body.innerHTML = `
    <div id="map"></div>
    <select id="crime-type"></select>
    <div class="crime-items"><ul></ul></div>
    <div id="last-date"></div>
  `;
});

const  {lastMonthDate,
    fetchCrimeData,
    addCrimeMarkers,
    highlightListedItem,
    updateCrimeList,
    populateCrimeDropdown,
    formatCrimeCategory,
    displayLastUpdatedDate,
    updateMarkersByCategory} = require('./assets/script.js');

    // mocks leafket
jest.mock('leaflet', () => {
    return {
        map: jest.fn(() => ({
            setView: jest.fn().mockReturnThis(),
            setMaxBounds: jest.fn(),
            setMinZoom: jest.fn(),
            setMaxZoom: jest.fn(),
            remove: jest.fn()
        })),
        tileLayer: jest.fn(() => ({
            addTo: jest.fn()
        })),
        marker: jest.fn(() => ({
            addTo: jest.fn().mockReturnThis(),
            bindPopup: jest.fn().mockReturnThis(),
            on: jest.fn()
        })),
        latLngBounds: jest.fn()
    };

});




    describe('Crime Map Script Tests', () => { 
    // Test for lastMonthDate function
    test('lastMonthDate returns a date in YYYY-MM format', () => {
        const date = lastMonthDate();
        expect(date).toMatch(/^\d{4}-\d{2}$/); // Check if the date is in YYYY-MM format
    });   });