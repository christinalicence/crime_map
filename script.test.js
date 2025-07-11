
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

const  {
    setupEventListeners,
    setupPage,
    initMap,
    lastMonthDate,
    fetchCrimeData,
    addCrimeMarkers,
    highlightListedItem,
    loadCrimes,
    filterCrimesByCategory,
    clearMarkers,
    updateMarkersByCategory,
    populateCrimeDropdown,
    formatCrimeCategory,
    displayLastUpdatedDate,
    updateCrimeList
      } = require('./assets/script.js');

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

    // Test for setupEventListeners function


    // Test for setupPage function


    // Test for initMap function

    // Test for lastMonthDate function
    describe('lastMonthDate', () => {
  test('returns a date in YYYY-MM format', () => {
    const date = lastMonthDate();
    expect(date).toMatch(/^\d{4}-\d{2}$/); // YYYY-MM format
  });
});


    // Test for fetchCrimeData function


    // Test for addCrimeMarkers function


    // Test for highlightListedItem function



    // Test for loadCrimes function


    // Test for filterCrimesByCategory function


    // Test for clearMarkers function


    // Test for updateMarkersByCategory function



    // Test for populateCrimeDropdown function



    // Test for formatCrimeCategory function
    test('formatCrimeCategory returns formatted category', () => {
        const category = 'violent-crime';
        const formatted = formatCrimeCategory(category);
        expect(formatted).toBe('Violent Crime');
    });



    // Test for displayLastUpdatedDate function



    // Test for updateCrimeList function




   