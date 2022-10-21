import { useMemo, useState, useEffect, useCallback } from 'react'
import PokemonCard from '../components/PokemonCard'
import { PokemonDetail } from '../interfaces/Interface'
import styles from '../styles/Home.module.css'
import Link from 'next/link'
import Router, { useRouter } from 'next/router'
import { useQuery } from 'react-query'
import { GetServerSidePropsContext } from 'next'
import debounce from 'lodash.debounce'

const Home = ({ pokemons, url }: { pokemons: PokemonDetail[]; url: string }) => {
  const { query, basePath } = useRouter()
  const queryName = query.name
  const [name, setName] = useState<string>(queryName ? (queryName as string) : '')

  const { data } = useQuery<PokemonDetail[]>(
    ['pokemons', name],
    () => {
      return name.length > 0 ? getPokemonData(url, name.split(' ')) : getPokemonData(url)
    },
    {
      enabled: !!name,
    }
  )

  const dataToDisplay = name ? data : pokemons

  const sortPokemonsByIndex = useMemo(() => {
    const sorting = dataToDisplay?.sort((a, b) => {
      const intl = Intl.Collator(undefined, {
        numeric: true,
      })
      let order = intl.compare(a.id.toString(), b.id.toString())
      return order
    })
    return sorting
  }, [dataToDisplay])

  const onSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value.trim())
  }

  const debouncedChangeHandler = useMemo(() => debounce(onSearch, 300), [name])


  useEffect(() => {
    Router.replace(
      basePath,
      name.length > 0
        ? {
            query: { ...query, name: name },
          }
        : process.env.BASE_URI!
    )
  }, [debouncedChangeHandler])

  return (
    <div className={styles.allContainer}>
      <div className={styles.header}>
        <Link href={'/'}>
          <h2>Pokemon kodex</h2>
        </Link>
        <div className={styles.search}>
          <input defaultValue={name} type="text" placeholder="Search pokemon..." onChange={(e) => onSearch(e)} />
        </div>
      </div>

      <div className={styles.container}>
        {sortPokemonsByIndex?.map((pokemon, index) => (
          <PokemonCard index={index} key={index} pokemon={pokemon} />
        ))}
      </div>
      <div className={styles.BtnContainer}></div>
    </div>
  )
}

export default Home

const getPokemonData = async (url: string, searchName?: string[]): Promise<PokemonDetail[]> =>
  await (
    await fetch(`http://${url}/api/getPokemons`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name: searchName }),
    })
  ).json()

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const { host } = context.req.headers

  return {
    props: {
      pokemons: await getPokemonData(host || ''),
      url: host,
    },
  }
}
