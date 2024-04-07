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

//this array stores pokemons to display
let displayPokemons = allPokemons
const baseURL = 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/'
const baseURL_back = 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/back/'
const baseURL_sound = "https://raw.githubusercontent.com/PokeAPI/cries/main/cries/pokemon/latest/"
let sortHighToLow = false
let pageChanged = false

//numberr of items to load initially and each time the button is clicked
const itemsPerPage = 15;
let currentPage = 1;

function updateDisplayPokemons(){
    
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

}

function updateNavButtons(){

    if(currentPage == 1){
        prevPageBtn.style.display = "None";
    }

    else{
        prevPageBtn.style.display = "Block";
    }

    if(currentPage < Math.ceil(displayPokemons.length / itemsPerPage)){
        nextPageBtn.style.display = "Block";
    }

    else{
        nextPageBtn.style.display = "None";
    }
    
}

// This function adds cards the page to display the data in the array
function showMoreCards() {

    // Store the current scroll position
    const scrollPosition = window.scrollY;

    const cardContainer = document.getElementById("card-container");
    cardContainer.innerHTML = "";
    const templateCard = document.querySelector(".card");

    //display only a batch of pokemons
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const displayBatch = displayPokemons.slice(startIndex, endIndex);
    
    for (let i = 0; i < displayBatch.length; i++) {
        const nextCard = templateCard.cloneNode(true); // Copy the template card
        editCardContent(nextCard, displayBatch[i]); // Edit title and image
        cardContainer.appendChild(nextCard); // Add new card to the container
        
    }

    updateNavButtons();


    if(!pageChanged){
        // Restore the scroll position after re-rendering
         window.scrollTo(0, scrollPosition);
    }
    else{
        window.scrollTo(0, 300);
        pageChanged = false;
    }

    //console.log("page number is ", currentPage)

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
document.addEventListener("DOMContentLoaded", showMoreCards);


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

        currentPage = 1;
        playClickSound();
        updateDisplayPokemons();
        showMoreCards()
    })
})

//sort by stats
const statButtons = document.querySelectorAll(".statBtn");

//filtering by different stats
function  sortByStat(pokemons, stat){

    //spread operator -> copies allPokemons
    let sortedPokemons = [...pokemons]
    sortedPokemons.sort((a,b)=>{

       if(sortHighToLow) {return b[stat] - a[stat]}
       else return a[stat] - b[stat]
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

        currentPage = 1;
        playClickSound();
        updateDisplayPokemons();
        showMoreCards()
    })
})

const sortDirectionBtn = document.querySelector(".sortDirectionBtn")
sortDirectionBtn.addEventListener("click", ()=>{

    //toggle the direction button
    if(sortHighToLow){
        
        sortDirectionBtn.innerHTML = "Low to High &darr;"
        sortHighToLow = false;
    } else {
        sortDirectionBtn.innerHTML = "High to Low &uarr;"
        sortHighToLow = true;
    }

    currentPage = 1;

    playClickSound();
    updateDisplayPokemons();
    showMoreCards();

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

    currentPage = 1;
    updateDisplayPokemons();
    showMoreCards();
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
    playClickSound();
    dialog.close();
})

//update the modal(details) box according to the clicked pokemon
function updateModalBox(pokemonID){

    const pokemon = allPokemons.find(pokemon => pokemon.Id == pokemonID)
    //destructure all the properties from pokemon object
    const { Name, Id, Total, HP, Attack, "Sp. Atk": SpAtk, Defense, "Sp. Def": SpDef,  Speed, Description} = pokemon
    
    dialog.querySelector('#pokemonName').innerHTML = Name;
    dialog.querySelector('#pokemonId').innerHTML = `<b>ID:</b> ${Id}`;
    dialog.querySelector('#totalStats').innerHTML = `<b>Total Stats:</b> ${Total}`;
    dialog.querySelector('#hp').innerHTML = `<b>HP:</b> ${HP}`;
    dialog.querySelector('#attack').innerHTML = `<b>Attack:</b> ${Attack}, <b>Sp. Atk:</b> ${SpAtk}`;
    dialog.querySelector('#defense').innerHTML = `<b>Defense:</b> ${Defense}, <b>Sp. Def:</b> ${SpDef}`;
    dialog.querySelector('#speed').innerHTML = `<b>Speed:</b> ${Speed}`;
    dialog.querySelector('#pokemonDescription').innerHTML = `${Description}`;
    dialog.querySelector('#pokemonImage').src =  `${baseURL}${Id}.png`;
}

//functions to play hover sound effect
function playHoverSound() {
    const hoverSound = document.getElementById("hoverSound");
    hoverSound.play();
}

// Add event listeners to card elements
const cards = document.querySelectorAll(".card");
cards.forEach(card => {
    card.addEventListener("mouseenter", playHoverSound);
});

function playPokemonSound(pokemonID) {

    const pokemon = allPokemons.find(pokemon => pokemon.Id == pokemonID)

    //to play pokemon sounds
    const pokemonSound = document.getElementById("pokemonSound")
    pokemonSound.src =`${baseURL_sound}${pokemon.Id}.ogg`

    pokemonSound.volume = 0.2;
    pokemonSound.play();
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

            setTimeout(()=>{
                playPokemonSound(pokemonID);
            },250)
            
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

            playPokemonSound(deleteID);

            setTimeout(()=>{
                //speical release / delete effects
                card.style.transition = "opacity 1s ease";
                card.style.opacity = 0;
            }, 400)
            

            //apply fade-out transition effect
            setTimeout(() => {
                
                deletePokemon(allPokemons, deleteID);
                updateDisplayPokemons();
                showMoreCards(); 

            }, 1000)
            
            
        });
    });

    // Add event listeners to card elements
    const cards = document.querySelectorAll(".card");
    cards.forEach(card => {
        card.addEventListener("mouseenter", playHoverSound);
    });

}

//functions to play hover sound effect
function playClickSound() {
    const hoverSound = document.getElementById("clickSound");
    hoverSound.play();
}



// Event listener for previous page button
const prevPageBtn = document.querySelector("#prevPageBtn")
prevPageBtn.addEventListener('click', () => {
    if (currentPage > 1) {
      currentPage--;
      pageChanged = true;
      playClickSound();
      showMoreCards();
    }

});
  
// Event listener for next page button
const nextPageBtn = document.querySelector("#nextPageBtn")
nextPageBtn.addEventListener('click', () => {
if (currentPage < Math.ceil(displayPokemons.length / itemsPerPage)) {
    currentPage++;
    pageChanged = true;
    playClickSound();
    showMoreCards();
}
});

