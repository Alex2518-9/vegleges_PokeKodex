import React from 'react'
import { PokemonProps } from '../pages/pokemon/[name]';

const PokemonTypes = ({pokemon}: PokemonProps) => {
  return (
    pokemon.types?.map((type, index) => (
        <li key={index} style={{ textDecoration: "none" }}>
          {type.type.name}
        </li>
      ))
  )
}

export default PokemonTypes