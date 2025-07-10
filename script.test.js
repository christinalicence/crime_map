
/**
 * @jest-environment jsdom
 */


const { describe } = require('yargs');
const  {lastMonthDate,
    fetchCrimeData,
    addCrimeMarkers,
    highlightListedItem,
    updateCrimeList,
    populateCrimeDropdown,
    formatCrimeCategory,
    displayLastUpdatedDate,
    updateMarkersByCategory} = require('./assets/script.js');

    describe('Crime Map Script Tests', () => { 
    // Test for lastMonthDate function
    test('lastMonthDate returns a date in YYYY-MM format', () => {
        const date = lastMonthDate();
        expect(date).toMatch(/^\d{4}-\d{2}$/); // Check if the date is in YYYY-MM format
    });   });