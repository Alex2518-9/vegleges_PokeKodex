import React from 'react'
import { PokemonProps } from '../pages/pokemon/[name]'
import ProgressBar from './ProgressBar'

const PokemonStats = ({ pokemon }: PokemonProps) => {
  return pokemon.stats?.map((stat, index) => (
    <ProgressBar key={index} completed={stat.base_stat} statName={stat.stat.name} />
  ))
}

export default PokemonStats
