import { NextApiRequest, NextApiResponse } from "next";
import { PokemonDetail, Pokemons } from "../../interfaces/Interface";

export default async function fetchPokemons(req: NextApiRequest, res: NextApiResponse) {
    const name = req.body?.name
    try {
        let fetched = 0;
        let total = -1;
        let pokemons: PokemonDetail[] = [];

        while (fetched < total || total === -1) {

            const res = await getPokkemonsWithOffsetChange(fetched);

            let n = 0;
            let m = n + 100;
            let chunkArray = res.results.slice(n, m);

            while (m <= res.results.length) {
                const pokemonBatch = await Promise.all(
                    chunkArray.map(async (data) => {
                        console.log(`fetching ${data.name}`);
                        if (name) {
                            return getPokemonDetailUsingTheirName(name);

                        } else {
                            return getPokemonDetailUsingTheirName(data.name);
                        }
                    })
                );
                pokemons = [...pokemons, ...pokemonBatch];
                n += 100;
                m = n + 100;
                chunkArray = res.results.slice(n, m);
            }
            fetched += res.results.length;
            total = res.count;
            console.log(`processed batch ${fetched}`);
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
    console.log(`received ${name}`);
    const details: PokemonDetail = await defaultData.json();
    return details;
}