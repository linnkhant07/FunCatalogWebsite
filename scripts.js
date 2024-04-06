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


//array of objects to hold pokemons
import allPokemons from "./pokemons.js";
const baseURL = 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/'


// This function adds cards the page to display the data in the array
function showCards() {

    let displayPokemons = []

    const cardContainer = document.getElementById("card-container");
    cardContainer.innerHTML = "";
    const templateCard = document.querySelector(".card");

    //filter accordingly to what user has chosen
    const typeButtons = document.querySelector('.typeButtons');
    const typeToFilter = typeButtons.querySelector('.lastClicked').innerText;

    displayPokemons = filterByType(allPokemons, typeToFilter)

    //sort accordingly to what user has chosen
    const statButtons = document.querySelector('.statButtons');
    const statToSort = statButtons.querySelector('.lastClicked').innerText;
    
    displayPokemons = sortByStat(displayPokemons, statToSort)
    
    for (let i = 0; i < displayPokemons.length; i++) {
        const nextCard = templateCard.cloneNode(true); // Copy the template card
        editCardContent(nextCard, displayPokemons[i]); // Edit title and image
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
document.addEventListener("DOMContentLoaded", showCards());

//to filter pokemons by type
const typeButtons = document.querySelectorAll(".typeBtn");

//filtering by type
function filterByType(pokemons, type){

    let filteredPokemons = []

    if(type == "All") return pokemons;

    for(let pokemon of pokemons){
        
        if(pokemon.Type.includes(type))
             filteredPokemons.push(pokemon)
    }
    return filteredPokemons;
};

typeButtons.forEach(btn => {
    btn.addEventListener("click", ()=>{
        

        //remove the lastClicked class from all buttons
        typeButtons.forEach(button => {
            button.classList.remove("lastClicked");
        });

        //add the lastClicked class to the clicked button
        btn.classList.add("lastClicked");

        showCards()
    })
})

//sort by stats
const statButtons = document.querySelectorAll(".statBtn");

//filtering by different stats
function  sortByStat(pokemons, stat){

    //spread operator -> copies allPokemons
    let sortedPokemons = [...pokemons]
    sortedPokemons.sort((a,b)=>{
       return b[stat] - a[stat]
    })

    return sortedPokemons;
}

statButtons.forEach(btn => {
    btn.addEventListener("click", ()=>{

        //remove the lastClicked class from all buttons
        statButtons.forEach(button => {
            button.classList.remove("lastClicked");
        });

        //add the lastClicked class to the clicked button
        btn.classList.add("lastClicked");

        showCards()
    })
})

window.quoteAlert = function(){
    console.log("Button Clicked!")
    alert("Pika Pi Pikachu!");
}

window.removeLastCard = function() {
    allPokemons.pop(); // Remove last item in titles array
    showCards(); // Call showCards again to refresh
}

