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
  description: string;
  primaryType: string;
  secondaryType: string;
  possibility: number;
  baseStats: Stats;
  evYield: Stats;
}