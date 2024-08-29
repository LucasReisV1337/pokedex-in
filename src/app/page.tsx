"use client";

import { useState, useEffect } from 'react';
import axios from 'axios';
import { FaMoon, FaSun } from 'react-icons/fa';
import Image from 'next/image';
import { PokemonDetails } from './interface';

export default function Home() {
  const [pokemon, setPokemon] = useState('');
  const [pokemonLS, setPokemonLS] = useState('');
  const [pokemonDetails, setPokemonDetails] = useState<PokemonDetails | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [darkMode, setDarkMode] = useState<boolean>(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);

  useEffect(() => {
    const savedDarkMode = localStorage.getItem('darkMode') === 'true';
    setDarkMode(savedDarkMode);
    if (savedDarkMode) {
      document.documentElement.classList.add('dark');
    }
    const lastSearch = localStorage.getItem('lastSearchedPokemon');
    if (lastSearch) {
      setPokemonLS(lastSearch);
      fetchPokemonDetails(lastSearch);
    }

    const previousSearches = JSON.parse(localStorage.getItem('searchHistory') || '[]');
    setSuggestions(previousSearches);
  }, []);

  useEffect(() => {
    if (pokemon.trim()) {
      const filteredSuggestions = JSON.parse(localStorage.getItem('searchHistory') || '[]')
        .filter((p: string) =>
          p.toLowerCase().includes(pokemon.toLowerCase())
        );
      setSuggestions(filteredSuggestions);
    } else {
      setSuggestions(JSON.parse(localStorage.getItem('searchHistory') || '[]'));
    }
  }, [pokemon]);

  const fetchPokemonDetails = async (pokemonName: string) => {
    if (!pokemonName.trim()) return;

    setLoading(true);
    setError(null);

    try {
      const response = await axios.get(`http://localhost:3000/pokemon/${pokemonName}`);
      const data = response.data;

      setPokemonDetails({
        abilities: data.abilities || [],
        types: data.types || [],
        stats: data.stats || [],
        sprite: data.sprite || '',
      });

      setError(null);
    } catch (err) {
      console.error(err);
      setPokemonDetails(null);
      setError('Failed to fetch Pokémon details');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    if (pokemon.trim()) {
      setPokemonLS(pokemon);
      fetchPokemonDetails(pokemon);
      localStorage.setItem('lastSearchedPokemon', pokemon);

      const previousSearches = JSON.parse(localStorage.getItem('searchHistory') || '[]');
      if (!previousSearches.includes(pokemon)) {
        previousSearches.push(pokemon);
        localStorage.setItem('searchHistory', JSON.stringify(previousSearches));
        setSuggestions(previousSearches);
      }
      
      setPokemon('');
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setPokemon(suggestion);
    setSuggestions([]);
    fetchPokemonDetails(suggestion);
    localStorage.setItem('lastSearchedPokemon', suggestion);
  };

  const toggleDarkMode = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    localStorage.setItem('darkMode', newDarkMode.toString());
    document.documentElement.classList.toggle('dark', newDarkMode);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-white dark:bg-gray-900 text-black dark:text-white transition-colors duration-300">
      <div className="absolute top-4 right-4 flex items-center space-x-2">
        <button 
          onClick={toggleDarkMode} 
          className="p-2 bg-gray-200 dark:bg-gray-700 rounded-full shadow-md hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors duration-300"
        >
          {darkMode ? <FaSun className="text-yellow-500" /> : <FaMoon className="text-blue-500" />}
        </button>
        <span className="text-lg font-semibold dark:text-gray-300 cursor-pointer" onClick={toggleDarkMode}>
          {darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
        </span>
      </div>
      <h1 className="text-3xl font-bold mb-6 text-gray-800 dark:text-gray-100">Pokémon Details</h1>
      <div className="w-full max-w-md bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
        <input
          type="text"
          value={pokemon}
          onChange={(e) => setPokemon(e.target.value)}
          placeholder="Enter Pokémon name"
          className="w-full text-black dark:text-white p-3 border border-gray-300 dark:border-gray-600 rounded-lg mb-4 focus:outline-none focus:border-blue-500 dark:focus:border-blue-400 transition-colors duration-300"
        />
        {suggestions.length > 0 && (
          <ul className="list-none ml-0 mt-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg shadow-lg">
            {suggestions.map((suggestion, index) => (
              <li 
                key={index}
                className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 cursor-pointer"
                onClick={() => handleSuggestionClick(suggestion)}
              >
                {suggestion}
              </li>
            ))}
          </ul>
        )}
        <p className="mb-4 text-gray-600 dark:text-gray-300">You have searched for: <strong>{pokemonLS}</strong></p>
        <div className="flex justify-center mb-4">
          <button
            onClick={handleSearch}
            className="bg-blue-500 text-white p-3 rounded-lg hover:bg-blue-600 dark:hover:bg-blue-400 transition-colors duration-300 ease-in-out transform hover:scale-105"
            disabled={loading}
          >
            {loading ? 'Loading...' : 'Get Details'}
          </button>
        </div>
        {error && <p className="text-red-500 mt-4 text-center">{error}</p>}
        {pokemonDetails && (
          <div className="mt-6 flex flex-col items-center">
            <div className="flex flex-col items-center mb-4">
              {pokemonDetails.sprite && (
                <Image 
                  src={pokemonDetails.sprite} 
                  alt={pokemon} 
                  width={128} 
                  height={128} 
                  className="mb-4 rounded-lg shadow-lg"
                />
              )}
              <p className="text-xl font-semibold mb-2">Types:</p>
              {pokemonDetails.types.length > 0 ? (
                <ul className="list-none ml-0 mb-4 text-center">
                  {pokemonDetails.types.map((type, index) => (
                    <li key={index} className="text-gray-800 dark:text-gray-200">{type}</li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-600 dark:text-gray-300">No types available</p>
              )}
            </div>
            <div className="flex flex-col items-center bg-gray-100 dark:bg-gray-700 p-4 rounded-lg shadow-lg w-full max-w-md">
              <p className="text-xl font-semibold mb-2 text-center">Base Stats:</p>
              {pokemonDetails.stats.length > 0 ? (
                <ul className="list-none ml-0 mb-4 text-center">
                  {pokemonDetails.stats.map((stat, index) => (
                    <li key={index} className="text-gray-800 dark:text-gray-200">{`${stat.name}: ${stat.value}`}</li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-600 dark:text-gray-300">No stats available</p>
              )}
              <p className="text-xl font-semibold mb-2 text-center">Abilities:</p>
              {pokemonDetails.abilities.length > 0 ? (
                <ul className="list-none ml-0 text-center">
                  {pokemonDetails.abilities.map((ability, index) => (
                    <li key={index} className="text-gray-800 dark:text-gray-200">{ability}</li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-600 dark:text-gray-300">No abilities available</p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
