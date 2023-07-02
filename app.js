const searchButton = document.getElementById("searchButton");
const searchInput = document.getElementById("searchInput");
const pokemonInfo = document.getElementById("pokemonInfo");
const suggestionsList = document.getElementById("suggestionsList");

searchButton.addEventListener("click", searchPokemon);
searchInput.addEventListener("input", handleInput);

async function handleInput() {
  const input = searchInput.value.toLowerCase();
  if (input.length === 0) {
    clearSuggestions();
    return;
  }

  try {
    const response = await fetch("https://pokeapi.co/api/v2/pokemon?limit=10");
    if (!response.ok) {
      throw new Error("Failed to fetch Pokémon list.");
    }
    const data = await response.json();
    const suggestions = data.results
      .map(result => result.name)
      .filter(name => name.startsWith(input))
      .slice(0, 5);
    displaySuggestions(suggestions);
  } catch (error) {
    console.log(error);
    clearSuggestions();
  }
}

function displaySuggestions(suggestions) {
  clearSuggestions();

  suggestions.forEach(suggestion => {
    const listItem = document.createElement("li");
    listItem.textContent = suggestion;
    listItem.addEventListener("click", () => {
      searchInput.value = suggestion;
      clearSuggestions();
      searchPokemon();
    });
    suggestionsList.appendChild(listItem);
  });
}

function clearSuggestions() {
  suggestionsList.innerHTML = "";
}

async function searchPokemon() {
  const pokemonName = searchInput.value.toLowerCase();

  try {
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonName}`);
    if (!response.ok) {
      throw new Error("Pokemon not found.");
    }

    const data = await response.json();
    displayPokemonInfo(data);
  } catch (error) {
    console.log(error);
    pokemonInfo.innerHTML = "Pokemon not found.";
  }
}

function displayPokemonInfo(pokemon) {
  const nameElement = document.querySelector(".name");
  const typeElement = document.querySelector(".type");
  const heightElement = document.querySelector(".height");
  const weightElement = document.querySelector(".weight");
  const bioElement = document.querySelector(".bio");

  nameElement.textContent = pokemon.name;
  typeElement.textContent = `Type: ${pokemon.types[0].type.name}`;
  heightElement.textContent = `Height: ${pokemon.height} m`;
  weightElement.textContent = `Weight: ${pokemon.weight} kg`;

  fetch(pokemon.species.url)
    .then(response => response.json())
    .then(data => {
      const bio = data.flavor_text_entries.find(entry => entry.language.name === "en").flavor_text;
      bioElement.textContent = bio;
    });
}
