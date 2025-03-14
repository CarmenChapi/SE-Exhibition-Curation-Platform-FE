import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import axios from "axios";

const apikeyRM = import.meta.env.VITE_API_KEY_RIJKS;
const ITEMS_PER_PAGE = 6;

const fetchRijksMData = async ({ queryKey }) => {
  const [_key, { query }] = queryKey;

  const searchQuery = query ? `&q=${query}` : "";

  const { data } = await axios.get(
    `https://www.rijksmuseum.nl/api/en/collection?key=${apikeyRM}${searchQuery}&limit=30`
  );

  return data;
};

const RijksMData = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [query, setQuery] = useState(""); 
  const [currentPage, setCurrentPage] = useState(1);

  const { data, error, isLoading } = useQuery({
    queryKey: ["rijksm", { query }],
    queryFn: fetchRijksMData,
    keepPreviousData: true,
  });

  const handleSearch = () => {
    setQuery(searchTerm);
  };

  const allItems = data?.artObjects || [];
  const totalPages = Math.ceil(allItems.length / ITEMS_PER_PAGE);
  const paginatedItems = allItems.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div>
      <h2>Rijksmuseum</h2>
      {/* Search Input */}
      <div>
        <input
          type="text"
          placeholder="Search Rijksmuseum Art..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="collection-input"
        />
        <button
          onClick={handleSearch}
          className="ml-2 bg-blue-500 text-white px-4 py-2 rounded"
        >
          Search
        </button>
      </div>

      {/* Artworks List */}
      <ul className="gallery-list">
        {paginatedItems.length > 0 ? (
          paginatedItems.map((art) => (
            <li key={art.id}>
              {art.title ? <h3>{art.title[0]}</h3> : <h3>Untitled</h3>}
              {art.webImage.url ? (
                <img
                  src={art.webImage.url}
                  alt={art.title ? art.title[0] : "Artwork"}
                  className="gallery-photo"
                />
              ) : (
                <p className="text-gray-500">No Image Available</p>
              )}
            </li>
          ))
        ) : (
          <p className="text-gray-500">No results found</p>
        )}
      </ul>

      {/* Pagination Controls */}
      <div className="flex justify-between mt-4">
        <button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
          className="bg-gray-500 text-white px-4 py-2 rounded disabled:opacity-50"
        >
          Previous
        </button>
        <span className="px-4 py-2">
          Page {currentPage} of {totalPages}
        </span>
        <button
          onClick={() =>
            setCurrentPage((prev) => Math.min(prev + 1, totalPages))
          }
          disabled={currentPage === totalPages}
          className="bg-gray-500 text-white px-4 py-2 rounded"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default RijksMData;
