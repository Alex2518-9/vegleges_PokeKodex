export interface Results {
  name: string,
  url: string,
}

export interface Pokemons {
  count: number,
  next: string,
  previous: string,
  results: Results[]
}

export interface PokemonDetail {
  id: number;
  name: string;
  sprites: {
    front_default: string;
  };
  height?: number;
  abilities?: {
    ability: {
      name: string;
    };
  }[];
  stats?: {
    base_stat: number;
    stat: {
      name: string;
    };
  }[];
  types?: {
    type: {
      name: string;
    };
  }[];
  weight?: number;
  versions?: {
    generation: {
      color: {
        front_default: string;
      };
    };
  };
  location_area_encounters?: string,
  species: {
    url: string,
  }
};


export interface EvolutionChain {
  chain?: {
    evolves_to: {
      evolves_to: {
        species: {
          name: string
        }
      }[],
      species: {
        name: string
      }
    }[],
    species: {
      name: string
    }
  }
}[]

export interface Location {
  location_area: {
    name: string;
  };
}
[];