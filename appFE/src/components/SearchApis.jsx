import React from 'react';
import { useState } from "react";
import SearchInAll from './SearchInAll';
import SmithsonianData from './SmithsonianData'

const SearchApis = () => {
    const [selectedGallery, setSelectedGallery] = useState(null);
    const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (gallery, query) => {
   // console.log(`Searching ${gallery} for: ${query}`);
    setSelectedGallery(gallery);
    setSearchQuery(query);
  };

  return (
    <div>
    <h2>Art Galleries Search</h2>
    <SearchInAll onSearch={handleSearch} />
    {selectedGallery === "smith" && (
      <SmithsonianData searchValue={searchQuery} />
    )}
    {/* Add conditional rendering for other galleries here */}
  </div>
  );
};

export default SearchApis;
