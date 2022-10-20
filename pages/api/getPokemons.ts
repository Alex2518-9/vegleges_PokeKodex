import { NextApiRequest, NextApiResponse } from "next";
import { PokemonDetail, Pokemons } from "../../interfaces/Interface";

export default async function fetchPokemons(req: NextApiRequest, res: NextApiResponse) {
    const names: string[] = req.body?.name || []

    try {

        let fetched = 0;
        let total = -1;
        let pokemons: PokemonDetail[] = [];

        while (fetched < total || total === -1) {

            const poks = await getPokkemonsWithOffsetChange(fetched);

            const filteredData = names.length > 0 ? poks.results?.filter((data) => {
                return names.some((name) => data.name.toLowerCase().includes(name))
            }) : poks.results

            let n = 0;
            let m = n + 100;
            let chunkArray = filteredData.slice(n, m);
            console.log('chunk', n, m, chunkArray);

            while (chunkArray.length > 0) {
                const pokemonBatch = await Promise.all(
                    chunkArray.map(async (data) => {
                        return getPokemonDetailUsingTheirName(data.name);
                    })
                );
                pokemons = [...pokemons, ...pokemonBatch];
                n += 100;
                m = n + 100;
                chunkArray = filteredData.slice(n, m);
            }
            fetched += poks.results.length;
            total = poks.count;
            console.log(`processed batch ${fetched}`, pokemons);
        }

        res.status(200).json(pokemons)

    } catch (error) {
        res.status(404).json(error)
    }
}

export async function getPokkemonsWithOffsetChange(offset: number) {
    const response = await fetch(
        `https://pokeapi.co/api/v2/pokemon?offset=${offset}&limit=1000`
    );
    const res: Pokemons = await response.json();
    return res
}

export async function getPokemonDetailUsingTheirName(name: string) {
    const defaultData = await fetch(
        `https://pokeapi.co/api/v2/pokemon/${name}`
    );
    const details: PokemonDetail = await defaultData.json();
    return details;
}

