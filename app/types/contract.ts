export interface Stats {
  hp: number;
  attack: number;
  defense: number;
  sp_attack: number;
  sp_defense: number;
  speed: number;
}

export interface Species {
  name: string;
  hash: string;
  primaryType: number;
  secondaryType: number;
  possibility: number;
  baseStats: Stats;
  evYield: Stats;
}