# crime_map

## Table of Contents

### 1. User Experience
#### a. Purpose of the Webstie
#### b. User Stories
#### c. Wireframes
#### d. Colour Palette
#### e. Fonts
#### f. Features

### 2. Image Credits

### 3. Technologies Used
#### a. APIs Used
#### b. Map Information
#### c. Other Code Credits

### 4. Deployment Information
#### a. Version Control
#### b. Deployment to Github Pages
#### c. Clone the Code Locally

### 5. Testing (See seperate Testing.md file)


### 1. User Experience

#### Purpose of the Website

This website is built to allow people to see how much crime has happened in an area in the last 3 months and understand what type of crime it is. The website is able to search across the UK using official UK Police data. It is as up to date as the latest data revealed by the Police.

#### User Stories

##### Story A

Someone is looking to buy/rent a house in a local area and wants to understand how much crime is committed to get a feel for how safe the area is.
    - They need an easily searchable and viewable map.

#### Story B

Someone wants to undersand the types of crimes committed in their area to get a more in depth feel of the local social issues.
    - They need a filter that easily allows you to see the type and location of each crime. 
    - They also want to see the numbers of the crimes that have been committed locally.

#### Story C

A tourist is visiting a town and they want to understand to the safest area of town to stay in.
    - They need a map that can be moved around within an area and the map regenerates to show the crimes within the new area.

#### Story D

A car owner wants to know if it is safe to park their car in an area.
    - They need to be able to filter vehicle crime and see how common it is in an area.


### 3. Technologies Used
The website is built using HTML, CSS and javascript.

#### APIs Used

The website uses 2 APIs.

It uses the official UK Police API for street level crimes. The documentation can be found here -

[https://data.police.uk/docs/method/crime-street/](https://data.police.uk/docs/method/crime-street/)

It also uses a postode API to calculate to longitude and latitude for each postcode to position the map correctly. The documentation can be found here -

[https://postcodes.io/](https://postcodes.io/)

#### Map Information

The map and the markers are generated using Leaflet Maps, a javascript library for interactive maps. The documentation can be found here -

[https://leafletjs.com/](https://leafletjs.com/)


#### Other Code Credits

Some code is used for formatting dates that was found on stackoverflow.

The exact post I used is here - 

[https://stackoverflow.com/questions/6040515/how-do-i-get-month-and-date-of-javascript-in-2-digit-format](https://stackoverflow.com/questions/6040515/how-do-i-get-month-and-date-of-javascript-in-2-digit-format)

