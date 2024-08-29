"use client";
import { useState, useEffect } from 'react';
import { mockAbilities } from './mockData';

export default function Home() {
  const [pokemon, setPokemon] = useState('');
  const [pokemonLS, setPokemonLS] = useState('');

  const [abilities, setAbilities] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const lastSearch = localStorage.getItem('lastSearchedPokemon');
    if (lastSearch) {
      setPokemonLS(lastSearch);
      fetchAbilities(lastSearch);
    }
  }, []);

  const fetchAbilities = (pokemonName: string) => {
    if (!pokemonName.trim()) return;

    setLoading(true);
    setError(null);

    try {
      const abilitiesData = mockAbilities[pokemonName.toLowerCase()];
      if (abilitiesData) {
        setAbilities(abilitiesData);
        setError(null);
      } else {
        setAbilities([]);
        setError('No abilities found for this Pokémon');
      }
    } catch (err) {
      console.error(err);
      setAbilities([]);
      setError('Failed to fetch abilities');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    if (pokemon.trim()) {
      setPokemonLS(pokemon);
      fetchAbilities(pokemon);
      localStorage.setItem('lastSearchedPokemon', pokemon); 
      setPokemon(''); 
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gray-100">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Pokémon Abilities</h1>
      <div className="w-full max-w-md bg-white p-6 rounded-lg shadow-lg">
        <input
          type="text"
          value={pokemon}
          onChange={(e) => setPokemon(e.target.value.toLowerCase())}
          placeholder="Enter Pokémon name"
          className="w-full text-black p-3 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:border-blue-500 transition duration-300"
        />
        <p className="mb-4 text-gray-600">You have searched for: <strong>{pokemonLS}</strong></p>
        <button
          onClick={handleSearch}
          className="w-full bg-blue-500 text-white p-3 rounded-lg hover:bg-blue-600 transition duration-300"
          disabled={loading}
        >
          {loading ? 'Loading...' : 'Get Abilities'}
        </button>
        {error && <p className="text-red-500 mt-4 text-center">{error}</p>}
        {abilities.length > 0 && (
          <table className="mt-6 w-full border border-gray-300 rounded-lg">
            <thead>
              <tr className="bg-gray-100 border-b">
                <th className="p-3 text-left text-gray-700">Ability</th>
              </tr>
            </thead>
            <tbody>
              {abilities.map((ability, index) => (
                <tr key={index} className="border-b">
                  <td className="p-3 text-gray-800">{ability}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        {abilities.length === 0 && !loading && !error && (
          <p className="mt-4 text-gray-500 text-center">Enter a Pokémon name and click Get Abilities to see the abilities.</p>
        )}
      </div>
    </div>
  );
}
