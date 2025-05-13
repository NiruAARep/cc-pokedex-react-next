"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import CatchingPokemonIcon from "@mui/icons-material/CatchingPokemon";

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
        ...(nameFilter && { name: nameFilter }),
        ...(selectedTypes.length > 0 && { types: selectedTypes.join(",") }),
      });

      const response = await fetch(
        `https://nestjs-pokedex-api.vercel.app/pokemons?${queryParams.toString()}`
      );
      const data = await response.json();

      setPokemons((prev) =>
        page === 1
          ? data
          : Array.from(
              new Map(
                [...prev, ...data].map((pokemon) => [
                  pokemon.pokedexId,
                  pokemon,
                ])
              ).values()
            )
      );

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

  useEffect(() => {
    setPage(1);
  }, [nameFilter, selectedTypes]);

  return (
    <div className="p-4">
      <h1 className="text-4xl font-bold text-center mb-6 text-white">
        Pokedex
      </h1>

      <div className="mb-4">
        <TextField
          variant="outlined"
          fullWidth
          placeholder="Filtre par nom"
          onChange={(e) => setNameFilter(e.target.value.trim())}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <CatchingPokemonIcon />
              </InputAdornment>
            ),
          }}
          className="mb-4"
        />

        <div className="flex flex-wrap gap-2">
          {types.map((type) => (
            <button
              key={type.id}
              className={`p-2 mt-2 border rounded-lg text-sm font-medium flex items-center gap-2 transition-all duration-300 ${
                selectedTypes.includes(type.id)
                  ? "bg-blue-500 text-white shadow-lg scale-105"
                  : "bg-gray-100 text-gray-700 hover:bg-blue-100 hover:text-blue-700"
              }`}
              onClick={() =>
                setSelectedTypes((prev) =>
                  prev.includes(type.id)
                    ? prev.filter((id) => id !== type.id)
                    : [...prev, type.id]
                )
              }
            >
              <img src={type.image} alt={type.name} className="h-6 w-6" />
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
            <div className="border p-4 rounded bg-white shadow-lg hover:shadow-2xl hover:scale-105 cursor-pointer transition-transform transition-shadow duration-300">
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

      {loading && <p className="text-center mt-4">Loading...</p>}
    </div>
  );
}
