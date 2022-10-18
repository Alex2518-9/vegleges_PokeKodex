import { useMemo } from "react";
import PokemonCard from "../components/PokemonCard";
import { PokemonDetail, Pokemons } from "../interfaces/Interface";
import styles from "../styles/Home.module.css";
import Link from "next/link";
import { useQueryState } from "next-usequerystate";
import { queryTypes } from "next-usequerystate";
import { useRouter } from "next/router";
import { dehydrate, QueryClient, useQuery } from "react-query";
import { GetServerSidePropsContext } from "next";

const Home = ({ pokemons }: { pokemons: PokemonDetail[] }) => {
  const [name, setName] = useQueryState(
    "name",
    queryTypes.array(queryTypes.string)
  );
  const { data } = useQuery<PokemonDetail[]>(["pokemon", name], getPokemonData);

  const sortPokemonsByIndex = useMemo(() => {
    const sorting = [...pokemons].sort((a, b) => {
      const intl = Intl.Collator(undefined, {
        numeric: true,
      });
      let order = intl.compare(a.id.toString(), b.id.toString());
      return order;
    });
    return sorting;
  }, [pokemons]);

  const searchedPokemonByName = useMemo(() => {
    const searching = [...sortPokemonsByIndex].filter((data) => {
      return !name
        ? true
        : name.every((characters) =>
            data.name.toLowerCase().includes(characters.toLowerCase())
          );
    });
    return searching;
  }, [sortPokemonsByIndex, name]);

  const { query } = useRouter();

  const onSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTimeout(() => {
      setName(e.target.value.trim() ? e.target.value.trim().split(" ") : []);
    }, 1000);
  };

  return (
    <div className={styles.allContainer}>
      <div className={styles.header}>
        <Link href={"/"}>
          <h2>Pokemon kodex</h2>
        </Link>
        <div className={styles.search}>
          <input
            value={query.name || undefined}
            type="text"
            placeholder="Search pokemon..."
            onChange={(e) => onSearch(e)}
          />
        </div>
      </div>

      <div className={styles.container}>
        {searchedPokemonByName.map((pokemon, index) => (
          <PokemonCard index={index} key={index} pokemon={pokemon} />
        ))}
      </div>
      <div className={styles.BtnContainer}></div>
    </div>
  );
};

export default Home;

const getPokemonData = async (key: string, name: string) =>
  await (
    await fetch("/api/getPokemons", {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(name),
    })
  ).json();

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery<PokemonDetail[]>(
    ["pokemon", context.query ? context.query : null],
    getPokemonData
  );

  return {
    props: {
      dehydratedState: dehydrate(queryClient),
    },
  };
}
