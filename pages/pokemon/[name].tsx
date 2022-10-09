import { GetServerSidePropsContext, GetStaticPropsContext } from 'next'
import React from 'react'
import { PokemonDetails } from '../../interfaces/Interface'
import styles from "../../styles/PokemonDetail.module.css"
import { Results } from "../../interfaces/Interface"
import Image from 'next/image'


interface PokemonProps extends PokemonDetails{
    pokemon: PokemonDetails
}



const Pokemon = ({pokemon}: PokemonProps) => {

    const renderStats = () => (
        pokemon.stats?.map((stat, index) => (
            <div key={index} className="bg-slate-700 my-2 rounded p-1">
                <div className="bg-slate-900 rounded px-2" style={{width: `${stat.base_stat}%`}}>
                    {stat.stat.name}: {stat.base_stat}
                </div>
            </div>
        ))
    )

    const renderTypes = () => (
        pokemon.types?.map((type, index) => (
            <li key={index} style={{textDecoration: "none"}}>
                {type.type.name}
            </li>
        ))
    )

  return (
    <div className={styles.detailContainer}>
      <div className={styles.detailCard}></div>
      <h1>{pokemon.name}</h1>
      <div className={styles.left}>
        <Image
          src={pokemon.sprites.front_default}
          alt={pokemon.name}
          height={400}
          width={400}
        />
         <ul>{renderTypes()}</ul>
      </div>
      <div className={styles.right}>
       
        <div>{renderStats()}</div>
      </div>
    </div>
  );
}

export default Pokemon

// export async function getServerSideProps(context: GetServerSidePropsContext) {
//     const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${context.query.name}`)
//     const pokemon = await response.json()

//     return {
//         props: {
//             pokemon
//         }
//     }
// }
export async function getStaticPaths() {
    const res = await fetch("https://pokeapi.co/api/v2/pokemon");
    const data = await res.json();

    const paths = data.results.map((pokemon: Results) => {
        return{
            params: {name: pokemon.name}
        }
    })
    return {
      paths: paths,
      fallback: false,
    };
  }


 export async function getStaticProps(context: GetStaticPropsContext) {
    if (!context.params) {
        return null
    }
    const name = context.params.name
     const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${name}`)
     const pokemon = await response.json()
  
     return {
         props: {
             pokemon
         }
     }
   }

