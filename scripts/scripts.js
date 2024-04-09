/* Linn Khant Thuya: Data Catalog Project Starter Code - SEA Stage 2 */

//array of objects that  holds 100 pokemons
import allPokemons from "./pokemons.js";

//this array stores pokemons to display
let displayPokemons = [...allPokemons] //shallow copy

//for pokemon sprites
const baseURL = 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/'
const baseURL_back = 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/back/'
const baseURL_sound = "https://raw.githubusercontent.com/PokeAPI/cries/main/cries/pokemon/latest/"

//helper variables
let sortHighToLow = false
let pageChanged = false

//number of items to load initially and each time the button is clicked
const itemsPerPage = 15;
let currentPage = 1;

//-------------------------DATA OPERATION FUNCTIONS-------------------------

//postcondition: return a type-filtered array of pokemons
function filterByName(pokemons, searchQuery) {

    const filteredPokemons = pokemons.filter(pokemon =>
      pokemon.Name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return filteredPokemons;
};

//postcondition: return a type-filtered array of pokemons
function filterByType(pokemons, type){

    let filteredPokemons = []

    if(type == "All") return pokemons;

    else if (type == "Favorites"){
         filteredPokemons = pokemons.filter(pokemon =>{
            return pokemon.isFavorite && pokemon.isFavorite == true
         })
    }

    else{
        for(let pokemon of pokemons){

            if(pokemon.Type.includes(type))
                 filteredPokemons.push(pokemon)
        }
    }

    /* BOTH WAYS WORK THE SAME BUT I WANTED TO USE THE OTHER METHOD THIS TIME
    else{
        filteredPokemons = pokemons.filter(pokemon => {
            return pokemon.Type.includes(type)
        })
    }*/

    

    return filteredPokemons;
};

//postcondition: return a stats-filtered array of pokemons
function  sortByStat(pokemons, stat){
    pokemons.sort((a,b)=>{

       if(sortHighToLow) {return b[stat] - a[stat]}
       else return a[stat] - b[stat]
    })

    return pokemons;
}

//postcondition: deletes a pokemon and returns the array
function deletePokemon(pokemons, deleteID){


    //find the pokemon with that id
    const indexToDelete = pokemons.findIndex(pokemon => {
        return pokemon.Id == deleteID
    })

    //array splice method
    //will delete 1 entry at index pokeID
    pokemons.splice(indexToDelete, 1);
}

//postcondition: the pokemon's isFavorite property is toggled
function toggleFavorite(pokemons, pokemonID){
    const pokemon = pokemons.find(pokemon => pokemon.Id == pokemonID)
    
    if (pokemon) {

        //check if isFavorite property exists, if not, set it to false
        if (pokemon.isFavorite == undefined) {
            pokemon.isFavorite = false;
        }
        
        pokemon.isFavorite = !pokemon.isFavorite;

        console.log(pokemon.Name, "'s favorite value was toggled to", pokemon.isFavorite)
    }
}


//-------------------------------------------------------------------


//-------------------------DISPLAY FUNCTIONS-------------------------

//post-condition: displayPokemons array is updated after data operations
function updateDisplayPokemons(){
    
    //filter with pokemon type
    const typeButtons = document.querySelector('.typeButtons');
    const typeToFilter = typeButtons.querySelector('.lastClicked').innerText;

    displayPokemons = filterByType(allPokemons, typeToFilter)

    //filter with search query
    const searchBox = document.querySelector('#pokeSearch');
    const searchQuery = searchBox.value.trim(); //trim whitespace
    displayPokemons = filterByName(displayPokemons, searchQuery);

    //sort with pokemon stats
    const statButtons = document.querySelector('.statButtons');
    const statToSort = statButtons.querySelector('.lastClicked').innerText;
    
    displayPokemons = sortByStat(displayPokemons, statToSort)

}

//post-condition: adds cards to the page to display the data in the displayPokemons array
function showMoreCards() {

    //store the current scroll position 
    const scrollPosition = window.scrollY;

    const cardContainer = document.getElementById("card-container");
    cardContainer.innerHTML = ""; //clear all cards
    const templateCard = document.querySelector(".card");

    //extract a batch of pokemons from displayPokemons array
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const displayBatch = displayPokemons.slice(startIndex, endIndex);
    
    for (let i = 0; i < displayBatch.length; i++) {
        const nextCard = templateCard.cloneNode(true); // Copy the template card
        editCardContent(nextCard, displayBatch[i]); // Edit title and image
        cardContainer.appendChild(nextCard); // Add new card to the container
        
    }

    //update visibility of prev and next buttons 
    updateNavButtons();

    // Restore the scroll position after re-rendering
    if(!pageChanged) { window.scrollTo(0, scrollPosition) }
    else{
        //go back to top if it is a new batch
        window.scrollTo(0, 300);
        pageChanged = false;
    }

    //reattach event listeners to new cards
    attachCardEventListeners();
}

//pre-conditions: card template and pokemon object are passed
//post-condition: adds pokemon data to the card
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

    //for the favorite icon star
    if(pokemon.isFavorite && pokemon.isFavorite == true){
        console.log("hehe")
        let favBtn = card.querySelector(".favorite-icon")
        favBtn.classList.add('isFavorite');
    }
    
    

}

