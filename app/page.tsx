"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

interface PokemonType {
  id: number;
  name: string;
  image: string;
}

interface Pokemon {
  id: number;
  pokedexId: number;
  name: string;
  image: string;
  types: PokemonType[];
}

export default function Home() {
  const [pokemons, setPokemons] = useState<Pokemon[]>([]);
  const [types, setTypes] = useState<PokemonType[]>([]);
  const [page, setPage] = useState(1);
  const [limit] = useState(50);
  const [nameFilter, setNameFilter] = useState("");
  const [selectedTypes, setSelectedTypes] = useState<number[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchTypes = async () => {
      const response = await fetch(
        "https://nestjs-pokedex-api.vercel.app/types"
      );
      const data = await response.json();
      setTypes(data);
    };

    fetchTypes();
  }, []);

  useEffect(() => {
    const fetchPokemons = async () => {
      setLoading(true);
      const queryParams = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        name: nameFilter,
        types: selectedTypes.join(","),
      });

      const response = await fetch(
        `https://nestjs-pokedex-api.vercel.app/pokemons?${queryParams.toString()}`
      );
      const data = await response.json();

      setPokemons((prev) => {
        const combined = [...prev, ...data];
        const uniquePokemons = Array.from(
          new Map(
            combined.map((pokemon) => [pokemon.pokedexId, pokemon])
          ).values()
        );
        return uniquePokemons;
      });

      setLoading(false);
    };

    fetchPokemons();
  }, [page, nameFilter, selectedTypes]);

  const handleScroll = () => {
    if (
      window.innerHeight + document.documentElement.scrollTop >=
        document.documentElement.offsetHeight &&
      !loading
    ) {
      setPage((prev) => prev + 1);
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [loading]);

  return (
    <div className="p-4">
      <h1 className="text-4xl font-bold text-center mb-6">Pokedex</h1>
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search by name"
          className="border p-2 w-full mb-4"
          onChange={(e) => setNameFilter(e.target.value)}
        />
        <div className="flex flex-wrap gap-2">
          {types.map((type) => (
            <button
              key={type.id}
              className={`p-2 border rounded ${
                selectedTypes.includes(type.id) ? "bg-blue-500 text-white" : ""
              }`}
              onClick={() =>
                setSelectedTypes((prev) =>
                  prev.includes(type.id)
                    ? prev.filter((id) => id !== type.id)
                    : [...prev, type.id]
                )
              }
            >
              {type.name}
            </button>
          ))}
        </div>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {pokemons.map((pokemon) => (
          <Link
            href={`/pokemon/${pokemon.pokedexId}`}
            key={`${pokemon.pokedexId}-${pokemon.name}`}
          >
            <div className="border p-4 rounded cursor-pointer hover:shadow-lg">
              <img
                src={pokemon.image}
                alt={pokemon.name}
                className="w-full h-32 object-contain"
              />
              <h2 className="text-lg font-bold text-center">{pokemon.name}</h2>
              <div className="flex justify-center gap-2 mt-2">
                {pokemon.types.map((type) => (
                  <img
                    key={`${pokemon.pokedexId}-${type.id}`}
                    src={type.image}
                    alt={type.name}
                    className="h-6"
                  />
                ))}
              </div>
            </div>
          </Link>
        ))}
      </div>
      {loading && <p className="text-center mt-4">Loading...</p>}{" "}
    </div>
  );
}
