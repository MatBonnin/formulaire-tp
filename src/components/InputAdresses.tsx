import '../styles/neon.css';

import React, { useEffect, useState } from 'react';

import useDebounce from '../hooks/useDebounce'; // adapte le chemin si besoin

const InputAdresses: React.FC = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<{ properties: { id: string; label: string } }[]>([]);

  // debounce du query avec un délai de 500ms
  const debouncedQuery = useDebounce(query, 500);

  useEffect(() => {
    if (debouncedQuery.length > 3) {
      fetchResults(debouncedQuery);
    }
    else{
      setResults([])
    }

  }, [debouncedQuery]);

  const fetchResults = async (q: string) => {
    const response = await fetch(`https://api-adresse.data.gouv.fr/search/?q=${q}`);
    const data = await response.json();
    setResults(data.features);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  };

  return (
    <div className="bg-black min-h-screen flex items-center justify-center">
      <div className="relative w-96">
        <input
          type="text"
          value={query}
          onChange={handleInputChange}
          placeholder="Entrez une adresse"
          className="neon-input focus:outline-none"
        />
        {results.length > 0 && (
          <ul className="shadow-md neon-list list-none">
            {results.map((result) => (
              <li
                key={result.properties.id}
                onClick={() => setQuery(result.properties.label)}
              >
                {result.properties.label}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default InputAdresses;
