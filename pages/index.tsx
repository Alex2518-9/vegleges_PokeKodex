import { useMemo, useState } from 'react'
import PokemonCard from '../components/PokemonCard'
import { PokemonDetail, Pokemons } from '../interfaces/Interface'
import styles from '../styles/Home.module.css'
import Link from 'next/link'
import { useQueryState } from 'next-usequerystate'
import { queryTypes } from 'next-usequerystate'
import Router, { useRouter } from 'next/router'
import { QueryClient, useQuery, dehydrate, DehydratedState } from 'react-query'
import { GetServerSidePropsContext } from 'next'
import axios from 'axios'

const Home = ({dehydratedState}: {dehydratedState : DehydratedState}) => {
  const [name, setName] = useState<string>('')

  const { data } = useQuery<PokemonDetail[]>(['pokemon', name], () => getPokemonData(name.split(' ')), {
    enabled: !!name,
  })
  const { query, basePath } = useRouter()

  const sortPokemonsByIndex = useMemo(() => {
    const sorting = data?.sort((a, b) => {
      const intl = Intl.Collator(undefined, {
        numeric: true,
      })
      let order = intl.compare(a.id.toString(), b.id.toString())
      return order
    })
    return sorting
  }, [data])

  const searchedPokemonByName = useMemo(() => {
    const searching = sortPokemonsByIndex?.filter((data) => {
      return !name ? true : data.name.toLowerCase().includes(name.toLowerCase())
    })
    return searching
  }, [sortPokemonsByIndex, name])

  const onSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTimeout(() => {
      setName(e.target.value.trim())
      Router.replace(
        basePath,
        e.target.value.trim().length > 0
          ? {
              query: { ...query, name: e.target.value.trim() },
            }
          : process.env.BASE_URI!
      )
    }, 1000)
  }

  return (
    <div className={styles.allContainer}>
      <div className={styles.header}>
        <Link href={'/'}>
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
        {searchedPokemonByName?.map((pokemon, index) => (
          <PokemonCard index={index} key={index} pokemon={pokemon} />
        ))}
      </div>
      <div className={styles.BtnContainer}></div>
    </div>
  )
}

export default Home

const getPokemonData = async (searchName?: string[], url?: string) =>
  await (
    await fetch(`${process.env.BASE_URI!}/api/getPokemons`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(searchName),
    })
  ).json()

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const alma = context.params;
  console.log(alma);
  
  const queryClient = new QueryClient()
  await queryClient.prefetchQuery<PokemonDetail[]>('pokemon', () => getPokemonData())

  return {
    props: {
      dehydratedState: dehydrate(queryClient),
    },
  }
}
