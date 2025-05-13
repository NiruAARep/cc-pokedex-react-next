"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { CircularProgress } from "@mui/material";

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
    return (
      <div className="flex items-center justify-center h-screen">
        <CircularProgress />
      </div>
    );
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
      <div className="relative border-4 border-yellow-500 rounded-lg bg-gradient-to-b from-yellow-300 via-white to-yellow-200 shadow-2xl p-6 hover:shadow-2xl transition-shadow duration-300">
        <h1 className="absolute top-2 left-2 bg-yellow-500 text-white text-2xl font-bold px-4 py-1 rounded-tl-lg rounded-br-lg">
          {pokemon.name}
        </h1>

        <img
          src={pokemon.image}
          alt={pokemon.name}
          className="w-full h-64 object-contain rounded-lg border-2 border-yellow-500"
        />

        <div className="grid grid-cols-2 gap-4 mt-4 bg-white p-4 rounded-lg border border-gray-300 shadow-inner">
          {Object.entries(pokemon.stats).map(([key, value]) => (
            <div
              key={key}
              className="flex justify-between text-sm font-bold tracking-wider"
            >
              <span className="capitalize">{key}</span>
              <span>{value}</span>
            </div>
          ))}
        </div>

        <h2 className="text-xl font-bold text-center text-gray-700 mt-6">
          Evolutions
        </h2>
        <div className="flex gap-4 mt-2 justify-center">
          {pokemon.evolutions.map((evolution) => (
            <div
              key={evolution.pokedexId}
              className="text-center bg-white p-2 rounded-lg border border-gray-200 shadow-md"
            >
              <img
                src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${evolution.pokedexId}.png`}
                alt={evolution.name}
                className="h-16 w-16 object-contain"
              />
              <p className="text-sm font-bold text-gray-700">
                {evolution.name}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
