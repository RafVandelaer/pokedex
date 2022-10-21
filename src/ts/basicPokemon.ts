export interface Sprites {
    front_default: string;
}

export  interface Type2 {
    name: string;
}

export interface Type {
    slot: number;
    type: Type2;
}

export  interface basicPokemon {
    id: number;
    name: string;
    sprites: Sprites;
    types: Type[];
}