import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
const ITEMS_PER_PAGE = 6;

const fetchVAMData = async ({ queryKey }) => {
  const [_key, { query }] = queryKey;

  // Default search term if no query is provided
  const searchQuery = query ? encodeURIComponent(query) : "painting";

  const { data } = await axios.get(
    `https://api.vam.ac.uk/v2/objects/search?q=${searchQuery}&images_exist=true&limit=30`
  );

  return data;
};

const VAMData = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [query, setQuery] = useState("painting"); // Default query term
  const [currentPage, setCurrentPage] = useState(1);
  const navigate = useNavigate();

  const { data, error, isLoading } = useQuery({
    queryKey: ["vam", { query }],
    queryFn: fetchVAMData,
    keepPreviousData: true,
  });

  const allItems = data?.records || [];
  const totalPages = Math.ceil(allItems.length / ITEMS_PER_PAGE);
  const paginatedItems = allItems.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handleSearch = () => {
    setQuery(searchTerm);
  };

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div>
      <h2>Victoria & Albert Museum</h2>
      {/* Search Input */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search V&A Art..."
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
            <li key={art.systemNumber} className="mb-4">
              {art._primaryTitle ? (
                <h3>{art._primaryTitle}</h3>
              ) : (
                <h3>Untitled</h3>
              )}
              {art._primaryImageId ? (
                <img
                  src={`https://framemark.vam.ac.uk/collections/${art._primaryImageId}/full/843,/0/default.jpg`}
                  alt={art.title ? art.title[0] : "Artwork"}
                  className="gallery-photo"
                  onClick={() => navigate(`/home/artgallery/vam/${art.systemNumber}`)}
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

export default VAMData;
