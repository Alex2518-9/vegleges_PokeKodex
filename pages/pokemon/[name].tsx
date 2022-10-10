import { GetServerSidePropsContext, GetStaticPropsContext } from "next";
import React from "react";
import { EvolutionChain, PokemonDetails } from "../../interfaces/Interface";
import styles from "../../styles/PokemonDetail.module.css";
import { Results } from "../../interfaces/Interface";
import Image from "next/image";
import { IoIosArrowBack } from "react-icons/io";
import Link from "next/link";
import ProgressBar from "../../components/ProgressBar";
interface PokemonProps extends PokemonDetails {
  pokemon: PokemonDetails;
}

const Pokemon = ({ pokemon }: PokemonProps) => {


  const renderStats = () =>
    pokemon.stats?.map((stat, index) => (
      <ProgressBar
        key={index}
        completed={stat.base_stat}
        statName={stat.stat.name}
      />
    ));

  const renderTypes = () =>
    pokemon.types?.map((type, index) => (
      <li key={index} style={{ textDecoration: "none" }}>
        {type.type.name}
      </li>
    ));

  const renderEvolution = async () => {
    await fetch(pokemon.species.url).then(async (res) => {
      const data: Results = await res.json();
      const response = await fetch(data.url);
      const chain: EvolutionChain[] = await response.json();
      console.log(chain);
    });
  };
  renderEvolution();

  
  return (
    <div className={styles.detailContainer}>
      <div className={styles.detailCard} >
        <Link href={"/"}>
          <button className={styles.backBtn}>
            <IoIosArrowBack />
          </button>
        </Link>
        <div className={styles.left}>
          <h1>{pokemon.name}</h1>
          <Image
            className={styles.detailImage}
            src={pokemon.sprites.front_default}
            alt={pokemon.name}
            height={400}
            width={400}
          />
          <ul>{renderTypes()}</ul>
        </div>
        <div className={styles.right}>
          <div>{renderStats()}</div>
          <div className={styles.bodyDetails}>height: {pokemon.height}</div>
          <div className={styles.bodyDetails}>weight: {pokemon.weight}</div>
          <div>{}</div>
        </div>
      </div>
    </div>
  );
};

export default Pokemon;


// export async function getStaticPaths() {
//   const res = await fetch("https://pokeapi.co/api/v2/pokemon");
//   const data = await res.json();

//   const paths = data.results.map((pokemon: Results) => {
//     return {
//       params: { name: pokemon.name },
//     };
//   });
//   return {
//     paths: paths,
//     fallback: false,
//   };
// }

// export async function getStaticProps(context: GetStaticPropsContext) {
//   if (!context.params) {
//     return null;
//   }
//   const name = context.params.name;
//   const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${name}`);
//   const pokemon = await response.json();

//   return {
//     props: {
//       pokemon,
//     },
//   };
// }



export async function getServerSideProps(context: GetServerSidePropsContext) {
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${context.query.name}`)
    const pokemon = await response.json()

    return {
        props: {
            pokemon
        }
    }
}