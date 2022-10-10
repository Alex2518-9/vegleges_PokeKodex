export interface Results{
    name: string,
    url: string
}

export interface Pokemons{
    next: string,
    previous: string,
    results: Results[]
}

export interface PokemonDetails {
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
  location_area_encounters?: string
}

export interface Location {
  location_area: {
    name: string;
  };
}
[];