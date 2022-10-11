import type { GetStaticPropsContext } from "next";
import { useEffect, useState, useRef } from "react";
import PokemonCard from "../components/PokemonCard";
import { PokemonDetails, Results, Pokemons } from "../interfaces/Interface";
import styles from "../styles/Home.module.css";
import Link from "next/link";

const Home = ({ initialPokemon }: any) => {
  const [pokemonDashboard, setPokemonDashboard] = useState<PokemonDetails[]>(
    []
  );
  const [search, setSearch] = useState<string[]>([]);
  const stopFetch = useRef(false);

  const allPokemon: Pokemons = initialPokemon;

  const getPokemon = async () => {
    allPokemon.results.map(async (pokemon: Results) => {
      const res = await fetch(
        `https://pokeapi.co/api/v2/pokemon/${pokemon.name}`
      );
      const data = await res.json();
      setPokemonDashboard((p) => [...p, data]);
    });
  };

  useEffect(() => {
    if (stopFetch.current === false) {
      getPokemon();
      return () => {
        stopFetch.current = true;
      };
    }
  }, []);

  const sortPokemonsByIndex = [...pokemonDashboard].sort((a, b) => {
    const intl = Intl.Collator(undefined, {
      numeric: true,
    });
    let order = intl.compare(a.id.toString(), b.id.toString());
    return order;
  });

  const searchedPokemon = [...sortPokemonsByIndex].filter((data) => {
    return search.length === 0
      ? true
      : search.every((characters: string) =>
          data.name.toLowerCase().includes(characters.toLowerCase())
        );
  });

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

export async function getStaticProps(context: GetStaticPropsContext) {
  try {
    const limit = "1154";
    const response = await fetch(
      `https://pokeapi.co/api/v2/pokemon?limit=${limit}`
    );
    const initialPokemon = await response.json();
    return {
      props: {
        initialPokemon,
      },
    };
  } catch (error) {
    return { error: error };
  }
}
