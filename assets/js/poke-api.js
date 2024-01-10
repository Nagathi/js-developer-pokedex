
const pokeApi = {}

function convertPokeApiDetailToPokemon(pokeDetail) {
    const pokemon = new Pokemon()
    pokemon.number = pokeDetail.id
    pokemon.name = pokeDetail.name

    const types = pokeDetail.types.map((typeSlot) => typeSlot.type.name)
    const [type] = types

    pokemon.types = types
    pokemon.type = type

    pokemon.photo = pokeDetail.sprites.other.dream_world.front_default

    return pokemon
}

pokeApi.getPokemonDetail = (pokemon) => {
    return fetch(pokemon.url)
        .then((response) => response.json())
        .then(convertPokeApiDetailToPokemon)
}

const getPokemonByTypeWithDetails = async (type) => {
    const typeUrl = `https://pokeapi.co/api/v2/type/${type}`;

    try {
        const response = await fetch(typeUrl);
        const data = await response.json();
        const pokemonsOfType = data.pokemon.map(async (pokemon) => {
            const details = await pokeApi.getPokemonDetail(pokemon.pokemon);
            return details;
        });
        return Promise.all(pokemonsOfType);
    } catch (error) {
        console.error('Erro ao buscar os Pokémon por tipo:', error);
        return [];
    }
};

const headerList = document.querySelectorAll('header li');

headerList.forEach((li) => {
    li.addEventListener('click', async (event) => {
        const type = event.target.id;
        const pokemons = await getPokemonByTypeWithDetails(type);
        window.pokemonList.innerHTML = '';
        pokemons.forEach((pokemon) => {
            window.pokemonList.innerHTML += window.convertPokemonToLi(pokemon);
        });
    });
});

pokeApi.getPokemons = (offset = 0, limit = 5) => {
    const url = `https://pokeapi.co/api/v2/pokemon?offset=${offset}&limit=${limit}`

    return fetch(url)
        .then((response) => response.json())
        .then((jsonBody) => jsonBody.results)
        .then((pokemons) => pokemons.map(pokeApi.getPokemonDetail))
        .then((detailRequests) => Promise.all(detailRequests))
        .then((pokemonsDetails) => pokemonsDetails)
}
