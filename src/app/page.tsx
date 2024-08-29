"use client";
import { useState, useEffect } from 'react';
import axios from 'axios'; 
import { FaMoon, FaSun } from 'react-icons/fa'; // Adicione ícones para alternar entre modos

export default function Home() {
  const [pokemon, setPokemon] = useState('');
  const [pokemonLS, setPokemonLS] = useState('');

  const [abilities, setAbilities] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [darkMode, setDarkMode] = useState<boolean>(false);

  useEffect(() => {
    const savedDarkMode = localStorage.getItem('darkMode') === 'true';
    setDarkMode(savedDarkMode);
    if (savedDarkMode) {
      document.documentElement.classList.add('dark');
    }
    const lastSearch = localStorage.getItem('lastSearchedPokemon');
    if (lastSearch) {
      setPokemonLS(lastSearch);
      fetchAbilities(lastSearch);
    }
  }, []);

  const fetchAbilities = async (pokemonName: string) => {
    if (!pokemonName.trim()) return;

    setLoading(true);
    setError(null);

    try {
      const response = await axios.get(`http://localhost:3000/pokemon/${pokemonName}`);
      const abilitiesData = response.data.abilities;

      if (abilitiesData.length > 0) {
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
      <h1 className="text-3xl font-bold mb-6 text-gray-800 dark:text-gray-100">Pokémon Abilities</h1>
      <div className="w-full max-w-md bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
        <input
          type="text"
          value={pokemon}
          onChange={(e) => setPokemon(e.target.value.toLowerCase())}
          placeholder="Enter Pokémon name"
          className="w-full text-black dark:text-white p-3 border border-gray-300 dark:border-gray-600 rounded-lg mb-4 focus:outline-none focus:border-blue-500 dark:focus:border-blue-400 transition-colors duration-300"
        />
        <p className="mb-4 text-gray-600 dark:text-gray-300">You have searched for: <strong>{pokemonLS}</strong></p>
        <div className="flex justify-center">
          <button
            onClick={handleSearch}
            className="bg-blue-500 text-white p-3 rounded-lg hover:bg-blue-600 dark:hover:bg-blue-400 transition-colors duration-300 ease-in-out transform hover:scale-105"
            disabled={loading}
          >
            {loading ? 'Loading...' : 'Get Abilities'}
          </button>
        </div>
        {error && <p className="text-red-500 mt-4 text-center">{error}</p>}
        {abilities.length > 0 && (
          <table className="mt-6 w-full border border-gray-300 dark:border-gray-600 rounded-lg">
            <thead>
              <tr className="bg-gray-100 dark:bg-gray-700 border-b">
                <th className="p-3 text-left text-gray-700 dark:text-gray-300">Ability</th>
              </tr>
            </thead>
            <tbody>
              {abilities.map((ability, index) => (
                <tr key={index} className="border-b">
                  <td className="p-3 text-gray-800 dark:text-gray-200">{ability}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        {abilities.length === 0 && !loading && !error && (
          <p className="mt-4 text-gray-500 dark:text-gray-400 text-center">Enter a Pokémon name and click Get Abilities to see the abilities.</p>
        )}
      </div>
    </div>
  );
}
