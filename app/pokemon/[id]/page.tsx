"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

interface Stats {
  HP: number;
  speed: number;
  attack: number;
  defense: number;
  specialAttack: number;
  specialDefense: number;
}

interface Evolution {
  name: string;
  pokedexId: number;
}

interface Pokemon {
  name: string;
  image: string;
  stats: Stats;
  evolutions: Evolution[];
}

export default function PokemonDetails({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [pokemon, setPokemon] = useState<Pokemon | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPokemon = async () => {
      try {
        const response = await fetch(
          `https://nestjs-pokedex-api.vercel.app/pokemons/${params.id}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch Pokémon details.");
        }
        const data = await response.json();
        setPokemon(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchPokemon();
  }, [params.id]);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (!pokemon) {
    return <p>Pokemon not found.</p>;
  }

  return (
    <div className="p-4">
      <button
        onClick={() => router.back()}
        className="mb-4 p-2 border rounded bg-gray-200 hover:bg-gray-300"
      >
        Back to Pokedex
      </button>
      <div className="border p-4 rounded bg-white shadow-lg hover:shadow-2xl transition-shadow duration-300">
        <img
          src={pokemon.image}
          alt={pokemon.name}
          className="w-full h-64 object-contain"
        />
        <h1 className="text-4xl font-bold text-center">{pokemon.name}</h1>
        <div className="grid grid-cols-2 gap-4 mt-4">
          {Object.entries(pokemon.stats).map(([key, value]) => (
            <div key={key} className="flex justify-between">
              <span>{key}</span>
              <span>{value}</span>
            </div>
          ))}
        </div>
        <h2 className="text-2xl font-bold mt-6">Evolutions</h2>
        <div className="flex gap-4 mt-2">
          {pokemon.evolutions.map((evolution) => (
            <div key={evolution.pokedexId} className="text-center">
              <img
                src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${evolution.pokedexId}.png`}
                alt={evolution.name}
                className="h-16 w-16 object-contain"
              />
              <p>{evolution.name}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
