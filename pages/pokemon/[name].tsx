import { GetServerSidePropsContext } from 'next'
import React from 'react'
import { PokemonDetail } from '../../interfaces/Interface'
import styles from '../../styles/PokemonDetail.module.css'
import Image from 'next/image'
import { IoIosArrowBack } from 'react-icons/io'
import Link from 'next/link'
import PokemonStats from '../../components/PokemonStats'
import PokemonTypes from '../../components/PokemonTypes'
export interface PokemonProps extends PokemonDetail {
  pokemon: PokemonDetail
}

const Pokemon = ({ pokemon }: PokemonProps) => {
  return (
    <div className={styles.detailContainer}>
      <div className={styles.detailCard}>
        <Link href={'/'}>
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
          <ul>
            <PokemonTypes pokemon={pokemon} />
          </ul>
        </div>
        <div className={styles.right}>
          <div className={styles.pokeStats}>
            <PokemonStats pokemon={pokemon} />
          </div>
          <div className={styles.bodyDetails}>height: {pokemon.height}</div>
          <div className={styles.bodyDetails}>weight: {pokemon.weight} lbs</div>
        </div>
      </div>
    </div>
  )
}

export default Pokemon

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${context.query.name}`)
  const pokemon = await response.json()

  return {
    props: {
      pokemon,
    },
  }
}
