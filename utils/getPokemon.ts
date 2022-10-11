
const baseUrl = 'https://pokeapi.co/api/v2/pokemon';


export default async function fetchPokemon(pokemon: string) {
    return await fetch(`${baseUrl}/${pokemon}`)
}