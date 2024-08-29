export interface PokemonStat {
  name: string;
  value: number;
}

export interface PokemonDetails {
  abilities: string[];
  types: string[];
  stats: PokemonStat[];
  sprite: string;
}
