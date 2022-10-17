import { useMemo, useState } from "react";
import PokemonCard from "../components/PokemonCard";
import { PokemonDetail, Pokemons } from "../interfaces/Interface";
import styles from "../styles/Home.module.css";
import Link from "next/link";

const Home = ({ pokemons }: { pokemons: PokemonDetail[] }) => {
  const [search, setSearch] = useState<string[]>([]);

  const sortPokemonsByIndex = [...pokemons].sort((a, b) => {
    const intl = Intl.Collator(undefined, {
      numeric: true,
    });
    let order = intl.compare(a.id.toString(), b.id.toString());
    return order;
  });

  const searchedPokemon = useMemo(() => {
    const searching = [...sortPokemonsByIndex].filter((data) => {
      return search.length === 0
        ? true
        : search.every((characters: string) =>
            data.name.toLowerCase().includes(characters.toLowerCase())
          );
    });
    return searching;
  }, [sortPokemonsByIndex, search]);

  return (
    <div className={styles.allContainer}>
      <div className={styles.header}>
        <Link href={"/"}>
          <h2>Pokemon kodex</h2>
        </Link>
        <div className={styles.search}>
          <input
            type="text"
            placeholder="Search pokemon..."
            onChange={(e) =>
              setSearch(
                e.target.value.trim() ? e.target.value.trim().split(" ") : []
              )
            }
          />
        </div>
      </div>

      <div className={styles.container}>
        {searchedPokemon.map((pokemon, index) => (
          <PokemonCard index={index} key={index} pokemon={pokemon} />
        ))}
      </div>
      <div className={styles.BtnContainer}></div>
    </div>
  );
};

export default Home;

export async function getServerSideProps() {
  try {
    let fetched = 0;
    let total = -1;
    let pokemons: PokemonDetail[] = [];

    while (fetched < total || total === -1) {
      const response = await fetch(
        `https://pokeapi.co/api/v2/pokemon?offset=${fetched}&limit=1000`
      );
      const res: Pokemons = await response.json();

      let n = 0;
      let m = n + 100;
      let chunkArray = res.results.slice(n, m);

      while (m <= res.results.length) {
        const pokemonBatch = await Promise.all(
          chunkArray.map(async (data) => {
            console.log(`fetching ${data.name}`);

            const defaultData = await fetch(
              `https://pokeapi.co/api/v2/pokemon/${data.name}`
            );
            console.log(`received ${data.name}`);
            const details: PokemonDetail = await defaultData.json();
            return details;
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
    return {
      props: {
        pokemons,
      },
    };
  } catch (error) {
    return { error: error };
  }
}
