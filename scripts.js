/**
 * Data Catalog Project Starter Code - SEA Stage 2
 *
 * This file is where you should be doing most of your work. You should
 * also make changes to the HTML and CSS files, but we want you to prioritize
 * demonstrating your understanding of data structures, and you'll do that
 * with the JavaScript code you write in this file.
 * 
 * The comments in this file are only to help you learn how the starter code
 * works. The instructions for the project are in the README. That said, here
 * are the three things you should do first to learn about the starter code:
 * - 1 - Change something small in index.html or style.css, then reload your 
 *    browser and make sure you can see that change. 
 * - 2 - On your browser, right click anywhere on the page and select
 *    "Inspect" to open the browser developer tools. Then, go to the "console"
 *    tab in the new window that opened up. This console is where you will see
 *    JavaScript errors and logs, which is extremely helpful for debugging.
 *    (These instructions assume you're using Chrome, opening developer tools
 *    may be different on other browsers. We suggest using Chrome.)
 * - 3 - Add another string to the titles array a few lines down. Reload your
 *    browser and observe what happens. You should see a fourth "card" appear
 *    with the string you added to the array, but a broken image.
 * 
 */




const FRESH_PRINCE_URL = "https://upload.wikimedia.org/wikipedia/en/3/33/Fresh_Prince_S1_DVD.jpg";
const CURB_POSTER_URL = "https://m.media-amazon.com/images/M/MV5BZDY1ZGM4OGItMWMyNS00MDAyLWE2Y2MtZTFhMTU0MGI5ZDFlXkEyXkFqcGdeQXVyMDc5ODIzMw@@._V1_FMjpg_UX1000_.jpg";
const EAST_LOS_HIGH_POSTER_URL = "https://static.wikia.nocookie.net/hulu/images/6/64/East_Los_High.jpg";

// This is an array of strings (TV show titles)
let titles = [
    "Fresh Prince of Bel Air",
    "Curb Your Enthusiasm",
    "East Los High"
];
// Your final submission should have much more data than this, and 
// you should use more than just an array of strings to store it all.


//array of objects to hold pokemons
import pokemons from "./pokemons.js";
const baseURL = 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/'
console.log(pokemons)


// This function adds cards the page to display the data in the array
function showCards() {
    const cardContainer = document.getElementById("card-container");
    cardContainer.innerHTML = "";
    const templateCard = document.querySelector(".card");
    
    for (let i = 0; i < pokemons.length; i++) {
        const nextCard = templateCard.cloneNode(true); // Copy the template card
        editCardContent(nextCard, pokemons[i]); // Edit title and image
        cardContainer.appendChild(nextCard); // Add new card to the container
        
    }
}

function editCardContent(card, pokemon) {
    card.style.display = "block";

    //id of the pokemon
    const pokemonID = pokemon.Id;

    const cardHeader = card.querySelector("h2");
    cardHeader.textContent = pokemon.Name;

    const cardImage = card.querySelector("img");
    //corresponding pokemon spirte 
    cardImage.src = `${baseURL}${pokemonID}.png`; 
    cardImage.alt = pokemon.Name + " Image";

    const cardBullets = card.querySelectorAll("li");

    //update the bullet points 
    cardBullets[0].textContent = `Type: ${pokemon.Type}`;
    cardBullets[1].textContent = `Total Stats: ${pokemon.Total}`;
    cardBullets[2].textContent = `Generation: ${pokemon.Generation}`;
}

// This calls the addCards() function when the page is first loaded
document.addEventListener("DOMContentLoaded", showCards);

window.quoteAlert = function(){
    console.log("Button Clicked!")
    alert("Pika Pi Pikachu!");
}

window.removeLastCard = function() {
    pokemons.pop(); // Remove last item in titles array
    showCards(); // Call showCards again to refresh
}
