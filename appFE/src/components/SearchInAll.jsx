import React, { useState } from 'react';

const SearchInAll = ({ onSearch }) => {
  const [gallery, setGallery] = useState('Smithsonian');
  const [query, setQuery] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    // Call the provided search handler with the chosen gallery and search query
    onSearch(gallery, query);
  };

  return (
    <form onSubmit={handleSearch} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
      <select value={gallery} onChange={(e) => setGallery(e.target.value)}>
        <option value="artic">Art Institute of Chicago</option>
        <option value="euro">Europeana Art</option>
        <option value="harvard">Harvard Art Museum</option>
        <option value="met">The Metropolitan Museum of Art</option>
        <option value="rijksm">RijksM</option>
        <option value="smith">Smithsonian</option>
        <option value="vam">Victoria & Albert M</option>
        {/* Add more options as needed */}
      </select>
      <input
        type="text"
        placeholder="Search artworks..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      <button type="submit">Search</button>
    </form>
  );
};

export default SearchInAll;
