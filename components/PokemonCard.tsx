import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import { PokemonDetail } from '../interfaces/Interface'
import styles from '../styles/PokemonCard.module.css'
interface CardProps {
  pokemon: PokemonDetail
  index?: number
}
const PokemonCard = ({ pokemon }: CardProps) => {
  return (
    <Link href={`/pokemon/${pokemon.name}`}>
      <div className={styles.Card}>
        <span className={styles.Card_id}>#{pokemon.id}</span>
        {pokemon.sprites.front_default && (
          <Image
            className={styles.Card_image}
            src={pokemon.sprites.front_default}
            alt={pokemon.name}
            width={200}
            height={200}
          />
        )}
        <p className={styles.Card_name}>{pokemon.name}</p>
        <div className={styles.Card_type}>
          {pokemon.types?.map((type) => (
            <p key={type.type.name}>{type.type.name}</p>
          ))}
        </div>
      </div>
    </Link>
  )
}

export default PokemonCard
