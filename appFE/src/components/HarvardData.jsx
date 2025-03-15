import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const apikeyHarvard = import.meta.env.VITE_API_KEY_HARVARD;
const ITEMS_PER_PAGE = 10;

const fetchHarvardData = async ({ queryKey }) => {
  const [_key, { query, page }] = queryKey;
  const searchQuery = query ? `&q=${encodeURIComponent(query)}` : "";

  const url = `https://api.harvardartmuseums.org/object?apikey=${apikeyHarvard}&hasimage=1&size=${ITEMS_PER_PAGE}&sort=random&fields=id,title,primaryimageurl,people,dated&page=${page}${searchQuery}`;
  console.log("Fetching URL:", url); // Debugging
  const { data } = await axios.get(url);
  return data;
};

const HarvardData = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const navigate = useNavigate();

  const { data, error, isLoading } = useQuery({
    queryKey: ["harvard", { query, page }],
    queryFn: fetchHarvardData,
    keepPreviousData: true,
  });

  const handleSearch = () => {
    setPage(1); // Reset to first page when searching
    setQuery(searchTerm);
  };

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div>
      <h2>Harvard Art Museum</h2>
      {/* Search Input */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search for artworks..."
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
        {data.records.length > 0 ? (
          data.records.map((art) => (
            <li key={art.id}>
              <h3>{art.title || "Untitled"}</h3>
              {art.primaryimageurl ? (
                <img
                  src={art.primaryimageurl}
                  alt={art.title}
                  className="gallery-photo"
                  onClick={() => navigate(`/home/artgallery/harvard/${art.id}`)}
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
          onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
          disabled={page === 1}
          className="bg-gray-500 text-white px-4 py-2 rounded disabled:opacity-50"
        >
          Previous
        </button>
        <span className="px-4 py-2">Page {page}</span>
        <button
          onClick={() => setPage((prev) => prev + 1)}
          className="bg-gray-500 text-white px-4 py-2 rounded"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default HarvardData;
