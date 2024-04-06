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
const baseURL_back = 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/back/'



// This function adds cards the page to display the data in the array
function showCards() {

    let displayPokemons = []

    // Store the current scroll position
    const scrollPosition = window.scrollY;
    

    const cardContainer = document.getElementById("card-container");
    cardContainer.innerHTML = "";
    const templateCard = document.querySelector(".card");

    //filter accordingly to pokemon type
    const typeButtons = document.querySelector('.typeButtons');
    const typeToFilter = typeButtons.querySelector('.lastClicked').innerText;

    displayPokemons = filterByType(allPokemons, typeToFilter)

    //filter accordingly to search query
    const searchBox = document.querySelector('#pokeSearch');
    const searchQuery = searchBox.value.trim(); //trim whitespace
    displayPokemons = filterByName(displayPokemons, searchQuery);

    //sort accordingly to  pokemon stats
    const statButtons = document.querySelector('.statButtons');
    const statToSort = statButtons.querySelector('.lastClicked').innerText;
    
    displayPokemons = sortByStat(displayPokemons, statToSort)
    
    for (let i = 0; i < displayPokemons.length; i++) {
        const nextCard = templateCard.cloneNode(true); // Copy the template card
        editCardContent(nextCard, displayPokemons[i]); // Edit title and image
        cardContainer.appendChild(nextCard); // Add new card to the container
        
    }

    // Restore the scroll position after re-rendering
    window.scrollTo(0, scrollPosition);

    //reattach event listeners to new cards
    //mainly for delete
    attachCardEventListeners();
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
    cardBullets[0].textContent = `Pokè ID: ${pokemon.Id}`;
    cardBullets[1].textContent = `Type: ${pokemon.Type}`;
    cardBullets[2].textContent = `Total Stats: ${pokemon.Total}`;

}

// This calls the addCards() function when the page is first loaded
document.addEventListener("DOMContentLoaded", showCards);


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

//for searching pokemons with name
function filterByName(pokemons, searchQuery) {

    const filteredPokemons = pokemons.filter(pokemon =>
      pokemon.Name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return filteredPokemons;
}

const searchInput = document.getElementById('pokeSearch');
searchInput.addEventListener('input', () => {
    showCards();
  });


//to delete each pokemon
function deletePokemon(pokemons, deleteID){


    //find the pokemon with that id
    const indexToDelete = allPokemons.findIndex(pokemon => {
        return pokemon.Id == deleteID
    })

    //array splice method
    //will delete 1 entry at index pokeID
    pokemons.splice(indexToDelete, 1);
}

//for dialog box - show pokemon details
const dialog = document.querySelector('dialog')
const closeDialog = document.querySelector('#closeDialog')

closeDialog.addEventListener("click", ()=>{
    dialog.close();
})

//update the modal(details) box according to the clicked pokemon
function updateModalBox(pokemonID){

    const pokemon = allPokemons.find(pokemon => pokemon.Id == pokemonID)
    //destructure all the properties from pokemon object
    const { Name, Id, Total, HP, Attack, "Sp. Atk": SpAtk, Defense, "Sp. Def": SpDef,  Speed, Description} = pokemon
    
    dialog.querySelector('#pokemonName').textContent = Name;
    dialog.querySelector('#pokemonId').textContent = `ID: ${Id}`;
    dialog.querySelector('#totalStats').textContent = `Total Stats: ${Total}`;
    dialog.querySelector('#hp').textContent = `HP: ${HP}`;
    dialog.querySelector('#attack').textContent = `Attack: ${Attack}, Sp. Atk: ${SpAtk}`;
    dialog.querySelector('#defense').textContent = `Defense: ${Defense}, Sp. Def: ${SpDef}`;
    dialog.querySelector('#speed').textContent = `Speed: ${Speed}`;
    dialog.querySelector('#pokemonDescription').textContent = Description;
    dialog.querySelector('#pokemonImage').src =  `${baseURL}${Id}.png`;
}


function attachCardEventListeners() {

    //details buttons
    const detailsButtons = document.querySelectorAll(".details");
    detailsButtons.forEach(btn =>{
        btn.addEventListener("click", () => {

            //take the parent card of the btn
            const card = btn.closest('.card');

            let pokemonID = card.querySelector("li").innerText;
            
            //pick out the id part first
            const parts = pokemonID.split(":");
            pokemonID = parseInt(parts[1].trim());
            //console.log(pokemonID);

            updateModalBox(pokemonID);

            dialog.showModal();
            
            
        });
    })

    //release buttons
    const releaseButtons = document.querySelectorAll(".release");
    releaseButtons.forEach(btn => {
        btn.addEventListener("click", () => {

            //take the parent card of the btn
            const card = btn.closest('.card');

            const deletedPokemon = card.querySelector("li").innerText;
            //console.log(pokemonID);

            //pick out the id part first
            const parts = deletedPokemon.split(":");
            const deleteID = parseInt(parts[1].trim());

            const imgElement = card.querySelector('img');
            imgElement.src = `${baseURL_back}${deleteID}.png`

            setTimeout(()=>{
                //speical release / delete effects
                card.style.transition = "opacity 1s ease";
                card.style.opacity = 0;
            }, 400)
            

            //apply fade-out transition effect
            setTimeout(() => {
                
                deletePokemon(allPokemons, deleteID);
                showCards(); 

            }, 1000)
            
            
        });
    });

}