//-----------------------------------------------------------------

//-------------------------EVENT LISTENERS-------------------------

//search bar
const searchInput = document.getElementById('pokeSearch');
searchInput.addEventListener('input', () => {

    currentPage = 1;
    updateDisplayPokemons();
    showMoreCards();
});

//to filter pokemons by type
const typeButtons = document.querySelectorAll(".typeBtn");
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


//statButtons
const statButtons = document.querySelectorAll(".statBtn");
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

//sort direction
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

//for dialog box - show pokemon details
const dialog = document.querySelector('dialog')
const closeDialog = document.querySelector('#closeDialog')

closeDialog.addEventListener("click", ()=>{
    playClickSound();
    dialog.close();
})

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

// Add event listeners to card elements
const cards = document.querySelectorAll(".card");
cards.forEach(card => {
    card.addEventListener("mouseenter", playHoverSound);
});




//----------------------------------------------------------------

//---------------------------UTILITIES----------------------------

//postcondition: the visibility of next and prev buttons are updated
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

//postcondition: update the modal(details) box according to the clicked pokemon
function updateModalBox(pokemonID){

    const pokemon = allPokemons.find(pokemon => pokemon.Id == pokemonID)
    //destructure all the properties from pokemon object
    const { Name, Id, Type, Total, HP, Attack, "Sp. Atk": SpAtk, Defense, "Sp. Def": SpDef,  Speed, Description} = pokemon
    
    dialog.querySelector('#pokemonName').innerHTML = Name;
    dialog.querySelector('#totalStats').innerHTML = `<b>Total Stats:</b> ${Total}`;
    dialog.querySelector('#hp').innerHTML = `<b>HP:</b> ${HP}`;
    dialog.querySelector('#attack').innerHTML = `<b>Attack:</b> ${Attack}, <b>Sp. Atk:</b> ${SpAtk}`;
    dialog.querySelector('#defense').innerHTML = `<b>Defense:</b> ${Defense}, <b>Sp. Def:</b> ${SpDef}`;
    dialog.querySelector('#speed').innerHTML = `<b>Speed:</b> ${Speed}`;
    dialog.querySelector('#pokemonDescription').innerHTML = `${Description}`;
    dialog.querySelector('#pokemonImage').src =  `${baseURL}${Id}.png`;

    if(Type[1]){
        dialog.querySelector('#pokemonType').innerHTML = `<b>Type:</b> <span class="typeSpan type${Type[0]}"> ${Type[0]} </span> <span class="typeSpan  type${Type[1]}"> ${Type[1]} </span>`;
    }
    else{
        dialog.querySelector('#pokemonType').innerHTML = `<b>Type:</b> <span class="typeSpan type${Type[0]}"> ${Type[0]} </span>`;
    }
}

//functions to play hover sound effect
function playHoverSound() {
    const hoverSound = document.getElementById("hoverSound");
    hoverSound.play();
}

function playPokemonSound(pokemonID) {

    const pokemon = allPokemons.find(pokemon => pokemon.Id == pokemonID)

    //to play pokemon sounds
    const pokemonSound = document.getElementById("pokemonSound")
    pokemonSound.src =`${baseURL_sound}${pokemon.Id}.ogg`

    pokemonSound.volume = 0.2;
    pokemonSound.play();
}

//functions to play hover sound effect
function playClickSound() {
    const hoverSound = document.getElementById("clickSound");
    hoverSound.play();
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

    //for favorite selection
    //for the favorite selection
    const favoriteBtns = document.querySelectorAll(".favorite-icon")
    favoriteBtns.forEach(btn =>{
        btn.addEventListener('click', ()=>{
        //take the parent card of the btn
        const card = btn.closest('.card');

        let pokemonID = card.querySelector("li").innerText;
        
        //pick out the id part first
        const parts = pokemonID.split(":");
        pokemonID = parseInt(parts[1].trim());
        
        //toggle favorite
        toggleFavorite(allPokemons, pokemonID)
        updateDisplayPokemons();
        showMoreCards(); 

        })
    })


    // Add event listeners to card elements
    const cards = document.querySelectorAll(".card");
    cards.forEach(card => {
        card.addEventListener("mouseenter", playHoverSound);
    });

}

//----------------------------------------------------------------

//---------------------------DOM IS LOADED----------------------------

// This calls the addCards() function when the page is first loaded
document.addEventListener("DOMContentLoaded", showMoreCards);

