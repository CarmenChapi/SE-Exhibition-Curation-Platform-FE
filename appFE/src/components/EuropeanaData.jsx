import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const apiKeyEuro = import.meta.env.VITE_API_KEY_EUROPEANA;
const ITEMS_PER_PAGE = 6;

const fetchEuroData = async ({ queryKey }) => {
  const [_key, { query }] = queryKey;
  const searchQuery = query ? `&query=${query}` : "&query=painting";

  const { data } = await axios.get(
    `https://api.europeana.eu/record/v2/search.json?wskey=${apiKeyEuro}${searchQuery}&media=true&qf=TYPE:IMAGE&rows=30`
  );

  return data;
};

const EuropeanaData = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [query, setQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const navigate = useNavigate();

  const { data, error, isLoading } = useQuery({
    queryKey: ["euro", { query }],
    queryFn: fetchEuroData,
    keepPreviousData: true,
  });

  const handleSearch = () => {
    setCurrentPage(1); // Reset to page 1 on new search
    setQuery(searchTerm);
  };

  const allItems = data?.items || [];
  const totalPages = Math.ceil(allItems.length / ITEMS_PER_PAGE);
  const paginatedItems = allItems.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <>
      <h2>Europeana</h2>
      {/* Search Input */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search Europeana Art..."
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
      {/**Europeana ListArworks */}
      <ul className="gallery-list">
        {paginatedItems.length > 0 ? (
          paginatedItems.map((art) => (
            <li key={art.id} className="mb-4">
              {art.title ? <h3>{art.title[0]}</h3> : <h3>Untitled</h3>}
              {art.edmIsShownBy ? (
                <img
                  className="gallery-photo"
                  src={art.edmIsShownBy[0]}
                  alt={art.title ? art.title[0] : "Artwork"}
                  onClick={() => navigate(`/home/artgallery/europeana/${art.id.replaceAll("/","-")}`)}
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
    </>
  );
};

export default EuropeanaData;
