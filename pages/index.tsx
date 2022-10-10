import axios from "axios";
import type { GetStaticPropsContext, NextPage } from "next";
import { useEffect, useState, useRef } from "react";
import PokemonCard from "../components/PokemonCard";
import { PokemonDetails, Results, Pokemons } from "../interfaces/Interface";
import styles from "../styles/Home.module.css";

const Home = ({ initialPokemon }: any) => {
  const [pokemonDashboard, setPokemonDashboard] = useState<PokemonDetails[]>(
    []
  );
  const [allPokemon, setAllPokemon] = useState<Pokemons>(initialPokemon);
  const [offset, setOffet] = useState(0);
  const [search, setSearch] = useState<string[]>([]);
  const [nextUrl, setNextUrl] = useState<string>(initialPokemon.next);

  const stopFetch = useRef(false);

  console.log(pokemonDashboard);
  // console.log(allPokemon);

  const getPokemon = async () => {
    allPokemon.results.map(async (pokemon: Results) => {
      if (pokemonDashboard.length < 20) {
        const res = await fetch(
          `https://pokeapi.co/api/v2/pokemon/${pokemon.name}`
        );
        const data = await res.json();
        setPokemonDashboard((p) => [...p, data]);
      } else {
        return null;
      }
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

  const sortByIndexPokemons = [...pokemonDashboard].sort((a, b) => {
    const intl = Intl.Collator(undefined, {
      numeric: true,
    });
    let order = intl.compare(a.id.toString(), b.id.toString());
    return order;
  });

  //   const fetchPokemon = async (url: string, next: boolean) => {
  //     const response = await fetch(url)
  //     const nextPokemon = await response.json()

  //     setOffet(next ? offset + 20 : offset - 20)
  //     setPokemonDashboard((p) => [...p, nextPokemon])
  // }

  const searchedPokemon = [...sortByIndexPokemons].filter((data) => {
    const pokemonType = data.types?.map((pokeType) => {
      return pokeType.type.name;
    });

    return search.length === 0
      ? true
      : search.every((characters: string) =>
          data.name.toLowerCase().includes(characters.toLowerCase())
        ) ||
          search.every((characters: string) =>
            pokemonType?.forEach((type) =>
              type.toLowerCase().includes(characters.toLowerCase())
            )
          );
  });

  const nextPage = async () => {
    let res = await axios.get(nextUrl);
    setNextUrl(res.data.next);
    res.data.results.forEach(async (pokemon: Results) => {
      const poke = await axios.get(
        `https://pokeapi.co/api/v2/pokemon/${pokemon.name}`
      );
      setPokemonDashboard((p) => [...p, poke.data]);
    });
  };

  return (
    <div className={styles.allContainer}>
      <div className={styles.header}>
        <h2>Pokemon kodex</h2>
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

      <div className={styles.container}>
        {searchedPokemon.map((pokemon, index) => (
          <PokemonCard index={index} key={index} pokemon={pokemon} />
        ))}
      </div>
      <div className={styles.BtnContainer}>
        <button className={styles.LoadBtn} onClick={nextPage}>
          Load more
        </button>
      </div>
    </div>
  );
};

export default Home;

export async function getStaticProps(context: GetStaticPropsContext) {
  const response = await fetch("https://pokeapi.co/api/v2/pokemon?limit=20");
  const initialPokemon = await response.json();

  return {
    props: {
      initialPokemon,
    },
  };
}
